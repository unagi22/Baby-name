import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Project, NameSuggestion } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SuggestFormProps {
  projectId: string;
  onSuccess?: () => void;
}

export function SuggestForm({ projectId, onSuccess }: SuggestFormProps) {
  const [projects, setProjects] = useLocalStorage<Project[]>(
    "babyNamingProjects",
    []
  );
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [contributor, setContributor] = useState("");
  const { toast } = useToast();

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">Project not found</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !contributor.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Both name and your name are required.",
        variant: "destructive",
      });
      return;
    }

    const newSuggestion: NameSuggestion = {
      id: crypto.randomUUID(),
      name: name.trim(),
      gender,
      contributor: contributor.trim(),
      status: "new",
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
    };

    const updatedProjects = projects.map((p) =>
      p.id === projectId
        ? { ...p, suggestions: [...p.suggestions, newSuggestion] }
        : p
    );

    setProjects(updatedProjects);
    setName("");
    setContributor("");

    toast({
      title: "Thank you! 🎉",
      description: "Your name suggestion has been submitted.",
    });

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Baby Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a baby name"
          required
          className="text-lg"
        />
      </div>

      <div className="space-y-2">
        <Label>Gender</Label>
        <RadioGroup
          value={gender}
          onValueChange={(value) => setGender(value as "male" | "female")}
          className="grid grid-cols-2 gap-4"
        >
          <Label
            htmlFor="male"
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
              gender === "male"
                ? "bg-blue-50 border-blue-400 text-blue-700"
                : "hover:bg-muted"
            }`}
          >
            <RadioGroupItem value="male" id="male" className="sr-only" />
            <span className="text-2xl">👦</span>
            <span className="mt-1">Boy</span>
          </Label>
          <Label
            htmlFor="female"
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
              gender === "female"
                ? "bg-pink-50 border-pink-400 text-pink-700"
                : "hover:bg-muted"
            }`}
          >
            <RadioGroupItem value="female" id="female" className="sr-only" />
            <span className="text-2xl">👧</span>
            <span className="mt-1">Girl</span>
          </Label>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contributor">Your Name</Label>
        <Input
          id="contributor"
          value={contributor}
          onChange={(e) => setContributor(e.target.value)}
          placeholder="Enter your name"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Submit Suggestion
      </Button>
    </form>
  );
}
