export interface Story {
  id: string;
  title: string;
  author: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  storyCount: number;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface CreateStoryInput {
  title: string;
  author: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
}

export interface UpdateStoryInput extends Partial<CreateStoryInput> {
  id: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
