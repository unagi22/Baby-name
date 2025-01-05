import { useState } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import { NameSuggestion } from '@/types';
import { cn } from '@/lib/utils';

interface NameCardProps {
  suggestion: NameSuggestion;
  onSwipe: (direction: 'left' | 'right') => void;
  onHeart: () => void;
}

export function NameCard({ suggestion, onSwipe, onHeart }: NameCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(velocity) >= 500 || Math.abs(offset) >= 100) {
      const direction = offset > 0 ? 'right' : 'left';
      await controls.start({
        x: direction === 'right' ? 200 : -200,
        opacity: 0,
        transition: { duration: 0.2 }
      });
      onSwipe(direction);
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
    setIsDragging(false);
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      animate={controls}
      className="cursor-grab active:cursor-grabbing"
    >
      <Card className={cn(
        "relative w-full max-w-md transition-colors",
        isDragging && "bg-muted"
      )}>
        <CardHeader>
          <Badge variant={suggestion.gender === 'male' ? 'default' : 'secondary'}>
            {suggestion.gender}
          </Badge>
        </CardHeader>
        <CardContent>
          <h3 className="text-2xl font-bold text-center py-4">{suggestion.name}</h3>
        </CardContent>
        <CardFooter className="justify-between">
          <span className="text-sm text-muted-foreground">
            Suggested by {suggestion.contributor}
          </span>
          <button
            onClick={onHeart}
            className={cn(
              "p-2 rounded-full transition-colors",
              suggestion.status === 'hearted' && "text-red-500"
            )}
          >
            <Heart className="w-4 h-4" />
          </button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}