import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { CommandBus } from "@nestjs/cqrs";
import { CreateUserDto } from "src/domain/users/dto/create-user-dto";
import { LoginDto } from "src/domain/auth/dto/login-dto";
import { Response } from "express";

describe("AuthController", () => {
  let controller: AuthController;
  let commandBus: CommandBus;

  const mockCommandBus = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("signUp", () => {
    const signUpTest = async () => {
      const dto: CreateUserDto = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
        username: "testuser",
      };
      const expectedResult = { id: "123", ...dto };
      mockCommandBus.execute.mockResolvedValue(expectedResult);

      const result = await controller.signUp(dto);

      expect(commandBus.execute).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    };
    it("should execute SignUpCommand and return result", signUpTest);
  });

  describe("signIn", () => {
    const signInTest = async () => {
      const dto: LoginDto = {
        email: "test@example.com",
        password: "password123",
      };
      const expectedResult = { token: "jwt-token" };
      mockCommandBus.execute.mockResolvedValue(expectedResult);

      const result = await controller.signIn(dto);

      expect(commandBus.execute).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    };
    it("should execute SignInCommand and return result", signInTest);
  });

  describe("confirmEmail", () => {
    const confirmEmailTest = async () => {
      const token = "confirmation-token";
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        redirect: jest.fn(),
      } as unknown as Response;

      process.env.FRONT_URL = "http://localhost:3000";

      await controller.confirmEmail(token, mockResponse);

      expect(commandBus.execute).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(302);
      expect(mockResponse.redirect).toHaveBeenCalledWith(
        "http://localhost:3000/login",
      );
    };
    it("should execute ConfirmEmailCommand and redirect", confirmEmailTest);
  });
});
