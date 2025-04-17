
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { 
  Button, 
  Input, 
  Textarea,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Save,
  FilePlus,
  Edit
} from "lucide-react";
import { ChecklistSection, ChecklistItem, Checklist } from "@/types";
import { toast } from "sonner";

interface ChecklistBuilderProps {
  initialChecklist?: Checklist;
  onSave: (checklist: Checklist) => void;
}

interface SectionFormProps {
  defaultValues?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const SectionForm: React.FC<SectionFormProps> = ({ defaultValues, onSubmit, onCancel }) => {
  const form = useForm({
    defaultValues: defaultValues || { title: "" }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название раздела</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Введите название раздела" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Отмена</Button>
          <Button type="submit">Сохранить</Button>
        </div>
      </form>
    </Form>
  );
};

interface ItemFormProps {
  defaultValues?: any;
  sections: ChecklistSection[];
  items: ChecklistItem[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isNested?: boolean;
}

const ItemForm: React.FC<ItemFormProps> = ({ defaultValues, sections, items, onSubmit, onCancel, isNested = false }) => {
  const form = useForm({
    defaultValues: defaultValues || { text: "", dependsOn: "", value: true }
  });
  
  const [hasDependency, setHasDependency] = useState(Boolean(defaultValues?.condition?.dependsOn));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Текст пункта</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Введите текст пункта" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {!isNested && (
          <div className="flex items-center gap-2 mt-2">
            <input 
              type="checkbox" 
              id="hasDependency" 
              checked={hasDependency}
              onChange={() => setHasDependency(!hasDependency)}
              className="h-4 w-4"
            />
            <label htmlFor="hasDependency">Добавить условие отображения</label>
          </div>
        )}
        
        {hasDependency && !isNested && (
          <div className="space-y-4 p-3 border border-gray-200 rounded-md">
            <FormField
              control={form.control}
              name="dependsOn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Зависит от пункта</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите пункт" />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map(item => (
                          <SelectItem key={item.id} value={item.id}>{item.text}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Условие</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value === "true")}
                      defaultValue={String(field.value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите условие" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Пункт выполнен</SelectItem>
                        <SelectItem value="false">Пункт не выполнен</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Отмена</Button>
          <Button type="submit">Сохранить</Button>
        </div>
      </form>
    </Form>
  );
};

const ChecklistBuilder: React.FC<ChecklistBuilderProps> = ({ initialChecklist, onSave }) => {
  const [checklist, setChecklist] = useState<Checklist>(initialChecklist || {
    id: uuidv4(),
    name: "Новый чек-лист",
    description: "",
    sections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  
  const [addingSectionId, setAddingSectionId] = useState<string | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [addingItemSectionId, setAddingItemSectionId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [addingNestedItemId, setAddingNestedItemId] = useState<string | null>(null);

  // Basic form for checklist metadata
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const metadataForm = useForm({
    defaultValues: { name: checklist.name, description: checklist.description || "" }
  });

  const saveMetadata = (data: any) => {
    setChecklist({
      ...checklist,
      name: data.name,
      description: data.description,
      updatedAt: new Date().toISOString()
    });
    setIsEditingMetadata(false);
    toast.success("Метаданные сохранены");
  };

  // Section management
  const addSection = () => {
    setAddingSectionId("new");
  };

  const saveSection = (data: any) => {
    if (editingSectionId) {
      // Edit existing section
      setChecklist({
        ...checklist,
        sections: checklist.sections.map(section => 
          section.id === editingSectionId ? { ...section, title: data.title } : section
        ),
        updatedAt: new Date().toISOString()
      });
      setEditingSectionId(null);
    } else {
      // Add new section
      const newSection: ChecklistSection = {
        id: uuidv4(),
        title: data.title,
        items: [],
        isExpanded: true
      };
      setChecklist({
        ...checklist,
        sections: [...checklist.sections, newSection],
        updatedAt: new Date().toISOString()
      });
    }
    setAddingSectionId(null);
    toast.success("Раздел сохранен");
  };

  const deleteSection = (sectionId: string) => {
    setChecklist({
      ...checklist,
      sections: checklist.sections.filter(section => section.id !== sectionId),
      updatedAt: new Date().toISOString()
    });
    toast.success("Раздел удален");
  };

  // Item management
  const editSection = (sectionId: string) => {
    setEditingSectionId(sectionId);
  };

  const addItem = (sectionId: string) => {
    setAddingItemSectionId(sectionId);
  };

  const editItem = (sectionId: string, itemId: string) => {
    setAddingItemSectionId(sectionId);
    setEditingItemId(itemId);
  };

  const saveItem = (data: any) => {
    if (!addingItemSectionId) return;
    
    if (editingItemId) {
      // Edit existing item
      setChecklist({
        ...checklist,
        sections: checklist.sections.map(section => {
          if (section.id === addingItemSectionId) {
            return {
              ...section,
              items: section.items.map(item => {
                if (item.id === editingItemId) {
                  return {
                    ...item,
                    text: data.text,
                    condition: data.dependsOn ? {
                      dependsOn: data.dependsOn,
                      value: data.value
                    } : undefined
                  };
                }
                return item;
              })
            };
          }
          return section;
        }),
        updatedAt: new Date().toISOString()
      });
      setEditingItemId(null);
    } else if (addingNestedItemId) {
      // Add nested item
      setChecklist({
        ...checklist,
        sections: checklist.sections.map(section => {
          if (section.id === addingItemSectionId) {
            return {
              ...section,
              items: section.items.map(item => {
                if (item.id === addingNestedItemId) {
                  return {
                    ...item,
                    children: [
                      ...(item.children || []),
                      {
                        id: uuidv4(),
                        text: data.text,
                        isCompleted: false,
                        hasPhoto: false
                      }
                    ]
                  };
                }
                return item;
              })
            };
          }
          return section;
        }),
        updatedAt: new Date().toISOString()
      });
      setAddingNestedItemId(null);
    } else {
      // Add new item
      const newItem: ChecklistItem = {
        id: uuidv4(),
        text: data.text,
        isCompleted: false,
        hasPhoto: false,
        condition: data.dependsOn ? {
          dependsOn: data.dependsOn,
          value: data.value
        } : undefined
      };

      setChecklist({
        ...checklist,
        sections: checklist.sections.map(section => 
          section.id === addingItemSectionId ? 
            { ...section, items: [...section.items, newItem] } : 
            section
        ),
        updatedAt: new Date().toISOString()
      });
    }
    
    setAddingItemSectionId(null);
    toast.success("Пункт сохранен");
  };

  const deleteItem = (sectionId: string, itemId: string) => {
    setChecklist({
      ...checklist,
      sections: checklist.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.filter(item => item.id !== itemId)
          };
        }
        return section;
      }),
      updatedAt: new Date().toISOString()
    });
    toast.success("Пункт удален");
  };

  const deleteNestedItem = (sectionId: string, parentItemId: string, nestedItemId: string) => {
    setChecklist({
      ...checklist,
      sections: checklist.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map(item => {
              if (item.id === parentItemId && item.children) {
                return {
                  ...item,
                  children: item.children.filter(child => child.id !== nestedItemId)
                };
              }
              return item;
            })
          };
        }
        return section;
      }),
      updatedAt: new Date().toISOString()
    });
    toast.success("Вложенный пункт удален");
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const sectionIndex = checklist.sections.findIndex(section => section.id === sectionId);
    if (
      (direction === 'up' && sectionIndex <= 0) || 
      (direction === 'down' && sectionIndex >= checklist.sections.length - 1)
    ) {
      return;
    }

    const newSections = [...checklist.sections];
    const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
    [newSections[sectionIndex], newSections[targetIndex]] = [newSections[targetIndex], newSections[sectionIndex]];
    
    setChecklist({
      ...checklist,
      sections: newSections,
      updatedAt: new Date().toISOString()
    });
  };

  const moveItem = (sectionId: string, itemId: string, direction: 'up' | 'down') => {
    const section = checklist.sections.find(s => s.id === sectionId);
    if (!section) return;

    const itemIndex = section.items.findIndex(item => item.id === itemId);
    if (
      (direction === 'up' && itemIndex <= 0) || 
      (direction === 'down' && itemIndex >= section.items.length - 1)
    ) {
      return;
    }

    const newItems = [...section.items];
    const targetIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    [newItems[itemIndex], newItems[targetIndex]] = [newItems[targetIndex], newItems[itemIndex]];
    
    setChecklist({
      ...checklist,
      sections: checklist.sections.map(s => 
        s.id === sectionId ? { ...s, items: newItems } : s
      ),
      updatedAt: new Date().toISOString()
    });
  };

  const handleSaveChecklist = () => {
    if (checklist.sections.length === 0) {
      toast.error("Чек-лист должен содержать хотя бы один раздел");
      return;
    }

    if (checklist.sections.some(section => section.items.length === 0)) {
      toast.error("Каждый раздел должен содержать хотя бы один пункт");
      return;
    }

    onSave({
      ...checklist,
      updatedAt: new Date().toISOString()
    });
  };

  const getAllItems = (): ChecklistItem[] => {
    let allItems: ChecklistItem[] = [];
    checklist.sections.forEach(section => {
      allItems = [...allItems, ...section.items];
    });
    return allItems;
  };

  return (
    <div className="space-y-6">
      {/* Checklist metadata */}
      <div className="flex items-center justify-between p-4 bg-card rounded-lg shadow">
        <div>
          <h2 className="text-2xl font-bold">{checklist.name}</h2>
          {checklist.description && <p className="text-muted-foreground mt-1">{checklist.description}</p>}
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsEditingMetadata(true)}>
          <Edit className="h-4 w-4 mr-2" /> Редактировать
        </Button>
      </div>

      {isEditingMetadata && (
        <Dialog open={isEditingMetadata} onOpenChange={setIsEditingMetadata}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактирование чек-листа</DialogTitle>
            </DialogHeader>
            <Form {...metadataForm}>
              <form onSubmit={metadataForm.handleSubmit(saveMetadata)} className="space-y-4">
                <FormField
                  control={metadataForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Название чек-листа" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={metadataForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Описание</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Описание чек-листа" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Сохранить</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Add Section Button */}
      <Button onClick={addSection} className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Добавить раздел
      </Button>

      {/* Add/Edit Section Dialog */}
      {addingSectionId && (
        <Dialog open={Boolean(addingSectionId)} onOpenChange={() => setAddingSectionId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSectionId ? "Редактировать раздел" : "Добавить раздел"}</DialogTitle>
            </DialogHeader>
            <SectionForm 
              defaultValues={editingSectionId ? 
                { title: checklist.sections.find(s => s.id === editingSectionId)?.title || "" } : 
                undefined
              }
              onSubmit={saveSection}
              onCancel={() => {
                setAddingSectionId(null);
                setEditingSectionId(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Add/Edit Item Dialog */}
      {addingItemSectionId && (
        <Dialog 
          open={Boolean(addingItemSectionId)} 
          onOpenChange={() => {
            setAddingItemSectionId(null);
            setEditingItemId(null);
            setAddingNestedItemId(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItemId ? "Редактировать пункт" : 
                 addingNestedItemId ? "Добавить вложенный пункт" : 
                 "Добавить пункт"}
              </DialogTitle>
            </DialogHeader>
            <ItemForm 
              defaultValues={editingItemId ? 
                (() => {
                  const item = checklist.sections
                    .find(s => s.id === addingItemSectionId)?.items
                    .find(i => i.id === editingItemId);
                  
                  if (item) {
                    return {
                      text: item.text,
                      dependsOn: item.condition?.dependsOn || "",
                      value: item.condition?.value || true
                    };
                  }
                  return undefined;
                })() : 
                undefined
              }
              sections={checklist.sections}
              items={getAllItems()}
              onSubmit={saveItem}
              onCancel={() => {
                setAddingItemSectionId(null);
                setEditingItemId(null);
                setAddingNestedItemId(null);
              }}
              isNested={Boolean(addingNestedItemId)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Sections list */}
      <div className="space-y-4">
        {checklist.sections.map((section, sIndex) => (
          <div key={section.id} className="border rounded-lg overflow-hidden bg-background">
            <div className="p-4 bg-muted flex items-center justify-between">
              <h3 className="font-medium text-lg">{section.title}</h3>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => moveSection(section.id, 'up')}
                  disabled={sIndex === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => moveSection(section.id, 'down')}
                  disabled={sIndex === checklist.sections.length - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => editSection(section.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteSection(section.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-4 space-y-2">
              {section.items.map((item, iIndex) => (
                <div key={item.id} className="space-y-2">
                  <div className={`flex items-start justify-between p-3 rounded-md ${
                    item.condition ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                  }`}>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span>{item.text}</span>
                        {item.condition && (
                          <span className="ml-2 text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                            Условное
                          </span>
                        )}
                      </div>
                      
                      {item.condition && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          Показывается, если "{getAllItems().find(i => i.id === item.condition?.dependsOn)?.text}" 
                          {item.condition.value ? " выполнен" : " не выполнен"}
                        </div>
                      )}
                      
                      {item.children && item.children.length > 0 && (
                        <div className="mt-2 pl-4 border-l-2 border-gray-200 space-y-2">
                          {item.children.map(child => (
                            <div key={child.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                              <span>{child.text}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => deleteNestedItem(section.id, item.id, child.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => moveItem(section.id, item.id, 'up')}
                        disabled={iIndex === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => moveItem(section.id, item.id, 'down')}
                        disabled={iIndex === section.items.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setAddingNestedItemId(item.id) || setAddingItemSectionId(section.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => editItem(section.id, item.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteItem(section.id, item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" size="sm" onClick={() => addItem(section.id)} className="w-full mt-2">
                <Plus className="h-4 w-4 mr-2" /> Добавить пункт
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Save button */}
      <div className="pt-4 flex justify-end">
        <Button onClick={handleSaveChecklist} className="flex items-center gap-2">
          <Save className="h-4 w-4" /> Сохранить чек-лист
        </Button>
      </div>
    </div>
  );
};

export default ChecklistBuilder;
