export type Gender = "male" | "female" | "both";

export type NameStatus = "new" | "favorite";

export type NameSuggestion = {
  id: string;
  name: string;
  gender: Exclude<Gender, "both">;
  contributor: string;
  status: NameStatus;
  likes: number;
  likedBy: string[];
  createdAt: string;
};

export type Project = {
  id: string;
  coupleNames: string;
  genderPreference: Gender;
  suggestions: NameSuggestion[];
  createdAt: string;
};
