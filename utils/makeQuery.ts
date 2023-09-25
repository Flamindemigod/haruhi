interface iQueryProps {
  query: string;
  variables: unknown;
  token: string | undefined;
}

const makeQuery = async (props: iQueryProps) => {
  function handleResponse(response: any) {
    return response.json().then(function (json: any) {
      return response.ok ? json : Promise.reject(json);
    });
  }
  function handleData(data: any) {
    return data;
  }
  function handleError(error: any) {
    console.error(error);
  }
  const url = "https://graphql.anilist.co";
  const options: RequestInit = {
    method: "POST",
    headers: props.token
      ? {
          Authorization: "Bearer " + props.token,
          "Content-Type": "application/json",
          Accept: "application/json",
        }
      : {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
    body: JSON.stringify({
      query: props.query,
      variables: props.variables,
    }),
  };
  return await fetch(url, options)
    .then(handleResponse)
    .then(handleData)
    .catch(handleError);
};

export default makeQuery;