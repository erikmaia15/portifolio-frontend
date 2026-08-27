export interface Project {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  name: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  order?: number;
}

export type UpdateProjectPayload = Partial<CreateProjectPayload>;

export interface AuthUser {
  id: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}
