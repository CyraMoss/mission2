import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dataURItoBlob from './DataUriToBlob';

function ImageUploader() {
  const apiKey = 'f4612ad12d9c440c855c4fe14c303d58';
  const endpoint =
    'https://testdifferentcars-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/6e4eda9b-e9a6-463f-a9b2-0bdedec47e4f/detect/iterations/Iteration4/image';

  const [image, setImage] = useState('');
  const [carType, setCarType] = useState('');

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

  <dataURItoBlob />;
  useEffect(() => {
    if (!image) {
      setCarType('');
    }
  }, [image]);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageChange} />
        <input type="submit" />
      </form>
      {carType && <p>The car type is: {carType}</p>}
    </div>
  );
}

export default ImageUploader;
