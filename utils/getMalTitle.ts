export default async (
  type: string,
  MalID: string | number
): Promise<string> => {
  const data = await fetch(`https://api.jikan.moe/v4/${type}/${MalID}`).then(
    (data) => data.json()
  );
  if (data.type === "Light Novel") {
    return data.data.title;
  }
  return data.data.title;
};
