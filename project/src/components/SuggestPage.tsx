import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Project, NameSuggestion } from "@/types";
import { SuggestionForm } from "./SuggestionForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface SuggestPageProps {
  projectId: string;
}

export function SuggestPage({ projectId }: SuggestPageProps) {
  const [projects, setProjects] = useLocalStorage<Project[]>(
    "babyNamingProjects",
    []
  );
  const [project, setProject] = useState<Project | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const foundProject = projects.find((p) => p.id === projectId);
    setProject(foundProject || null);
  }, [projectId, projects]);

  if (!project) {
    return (
      <div className="p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Project Not Found</CardTitle>
            <CardDescription>
              Sorry, this project doesn't exist or has been deleted.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleSubmit = (
    suggestion: Omit<NameSuggestion, "id" | "status" | "createdAt">
  ) => {
    const newSuggestion: NameSuggestion = {
      ...suggestion,
      id: crypto.randomUUID(),
      status: "new",
      createdAt: new Date().toISOString(),
    };

    const updatedProjects = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          suggestions: [...p.suggestions, newSuggestion],
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    toast({
      title: "Thank you! 🎉",
      description: "Your name suggestion has been submitted.",
    });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <Card className="text-center">
        <CardHeader>
          <CardTitle>{project.coupleNames}'s Baby Name Project</CardTitle>
          <CardDescription>
            Help {project.coupleNames} find the perfect name for their baby!
            {project.genderPreference !== "both" && (
              <span className="block mt-1">
                They are looking for {project.genderPreference} names.
              </span>
            )}
          </CardDescription>
        </CardHeader>
      </Card>
      <SuggestionForm projectId={projectId} onSubmit={handleSubmit} />
    </div>
  );
}
