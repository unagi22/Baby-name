import { createClient } from '@supabase/supabase-js';
import type { Project, NameSuggestion, Gender } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function createProject(parentsNames: string, genderPreference: Gender): Promise<string> {
  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        parents_names: parentsNames,
        gender_preference: genderPreference,
        created_at: new Date().toISOString(),
        created_by: 'anonymous'
      }
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data.id;
}

export async function getProject(projectId: string): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Project not found');
    }
    throw new Error(error.message);
  }

  return data;
}

export async function getSuggestions(projectId: string): Promise<NameSuggestion[]> {
  const { data, error } = await supabase
    .from('suggestions')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function addSuggestion(
  projectId: string,
  name: string,
  gender: Gender,
  suggestedBy: string
): Promise<NameSuggestion> {
  const { data, error } = await supabase
    .from('suggestions')
    .insert([
      {
        project_id: projectId,
        name,
        gender,
        suggested_by: suggestedBy,
        likes: 0,
        is_favorite: false,
        created_at: new Date().toISOString()
      }
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function toggleSuggestionLike(
  projectId: string,
  suggestionId: string
): Promise<{ likes: number }> {
  // First get the current likes
  const { data: suggestion, error: fetchError } = await supabase
    .from('suggestions')
    .select('likes')
    .eq('id', suggestionId)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  // Toggle the like by incrementing
  const newLikes = (suggestion.likes || 0) + 1;
  const { error: updateError } = await supabase
    .from('suggestions')
    .update({ likes: newLikes })
    .eq('id', suggestionId);

  if (updateError) throw new Error(updateError.message);
  return { likes: newLikes };
}

export async function toggleSuggestionFavorite(
  projectId: string,
  suggestionId: string
): Promise<{ is_favorite: boolean }> {
  // First get the current favorite status
  const { data: suggestion, error: fetchError } = await supabase
    .from('suggestions')
    .select('is_favorite')
    .eq('id', suggestionId)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  // Toggle the favorite status
  const newFavoriteStatus = !suggestion.is_favorite;
  const { error: updateError } = await supabase
    .from('suggestions')
    .update({ is_favorite: newFavoriteStatus })
    .eq('id', suggestionId);

  if (updateError) throw new Error(updateError.message);
  return { is_favorite: newFavoriteStatus };
}
