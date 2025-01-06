import { useState } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { NameSuggestion } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NameCardProps {
  suggestion: NameSuggestion;
  onLike: () => void;
  onFavorite: () => void;
  showLikeButton?: boolean;
}

export function NameCard({
  suggestion,
  onLike,
  onFavorite,
  showLikeButton = true,
}: NameCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const scale = useMotionValue(1);
  const rotate = useTransform(scale, [1, 1.02], [0, 1]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ scale, rotate }}
      className="cursor-pointer"
    >
      <Card
        className={cn(
          "relative w-full transition-colors p-4",
          isHovered && "bg-muted"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {suggestion.gender === "male" ? "👦" : "👧"}
            </span>
            <h3 className="text-lg font-semibold">{suggestion.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            {showLikeButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onLike();
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <Heart
                  className={cn(
                    "w-4 h-4",
                    suggestion.likedBy.length > 0 && "fill-red-500 text-red-500"
                  )}
                />
                <span className="ml-1">{suggestion.likes}</span>
              </Button>
            )}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className={cn(
                "p-2 rounded-full transition-colors",
                suggestion.status === "favorite" && "text-yellow-500"
              )}
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-transform",
                  suggestion.status === "favorite" && "fill-current"
                )}
              />
            </motion.button>
          </div>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          Suggested by {suggestion.contributor}
        </div>
      </Card>
    </motion.div>
  );
}
