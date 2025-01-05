import { useState } from "react";
import {
  motion,
  PanInfo,
  useAnimation,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Card } from "@/components/ui/card";
import { Heart, Share2, Archive } from "lucide-react";
import { NameSuggestion } from "@/types";
import { cn } from "@/lib/utils";

interface NameCardProps {
  suggestion: NameSuggestion;
  onSwipe: (direction: "left" | "right") => void;
  onHeart: () => void;
}

export function NameCard({ suggestion, onSwipe, onHeart }: NameCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const backgroundColor = useTransform(
    x,
    [-200, 0, 200],
    ["rgba(239, 68, 68, 0.1)", "rgba(0, 0, 0, 0)", "rgba(34, 197, 94, 0.1)"]
  );

  const handleDragEnd = async (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(velocity) >= 500 || Math.abs(offset) >= 100) {
      const direction = offset > 0 ? "right" : "left";
      await controls.start({
        x: direction === "right" ? 200 : -200,
        opacity: 0,
        transition: { duration: 0.2 },
      });
      onSwipe(direction);
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
    setIsDragging(false);
  };

  const handleShare = () => {
    // Share functionality
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      animate={controls}
      style={{ x, rotate }}
      className="cursor-grab active:cursor-grabbing"
      whileTap={{ scale: 1.05 }}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div style={{ backgroundColor }}>
        <Card
          className={cn(
            "relative w-full transition-colors p-4",
            isDragging && "bg-muted"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {suggestion.gender === "male" ? "👦" : "👧"}
              </span>
              <h3 className="text-lg font-semibold">{suggestion.name}</h3>
            </div>
            <motion.button
              onClick={onHeart}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className={cn(
                "p-2 rounded-full transition-colors",
                suggestion.status === "hearted" && "text-red-500"
              )}
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-transform",
                  suggestion.status === "hearted" && "fill-current"
                )}
              />
            </motion.button>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Suggested by {suggestion.contributor}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
