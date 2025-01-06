export type NameSuggestion = {
  id: string;
  name: string;
  gender: "male" | "female";
  contributor: string;
  status: "new" | "favorite" | "hearted";
  likes: number;
  likedBy: string[];
  createdAt: string;
};

export type Project = {
  id: string;
  coupleNames: string;
  genderPreference: "male" | "female" | "both";
  suggestions: NameSuggestion[];
  createdAt: string;
};
