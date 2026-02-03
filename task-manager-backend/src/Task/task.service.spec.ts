import { Test } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/Task.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './DTO/create-task.dto';
import { UpdateTaskDto } from './DTO/update-task.dto';

describe('TaskService', () => {
  let service: TaskService;
  let repo: jest.Mocked<Repository<Task>>;

  const mockUser = { id: 'user-1', username: 'insaf' };

  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test description',
    isActive: true,
    user: mockUser,
  } as Task;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(TaskService);
    repo = module.get(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
  it('should create a task', async () => {
    const createDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Desc',
        date: new Date().toISOString(),
    };
    repo.create.mockReturnValue(mockTask);
    repo.save.mockResolvedValue(mockTask);

    const result = await service.create(createDto, mockUser as any);
    expect(repo.create).toHaveBeenCalledWith({ ...createDto, user: mockUser });
    expect(result).toEqual(mockTask);
  });

  it('should return all tasks for user', async () => {
    repo.find.mockResolvedValue([mockTask]);
    const result = await service.findAll(mockUser as any);
    expect(repo.find).toHaveBeenCalledWith({ where: { user: { id: mockUser.id } } });
    expect(result).toEqual([mockTask]);
  });

  
  it('should find one task by id', async () => {
    repo.findOne.mockResolvedValue(mockTask);
    const result = await service.findOne(1, mockUser as any);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1, user: { id: mockUser.id } } });
    expect(result).toEqual(mockTask);
  });

  it('should throw NotFoundException if task not found', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.findOne(1, mockUser as any)).rejects.toThrow(NotFoundException);
  });

  
  it('should update a task', async () => {
    const updateDto: UpdateTaskDto = { title: 'Updated' };
    repo.findOne.mockResolvedValue(mockTask);
    repo.save.mockResolvedValue({ ...mockTask, ...updateDto });

    const result = await service.update(1, updateDto, mockUser as any);
    expect(result.title).toEqual('Updated');
  });

  
  it('should remove a task', async () => {
    repo.findOne.mockResolvedValue(mockTask);
    repo.remove.mockResolvedValue(mockTask);

    await service.remove(1, mockUser as any);
    expect(repo.remove).toHaveBeenCalledWith(mockTask);
  });


  it('should archive a task', async () => {
    repo.findOne.mockResolvedValue(mockTask);
    repo.save.mockResolvedValue({ ...mockTask, isActive: false });

    const result = await service.archive(1, mockUser as any);
    expect(result.isActive).toBe(false);
  });
});
