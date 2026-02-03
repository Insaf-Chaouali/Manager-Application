import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/Task.entity';
import { CreateTaskDto } from './DTO/create-task.dto';
import { UpdateTaskDto } from './DTO/update-task.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto, user: User): Promise<Task> {
    if (!dto.title || !dto.date) {
      throw new BadRequestException('Title and date are required');
    }

    const task = this.taskRepository.create({
      ...dto,
      date: dto.date, // Pass the date as a string
      user,
    });
    return this.taskRepository.save(task);
  }

  async findAll(user: User): Promise<Task[]> {
    return this.taskRepository.find({
      where: { user: { id: user.id } },
    });
  }

  async findOne(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: {
        id,
        user: { id: user.id },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(
    id: number,
    dto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = await this.findOne(id, user);
    Object.assign(task, {
      ...dto,
      date: dto.date, // Ensure the date is passed as a string
    });
    return this.taskRepository.save(task);
  }

  async remove(id: number, user: User): Promise<void> {
    const task = await this.findOne(id, user);
    await this.taskRepository.remove(task);
  }

  async archive(id: number, user: User): Promise<Task> {
    const task = await this.findOne(id, user);
    task.isActive = false;
    return this.taskRepository.save(task);
  }

  async toggleActiveStatus(id: number, user: User): Promise<Task> {
    const task = await this.findOne(id, user);
    task.isActive = !task.isActive; // Toggle the isActive status
    return this.taskRepository.save(task);
  }
}
