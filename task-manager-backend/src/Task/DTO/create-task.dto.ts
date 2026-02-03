import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsDateString,
  } from "class-validator";
  import { TaskPriority, TaskStatus } from "../entities/Task.entity";
  
  export class CreateTaskDto {
    @IsNotEmpty()
    title: string;
  
    @IsOptional()
    description?: string;
  
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;
  
    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;
  
    @IsOptional()
    @IsDateString()
    deadline?: Date;
  
    @IsNotEmpty()
    @IsDateString()
    date: string; // Add the 'date' property to match the frontend payload
  }