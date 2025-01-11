import { create } from 'zustand';
import type { Project, NameSuggestion, Gender } from '../types';

// Helper to generate UUID
const generateId = () => crypto.randomUUID();

interface ProjectStore {
  currentProject: Project | null;
  nameSuggestions: NameSuggestion[];
  loading: boolean;
  error: string | null;
  createProject: (parentsNames: string, genderPreference: Gender) => Promise<string>;
  loadProject: (id: string) => Promise<void>;
  addNameSuggestion: (name: string, gender: Gender, suggestedBy: string) => Promise<void>;
  toggleFavorite: (nameId: string) => Promise<void>;
  toggleLike: (nameId: string) => Promise<void>;
}

// Helper functions for localStorage
const getStoredProjects = (): Record<string, Project> => {
  const stored = localStorage.getItem('projects');
  return stored ? JSON.parse(stored) : {};
};

const getStoredSuggestions = (): Record<string, NameSuggestion[]> => {
  const stored = localStorage.getItem('suggestions');
  return stored ? JSON.parse(stored) : {};
};

const getStoredLikes = (): Record<string, string[]> => {
  const stored = localStorage.getItem('likes');
  return stored ? JSON.parse(stored) : {};
};

const saveProjects = (projects: Record<string, Project>) => {
  localStorage.setItem('projects', JSON.stringify(projects));
};

const saveSuggestions = (suggestions: Record<string, NameSuggestion[]>) => {
  localStorage.setItem('suggestions', JSON.stringify(suggestions));
};

const saveLikes = (likes: Record<string, string[]>) => {
  localStorage.setItem('likes', JSON.stringify(likes));
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  currentProject: null,
  nameSuggestions: [],
  loading: false,
  error: null,

  createProject: async (parentsNames, genderPreference) => {
    set({ loading: true, error: null });
    try {
      const projectId = generateId();
      const project: Project = {
        id: projectId,
        parents_names: parentsNames,
        gender_preference: genderPreference,
        created_at: new Date().toISOString(),
        created_by: 'anonymous'
      };

      const projects = getStoredProjects();
      projects[projectId] = project;
      saveProjects(projects);

      const suggestions: Record<string, NameSuggestion[]> = getStoredSuggestions();
      suggestions[projectId] = [];
      saveSuggestions(suggestions);

      set({ currentProject: project });
      return projectId;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  loadProject: async (id) => {
    set({ loading: true, error: null });
    try {
      // First try to load from local storage
      const projects = getStoredProjects();
      let project = projects[id];
      
      if (!project) {
        // If not in local storage, try to load from server
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) {
          throw new Error('Project not found');
        }
        project = await response.json();
        
        // Save to local storage for future access
        projects[id] = project;
        saveProjects(projects);
      }

      const suggestions = getStoredSuggestions();
      let projectSuggestions = suggestions[id] || [];

      // If project was loaded from server, also load suggestions
      if (!suggestions[id]) {
        const suggestionsResponse = await fetch(`/api/projects/${id}/suggestions`);
        if (suggestionsResponse.ok) {
          projectSuggestions = await suggestionsResponse.json();
          suggestions[id] = projectSuggestions;
          saveSuggestions(suggestions);
        }
      }

      set({
        currentProject: project,
        nameSuggestions: projectSuggestions
      });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addNameSuggestion: async (name, gender, suggestedBy) => {
    const { currentProject } = get();
    if (!currentProject) return;

    set({ loading: true, error: null });
    try {
      const suggestion: NameSuggestion = {
        id: generateId(),
        project_id: currentProject.id,
        name,
        gender,
        suggested_by: suggestedBy,
        likes: 0,
        is_favorite: false,
        created_at: new Date().toISOString()
      };

      const suggestions = getStoredSuggestions();
      suggestions[currentProject.id] = [...(suggestions[currentProject.id] || []), suggestion];
      saveSuggestions(suggestions);

      set(state => ({
        nameSuggestions: [...state.nameSuggestions, suggestion]
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  toggleFavorite: async (nameId) => {
    const { currentProject, nameSuggestions } = get();
    if (!currentProject) return;

    set({ loading: true, error: null });
    try {
      const suggestions = getStoredSuggestions();
      suggestions[currentProject.id] = nameSuggestions.map(s =>
        s.id === nameId ? { ...s, is_favorite: !s.is_favorite } : s
      );
      saveSuggestions(suggestions);

      set(state => ({
        nameSuggestions: state.nameSuggestions.map(s =>
          s.id === nameId ? { ...s, is_favorite: !s.is_favorite } : s
        )
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  toggleLike: async (nameId) => {
    const { currentProject, nameSuggestions } = get();
    if (!currentProject) return;

    set({ loading: true, error: null });
    try {
      const likes = getStoredLikes();
      const nameKey = `${currentProject.id}-${nameId}`;
      const userLikes = likes[nameKey] || [];
      const userId = 'anonymous'; // In a real app, this would be the actual user ID

      // Check if user already liked this name
      if (userLikes.includes(userId)) {
        return;
      }

      // Update likes
      likes[nameKey] = [...userLikes, userId];
      saveLikes(likes);

      const suggestions = getStoredSuggestions();
      suggestions[currentProject.id] = nameSuggestions.map(s =>
        s.id === nameId ? { ...s, likes: s.likes + 1 } : s
      );
      saveSuggestions(suggestions);

      set(state => ({
        nameSuggestions: state.nameSuggestions.map(s =>
          s.id === nameId ? { ...s, likes: s.likes + 1 } : s
        )
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  }
}));