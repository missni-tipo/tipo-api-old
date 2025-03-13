export interface OAuthAccountData {
    userId: string;
    provider: string;
    providerId: string;
    accessToken: string;
    refreshToken?: string;
}
