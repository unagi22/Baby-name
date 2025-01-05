export type Gender = 'male' | 'female' | 'both';

export interface NameSuggestion {
  id: string;
  name: string;
  gender: Exclude<Gender, 'both'>;
  contributor: string;
  status: 'new' | 'interesting' | 'archived' | 'hearted';
  createdAt: string;
}

export interface Project {
  id: string;
  coupleNames: string;
  genderPreference: Gender;
  suggestions: NameSuggestion[];
  createdAt: string;
}