// app/services/mockApi.ts
// This is temporary until you set up your real backend
const MOCK_USERS = new Map();
const MOCK_TOKENS = new Map();

const generateToken = () => Math.random().toString(36).substr(2);

export const mockAuthApi = {
  login: async (email: string, password: string) => {
    console.log('Attempting login:', { email, password }); // Debug log
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    const user = Array.from(MOCK_USERS.values()).find(
      (u: any) => u.email === email && u.password === password
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const token = generateToken();
    MOCK_TOKENS.set(token, user.id);
    
    const { password: _, ...userWithoutPassword } = user;
    console.log('Login successful:', { token, user: userWithoutPassword }); // Debug log
    return { token, user: userWithoutPassword };
  },
  
  register: async (email: string, password: string, name: string) => {
    console.log('Attempting registration:', { email, name }); // Debug log
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      if (Array.from(MOCK_USERS.values()).some((u: any) => u.email === email)) {
        throw new Error('Email already exists');
      }
      
      const id = generateToken();
      const user = { id, email, password, name };
      MOCK_USERS.set(id, user);
      
      const token = generateToken();
      MOCK_TOKENS.set(token, id);
      
      const { password: _, ...userWithoutPassword } = user;
      console.log('Registration successful:', { token, user: userWithoutPassword }); // Debug log
      return { token, user: userWithoutPassword };
    } catch (error) {
      console.error('Registration error:', error); // Debug log
      throw error;
    }
  },
  
  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  },
};