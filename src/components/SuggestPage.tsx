import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Project, NameSuggestion } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Baby } from "lucide-react";

interface SuggestPageProps {
  projectId: string;
}

export function SuggestPage({ projectId }: SuggestPageProps) {
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
      <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <motion.div
        className="max-w-2xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <header className="text-center space-y-4">
          <motion.h1
            className="text-4xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Baby Name Explorer
          </motion.h1>
        </header>

        <Card className="text-center">
          <CardHeader>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`text-3xl p-3 rounded-full ${getGenderColor()}`}>
                {getGenderIcon()}
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {project.coupleNames}'s Baby Name Project
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-base">
              <p>
                Help {project.coupleNames} find the perfect name for their baby!
              </p>
              {project.genderPreference !== "both" && (
                <p className="mt-2 font-medium text-foreground">
                  They are specifically looking for {project.genderPreference}{" "}
                  names
                </p>
              )}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Suggest a Name</CardTitle>
              <CardDescription>
                Share your favorite baby name suggestion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  onValueChange={(value) =>
                    setGender(value as "male" | "female")
                  }
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
                    <RadioGroupItem
                      value="male"
                      id="male"
                      className="sr-only"
                    />
                    <span className="text-2xl">👦</span>
                    <span className="mt-1">Male</span>
                  </Label>
                  <Label
                    htmlFor="female"
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      gender === "female"
                        ? "bg-pink-50 border-pink-400 text-pink-700"
                        : "hover:bg-muted"
                    }`}
                  >
                    <RadioGroupItem
                      value="female"
                      id="female"
                      className="sr-only"
                    />
                    <span className="text-2xl">👧</span>
                    <span className="mt-1">Female</span>
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
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full text-lg py-6">
                Submit Suggestion
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
