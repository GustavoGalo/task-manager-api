import { Module } from "@nestjs/common";
import { AuthModule } from "./app/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { ProjectModule } from "./app/project/project.module";
import { TaskModule } from "./app/task/task.module";

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ProjectModule,
    TaskModule,
  ],
})
export class AppModule {}
