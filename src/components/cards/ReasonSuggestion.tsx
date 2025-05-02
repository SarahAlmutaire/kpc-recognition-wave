
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ReasonSuggestionProps {
  suggestion: string;
  onClick: () => void;
}

export function ReasonSuggestion({ suggestion, onClick }: ReasonSuggestionProps) {
  return (
    <Card className="border-kpc-light-purple/20 hover:border-kpc-light-purple transition-colors">
      <CardContent className="p-3">
        <div className="flex flex-col">
          <p className="text-sm mb-2">{suggestion}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClick}
            className="self-end text-xs"
          >
            Use This
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
