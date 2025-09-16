// Authentication utilities and functions
import { useState, useEffect } from 'react';

// Mock user database (in a real app, this would be an API)
const mockUsers = [
  {
    id: '1',
    email: 'demo@example.com',
    password: 'demo123',
    name: 'Demo User',
    profile: {
      name: 'Demo User',
      age: '28',
      gender: 'prefer_not_to_say',
      lifeStage: 'early_career'
    },
    scenarios: []
  }
];

// Authentication state management
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('financial_planner_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('financial_planner_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in mock database
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('financial_planner_user', JSON.stringify(userWithoutPassword));
      setLoading(false);
      return { success: true, user: userWithoutPassword };
    } else {
      setLoading(false);
      return { success: false, error: 'Invalid email or password' };
    }
  };

  const signup = async (email, password, name) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      setLoading(false);
      return { success: false, error: 'User with this email already exists' };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      profile: {
        name,
        age: '',
        gender: '',
        lifeStage: ''
      },
      scenarios: []
    };

    // Add to mock database
    mockUsers.push(newUser);
    
    // Remove password from user object before storing
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('financial_planner_user', JSON.stringify(userWithoutPassword));
    setLoading(false);
    
    return { success: true, user: userWithoutPassword };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('financial_planner_user');
  };

  const updateUserProfile = (profileData) => {
    if (user) {
      const updatedUser = {
        ...user,
        profile: { ...user.profile, ...profileData }
      };
      setUser(updatedUser);
      localStorage.setItem('financial_planner_user', JSON.stringify(updatedUser));
    }
  };

  const updateUserScenarios = (scenarios) => {
    if (user) {
      const updatedUser = {
        ...user,
        scenarios
      };
      setUser(updatedUser);
      localStorage.setItem('financial_planner_user', JSON.stringify(updatedUser));
    }
  };

  return {
    user,
    loading,
    login,
    signup,
    logout,
    updateUserProfile,
    updateUserScenarios,
    isAuthenticated: !!user
  };
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.trim().length >= 2;
};

// Form validation helper
export const validateLoginForm = (email, password) => {
  const errors = {};
  
  if (!email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateSignupForm = (email, password, confirmPassword, name) => {
  const errors = {};
  
  if (!name) {
    errors.name = 'Name is required';
  } else if (!validateName(name)) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  if (!email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
