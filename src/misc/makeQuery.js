import getToken from "./getToken"

const makeQuery = async ( query, variables = { }, ) => {
    const accessToken = getToken();
    function handleResponse(response) {
        return response.json().then(function (json) {
          return response.ok ? json : Promise.reject(json);
        });
      }
  
      function handleData(data) {
        return data;
      }
  
      function handleError(error) {
        console.error(error);
      }
  
  
  
    var url = "https://graphql.anilist.co",
    options = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    };


  return await fetch(url, options)
  .then(handleResponse)
  .then(handleData)
  .catch(handleError);
};

export default makeQuery;
