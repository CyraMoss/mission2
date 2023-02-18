import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const apiKey = 'f4612ad12d9c440c855c4fe14c303d58';
  const endpoint =
    'https://testdifferentcars-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/6e4eda9b-e9a6-463f-a9b2-0bdedec47e4f/detect/iterations/Iteration4/image';

  const [image, setImage] = useState('');
  const [carType, setCarType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState('');

  function handleSearch(event) {
    event.preventDefault();
    const bingApiKey = 'b82539cef2584b33b408f53cdba78ed1';
    // update the state with the search term
    setSearchTerm(event.target.value);

    axios
      .get(
        `https://api.bing.microsoft.com/v7.0/custom/search?q=${searchTerm}&customconfig=cfbae12f-7d63-46e5-96e0-2c66b65d48b6&mkt=en-US`,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': bingApiKey,
          },
        }
      )
      .then((response) => {
        const searchResults = response.data.webPages.value;
        setSearchResults(searchResults);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleImageChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      setImage(e.target.result);
      setCarType('');
    };

    reader.readAsDataURL(file);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('image', dataURItoBlob(image));

    axios
      .post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Prediction-Key': `${apiKey}`,
        },
      })
      .then((response) => {
        const predictions = response.data.predictions;
        // Use the reduce() method to find the item with the highest probability value
        const highestProbabilityItem = predictions.reduce((prev, current) =>
          prev.probability > current.probability ? prev : current
        );
        setCarType(highestProbabilityItem.tagName);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
  function handleSearchTermChange(event) {
    setSearchTerm(event.target.value);
  }

  useEffect(() => {
    if (!image) {
      setCarType('');
    }
  }, [image]);

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageChange} />
        <input type="submit" />
      </form>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSearch(event);
        }}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <input type="submit" />
      </form>
      {carType && <p>The car type is: {carType}</p>}
      <div>
        <h2>Search Results for "{searchTerm}"</h2>
        {searchResults && (
          <div>
            {searchResults.map((result) => (
              <p key={result.id}>
                <a href={result.url}>{result.name}</a>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
