import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import { ForgotPasswordHandler } from './forgot-password-handler';
import { PrismaUserRepository } from 'src/infra/repositories/prisma-user-repository';
import { ForgotPasswordCommand } from './forgot-password-command';
import { ErrorMessages } from 'src/domain/errors/error-messages';
import { EventBus } from '@nestjs/cqrs';
import { ForgotPasswordEvent } from '../../events/forgot-password/forgot-password-event';

describe('ForgotPasswordHandler', () => {
  let handler: ForgotPasswordHandler;
  let userRepository: jest.Mocked<PrismaUserRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(async () => {
    const userRepositoryMock = {
      findByEmail: jest.fn(),
    };

    const jwtServiceMock = {
      sign: jest.fn(),
    };

    const eventBusMock = {
      publish: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ForgotPasswordHandler,
        {
          provide: PrismaUserRepository,
          useValue: userRepositoryMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: EventBus,
          useValue: eventBusMock,
        },
      ],
    }).compile();

    handler = moduleRef.get<ForgotPasswordHandler>(ForgotPasswordHandler);
    userRepository = moduleRef.get(PrismaUserRepository);
    jwtService = moduleRef.get(JwtService);
    eventBus = moduleRef.get(EventBus);
  });

  it('should successfully process forgot password request', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      active: true,
      name: 'Test User',
      password: 'hashedPassword',
      username: 'testuser',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockCommand: ForgotPasswordCommand = {
      email: 'test@example.com',
    };

    const mockResetToken = 'mock-reset-token';

    userRepository.findByEmail.mockResolvedValue(mockUser);
    jwtService.sign.mockReturnValue(mockResetToken);
    eventBus.publish.mockResolvedValue(undefined);

    await handler.execute(mockCommand);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(mockCommand.email);
    expect(jwtService.sign).toHaveBeenCalledWith({ email: mockCommand.email });
    expect(eventBus.publish).toHaveBeenCalledWith(
      new ForgotPasswordEvent(mockCommand.email, mockResetToken)
    );
  });

  it('should throw NotFoundException when user is not found', async () => {
    const mockCommand: ForgotPasswordCommand = {
      email: 'nonexistent@example.com',
    };

    userRepository.findByEmail.mockResolvedValue(null);

    await expect(handler.execute(mockCommand)).rejects.toThrow(
      new NotFoundException(ErrorMessages.AUTH.USER_NOT_FOUND)
    );

    expect(userRepository.findByEmail).toHaveBeenCalledWith(mockCommand.email);
    expect(jwtService.sign).not.toHaveBeenCalled();
    expect(eventBus.publish).not.toHaveBeenCalled();
  });
});
