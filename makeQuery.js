import getToken from "./getToken"

const makeQuery = async (query, variables = {}, token) => {
    const accessToken = token;
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
            headers: accessToken ? {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json",
                Accept: "application/json",
            } : {
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