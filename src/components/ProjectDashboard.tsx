import { useState, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Project, NameSuggestion } from "@/types";
import { NameCard } from "./NameCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share2, SlidersHorizontal, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SuggestForm } from "./SuggestForm";

interface ProjectDashboardProps {
  projectId: string;
}

type FilterState = {
  gender: "all" | "male" | "female";
  favorites: boolean;
  mostPopular: boolean;
  contributor: string | null;
};

export function ProjectDashboard({ projectId }: ProjectDashboardProps) {
  const [projects, setProjects] = useLocalStorage<Project[]>(
    "babyNamingProjects",
    []
  );
  const [activeTab, setActiveTab] = useState<"new" | "favorites">("new");
  const [filters, setFilters] = useState<FilterState>({
    gender: "all",
    favorites: false,
    mostPopular: false,
    contributor: null,
  });
  const [showSuggestDialog, setShowSuggestDialog] = useState(false);
  const { toast } = useToast();

  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  const handleLike = (suggestionId: string) => {
    // Generate a random user ID for demo purposes
    // In a real app, this would be the actual user's ID
    const userId = Math.random().toString(36).substr(2, 9);

    const updatedProjects = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          suggestions: p.suggestions.map((s) => {
            if (s.id === suggestionId) {
              const isLiked = s.likedBy.includes(userId);
              return {
                ...s,
                likes: isLiked ? s.likes - 1 : s.likes + 1,
                likedBy: isLiked
                  ? s.likedBy.filter((id) => id !== userId)
                  : [...s.likedBy, userId],
              };
            }
            return s;
          }),
        };
      }
      return p;
    });
    setProjects(updatedProjects);
  };

  const handleFavorite = (suggestionId: string) => {
    const updatedProjects = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          suggestions: p.suggestions.map((s) =>
            s.id === suggestionId
              ? {
                  ...s,
                  status: s.status === "favorite" ? "new" : "favorite",
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

  const filteredSuggestions = project.suggestions
    .filter((s) => {
      // First filter by tab
      if (activeTab === "new" && s.status === "favorite") return false;
      if (activeTab === "favorites" && s.status !== "favorite") return false;

      // Then apply additional filters
      if (filters.gender !== "all" && s.gender !== filters.gender) return false;
      if (filters.favorites && s.status !== "favorite") return false;
      if (filters.contributor && s.contributor !== filters.contributor)
        return false;

      return true;
    })
    .sort((a, b) => {
      // Sort by most popular if the filter is active
      if (filters.mostPopular) {
        return b.likes - a.likes;
      }
      // Otherwise, sort by newest first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/suggest/${projectId}`;

      if (navigator.share) {
        await navigator.share({
          title: project.coupleNames,
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
                  {project.coupleNames}
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
              <Dialog
                open={showSuggestDialog}
                onOpenChange={setShowSuggestDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Name
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Suggest a Name</DialogTitle>
                    <DialogDescription>
                      Help choose the perfect name for this baby
                    </DialogDescription>
                  </DialogHeader>
                  <SuggestForm
                    projectId={projectId}
                    onSuccess={() => setShowSuggestDialog(false)}
                  />
                </DialogContent>
              </Dialog>

              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>

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
                    Boy Names
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.gender === "female"}
                    onCheckedChange={() =>
                      setFilters((f) => ({ ...f, gender: "female" }))
                    }
                  >
                    Girl Names
                  </DropdownMenuCheckboxItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Sort & Filter
                  </DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={filters.mostPopular}
                    onCheckedChange={(checked) =>
                      setFilters((f) => ({ ...f, mostPopular: checked }))
                    }
                  >
                    Most Popular First
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.favorites}
                    onCheckedChange={(checked) =>
                      setFilters((f) => ({ ...f, favorites: checked }))
                    }
                  >
                    Favorites Only
                  </DropdownMenuCheckboxItem>

                  {contributors.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Filter by Contributor
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
            </div>
          </div>

          <div className="mt-8">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as typeof activeTab)}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="new">All Names</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
              </TabsList>

              <TabsContent value="new" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSuggestions.length === 0 ? (
                    <Card className="p-8 text-center col-span-2">
                      <p className="text-muted-foreground">No names yet</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setShowSuggestDialog(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Name
                      </Button>
                    </Card>
                  ) : (
                    filteredSuggestions.map((suggestion) => (
                      <NameCard
                        key={suggestion.id}
                        suggestion={suggestion}
                        onLike={() => handleLike(suggestion.id)}
                        onFavorite={() => handleFavorite(suggestion.id)}
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="favorites" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSuggestions.length === 0 ? (
                    <Card className="p-8 text-center col-span-2">
                      <p className="text-muted-foreground">
                        No favorite names yet
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Click the heart icon on names you love to add them to
                        your favorites
                      </p>
                    </Card>
                  ) : (
                    filteredSuggestions.map((suggestion) => (
                      <NameCard
                        key={suggestion.id}
                        suggestion={suggestion}
                        onLike={() => handleLike(suggestion.id)}
                        onFavorite={() => handleFavorite(suggestion.id)}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
