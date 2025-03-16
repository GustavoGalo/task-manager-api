import { Test, TestingModule } from "@nestjs/testing";
import { SignUpHandler } from "./sign-up-handler";
import { PrismaUserRepository } from "src/infra/repositories/prisma-user-repository";
import { PasswordService } from "../../password.service";
import { EventBus } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import { SignUpCommand } from "./sign-up-command";
import { BadRequestException } from "@nestjs/common";
import { ErrorMessages } from "src/domain/errors/error-messages";
import { UserSignedUpEvent } from "../../events/user-signed-up/user-signed-up-event";

describe("SignUpHandler", () => {
  let handler: SignUpHandler;
  let repository: PrismaUserRepository;
  let passwordService: PasswordService;
  let eventBus: EventBus;
  let jwtService: JwtService;

  const mockRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockPasswordService = {
    validatePasswordStrength: jest.fn(),
    hashPassword: jest.fn(),
  };

  const mockEventBus = {
    publish: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpHandler,
        {
          provide: PrismaUserRepository,
          useValue: mockRepository,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
        {
          provide: EventBus,
          useValue: mockEventBus,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    handler = module.get<SignUpHandler>(SignUpHandler);
    repository = module.get<PrismaUserRepository>(PrismaUserRepository);
    passwordService = module.get<PasswordService>(PasswordService);
    eventBus = module.get<EventBus>(EventBus);
    jwtService = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(handler).toBeDefined();
  });

  describe("execute", () => {
    const mockCommand: SignUpCommand = {
      email: "test@example.com",
      password: "StrongP@ss123",
      name: "Test User",
      username: "testuser",
    };

    const mockHashedPassword = "hashedPassword";
    const mockConfirmationToken = "confirmation-token";

    it("should successfully create user and publish event", async () => {
      mockRepository.findByEmail.mockResolvedValue(null);
      mockPasswordService.validatePasswordStrength.mockReturnValue(true);
      mockPasswordService.hashPassword.mockResolvedValue(mockHashedPassword);
      mockJwtService.sign.mockReturnValue(mockConfirmationToken);
      mockRepository.create.mockResolvedValue(undefined);
      mockEventBus.publish.mockResolvedValue(undefined);

      await handler.execute(mockCommand);

      expect(repository.findByEmail).toHaveBeenCalledWith(mockCommand.email);
      expect(passwordService.validatePasswordStrength).toHaveBeenCalledWith(
        mockCommand.password,
      );
      expect(passwordService.hashPassword).toHaveBeenCalledWith(
        mockCommand.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockCommand.email,
      });
      expect(repository.create).toHaveBeenCalledWith({
        email: mockCommand.email,
        password: mockHashedPassword,
        name: mockCommand.name,
        username: mockCommand.username,
        id: expect.any(String),
      });
      expect(eventBus.publish).toHaveBeenCalledWith(
        new UserSignedUpEvent(mockCommand.email, mockConfirmationToken),
      );
    });

    it("should throw BadRequestException when email is already in use", async () => {
      mockRepository.findByEmail.mockResolvedValue({
        id: "123",
        email: mockCommand.email,
      });

      await expect(handler.execute(mockCommand)).rejects.toThrow(
        new BadRequestException(ErrorMessages.AUTH.EMAIL_IN_USE),
      );
    });

    it("should throw BadRequestException when password is weak", async () => {
      mockRepository.findByEmail.mockResolvedValue(null);
      mockPasswordService.validatePasswordStrength.mockReturnValue(false);

      await expect(handler.execute(mockCommand)).rejects.toThrow(
        new BadRequestException(ErrorMessages.AUTH.PASSWORD_WEAK),
      );
    });
  });
});
