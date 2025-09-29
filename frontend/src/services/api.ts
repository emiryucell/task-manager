import axios from 'axios';
import { AuthResponse, LoginRequest, PaginationParams, Task, TaskListResponse } from '../types';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

export const authService = {
  login: async (loginRequest: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', loginRequest);
    return response.data;
  },
};

export const taskService = {
  getAllTasks: async (params: PaginationParams): Promise<TaskListResponse> => {
    const response = await api.get<TaskListResponse>('/tasks', { params });
    return response.data;
  },

  getTaskById: async (taskId: string): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${taskId}`);
    return response.data;
  },

  createTask: async (task: Task): Promise<Task> => {
    const response = await api.post<Task>('/tasks', task);
    return response.data;
  },

  updateTask: async (taskId: string, task: Task): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${taskId}`, task);
    return response.data;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  },
};

export default api; 