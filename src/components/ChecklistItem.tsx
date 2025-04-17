
import React, { useState } from "react";
import { ChecklistItem as ChecklistItemType } from "@/types";
import { Camera, Check, MessageSquare } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (id: string) => void;
  onAddPhoto: (id: string, photoUrl: string) => void;
  onAddNote: (id: string, note: string) => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  item,
  onToggle,
  onAddPhoto,
  onAddNote,
}) => {
  const [note, setNote] = useState(item.notes || "");

  const handlePhotoCapture = () => {
    // In a real app, this would trigger the device camera
    // For demo purposes, we'll just simulate adding a photo
    const mockPhotoUrl = "public/lovable-uploads/11ce2198-18e4-4d0e-be73-3e84f646bb06.png";
    onAddPhoto(item.id, mockPhotoUrl);
  };

  const handleNoteSave = () => {
    onAddNote(item.id, note);
  };

  return (
    <div className={`checklist-item ${item.isCompleted ? "checklist-item-checked" : ""}`}>
      <Checkbox
        checked={item.isCompleted}
        onCheckedChange={() => onToggle(item.id)}
        className="mt-1"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className={`${item.isCompleted ? "line-through text-muted-foreground" : ""}`}>
            {item.text}
          </span>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить заметку</DialogTitle>
                </DialogHeader>
                <Textarea 
                  value={note} 
                  onChange={(e) => setNote(e.target.value)} 
                  placeholder="Введите комментарий"
                  className="min-h-[100px]"
                />
                <Button onClick={handleNoteSave} className="mt-4">Сохранить</Button>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              onClick={handlePhotoCapture}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {item.hasPhoto && (
          <div className="mt-2 relative">
            <img 
              src={item.photoUrl} 
              alt="Фото подтверждение" 
              className="w-full max-h-40 object-cover rounded-md"
            />
            <div className="absolute top-0 right-0 bg-green-500 text-white rounded-full p-1 m-1">
              <Check className="h-4 w-4" />
            </div>
          </div>
        )}
        
        {item.notes && (
          <div className="mt-2 text-sm p-2 bg-muted rounded-md">
            {item.notes}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChecklistItem;
