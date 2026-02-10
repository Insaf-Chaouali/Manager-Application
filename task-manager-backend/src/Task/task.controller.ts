import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TaskService } from './task.service';
import { CreateTaskDto } from './DTO/create-task.dto';
import { UpdateTaskDto } from './DTO/update-task.dto';
import { GetUser } from '../auth/get-user.decorators';
import { User } from '../auth/entities/user.entity';
import { SkipThrottle } from '@nestjs/throttler';

@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @SkipThrottle()
  @Post()
  create(
    @Body() dto: CreateTaskDto,
    @GetUser() user: User,
  ) {
    return this.taskService.create(dto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.taskService.findAll(user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.taskService.findOne(id, user);
  }

  @Put(':id') 
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @GetUser() user: User,
  ) {
    return this.taskService.update(id, dto, user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.taskService.remove(id, user);
  }

  @Patch(':id/archive')
  archive(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.taskService.archive(id, user);
  }

  @Patch(':id/toggle')
  async toggleActiveStatus(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.taskService.toggleActiveStatus(id, user);
  }
}
