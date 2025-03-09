import { Controller, Get, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../shared/guards/jwt-auth.guard";
import { CurrentUser } from "../shared/decorators/current-user.decorator";
import { CurrentUserDto } from "src/domain/auth/dto/current-user-dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  profile(@CurrentUser() { userId }: CurrentUserDto) {
    return this.userService.profile(userId);
  }
}
