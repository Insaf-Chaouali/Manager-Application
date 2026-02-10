import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { Task } from "./entities/Task.entity";
import { AuthModule } from "../auth/auth.module"; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]), 
    AuthModule, 
  ],
  controllers: [TaskController],
  providers: [TaskService], 
})
export class TaskModule {}