import { Module } from "@nestjs/common";
import { AuthModule } from "./app/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { ProjectModule } from "./app/project/project.module";
import { TaskModule } from "./app/task/task.module";
import { UserModule } from "./app/user/user.module";
import { EmailModule } from "./infra/email/email.module";

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ProjectModule,
    TaskModule,
    UserModule,
    EmailModule,
  ],
})
export class AppModule {}
