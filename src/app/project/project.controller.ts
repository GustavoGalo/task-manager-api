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
import { CurrentUser } from "src/app/shared/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/app/shared/guards/jwt-auth.guard";
import { ProjectService } from "./project.service";
import { CurrentUserDto } from "src/domain/auth/dto/current-user-dto";
import { CreateProjectDto } from "src/domain/project/dto/create-project-dto";
import { UpdateProjectDto } from "src/domain/project/dto/update-project-dto";
import { CreateProjectColumnDto } from "src/domain/project/dto/create-project-column-dto";

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
  create(@CurrentUser() user: CurrentUserDto, @Body() body: CreateProjectDto) {
    return this.projectService.create(user.userId, body);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  update(
    @Param("id") id: string,
    @CurrentUser() user: CurrentUserDto,
    @Body() body: UpdateProjectDto,
  ) {
    return this.projectService.update(user.userId, body, id);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  inactivate(@Param("id") id: string, @CurrentUser() user: CurrentUserDto) {
    return this.projectService.inactivate(user.userId, id);
  }

  @Post("column")
  @UseGuards(JwtAuthGuard)
  createColumn(
    @CurrentUser() user: CurrentUserDto,
    @Body() body: CreateProjectColumnDto,
  ) {
    return this.projectService.createColumn(user.userId, body);
  }
}
