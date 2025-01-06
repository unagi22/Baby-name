import { useState } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Card } from "@/components/ui/card";
import { Heart, Star } from "lucide-react";
import { NameSuggestion } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NameCardProps {
  suggestion: NameSuggestion;
  onLike: () => void;
  onFavorite: () => void;
  showLikeButton?: boolean;
  currentUserId: string;
}

export function NameCard({
  suggestion,
  onLike,
  onFavorite,
  showLikeButton = true,
  currentUserId,
}: NameCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const scale = useMotionValue(1);
  const rotate = useTransform(scale, [1, 1.02], [0, 1]);

  const hasLiked = suggestion.likedBy.includes(currentUserId);

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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!hasLiked) {
                        onLike();
                      }
                    }}
                    className={cn(
                      "text-muted-foreground hover:text-foreground",
                      hasLiked && "text-red-500 hover:text-red-600"
                    )}
                    disabled={hasLiked}
                  >
                    <Heart
                      className={cn("w-4 h-4", hasLiked && "fill-current")}
                    />
                    <span className="ml-1">{suggestion.likes}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {hasLiked
                    ? "You've already liked this name"
                    : "Like this name"}
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFavorite();
                  }}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    suggestion.status === "favorite"
                      ? "text-yellow-500"
                      : "text-muted-foreground hover:text-yellow-500"
                  )}
                >
                  <Star
                    className={cn(
                      "w-4 h-4 transition-transform",
                      suggestion.status === "favorite" && "fill-current"
                    )}
                  />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                {suggestion.status === "favorite"
                  ? "Remove from favorites"
                  : "Add to favorites"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          Suggested by {suggestion.contributor}
        </div>
      </Card>
    </motion.div>
  );
}
