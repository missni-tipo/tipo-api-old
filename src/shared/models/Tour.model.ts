import { Status, TourCategory } from "@prisma/client";

export interface TourData {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    description: string;
    location: string;
    latitude?: number;
    longitude?: number;
    category: TourCategory;
    status: Status;
    rating: number;
    reviewCount: number;
    picture: string[];
    createdBy: string;
    createdAt: bigint;
    updatedAt: bigint;
}
