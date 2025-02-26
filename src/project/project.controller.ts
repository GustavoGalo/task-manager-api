import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user.decorator";
import { CurrentUserDto } from "src/auth/current-user.dto";
import { JwtAuthGuard } from "src/auth/jwt-auto.guard";
import { ProjectService } from "./project.service";
import { ProjectDto } from "./types";

@Controller("project")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get("")
  @UseGuards(JwtAuthGuard)
  project(@CurrentUser() user: CurrentUserDto) {
    return this.projectService.index(user.userId);
  }

  @Post("")
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: CurrentUserDto, @Body() body: ProjectDto) {
    return this.projectService.create(user.userId, body);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  update(
    @Param("id") id: string,
    @CurrentUser() user: CurrentUserDto,
    @Body() body: ProjectDto,
  ) {
    return this.projectService.update(user.userId, body, id);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  inactivate(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
    return this.projectService.inactivate(user.userId, id);
  }
}
