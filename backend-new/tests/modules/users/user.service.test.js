const UserService = require('../../../src/modules/users/user.service');
const UserRepository = require('../../../src/modules/users/user.repository');
const ApiError = require('../../../src/utils/ApiError');
const { hashPassword, comparePassword } = require('../../../src/middleware/auth');

describe('UserService', () => {
  let userService;
  let mockUserRepository;

  beforeEach(() => {
    // Create mock repository
    mockUserRepository = {
      findByEmail: jest.fn(),
      findByPhone: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      updateProfile: jest.fn(),
      updatePassword: jest.fn(),
      setResetPasswordToken: jest.fn(),
      findByResetToken: jest.fn(),
      clearResetPasswordToken: jest.fn()
    };

    // Create service instance with mocked repository
    userService = new UserService();
    userService.repository = mockUserRepository;
  });

  describe('createUser', () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '9876543210',
      password: 'Test@123',
      role: 'user'
    };

    it('should create a new user successfully', async () => {
      // Mock repository methods
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByPhone.mockResolvedValue(null);
      
      const mockUser = {
        id: 'user123',
        ...userData,
        password: 'hashedPassword',
        getPublicProfile: jest.fn().mockReturnValue({
          id: 'user123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          role: 'user'
        })
      };
      
      mockUserRepository.create.mockResolvedValue(mockUser);

      // Execute
      const result = await userService.createUser(userData);

      // Assertions
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockUserRepository.findByPhone).toHaveBeenCalledWith(userData.phone);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'user'
      });
    });

    it('should throw error if email already exists', async () => {
      // Mock existing user
      mockUserRepository.findByEmail.mockResolvedValue({ id: 'existing' });

      // Execute and assert
      await expect(userService.createUser(userData))
        .rejects
        .toThrow(ApiError);
      
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error if phone already exists', async () => {
      // Mock existing phone
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByPhone.mockResolvedValue({ id: 'existing' });

      // Execute and assert
      await expect(userService.createUser(userData))
        .rejects
        .toThrow(ApiError);
      
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('authenticateUser', () => {
    const email = 'john.doe@example.com';
    const password = 'Test@123';
    const ip = '127.0.0.1';

    it('should authenticate user successfully', async () => {
      // Mock user
      const mockUser = {
        id: 'user123',
        email,
        password: await hashPassword(password),
        status: 'active',
        isLocked: false,
        incrementLoginAttempts: jest.fn(),
        resetLoginAttempts: jest.fn(),
        updateLastLogin: jest.fn(),
        getPublicProfile: jest.fn().mockReturnValue({
          id: 'user123',
          email,
          firstName: 'John'
        })
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      // Execute
      const result = await userService.authenticateUser(email, password, ip);

      // Assertions
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockUser.resetLoginAttempts).toHaveBeenCalled();
      expect(mockUser.updateLastLogin).toHaveBeenCalledWith(ip);
      expect(result).toEqual({
        id: 'user123',
        email,
        firstName: 'John'
      });
    });

    it('should throw error for invalid email', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(userService.authenticateUser(email, password, ip))
        .rejects
        .toThrow(ApiError);
    });

    it('should throw error for locked account', async () => {
      const mockUser = {
        isLocked: true,
        status: 'active'
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(userService.authenticateUser(email, password, ip))
        .rejects
        .toThrow(ApiError);
    });

    it('should throw error for inactive account', async () => {
      const mockUser = {
        isLocked: false,
        status: 'inactive'
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(userService.authenticateUser(email, password, ip))
        .rejects
        .toThrow(ApiError);
    });

    it('should increment login attempts for wrong password', async () => {
      const mockUser = {
        id: 'user123',
        email,
        password: await hashPassword('wrongpassword'),
        status: 'active',
        isLocked: false,
        incrementLoginAttempts: jest.fn()
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(userService.authenticateUser(email, password, ip))
        .rejects
        .toThrow(ApiError);
      
      expect(mockUser.incrementLoginAttempts).toHaveBeenCalled();
    });
  });

  describe('changePassword', () => {
    const userId = 'user123';
    const currentPassword = 'OldPass@123';
    const newPassword = 'NewPass@123';

    it('should change password successfully', async () => {
      // Mock user with current password
      const mockUser = {
        id: userId,
        email: 'john@example.com',
        password: await hashPassword(currentPassword)
      };

      mockUserRepository.findById.mockResolvedValue({ email: mockUser.email });
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockUserRepository.updatePassword.mockResolvedValue(true);

      // Execute
      const result = await userService.changePassword(userId, currentPassword, newPassword);

      // Assertions
      expect(mockUserRepository.updatePassword).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Password changed successfully' });
    });

    it('should throw error for incorrect current password', async () => {
      const mockUser = {
        id: userId,
        email: 'john@example.com',
        password: await hashPassword('differentpassword')
      };

      mockUserRepository.findById.mockResolvedValue({ email: mockUser.email });
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(userService.changePassword(userId, currentPassword, newPassword))
        .rejects
        .toThrow(ApiError);
      
      expect(mockUserRepository.updatePassword).not.toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(userService.changePassword(userId, currentPassword, newPassword))
        .rejects
        .toThrow(ApiError);
    });
  });

  describe('resetPassword', () => {
    const email = 'john@example.com';

    it('should initiate password reset for existing user', async () => {
      const mockUser = {
        id: 'user123',
        email
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockUserRepository.setResetPasswordToken.mockResolvedValue(true);

      const result = await userService.resetPassword(email);

      expect(mockUserRepository.setResetPasswordToken).toHaveBeenCalled();
      expect(result.message).toContain('reset link has been sent');
    });

    it('should return generic message for non-existing user', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      const result = await userService.resetPassword(email);

      expect(result.message).toContain('reset link has been sent');
      expect(mockUserRepository.setResetPasswordToken).not.toHaveBeenCalled();
    });
  });

  describe('confirmPasswordReset', () => {
    const token = 'reset-token-123';
    const newPassword = 'NewPass@123';

    it('should reset password with valid token', async () => {
      const mockUser = {
        id: 'user123',
        email: 'john@example.com'
      };

      mockUserRepository.findByResetToken.mockResolvedValue(mockUser);
      mockUserRepository.updatePassword.mockResolvedValue(true);
      mockUserRepository.clearResetPasswordToken.mockResolvedValue(true);

      const result = await userService.confirmPasswordReset(token, newPassword);

      expect(mockUserRepository.updatePassword).toHaveBeenCalled();
      expect(mockUserRepository.clearResetPasswordToken).toHaveBeenCalled();
      expect(result.message).toBe('Password reset successfully');
    });

    it('should throw error for invalid token', async () => {
      mockUserRepository.findByResetToken.mockResolvedValue(null);

      await expect(userService.confirmPasswordReset(token, newPassword))
        .rejects
        .toThrow(ApiError);
    });
  });

  describe('updateUserProfile', () => {
    const userId = 'user123';
    const profileData = {
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '9876543211'
    };

    it('should update user profile successfully', async () => {
      const mockUpdatedUser = {
        id: userId,
        ...profileData,
        getPublicProfile: jest.fn().mockReturnValue({
          id: userId,
          ...profileData
        })
      };

      mockUserRepository.updateProfile.mockResolvedValue(mockUpdatedUser);

      const result = await userService.updateUserProfile(userId, profileData);

      expect(mockUserRepository.updateProfile).toHaveBeenCalledWith(userId, profileData);
      expect(result).toEqual({
        id: userId,
        ...profileData
      });
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.updateProfile.mockResolvedValue(null);

      await expect(userService.updateUserProfile(userId, profileData))
        .rejects
        .toThrow(ApiError);
    });
  });

  describe('validateUserBusinessRules', () => {
    it('should validate age requirement', async () => {
      const userData = {
        dateOfBirth: new Date('2010-01-01') // Too young
      };

      await expect(userService.validateUserBusinessRules(userData))
        .rejects
        .toThrow(ApiError);
    });

    it('should validate role hierarchy', async () => {
      const managerId = 'manager123';
      const userData = {
        role: 'manager',
        manager: managerId
      };

      // Mock manager with lower role
      mockUserRepository.findById.mockResolvedValue({
        id: managerId,
        role: 'user'
      });

      await expect(userService.validateUserBusinessRules(userData))
        .rejects
        .toThrow(ApiError);
    });

    it('should pass validation for valid data', async () => {
      const userData = {
        dateOfBirth: new Date('1990-01-01'),
        role: 'user'
      };

      const result = await userService.validateUserBusinessRules(userData);
      expect(result).toBe(true);
    });
  });

  describe('healthCheck', () => {
    it('should return healthy status', async () => {
      mockUserRepository.count = jest.fn()
        .mockResolvedValueOnce(100) // total users
        .mockResolvedValueOnce(85); // active users

      const result = await userService.healthCheck();

      expect(result.status).toBe('healthy');
      expect(result.totalUsers).toBe(100);
      expect(result.activeUsers).toBe(85);
    });

    it('should return unhealthy status on error', async () => {
      mockUserRepository.count = jest.fn()
        .mockRejectedValue(new Error('Database error'));

      const result = await userService.healthCheck();

      expect(result.status).toBe('unhealthy');
      expect(result.error).toBe('Database error');
    });
  });
});