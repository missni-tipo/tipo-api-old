export const config = {
    PORT: process.env.PORT || 3000,
    API_VERSION: process.env.API_VERSION || "v1",
    JWT_SECRET: process.env.JWT_SECRET || "your_secret_key",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "your_secret_key",
};
