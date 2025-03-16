import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ResetPasswordCommandHandler } from './reset-password-handler';
import { PrismaUserRepository } from 'src/infra/repositories/prisma-user-repository';
import { ResetPasswordCommand } from './reset-password-command';
import { ErrorMessages } from 'src/domain/errors/error-messages';
import { JsonWebTokenError } from 'jsonwebtoken';
import { PasswordService } from '../../password.service';

describe('ResetPasswordCommandHandler', () => {
  let handler: ResetPasswordCommandHandler;
  let userRepository: jest.Mocked<PrismaUserRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let passwordService: jest.Mocked<PasswordService>;

  beforeEach(async () => {
    const userRepositoryMock = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    };

    const jwtServiceMock = {
      verify: jest.fn(),
    };

    const passwordServiceMock = {
      validatePasswordStrength: jest.fn(),
      hashPassword: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ResetPasswordCommandHandler,
        {
          provide: PrismaUserRepository,
          useValue: userRepositoryMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: PasswordService,
          useValue: passwordServiceMock,
        },
      ],
    }).compile();

    handler = moduleRef.get<ResetPasswordCommandHandler>(ResetPasswordCommandHandler);
    userRepository = moduleRef.get(PrismaUserRepository);
    jwtService = moduleRef.get(JwtService);
    passwordService = moduleRef.get(PasswordService);
  });

  it('should successfully reset password', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      active: true,
      name: 'Test User',
      password: 'oldHashedPassword',
      username: 'testuser',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockCommand: ResetPasswordCommand = {
      resetToken: 'valid-token',
      password: 'NewStrongP@ss123',
    };

    const mockHashedPassword = 'newHashedPassword';

    jwtService.verify.mockReturnValue({ email: mockUser.email });
    userRepository.findByEmail.mockResolvedValue(mockUser);
    passwordService.validatePasswordStrength.mockReturnValue(true);
    passwordService.hashPassword.mockResolvedValue(mockHashedPassword);
    userRepository.save.mockResolvedValue({ ...mockUser, password: mockHashedPassword });

    await handler.execute(mockCommand);

    expect(jwtService.verify).toHaveBeenCalledWith(mockCommand.resetToken);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
    expect(passwordService.validatePasswordStrength).toHaveBeenCalledWith(mockCommand.password);
    expect(passwordService.hashPassword).toHaveBeenCalledWith(mockCommand.password);
    expect(userRepository.save).toHaveBeenCalledWith({ ...mockUser, password: mockHashedPassword });
  });

  it('should throw NotFoundException when user is not found', async () => {
    const mockCommand: ResetPasswordCommand = {
      resetToken: 'valid-token',
      password: 'NewStrongP@ss123',
    };

    jwtService.verify.mockReturnValue({ email: 'nonexistent@example.com' });
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(handler.execute(mockCommand)).rejects.toThrow(
      new NotFoundException(ErrorMessages.AUTH.USER_NOT_FOUND)
    );

    expect(jwtService.verify).toHaveBeenCalledWith(mockCommand.resetToken);
    expect(userRepository.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    expect(passwordService.validatePasswordStrength).not.toHaveBeenCalled();
    expect(passwordService.hashPassword).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when token is expired', async () => {
    const mockCommand: ResetPasswordCommand = {
      resetToken: 'expired-token',
      password: 'NewStrongP@ss123',
    };

    jwtService.verify.mockImplementation(() => {
      throw new JsonWebTokenError('jwt expired');
    });

    await expect(handler.execute(mockCommand)).rejects.toThrow(
      new BadRequestException(ErrorMessages.AUTH.RESET_PASSWORD_TOKEN_EXPIRED)
    );

    expect(jwtService.verify).toHaveBeenCalledWith(mockCommand.resetToken);
    expect(userRepository.findByEmail).not.toHaveBeenCalled();
    expect(passwordService.validatePasswordStrength).not.toHaveBeenCalled();
    expect(passwordService.hashPassword).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when password is weak', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      active: true,
      name: 'Test User',
      password: 'oldHashedPassword',
      username: 'testuser',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockCommand: ResetPasswordCommand = {
      resetToken: 'valid-token',
      password: 'weak',
    };

    jwtService.verify.mockReturnValue({ email: mockUser.email });
    userRepository.findByEmail.mockResolvedValue(mockUser);
    passwordService.validatePasswordStrength.mockReturnValue(false);

    await expect(handler.execute(mockCommand)).rejects.toThrow(
      new BadRequestException(ErrorMessages.AUTH.PASSWORD_WEAK)
    );

    expect(jwtService.verify).toHaveBeenCalledWith(mockCommand.resetToken);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
    expect(passwordService.validatePasswordStrength).toHaveBeenCalledWith(mockCommand.password);
    expect(passwordService.hashPassword).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();
  });
});
