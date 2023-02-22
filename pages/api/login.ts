import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { clientSecret } from "../../utils/anilistClientSecret";
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
      client_id: process.env.NEXT_PUBLIC_ANILIST,
      client_secret: clientSecret,
      redirect_uri: `${process.env.NEXT_PUBLIC_SERVER}/api/login`,
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
