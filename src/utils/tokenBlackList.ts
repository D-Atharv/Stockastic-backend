const tokenBlacklist = new Set<string>();

export const addTokenToBlacklist = (token: string) => {
    tokenBlacklist.add(token);
};

export const isTokenBlacklisted = (token: string) => {
    return tokenBlacklist.has(token);
};
