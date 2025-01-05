import { useState, useEffect } from "react";
import { CreateProject } from "@/components/CreateProject";
import { ProjectDashboard } from "@/components/ProjectDashboard";
import { SuggestPage } from "@/components/SuggestPage";
import { Button } from "@/components/ui/button";
import { Baby } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Project } from "@/types";
import { AnimatePresence, motion } from "framer-motion";

export default function App() {
  const [projects] = useLocalStorage<Project[]>("babyNamingProjects", []);
  const [showCreateProject, setShowCreateProject] = useState(
    projects.length === 0
  );
  const [activeProjectId, setActiveProjectId] = useState<string | null>(
    projects.length > 0 ? projects[0].id : null
  );

  // Check if we're on a suggestion page
  const isSuggestPage = window.location.pathname.startsWith("/suggest/");
  const suggestProjectId = isSuggestPage
    ? window.location.pathname.split("/suggest/")[1]
    : null;

  useEffect(() => {
    // Update active project when projects change
    if (projects.length > 0 && !activeProjectId && !isSuggestPage) {
      setActiveProjectId(projects[0].id);
      setShowCreateProject(false);
    }
  }, [projects, activeProjectId, isSuggestPage]);

  const handleProjectCreated = (projectId: string) => {
    setActiveProjectId(projectId);
    setShowCreateProject(false);
  };

  // If we're on a suggestion page, show that instead
  if (isSuggestPage && suggestProjectId) {
    return <SuggestPage projectId={suggestProjectId} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <AnimatePresence mode="wait">
        {showCreateProject ? (
          <motion.div
            key="create"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 md:p-8"
          >
            <div className="max-w-7xl mx-auto space-y-8">
              <header className="text-center space-y-4">
                <motion.h1
                  className="text-4xl font-bold tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Baby Name Explorer
                </motion.h1>
                <motion.p
                  className="text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Create a project, share with loved ones, and find the perfect
                  name for your baby
                </motion.p>
              </header>
              <CreateProject onProjectCreated={handleProjectCreated} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="min-h-screen"
          >
            <div className="max-w-7xl mx-auto p-4 md:p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">Baby Name Explorer</h1>
                </div>
                <Button
                  onClick={() => setShowCreateProject(true)}
                  className="bg-primary/10 hover:bg-primary/20 text-primary"
                >
                  <Baby className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>
              {activeProjectId && (
                <ProjectDashboard
                  key={activeProjectId}
                  projectId={activeProjectId}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
