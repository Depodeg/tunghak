
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Checklist } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface ChecklistImportProps {
  onImport: (checklist: Checklist) => void;
}

const ChecklistImport: React.FC<ChecklistImportProps> = ({ onImport }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!file) {
      toast.error("Выберите файл для импорта");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        
        // Validate the imported JSON
        if (!json.sections && !json.name) {
          // Try to handle exported checklist format
          if (json.date && Array.isArray(json.sections)) {
            const importedChecklist: Checklist = {
              id: uuidv4(),
              name: `Импортированный чек-лист ${new Date().toLocaleDateString()}`,
              sections: json.sections.map((section: any) => ({
                id: uuidv4(),
                title: section.title,
                items: Array.isArray(section.items) ? section.items.map((item: any) => ({
                  id: uuidv4(),
                  text: item.text,
                  isCompleted: Boolean(item.isCompleted),
                  hasPhoto: Boolean(item.hasPhoto),
                  photoUrl: item.photoUrl || undefined,
                  notes: item.notes || undefined
                })) : [],
                isExpanded: true
              })),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            
            onImport(importedChecklist);
            toast.success("Чек-лист успешно импортирован");
          } else {
            toast.error("Неверный формат файла");
          }
          return;
        }

        // Handle the checklist builder format
        const importedChecklist: Checklist = {
          id: json.id || uuidv4(),
          name: json.name,
          description: json.description,
          sections: Array.isArray(json.sections) ? json.sections.map((section: any) => ({
            id: section.id || uuidv4(),
            title: section.title,
            items: Array.isArray(section.items) ? section.items.map((item: any) => ({
              id: item.id || uuidv4(),
              text: item.text,
              isCompleted: Boolean(item.isCompleted),
              hasPhoto: Boolean(item.hasPhoto),
              photoUrl: item.photoUrl || undefined,
              notes: item.notes || undefined,
              children: item.children ? item.children.map((child: any) => ({
                id: child.id || uuidv4(),
                text: child.text,
                isCompleted: Boolean(child.isCompleted),
                hasPhoto: Boolean(child.hasPhoto),
                photoUrl: child.photoUrl || undefined,
                notes: child.notes || undefined,
              })) : undefined,
              condition: item.condition
            })) : [],
            isExpanded: section.isExpanded !== undefined ? section.isExpanded : true
          })) : [],
          createdAt: json.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        onImport(importedChecklist);
        toast.success("Чек-лист успешно импортирован");
      } catch (error) {
        console.error("Error parsing JSON:", error);
        toast.error("Ошибка при импорте чек-листа. Проверьте формат файла.");
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="checklist-file">Выберите JSON файл чек-листа</Label>
        <Input 
          id="checklist-file" 
          type="file" 
          accept=".json" 
          onChange={handleFileChange} 
        />
      </div>
      
      <Button onClick={handleImport} className="flex items-center gap-2" disabled={!file}>
        <Upload className="h-4 w-4" /> Импортировать
      </Button>
    </div>
  );
};

export default ChecklistImport;
