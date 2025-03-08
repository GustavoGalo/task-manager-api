import { PartialType } from "@nestjs/mapped-types";
import { CreateProjectDto } from "./create-project-dto";

export declare class UpdateProjectDto extends PartialType(CreateProjectDto) {}
