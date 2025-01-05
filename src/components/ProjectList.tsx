import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Project } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function ProjectList() {
  const [projects] = useLocalStorage<Project[]>('babyNamingProjects', []);

  const copyShareLink = (projectId: string) => {
    const shareLink = `${window.location.origin}/suggest/${projectId}`;
    navigator.clipboard.writeText(shareLink);
  };

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{project.coupleNames}</span>
              <Button variant="ghost" size="icon" onClick={() => copyShareLink(project.id)}>
                <Share2 className="w-4 h-4" />
              </Button>
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Created {formatDistanceToNow(new Date(project.createdAt))} ago
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-sm font-medium">
                  {project.suggestions.length} suggestions
                </div>
                <div className="text-sm text-muted-foreground">
                  Looking for {project.genderPreference} names
                </div>
              </div>
              <Button variant="outline" size="icon">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}