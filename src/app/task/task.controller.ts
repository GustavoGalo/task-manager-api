import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { TaskService } from "./task.service";
import { JwtAuthGuard } from "src/app/shared/guards/jwt-auth.guard";
import { CurrentUser } from "src/app/shared/decorators/current-user.decorator";
import { CurrentUserDto } from "src/domain/auth/dto/current-user-dto";
import { CreateTaskDto } from "src/domain/tasks/dto/create-task-dto";

@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get("/:projectId")
  @UseGuards(JwtAuthGuard)
  tasks(
    @Param("projectId") projectId: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.taskService.tasks(user.userId, projectId);
  }

  @Post("")
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: CurrentUserDto, @Body() body: CreateTaskDto) {
    return this.taskService.create(user.userId, body);
  }
}
