import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
    windowMs: 1 * 60 * 60 * 1000, // 15 minutes
    max: 10,
    message: "Too many login requests, please try again later"
})