import { Exclude, Type } from "class-transformer";
import { ProjectResponseDto } from "src/domain/project/dto/project-response-dto";

export class ProfileResponseDto {
  email: string;
  name: string;
  username: string;

  @Type(() => ProjectResponseDto)
  projects: ProjectResponseDto[];

  @Exclude()
  password: string;

  @Exclude()
  active: boolean;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  id: number;
}
