export const generateVerifyToken = (length: number = 6): string => {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (num) => (num % 10).toString()).join("");
};
