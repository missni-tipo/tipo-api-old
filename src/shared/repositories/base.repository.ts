import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class BaseRepository<T> {
    protected model: any;

    constructor(model: any) {
        this.model = model;
    }

    async findUnique(field: string, value: any): Promise<T | null> {
        return this.model.findUnique({
            where: { [field]: value },
        });
    }

    async findMany(params: Record<string, any> = {}): Promise<T[] | null> {
        return this.model.findMany(params);
    }

    async findOne(where: Partial<T>): Promise<T | null> {
        return this.model.findFirst({ where });
    }

    async findByEmail(email: string): Promise<T | null> {
        return this.model.findMany({ where: { email } });
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findUnique({ where: { id } });
    }

    async findAll(): Promise<T[]> {
        return this.model.findMany();
    }

    async create(data: Partial<T>): Promise<T> {
        return this.model.create({ data });
    }

    async updateById(id: string, data: Partial<T>): Promise<T> {
        return this.model.update({ where: { id }, data });
    }

    async update(where: Partial<T>, data: Partial<T>): Promise<T> {
        return this.model.update({ where, data });
    }

    async deleteById(id: string): Promise<T> {
        return this.model.delete({ where: { id } });
    }

    async delete(where: Partial<T>): Promise<{ count: number }> {
        return this.model.deleteMany({ where });
    }

    async exists(field: string, value: any): Promise<boolean> {
        return !!(await this.model.findFirst({ where: { [field]: value } }));
    }
}
