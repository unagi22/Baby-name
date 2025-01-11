export type Gender = 'boy' | 'girl' | 'either';

export interface Project {
  id: string;
  parents_names: string;
  gender_preference: Gender;
  created_at: string;
  created_by: string;
}

export interface NameSuggestion {
  id: string;
  project_id: string;
  name: string;
  gender: Gender;
  suggested_by: string;
  likes: number;
  is_favorite: boolean;
  created_at: string;
}

export interface User {
  id: string;
  liked_names: string[];
}