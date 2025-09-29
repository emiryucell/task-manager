import { AxiosError } from 'axios';

interface ApiError {
  status: string;
  message: string;
  errors: string[];
  timestamp: string;
}

export const extractErrorMessages = (error: any): string[] => {
  if (error.response && error.response.data) {
    const apiError = error.response.data as ApiError;
    
    if (apiError.errors && apiError.errors.length > 0) {
      return apiError.errors;
    }
    
    if (apiError.message) {
      return [apiError.message];
    }
  }
  
  if (error.message) {
    return [error.message];
  }
  
  return ['An unexpected error occurred'];
};

export const getErrorMessage = (error: any): string => {
  const errors = extractErrorMessages(error);
  return errors.join(', ');
};
