export interface Task {
  taskId?: string;
  taskName: string;
  taskDescription: string;
  username?: string;
  taskDate: Date | string; 
  durationInHour: number;
}

export interface User {
  username: string;
  role: string;
}

export interface AuthResponse {
  token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TaskListResponse {
  content: Task[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface PaginationParams {
  page: number;
  size: number;
  sort?: string; 
}

export interface SortMeta {
  field: string;
  order: 1 | -1;  
} 