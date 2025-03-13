import { Module } from "@nestjs/common";
import { AuthModule } from "./app/auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ProjectModule } from "./app/project/project.module";
import { TaskModule } from "./app/task/task.module";
import { UserModule } from "./app/user/user.module";
import { EmailModule } from "./infra/email/email.module";
import { BullModule } from "@nestjs/bull";

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: config.getOrThrow("REDIS_URL"),
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 1000,
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 2000,
          },
        },
      }),
    }),
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ProjectModule,
    TaskModule,
    UserModule,
    EmailModule,
  ],
})
export class AppModule {}
