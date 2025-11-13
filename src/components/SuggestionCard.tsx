import { MapPin, Star, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SuggestionCardProps {
  name: string;
  type: string;
  location: string;
  rating: number;
  price: string;
  image: string;
  description: string;
  onClick?: () => void;
}

export const SuggestionCard = ({
  name,
  type,
  location,
  rating,
  price,
  image,
  description,
  onClick,
}: SuggestionCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-moroccan transition-all duration-300 group cursor-pointer animate-slide-in">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0">
          {type}
        </Badge>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1 text-accent">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-secondary font-semibold">
            <DollarSign className="w-4 h-4" />
            <span>{price}</span>
          </div>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90"
            onClick={onClick}
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};
