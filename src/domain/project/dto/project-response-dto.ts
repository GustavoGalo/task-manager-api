import { Exclude } from "class-transformer";

export class ProjectResponseDto {
  id: string;
  name: string;
  description: string;
  userId: string;

  @Exclude()
  active: boolean;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
