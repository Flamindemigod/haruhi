const isProd = process.env.NODE_ENV === "production" ? true : false;

export const AnilistClientID = 9465;
export const SERVER = isProd ? "https://haruhi.flamindemigod.com" : "http://haruhi.flamindemigod.com:8080" 