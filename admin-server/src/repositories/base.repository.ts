import { PrismaClient } from '@prisma/client';

type PrismaModel = {
  findMany: (args: any) => Promise<any[]>;
  findUnique: (args: any) => Promise<any>;
  findFirst: (args: any) => Promise<any>;
  create: (args: any) => Promise<any>;
  createMany: (args: any) => Promise<any>;
  update: (args: any) => Promise<any>;
  updateMany: (args: any) => Promise<any>;
  delete: (args: any) => Promise<any>;
  deleteMany: (args: any) => Promise<any>;
  count: (args: any) => Promise<number>;
};

export class BaseRepository<T> {
  protected model: PrismaModel;
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient, model: PrismaModel) {
    this.prisma = prisma;
    this.model = model;
  }

  async findAll(options: any = {}): Promise<T[]> {
    return this.model.findMany(options);
  }

  async findById(id: string, options: any = {}): Promise<T | null> {
    return await this.model.findUnique({
      where: { id },
      ...options,
    });
  }

  async findOne(where: any, options: any = {}): Promise<T | null> {
    return await this.model.findFirst({
      where,
      ...options,
    });
  }

  async create(data: any): Promise<T> {
    return await this.model.create({ data });
  }

  async createMany(data: any[]): Promise<any> {
    return await this.model.createMany({ data });
  }

  async update(id: string, data: any): Promise<T> {
    return await this.model.update({
      where: { id },
      data,
    });
  }

  async updateMany(where: any, data: any): Promise<any> {
    return await this.model.updateMany({
      where,
      data,
    });
  }

  async delete(id: string, softDelete = true): Promise<T | null> {
    if (softDelete) {
      return await this.model.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    }
    return await this.model.delete({
      where: { id },
    });
  }

  async deleteMany(where: any, softDelete = true): Promise<any> {
    if (softDelete) {
      return await this.model.updateMany({
        where,
        data: { deletedAt: new Date() },
      });
    }
    return await this.model.deleteMany({ where });
  }

  async count(options: any = {}): Promise<number> {
    return await this.model.count(options);
  }
}
