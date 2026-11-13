import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  create(dto: CreateTaskDto) {
    this.rejectNulls(dto);
    return this.prisma.task.create({
      data: { ...dto, dueDate: this.toDate(dto.dueDate) },
    });
  }

  async update(id: string, dto: UpdateTaskDto) {
    await this.findOne(id);
    this.rejectNulls(dto);
    return this.prisma.task.update({
      where: { id },
      data: { ...dto, dueDate: this.toDate(dto.dueDate) },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.task.delete({ where: { id } });
  }

  private rejectNulls(dto: UpdateTaskDto) {
    if (dto.title === null || dto.status === null) {
      throw new BadRequestException('title and status cannot be null');
    }
  }

  private toDate(value?: string | null) {
    if (value === undefined || value === null) {
      return value;
    }
    return new Date(value);
  }
}
