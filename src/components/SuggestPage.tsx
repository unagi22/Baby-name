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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <motion.div
        className="max-w-2xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
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
                />
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup
                  value={gender}
                  onValueChange={(value) =>
                    setGender(value as "male" | "female")
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
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
              <Button type="submit" className="w-full">
                Submit Suggestion
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
