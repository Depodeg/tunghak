
import { useState } from "react";
import { ChecklistSection as ChecklistSectionType, ChecklistItem as ChecklistItemType } from "@/types";
import ChecklistItem from "./ChecklistItem";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ChecklistSectionProps {
  section: ChecklistSectionType;
  onToggleItem: (sectionId: string, itemId: string) => void;
  onToggleExpand: (sectionId: string) => void;
  onAddPhoto: (sectionId: string, itemId: string, photoUrl: string) => void;
  onAddNote: (sectionId: string, itemId: string, note: string) => void;
}

const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  section,
  onToggleItem,
  onToggleExpand,
  onAddPhoto,
  onAddNote
}) => {
  const completedItems = section.items.filter(item => item.isCompleted).length;
  const totalItems = section.items.length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="checklist-container">
      <div className="flex items-center justify-between mb-2">
        <h3 className="checklist-title">{section.title}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleExpand(section.id)}
        >
          {section.isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Progress value={progress} className="h-2" />
        <span>{completedItems}/{totalItems}</span>
      </div>
      
      {section.isExpanded && (
        <div className="space-y-1 mt-4">
          {section.items.map((item) => (
            <ChecklistItem
              key={item.id}
              item={item}
              onToggle={(itemId) => onToggleItem(section.id, itemId)}
              onAddPhoto={(itemId, photoUrl) => onAddPhoto(section.id, itemId, photoUrl)}
              onAddNote={(itemId, note) => onAddNote(section.id, itemId, note)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChecklistSection;
