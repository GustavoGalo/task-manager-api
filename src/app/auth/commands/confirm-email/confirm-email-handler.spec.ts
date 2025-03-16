import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfirmEmailHandler } from './confirm-email-handler';
import { PrismaUserRepository } from 'src/infra/repositories/prisma-user-repository';
import { ConfirmEmailCommand } from './confirm-email-command';
import { ErrorMessages } from 'src/domain/errors/error-messages';
import { JsonWebTokenError } from 'jsonwebtoken';

describe('ConfirmEmailHandler', () => {
  let handler: ConfirmEmailHandler;
  let userRepository: jest.Mocked<PrismaUserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const userRepositoryMock = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    };

    const jwtServiceMock = {
      verify: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ConfirmEmailHandler,
        {
          provide: PrismaUserRepository,
          useValue: userRepositoryMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    handler = moduleRef.get<ConfirmEmailHandler>(ConfirmEmailHandler);
    userRepository = moduleRef.get(PrismaUserRepository);
    jwtService = moduleRef.get(JwtService);
  });

  it('should successfully confirm email', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      active: false,
      name: 'Test User',
      password: 'hashedPassword',
      username: 'testuser',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const mockCommand: ConfirmEmailCommand = {
      confirmationToken: 'valid-token',
    };
    jwtService.verify.mockReturnValue({ email: mockUser.email });
    userRepository.findByEmail.mockResolvedValue(mockUser);
    userRepository.save.mockResolvedValue({
      ...mockUser,
      active: true
    });

    await handler.execute(mockCommand);

    expect(jwtService.verify).toHaveBeenCalledWith('valid-token');
    expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
    expect(userRepository.save).toHaveBeenCalledWith({ ...mockUser, active: true });
  });

  it('should throw NotFoundException when user is not found', async () => {
    const command: ConfirmEmailCommand = {
      confirmationToken: 'valid-token'
    };

    jwtService.verify.mockReturnValue({ email: 'nonexistent@example.com' });
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(
      new NotFoundException(ErrorMessages.AUTH.USER_NOT_FOUND)
    );
  });

  it('should throw BadRequestException when token is expired', async () => {
    const command: ConfirmEmailCommand = {
      confirmationToken: 'expired-token'
    };

    jwtService.verify.mockImplementation(() => {
      throw new JsonWebTokenError('jwt expired');
    });

    await expect(handler.execute(command)).rejects.toThrow(
      new BadRequestException(ErrorMessages.AUTH.CONFIRMATION_CODE_EXPIRED)
    );
  });

  it('should throw BadRequestException for invalid token', async () => {
    const command: ConfirmEmailCommand = {
      confirmationToken: 'invalid-token'
    };

    jwtService.verify.mockImplementation(() => {
      throw new Error('invalid token');
    });

    await expect(handler.execute(command)).rejects.toThrow(
      new BadRequestException(ErrorMessages.AUTH.INVALID_CONFIRMATION_TOKEN)
    );
  });
});
