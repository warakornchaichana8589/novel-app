'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Story, CreateStoryInput, UpdateStoryInput } from '@/lib/types';
import { mockStories, mockCategories, simulateDelay } from '@/lib/mock-data';

// Query keys
export const storyKeys = {
  all: ['stories'] as const,
  lists: () => [...storyKeys.all, 'list'] as const,
  list: (filters: { category?: string; search?: string }) =>
    [...storyKeys.lists(), filters] as const,
  details: () => [...storyKeys.all, 'detail'] as const,
  detail: (id: string) => [...storyKeys.details(), id] as const,
};

// Mock API functions (replace with real API calls)
const fetchStories = async (filters?: { category?: string; search?: string }): Promise<Story[]> => {
  await simulateDelay(500);
  let stories = [...mockStories];
  
  if (filters?.category && filters.category !== 'all') {
    stories = stories.filter(s => s.category === filters.category);
  }
  
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    stories = stories.filter(
      s =>
        s.title.toLowerCase().includes(searchLower) ||
        s.author.toLowerCase().includes(searchLower) ||
        s.description.toLowerCase().includes(searchLower)
    );
  }
  
  return stories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const fetchStory = async (id: string): Promise<Story | null> => {
  await simulateDelay(300);
  const story = mockStories.find(s => s.id === id);
  return story || null;
};

const createStory = async (input: CreateStoryInput): Promise<Story> => {
  await simulateDelay(800);
  const newStory: Story = {
    id: Math.random().toString(36).substr(2, 9),
    ...input,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
  };
  mockStories.unshift(newStory);
  return newStory;
};

const updateStory = async (input: UpdateStoryInput): Promise<Story> => {
  await simulateDelay(600);
  const index = mockStories.findIndex(s => s.id === input.id);
  if (index === -1) throw new Error('Story not found');
  
  const updatedStory = {
    ...mockStories[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  mockStories[index] = updatedStory;
  return updatedStory;
};

const deleteStory = async (id: string): Promise<void> => {
  await simulateDelay(500);
  const index = mockStories.findIndex(s => s.id === id);
  if (index === -1) throw new Error('Story not found');
  mockStories.splice(index, 1);
};

// Hooks
export function useStories(filters?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: storyKeys.list(filters || {}),
    queryFn: () => fetchStories(filters),
  });
}

export function useStory(id: string) {
  return useQuery({
    queryKey: storyKeys.detail(id),
    queryFn: () => fetchStory(id),
    enabled: !!id,
  });
}

export function useCreateStory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storyKeys.lists() });
    },
  });
}

export function useUpdateStory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateStory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: storyKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: storyKeys.lists() });
    },
  });
}

export function useDeleteStory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storyKeys.lists() });
    },
  });
}

// Categories hook
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      await simulateDelay(300);
      return mockCategories;
    },
  });
}
