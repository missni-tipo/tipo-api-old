export interface GetUserDto {
    id: string;
}

export interface UpdateUserDto {
    fullName?: string;
    email?: string;
    gender: "m" | "f";
    phoneNumber: string;
    birthdate: Date;
    domicile: string;
    picture?: string;
}

export interface UpdatePinDto {
    id: string;
    oldPin?: string;
    newPin: string;
}
