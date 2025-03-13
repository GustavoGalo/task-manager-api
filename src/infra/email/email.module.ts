import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
import { EmailService } from "./email.service";

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.getOrThrow("EMAIL_HOST"),
          port: config.getOrThrow("EMAIL_PORT"),
          secure: false,
          auth: {
            user: config.getOrThrow("EMAIL_USER"),
            pass: config.getOrThrow("EMAIL_PASS"),
          },
        },
        defaults: {
          from: config.getOrThrow("EMAIL_FROM"),
        },
        template: {
          dir: __dirname + "/templates",
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [EmailService],
})
export class EmailModule {}
