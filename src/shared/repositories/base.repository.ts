import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class BaseRepository<T> {
    protected model: {
        count: (args?: any) => Promise<number>;
        findUnique: (args: any) => Promise<T | null>;
        findMany: (args?: any) => Promise<T[]>;
        findFirst: (args: any) => Promise<T | null>;
        create: (args: any) => Promise<T>;
        update: (args: any) => Promise<T>;
        delete: (args: any) => Promise<T>;
        deleteMany: (args: any) => Promise<{ count: number }>;
    };

    constructor(model: any) {
        this.model = model;
    }

    async count(filters?: Partial<T>): Promise<number> {
        return await this.model.count({ where: filters || {} });
    }

    async findUnique(where: Partial<T>): Promise<T | null> {
        return this.model.findUnique({ where });
    }

    async findMany(
        params: Record<string, any> = {},
        page: number = 1,
        limit: number = 10
    ): Promise<T[]> {
        return this.model.findMany({
            ...params,
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async findOne(where: Partial<T>): Promise<T | null> {
        return this.model.findFirst({ where });
    }

    async create(data: Partial<T>): Promise<T> {
        return this.model.create({ data });
    }

    async update(where: Partial<T>, data: Partial<T>): Promise<T> {
        return this.model.update({ where, data });
    }

    async delete(where: Partial<T>): Promise<T> {
        return this.model.delete({ where });
    }

    async exists(where: Partial<T>): Promise<boolean> {
        return !!(await this.model.findFirst({ where }));
    }

    async runTransaction(
        action: (
            tx: Omit<
                PrismaClient,
                | "$connect"
                | "$disconnect"
                | "$on"
                | "$transaction"
                | "$use"
                | "$extends"
            >
        ) => Promise<any>
    ) {
        return await prisma.$transaction(action);
    }
}
