import { useState } from 'react';
import axios from 'axios';

function SearchBar() {
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
        console.log(searchResults);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  function handleSearchTermChange(event) {
    setSearchTerm(event.target.value);
  }
  return (
    <div>
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

      <div>
        <h2>Search Results for "{searchTerm}"</h2>
        {searchResults && (
          <div>
            {searchResults.map((result) => (
              <>
                <img
                  src={result.openGraphImage.contentUrl}
                  alt={result.name}
                ></img>
                <p key={result.name}>
                  <a href={result.url}>{result.name}</a>
                </p>
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default SearchBar;
