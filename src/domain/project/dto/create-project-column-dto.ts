import { IsNotEmpty, IsString } from "class-validator";

export class CreateProjectColumnDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  projectId: string;
}
