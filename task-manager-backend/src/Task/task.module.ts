import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { Task } from "./entities/Task.entity";
import { User } from "../auth/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Task, User])],
  controllers: [TaskController],
  providers: [TaskService],
})

export class TaskModule {}