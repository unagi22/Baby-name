import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Gender, NameSuggestion } from '@/types';

interface SuggestionFormProps {
  projectId: string;
  onSubmit: (suggestion: Omit<NameSuggestion, 'id' | 'status' | 'createdAt'>) => void;
}

export function SuggestionForm({ onSubmit }: SuggestionFormProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Exclude<Gender, 'both'>>('male');
  const [contributor, setContributor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, gender, contributor });
    setName('');
    setContributor('');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Suggest a Name</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Baby Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <RadioGroup
              value={gender}
              onValueChange={(value) => setGender(value as Exclude<Gender, 'both'>)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="suggest-male" />
                <Label htmlFor="suggest-male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="suggest-female" />
                <Label htmlFor="suggest-female">Female</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contributor">Your Name</Label>
            <Input
              id="contributor"
              value={contributor}
              onChange={(e) => setContributor(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Submit Suggestion</Button>
        </CardFooter>
      </form>
    </Card>
  );
}