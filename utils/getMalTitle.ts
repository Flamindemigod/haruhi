export default async (
  type: string,
  MalID: string | number
): Promise<string> => {
  const data = await fetch(`https://api.jikan.moe/v4/${type}/${MalID}`).then(
    (data) => data.json()
  );
  return data.data.title;
};
