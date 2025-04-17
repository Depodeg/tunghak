
import React, { useState } from "react";
import { Checklist } from "@/types";
import ChecklistBuilder from "@/components/ChecklistBuilder";
import ChecklistImport from "@/components/ChecklistImport";
import { Button } from "@/components/ui/button";
import { FilePlus, Upload, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const ChecklistManager: React.FC = () => {
  const [activeChecklist, setActiveChecklist] = useState<Checklist | null>(null);
  const [activeTab, setActiveTab] = useState("create");

  const handleCreateNew = () => {
    setActiveChecklist({
      id: uuidv4(),
      name: "Новый чек-лист",
      description: "",
      sections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setActiveTab("create");
  };

  const handleImport = (checklist: Checklist) => {
    setActiveChecklist(checklist);
    setActiveTab("create");
  };

  const handleSave = (checklist: Checklist) => {
    // Save the checklist to local storage or export it
    const jsonString = JSON.stringify(checklist, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `${checklist.name.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Чек-лист сохранен");
  };

  return (
    <div className="container py-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-sigma-primary">Управление чек-листами</h1>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCreateNew} className="flex items-center gap-1">
            <FilePlus className="h-4 w-4" /> Создать новый
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Конструктор</TabsTrigger>
          <TabsTrigger value="import">Импорт</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="mt-4">
          {activeChecklist ? (
            <ChecklistBuilder 
              initialChecklist={activeChecklist} 
              onSave={handleSave} 
            />
          ) : (
            <div className="p-8 text-center space-y-4 border rounded-lg">
              <p className="text-lg text-muted-foreground">Создайте новый чек-лист или импортируйте существующий</p>
              <div className="flex justify-center gap-4">
                <Button onClick={handleCreateNew} className="flex items-center gap-2">
                  <FilePlus className="h-4 w-4" /> Создать новый
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("import")} 
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" /> Импортировать
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="import" className="mt-4 p-6 border rounded-lg bg-background">
          <ChecklistImport onImport={handleImport} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChecklistManager;
