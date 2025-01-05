import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Project, NameSuggestion } from "@/types";
import { NameCard } from "./NameCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProjectDashboardProps {
  projectId: string;
}

export function ProjectDashboard({ projectId }: ProjectDashboardProps) {
  const [projects, setProjects] = useLocalStorage<Project[]>(
    "babyNamingProjects",
    []
  );
  const [activeTab, setActiveTab] = useState<
    "new" | "interesting" | "archived"
  >("new");
  const { toast } = useToast();

  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  const handleSwipe = (suggestionId: string, direction: "left" | "right") => {
    const newStatus = direction === "right" ? "interesting" : "archived";
    const updatedProjects = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          suggestions: p.suggestions.map((s) =>
            s.id === suggestionId ? { ...s, status: newStatus } : s
          ),
        };
      }
      return p;
    });
    setProjects(updatedProjects);
  };

  const handleHeart = (suggestionId: string) => {
    const updatedProjects = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          suggestions: p.suggestions.map((s) =>
            s.id === suggestionId
              ? {
                  ...s,
                  status: s.status === "hearted" ? "interesting" : "hearted",
                }
              : s
          ),
        };
      }
      return p;
    });
    setProjects(updatedProjects);
  };

  const filteredSuggestions = project.suggestions.filter((s) => {
    if (activeTab === "new") return s.status === "new";
    if (activeTab === "interesting")
      return s.status === "interesting" || s.status === "hearted";
    return s.status === "archived";
  });

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/suggest/${projectId}`;
    await navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied! 🔗",
      description:
        "Share this link with friends and family to get name suggestions!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          {project.coupleNames}'s Project
        </h2>
        <Button
          variant="outline"
          onClick={handleShare}
          className="flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share Project
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="interesting">Interesting</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredSuggestions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No names in this category yet
              </div>
            ) : (
              filteredSuggestions.map((suggestion: NameSuggestion) => (
                <NameCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onSwipe={(direction) => handleSwipe(suggestion.id, direction)}
                  onHeart={() => handleHeart(suggestion.id)}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
