import { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby";

export default function handler(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse,
) {
  const { secret, url, status } = req.query;
  if (secret !== process.env.PREVIEW_SECRET) {
    return res.status(401).send("Invalid token");
  }

  if (!url) {
    return res.status(400).send("Missing url parameter");
  }

  // Set a cookie to indicate preview mode
  // Using status if provided, defaulting to draft
  res.setHeader(
    "Set-Cookie",
    `strapi_preview_status=${status || "draft"}; Path=/; SameSite=Lax`,
  );

  res.redirect(url);
}
