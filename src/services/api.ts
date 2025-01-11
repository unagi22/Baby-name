import type { Project, NameSuggestion, Gender } from '../types';

const API_URL = 'https://babyname-api.netlify.app/.netlify/functions';

export async function createProject(parentsNames: string, genderPreference: Gender): Promise<string> {
  const response = await fetch(`${API_URL}/create-project`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ parentsNames, genderPreference }),
  });

  if (!response.ok) {
    throw new Error('Failed to create project');
  }

  const data = await response.json();
  return data.projectId;
}

export async function getProject(projectId: string): Promise<Project> {
  const response = await fetch(`${API_URL}/get-project/${projectId}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Project not found');
    }
    throw new Error('Failed to fetch project');
  }

  return response.json();
}

export async function getSuggestions(projectId: string): Promise<NameSuggestion[]> {
  const response = await fetch(`${API_URL}/get-suggestions/${projectId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch suggestions');
  }

  return response.json();
}

export async function addSuggestion(
  projectId: string,
  name: string,
  gender: Gender,
  suggestedBy: string
): Promise<NameSuggestion> {
  const response = await fetch(`${API_URL}/add-suggestion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projectId, name, gender, suggestedBy }),
  });

  if (!response.ok) {
    throw new Error('Failed to add suggestion');
  }

  return response.json();
}

export async function toggleSuggestionLike(
  projectId: string,
  suggestionId: string
): Promise<{ likes: number }> {
  const response = await fetch(`${API_URL}/toggle-like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projectId, suggestionId }),
  });

  if (!response.ok) {
    throw new Error('Failed to toggle like');
  }

  return response.json();
}

export async function toggleSuggestionFavorite(
  projectId: string,
  suggestionId: string
): Promise<{ is_favorite: boolean }> {
  const response = await fetch(`${API_URL}/toggle-favorite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projectId, suggestionId }),
  });

  if (!response.ok) {
    throw new Error('Failed to toggle favorite');
  }

  return response.json();
}
