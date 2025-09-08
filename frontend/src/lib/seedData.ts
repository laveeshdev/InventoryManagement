import { User } from '@/types/schemas';
import { getStorageData, setStorageData } from './storage';

// Create demo user for testing
export const createDemoUser = (): void => {
  const users = getStorageData<User>('users');
  
  // Check if demo user already exists
  const demoExists = users.some(user => user.email === 'demo@example.com');
  if (demoExists) return;
  
  const demoUser: User = {
    id: 'demo_user_123',
    name: 'Demo User',
    username: 'demo',
    email: 'demo@example.com',
    password: 'demo123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const updatedUsers = [...users, demoUser];
  setStorageData('users', updatedUsers);
};

// Initialize demo data
export const initializeDemoData = (): void => {
  createDemoUser();
};