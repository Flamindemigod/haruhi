import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  res.setHeader(
    "Set-Cookie",
    serialize("access_token", "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
    })
  );
  res.redirect("/");
}
