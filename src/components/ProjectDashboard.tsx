import { useState, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Project, NameSuggestion } from "@/types";
import { NameCard } from "./NameCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share2, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface ProjectDashboardProps {
  projectId: string;
}

type FilterState = {
  gender: "all" | "male" | "female";
  hearted: boolean;
  archived: boolean;
  contributor: string | null;
};

export function ProjectDashboard({ projectId }: ProjectDashboardProps) {
  const [projects, setProjects] = useLocalStorage<Project[]>(
    "babyNamingProjects",
    []
  );
  const [activeTab, setActiveTab] = useState<
    "new" | "interesting" | "archived"
  >("new");
  const [filters, setFilters] = useState<FilterState>({
    gender: "all",
    hearted: false,
    archived: false,
    contributor: null,
  });
  const { toast } = useToast();

  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  const handleSwipe = (suggestionId: string, direction: "left" | "right") => {
    const newStatus: NameSuggestion["status"] =
      direction === "right" ? "interesting" : "archived";
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
                  status: (s.status === "hearted"
                    ? "interesting"
                    : "hearted") as NameSuggestion["status"],
                }
              : s
          ),
        };
      }
      return p;
    });
    setProjects(updatedProjects);
  };

  // Get unique contributors
  const contributors = useMemo(() => {
    const uniqueContributors = new Set(
      project.suggestions.map((s) => s.contributor)
    );
    return Array.from(uniqueContributors);
  }, [project.suggestions]);

  const filteredSuggestions = project.suggestions.filter((s) => {
    // First filter by tab
    if (activeTab === "new" && s.status !== "new") return false;
    if (
      activeTab === "interesting" &&
      !["interesting", "hearted"].includes(s.status)
    )
      return false;
    if (activeTab === "archived" && s.status !== "archived") return false;

    // Then apply additional filters
    if (filters.gender !== "all" && s.gender !== filters.gender) return false;
    if (filters.hearted && s.status !== "hearted") return false;
    if (filters.archived && s.status !== "archived") return false;
    if (filters.contributor && s.contributor !== filters.contributor)
      return false;

    return true;
  });

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/suggest/${projectId}`;

      if (navigator.share) {
        await navigator.share({
          title: `${project.coupleNames}'s Baby Name Project`,
          text: "Help us choose a name for our baby!",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied! 🔗",
          description:
            "Share this link with friends and family to get name suggestions!",
        });
      }
    } catch (error) {
      toast({
        title: "Couldn't share",
        description: "Please try copying the link manually.",
        variant: "destructive",
      });
    }
  };

  const getGenderIcon = () => {
    switch (project.genderPreference) {
      case "male":
        return "👦";
      case "female":
        return "👧";
      default:
        return "👶";
    }
  };

  const getGenderColor = () => {
    switch (project.genderPreference) {
      case "male":
        return "text-blue-500 bg-blue-50";
      case "female":
        return "text-pink-500 bg-pink-50";
      default:
        return "text-purple-500 bg-purple-50";
    }
  };

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== "all" && v !== null && v !== false
  ).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <motion.div
        className="bg-white rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className={`text-3xl p-3 rounded-full ${getGenderColor()}`}>
                {getGenderIcon()}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">
                  {project.coupleNames}'s Project
                </h2>
                <p className="text-sm text-muted-foreground">
                  Looking for{" "}
                  {project.genderPreference === "both"
                    ? "baby names"
                    : `${project.genderPreference} names`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <SlidersHorizontal className="w-4 h-4" />
                    {activeFiltersCount > 0 && (
                      <Badge
                        className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs"
                        variant="destructive"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filters</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuLabel className="text-xs text-muted-foreground mt-2">
                    Gender
                  </DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={filters.gender === "all"}
                    onCheckedChange={() =>
                      setFilters((f) => ({ ...f, gender: "all" }))
                    }
                  >
                    All Genders
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.gender === "male"}
                    onCheckedChange={() =>
                      setFilters((f) => ({ ...f, gender: "male" }))
                    }
                  >
                    Male Names
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.gender === "female"}
                    onCheckedChange={() =>
                      setFilters((f) => ({ ...f, gender: "female" }))
                    }
                  >
                    Female Names
                  </DropdownMenuCheckboxItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Status
                  </DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={filters.hearted}
                    onCheckedChange={(checked) =>
                      setFilters((f) => ({ ...f, hearted: checked }))
                    }
                  >
                    Hearted Only
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.archived}
                    onCheckedChange={(checked) =>
                      setFilters((f) => ({ ...f, archived: checked }))
                    }
                  >
                    Include Archived
                  </DropdownMenuCheckboxItem>

                  {contributors.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        By Contributor
                      </DropdownMenuLabel>
                      <DropdownMenuCheckboxItem
                        checked={filters.contributor === null}
                        onCheckedChange={() =>
                          setFilters((f) => ({ ...f, contributor: null }))
                        }
                      >
                        All Contributors
                      </DropdownMenuCheckboxItem>
                      {contributors.map((contributor) => (
                        <DropdownMenuCheckboxItem
                          key={contributor}
                          checked={filters.contributor === contributor}
                          onCheckedChange={() =>
                            setFilters((f) => ({ ...f, contributor }))
                          }
                        >
                          {contributor}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={handleShare}
                size="icon"
                className="bg-primary hover:bg-primary/90"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          className="w-full"
        >
          <div className="border-t">
            <TabsList className="w-full rounded-none h-14">
              <TabsTrigger
                value="new"
                className="flex-1 data-[state=active]:bg-background"
              >
                <span className="text-lg">New</span>
              </TabsTrigger>
              <TabsTrigger
                value="interesting"
                className="flex-1 data-[state=active]:bg-background"
              >
                <span className="text-lg">Interesting</span>
              </TabsTrigger>
              <TabsTrigger
                value="archived"
                className="flex-1 data-[state=active]:bg-background"
              >
                <span className="text-lg">Archived</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="p-4 md:p-8 min-h-[400px]">
            <div className="space-y-4">
              {filteredSuggestions.length === 0 ? (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-center py-8">
                    <div className="max-w-sm mx-auto space-y-4">
                      <div className="text-4xl">✨</div>
                      <h3 className="text-xl font-semibold">No names yet</h3>
                      <p className="text-sm text-muted-foreground">
                        {activeFiltersCount > 0
                          ? "Try adjusting your filters to see more names"
                          : "Share your project with friends and family to get name suggestions!"}
                      </p>
                      {activeFiltersCount > 0 ? (
                        <Button
                          onClick={() =>
                            setFilters({
                              gender: "all",
                              hearted: false,
                              archived: false,
                              contributor: null,
                            })
                          }
                          variant="outline"
                          size="lg"
                          className="mt-4"
                        >
                          Clear Filters
                        </Button>
                      ) : (
                        <Button
                          onClick={handleShare}
                          variant="outline"
                          size="lg"
                          className="mt-4"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Project
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Mock cards */}
                  <div className="opacity-30 pointer-events-none max-w-md mx-auto">
                    {[1, 2].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="mb-4"
                      >
                        <Card className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-muted rounded-full" />
                              <div className="w-24 h-6 bg-muted rounded" />
                            </div>
                            <div className="w-8 h-8 bg-muted rounded-full" />
                          </div>
                          <div className="w-32 h-4 bg-muted rounded mt-2" />
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="max-w-md mx-auto">
                  {filteredSuggestions.map((suggestion: NameSuggestion) => (
                    <NameCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      onSwipe={(direction) =>
                        handleSwipe(suggestion.id, direction)
                      }
                      onHeart={() => handleHeart(suggestion.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
