import { Test, TestingModule } from "@nestjs/testing";
import { SignInHandler } from "./sign-in-handler";
import { PrismaUserRepository } from "src/infra/repositories/prisma-user-repository";
import { PasswordService } from "../../password.service";
import { JwtService } from "@nestjs/jwt";
import { SignInCommand } from "./sign-in-command";
import { UnauthorizedException } from "@nestjs/common";
import { ErrorMessages } from "src/domain/errors/error-messages";

describe("SignInHandler", () => {
  let handler: SignInHandler;
  let repository: PrismaUserRepository;
  let passwordService: PasswordService;
  let jwtService: JwtService;

  const mockRepository = {
    findByEmail: jest.fn(),
  };

  const mockPasswordService = {
    comparePassword: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignInHandler,
        {
          provide: PrismaUserRepository,
          useValue: mockRepository,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    handler = module.get<SignInHandler>(SignInHandler);
    repository = module.get<PrismaUserRepository>(PrismaUserRepository);
    passwordService = module.get<PasswordService>(PasswordService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(handler).toBeDefined();
  });

  describe("execute", () => {
    const mockUser = {
      id: "123",
      email: "test@example.com",
      password: "hashedPassword",
      username: "testuser",
    };

    const mockCommand: SignInCommand = {
      email: "test@example.com",
      password: "password123",
    };

    it("should successfully sign in user and return JWT token", async () => {
      mockRepository.findByEmail.mockResolvedValue(mockUser);
      mockPasswordService.comparePassword.mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue("jwt-token");

      const result = await handler.execute(mockCommand);

      expect(repository.findByEmail).toHaveBeenCalledWith(mockCommand.email);
      expect(passwordService.comparePassword).toHaveBeenCalledWith(
        mockCommand.password,
        mockUser.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.id,
      });
      expect(result).toEqual({ token: "jwt-token" });
    });

    it("should throw UnauthorizedException when user not found", async () => {
      mockRepository.findByEmail.mockResolvedValue(null);

      await expect(handler.execute(mockCommand)).rejects.toThrow(
        new UnauthorizedException(ErrorMessages.AUTH.INVALID_CREDENTIALS),
      );
    });

    it("should throw UnauthorizedException when password is incorrect", async () => {
      mockRepository.findByEmail.mockResolvedValue(mockUser);
      mockPasswordService.comparePassword.mockResolvedValue(false);

      await expect(handler.execute(mockCommand)).rejects.toThrow(
        new UnauthorizedException(ErrorMessages.AUTH.INVALID_CREDENTIALS),
      );
    });
  });
});
