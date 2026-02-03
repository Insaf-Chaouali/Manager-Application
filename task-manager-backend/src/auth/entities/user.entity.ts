import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
  } from 'typeorm';
  import { Task } from '../../Task/entities/Task.entity';
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: string;
  
    @Column()
    firstName: string;
  
    @Column()
    lastName: string;
  
    @Column({ unique: true })
    username: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column()
    password: string;
  
    @Column({ type: 'date', nullable: true })
    dateBirth?: Date;
  
    @OneToMany(() => Task, task => task.user)
    tasks: Task[];
  }
  