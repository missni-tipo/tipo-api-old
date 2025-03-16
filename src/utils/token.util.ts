import jwt from "jsonwebtoken";

export const generateVerifyCode = (length: number = 6): string => {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (num) => (num % 10).toString()).join("");
};

export const generateJWTToken = (
    userPayload: Record<string, any>,
    secret: string,
    expired: string | number
): string => {
    return jwt.sign(userPayload, secret, { expiresIn: expired as any });
};

export const verifyJWTToken = (token: string, secret: string) => {
    return jwt.verify(token, secret);
};
