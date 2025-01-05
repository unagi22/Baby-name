import { useState } from 'react';
import { CreateProject } from '@/components/CreateProject';
import { ProjectDashboard } from '@/components/ProjectDashboard';
import { Button } from '@/components/ui/button';
import { Baby } from 'lucide-react';

export default function App() {
  const [showCreateProject, setShowCreateProject] = useState(true);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const handleProjectCreated = (projectId: string) => {
    setShowCreateProject(false);
    setActiveProjectId(projectId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Baby Name Explorer</h1>
          <p className="text-muted-foreground">
            Create a project, share with loved ones, and find the perfect name for your baby
          </p>
          {!showCreateProject && (
            <Button 
              onClick={() => setShowCreateProject(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Baby className="w-4 h-4 mr-2" />
              Create New Project
            </Button>
          )}
        </header>
        <main>
          {showCreateProject ? (
            <CreateProject onProjectCreated={handleProjectCreated} />
          ) : activeProjectId ? (
            <ProjectDashboard projectId={activeProjectId} />
          ) : null}
        </main>
      </div>
    </div>
  );
}