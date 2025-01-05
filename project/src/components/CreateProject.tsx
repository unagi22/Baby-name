import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Baby } from 'lucide-react';
import { Gender, Project } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';

interface CreateProjectProps {
  onProjectCreated: (projectId: string) => void;
}

export function CreateProject({ onProjectCreated }: CreateProjectProps) {
  const [projects, setProjects] = useLocalStorage<Project[]>('babyNamingProjects', []);
  const [coupleNames, setCoupleNames] = useState('');
  const [genderPreference, setGenderPreference] = useState<Gender>('both');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: crypto.randomUUID(),
      coupleNames,
      genderPreference,
      suggestions: [],
      createdAt: new Date().toISOString(),
    };
    setProjects([...projects, newProject]);
    
    toast({
      title: "Project Created! 🎉",
      description: "Your baby naming project is ready to go!",
    });
    
    onProjectCreated(newProject.id);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Baby className="w-6 h-6" />
          Create Baby Naming Project
        </CardTitle>
        <CardDescription>
          Start your journey to find the perfect name for your baby
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="coupleNames">Your Names</Label>
            <Input
              id="coupleNames"
              placeholder="e.g., Sarah & John"
              value={coupleNames}
              onChange={(e) => setCoupleNames(e.target.value)}
              required
              className="border-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label>Name Preference</Label>
            <RadioGroup
              value={genderPreference}
              onValueChange={(value) => setGenderPreference(value as Gender)}
              className="grid grid-cols-3 gap-4"
            >
              <Label
                htmlFor="male"
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  genderPreference === 'male'
                    ? 'bg-blue-50 border-blue-400 text-blue-700'
                    : 'hover:bg-muted'
                }`}
              >
                <RadioGroupItem value="male" id="male" className="sr-only" />
                <span className="text-lg">👦</span>
                <span className="mt-1">Male</span>
              </Label>
              <Label
                htmlFor="female"
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  genderPreference === 'female'
                    ? 'bg-pink-50 border-pink-400 text-pink-700'
                    : 'hover:bg-muted'
                }`}
              >
                <RadioGroupItem value="female" id="female" className="sr-only" />
                <span className="text-lg">👧</span>
                <span className="mt-1">Female</span>
              </Label>
              <Label
                htmlFor="both"
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  genderPreference === 'both'
                    ? 'bg-purple-50 border-purple-400 text-purple-700'
                    : 'hover:bg-muted'
                }`}
              >
                <RadioGroupItem value="both" id="both" className="sr-only" />
                <span className="text-lg">👶👶</span>
                <span className="mt-1">Both</span>
              </Label>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            Create Project
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}