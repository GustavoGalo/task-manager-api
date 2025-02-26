import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { TaskService } from "./task.service";
import { JwtAuthGuard } from "src/auth/jwt-auto.guard";
import { CurrentUser } from "src/auth/current-user.decorator";
import { CurrentUserDto } from "src/auth/current-user.dto";
import { TaskDto } from "./types";

@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post("")
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: CurrentUserDto, @Body() body: TaskDto) {
    return this.taskService.create(user.userId, body);
  }
}
