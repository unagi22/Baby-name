import { create } from 'zustand';
import type { Project, NameSuggestion, Gender } from '../types';
import * as api from '../services/api';

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

// Keep local cache of projects and suggestions for better performance
const projectCache = new Map<string, Project>();
const suggestionsCache = new Map<string, NameSuggestion[]>();

export const useProjectStore = create<ProjectStore>((set, get) => ({
  currentProject: null,
  nameSuggestions: [],
  loading: false,
  error: null,

  createProject: async (parentsNames, genderPreference) => {
    set({ loading: true, error: null });
    try {
      const projectId = await api.createProject(parentsNames, genderPreference);
      const project = await api.getProject(projectId);
      
      projectCache.set(projectId, project);
      suggestionsCache.set(projectId, []);
      
      set({ 
        currentProject: project,
        nameSuggestions: [],
        loading: false 
      });
      
      return projectId;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  loadProject: async (id) => {
    set({ loading: true, error: null });
    try {
      let project: Project;
      let suggestions: NameSuggestion[];

      // Try to get from cache first
      if (projectCache.has(id)) {
        project = projectCache.get(id)!;
        suggestions = suggestionsCache.get(id) || [];
      } else {
        // Fetch from API if not in cache
        [project, suggestions] = await Promise.all([
          api.getProject(id),
          api.getSuggestions(id)
        ]);

        // Update cache
        projectCache.set(id, project);
        suggestionsCache.set(id, suggestions);
      }

      set({
        currentProject: project,
        nameSuggestions: suggestions,
        loading: false
      });
    } catch (error) {
      set({ 
        error: (error as Error).message, 
        loading: false,
        currentProject: null,
        nameSuggestions: []
      });
      throw error;
    }
  },

  addNameSuggestion: async (name, gender, suggestedBy) => {
    const { currentProject } = get();
    if (!currentProject) return;

    set({ loading: true, error: null });
    try {
      const suggestion = await api.addSuggestion(
        currentProject.id,
        name,
        gender,
        suggestedBy
      );

      // Get fresh suggestions from API to ensure consistency
      const suggestions = await api.getSuggestions(currentProject.id);
      suggestionsCache.set(currentProject.id, suggestions);

      set({
        nameSuggestions: suggestions,
        loading: false
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  toggleLike: async (nameId) => {
    const { currentProject, nameSuggestions } = get();
    if (!currentProject) return;

    try {
      const { likes } = await api.toggleSuggestionLike(currentProject.id, nameId);

      const updatedSuggestions = nameSuggestions.map(s =>
        s.id === nameId ? { ...s, likes } : s
      );

      suggestionsCache.set(currentProject.id, updatedSuggestions);
      set({ nameSuggestions: updatedSuggestions });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  toggleFavorite: async (nameId) => {
    const { currentProject, nameSuggestions } = get();
    if (!currentProject) return;

    try {
      const { is_favorite } = await api.toggleSuggestionFavorite(currentProject.id, nameId);

      const updatedSuggestions = nameSuggestions.map(s =>
        s.id === nameId ? { ...s, is_favorite } : s
      );

      suggestionsCache.set(currentProject.id, updatedSuggestions);
      set({ nameSuggestions: updatedSuggestions });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  }
}));