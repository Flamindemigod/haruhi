const isProd = process.env.NODE_ENV === "production" ? true : false;
export const AnilistClientID = 8343;
export const SERVER = isProd ? "https://haruhi.flamindemigod.com" : "http://haruhi.flamindemigod.com:8080";
export const VIDEOSERVER = "https://haruhi-backend.flamindemigod.com";
export const MALSERVER = "https://api.jikan.moe/v4/anime"
