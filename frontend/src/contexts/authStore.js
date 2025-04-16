// src/contexts/authStore.js
import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  // Check if user is logged in
  checkAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/auth/me');
      set({ user: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ user: null, isLoading: false, error: error.message });
      return null;
    }
  },

  // User login
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/auth/login', { email, password });
      set({ user: response.data.user, isLoading: false });
      return response.data.user;
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || 'Login failed' });
      throw error;
    }
  },

  // User signup
  signup: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/auth/signup', userData);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || 'Signup failed' });
      throw error;
    }
  },

  // User logout
  logout: async () => {
    try {
      set({ isLoading: true });
      await api.post('/auth/logout');
      set({ user: null, isLoading: false, error: null });
      return true;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  
  // Update user profile
  updateUserProfile: (profileData) => {
    set((state) => ({
      user: {
        ...state.user,
        ...profileData
      }
    }));
  }
}));

export default useAuthStore;