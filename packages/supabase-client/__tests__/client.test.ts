import { createUser, getUser, supabase } from '../src/client';

jest.mock('../src/client', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  },
}));

describe('Supabase Client', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await createUser('test@example.com', 'password123');

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if sign up fails', async () => {
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: null,
        error: new Error('Sign up failed'),
      });

      await expect(createUser('test@example.com', 'password123')).rejects.toThrow('Sign up failed');
    });
  });

  describe('getUser', () => {
    it('should get a user successfully', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      (supabase.from('users').select().eq().single as jest.Mock).mockResolvedValue({
        data: mockUser,
        error: null,
      });

      const result = await getUser('123');

      expect(supabase.from).toHaveBeenCalledWith('users');
      expect(supabase.from().select).toHaveBeenCalledWith('*');
      expect(supabase.from().select().eq).toHaveBeenCalledWith('id', '123');
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if get user fails', async () => {
      (supabase.from('users').select().eq().single as jest.Mock).mockResolvedValue({
        data: null,
        error: new Error('User not found'),
      });

      await expect(getUser('123')).rejects.toThrow('User not found');
    });
  });
});
