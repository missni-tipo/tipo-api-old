import { PrismaClient, Tour } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { CreateTourDto, UpdateTourDto } from "../../modules/tour/dtos/tour.dto";

const prisma = new PrismaClient();

export class BaseTourRepository extends BaseRepository<Tour> {
    constructor() {
        super(prisma.tour);
    }
}
