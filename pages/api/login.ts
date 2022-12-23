import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: 9465,
      client_secret: "c9m4A289qNqPs91nZtQBBS0OTvgTF76pBULxB65P",
      redirect_uri: "https://haruhi.flamindemigod.com/api/login",
      code: req.query.code,
    }),
  };
  const access_token = await fetch(
    "https://anilist.co/api/v2/oauth/token",
    options
  ).then((data) => data.json());
  const d = new Date();
  d.setTime(d.getTime() + access_token.expires_in * 1000);
  res.setHeader(
    "Set-Cookie",
    serialize("access_token", access_token.access_token, {
      httpOnly: true,
      expires: d,
      path: "/",
    })
  );
  res.redirect("/");
}
