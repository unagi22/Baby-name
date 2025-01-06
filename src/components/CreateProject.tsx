import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Project } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CreateProjectProps {
  onProjectCreated: (projectId: string) => void;
}

export function CreateProject({ onProjectCreated }: CreateProjectProps) {
  const [projects, setProjects] = useLocalStorage<Project[]>(
    "babyNamingProjects",
    []
  );
  const [coupleNames, setCoupleNames] = useState("");
  const [genderPreference, setGenderPreference] = useState<
    "male" | "female" | "both"
  >("both");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate a unique ID using timestamp and random string
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Format couple names to "X and Y's Baby"
    const formattedNames = coupleNames
      .split(" and ")
      .map((name) => name.trim())
      .join(" and ");
    const projectName = `${formattedNames}'s Baby`;

    const newProject: Project = {
      id: uniqueId,
      coupleNames: projectName,
      genderPreference,
      suggestions: [],
      createdAt: new Date().toISOString(),
    };

    setProjects([...projects, newProject]);
    onProjectCreated(uniqueId);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create a Baby Name Project</CardTitle>
          <CardDescription>
            Start your journey to find the perfect name for your baby
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="coupleNames">Parents' Names</Label>
            <Input
              id="coupleNames"
              placeholder="e.g. John and Jane"
              value={coupleNames}
              onChange={(e) => setCoupleNames(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              Enter names separated by "and" (e.g., "John and Jane")
            </p>
          </div>

          <div className="space-y-2">
            <Label>Gender Preference</Label>
            <RadioGroup
              value={genderPreference}
              onValueChange={(value) =>
                setGenderPreference(value as typeof genderPreference)
              }
              className="grid grid-cols-3 gap-4"
            >
              <Label
                htmlFor="male"
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  genderPreference === "male"
                    ? "bg-blue-50 border-blue-400 text-blue-700"
                    : "hover:bg-muted"
                }`}
              >
                <RadioGroupItem value="male" id="male" className="sr-only" />
                <motion.span
                  className="text-4xl"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  👦
                </motion.span>
                <span className="mt-2">Boy</span>
              </Label>
              <Label
                htmlFor="female"
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  genderPreference === "female"
                    ? "bg-pink-50 border-pink-400 text-pink-700"
                    : "hover:bg-muted"
                }`}
              >
                <RadioGroupItem
                  value="female"
                  id="female"
                  className="sr-only"
                />
                <motion.span
                  className="text-4xl"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  👧
                </motion.span>
                <span className="mt-2">Girl</span>
              </Label>
              <Label
                htmlFor="both"
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  genderPreference === "both"
                    ? "bg-purple-50 border-purple-400 text-purple-700"
                    : "hover:bg-muted"
                }`}
              >
                <RadioGroupItem value="both" id="both" className="sr-only" />
                <motion.span
                  className="text-4xl"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  👶
                </motion.span>
                <span className="mt-2">Either</span>
              </Label>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full">
            Create Project
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
