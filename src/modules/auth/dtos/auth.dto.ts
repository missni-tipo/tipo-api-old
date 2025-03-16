export interface RegisterDto {
    fullName: string;
    email: string;
    role: string;
}

export interface ResendTokenDto {
    email: string;
}

export interface VerifyTokenDto {
    email: string;
    token: string;
}

export interface UpdatePasswordDto {
    userId: string;
    oldPassword: string;
    newPassword: string;
}

export interface LoginDto {
    email: string;
    password: string;
    ip: string;
    userAgent: string;
}

export interface refreshTokenDto {
    refreshToken: string;
}
