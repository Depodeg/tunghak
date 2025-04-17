
import { useState, useEffect } from "react";
import { 
  ChecklistSection as ChecklistSectionType, 
  ChecklistItem as ChecklistItemType,
  Checklist 
} from "@/types";
import Header from "@/components/Header";
import ChecklistSection from "@/components/ChecklistSection";
import WeatherCheck from "@/components/WeatherCheck";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, CloudSun, Download, Upload, FilePlus } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import ChecklistImport from "@/components/ChecklistImport";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";

const Index = () => {
  const [sections, setSections] = useState<ChecklistSectionType[]>([
    {
      id: "preparation-base",
      title: "Предварительная подготовка (на базе)",
      isExpanded: true,
      items: [
        {
          id: "charge-battery-1",
          text: "Зарядить силовые АКБ х2",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "charge-battery-2",
          text: "Зарядить АКБ пульта РДУ",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "charge-battery-3",
          text: "Зарядить АКБ НСУ",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "prepare-maps",
          text: "Подготовить и загрузить подложки для местности полетов на НСУ",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "load-height-map",
          text: "Загрузить карту высот на НСУ",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "prepare-route",
          text: "Подготовить маршрут",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "collect-equipment",
          text: "Произвести сбор оборудования по списку",
          isCompleted: false,
          hasPhoto: false
        }
      ]
    },
    {
      id: "preparation-site",
      title: "Предварительная подготовка (на месте)",
      isExpanded: false,
      items: [
        {
          id: "assess-weather",
          text: "Оценить погодные условия",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "assemble-drone",
          text: "Произвести сборку БЛА",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "position-fuselage",
          text: "Установить фюзеляж в исходное положение",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "install-battery",
          text: "Установить АКБ",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "install-propeller",
          text: "Установить воздушный винт на маршевый двигатель, проверить затяжку",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "install-carbon-tube",
          text: "Установить карбоновые трубки",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "install-wings",
          text: "Установить и закрепить крылья",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "install-beams",
          text: "Установить балки, зафиксировать крепежными винтами",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "install-tail",
          text: "Установить хвостовое оперение, зафиксировать крепежным винтом",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "install-motors",
          text: "Установить воздушные винты электродвигателей, проверить затяжку",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "deploy-nsu",
          text: "Развернуть НСУ",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "install-antenna",
          text: "Установить антенный пост",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "install-tripod",
          text: "Установить штатив",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "install-radio",
          text: "Установить радиомодем на штатив",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "connect-antenna",
          text: "Подключить антенный пост к ноутбуку НСУ",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "connect-mouse",
          text: "Подключить мышь к ноутбуку НСУ",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "connect-power",
          text: "Подключить НСУ к сети 220В",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "start-efir",
          text: "Запустить ПО Эфир",
          isCompleted: false,
          hasPhoto: false
        }
      ]
    },
    {
      id: "preflight",
      title: "Предполетная подготовка (Перед взлетом)",
      isExpanded: false,
      items: [
        {
          id: "power-on",
          text: "Подать электропитание на БЛА, дождаться загрузки автопилота",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "check-connection",
          text: "Проверить наличие связи с НСУ, убедится в корректности телеметрии, убедиться в корректности показаний авиагоризонта (крен, тангаж, координаты)",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "check-servos",
          text: "Проверить сервоприводы",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "check-regulators",
          text: "Проверить регуляторы",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "check-lights",
          text: "Проверить БАНО",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "take-photo",
          text: "Сделать контрольное фото (fphoto -e, fphoto -c 0)",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "check-ready",
          text: "Контролировать переход ЛА В режим 'ГОТОВ', при необходимости повторить проверки",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "load-mission",
          text: "Загрузить или создать миссию на НСУ, убедиться, что в миссии есть посадочная точка",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "transmit-mission",
          text: "Передать миссию на БВС",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "set-routes",
          text: "Установить текущий и следующий маршруты",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "set-landing",
          text: "Установить высоту и направление точки посадки",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "set-base-height",
          text: "Установить высоту базовой точки",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "verify-mission",
          text: "Выполнить контрольный запрос миссии с БЛА",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "orient-aircraft",
          text: "Сориентировать БЛА против ветра",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "reset-remote",
          text: "Перевести пульт ДУ в исходное положение",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "power-remote",
          text: "Включить пульт ДУ, убедиться в наличии управления через пульт",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "auto-mode",
          text: "Перевести пульт в автоматический режим",
          isCompleted: false,
          hasPhoto: false
        }
      ]
    },
    {
      id: "takeoff",
      title: "Взлет",
      isExpanded: false,
      items: [
        {
          id: "start-video",
          text: "Запустить видеофиксацию",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "checklist-completed",
          text: "Чеклист подготовки выполнен",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "power-confirm",
          text: "Питание 220В наземной станции поступает (по индикатору БП)",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "battery-confirm",
          text: "Батареи 50В",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "gnss-confirm",
          text: "GNSS 12+",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "pilot-ready",
          text: "Пилот готов, пульт в автоматическом режиме",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "camera-ready",
          text: "Оператор камеры готов",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "weather-ok",
          text: "Погода ОК",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "obstacles-none",
          text: "Помехи взлету и посадке отсутствуют",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "unlock-arm",
          text: "Разблокировать АРМ с НСУ",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "arm-aircraft",
          text: "Заармить ЛА с пульта ДУ",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "takeoff-mode",
          text: "Перевести ЛА в режим 'Взлет'",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "monitor-altitude",
          text: "Контролировать набор высоты",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "monitor-speed",
          text: "Контролировать набор скорости до 75 км/ч",
          isCompleted: false,
          hasPhoto: false
        }
      ]
    },
    {
      id: "flight",
      title: "Полет по Маршруту",
      isExpanded: false,
      items: [
        {
          id: "monitor-parameters",
          text: "Контролировать показатели скорости, высоты, крена и тангажа при прохождении ППМ. Контролировать увеличение счетчика снимков на участках АФС.",
          isCompleted: false,
          hasPhoto: false
        }
      ]
    },
    {
      id: "landing",
      title: "Посадка",
      isExpanded: false,
      items: [
        {
          id: "monitor-approach",
          text: "Контролировать заход на посадочную глиссаду",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "monitor-engine",
          text: "Контролировать выключение маршевого двигателя за 200 метров до последнего ППМ",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "monitor-copter",
          text: "Контролировать заход на посадочную точку в коптерном режиме",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "monitor-descent",
          text: "Контролировать снижение, при необходимости перехватить в ручной режим с пульта ДУ",
          isCompleted: false,
          hasPhoto: false
        },
        {
          id: "block-engines",
          text: "После касания земли заблокировать двигатели с НСУ или пульта ДУ",
          isCompleted: false,
          hasPhoto: false
        }
      ]
    }
  ]);
  
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  
  const handleToggleItem = (sectionId: string, itemId: string) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item) => {
              if (item.id === itemId) {
                // Toggle this item
                const updatedItem = {
                  ...item,
                  isCompleted: !item.isCompleted,
                };
                
                // Also update any nested children if this item has them
                if (updatedItem.children && updatedItem.children.length > 0) {
                  updatedItem.children = updatedItem.children.map(child => ({
                    ...child,
                    isCompleted: updatedItem.isCompleted
                  }));
                }
                
                return updatedItem;
              }
              
              // Check if this item has any children that match the toggled ID
              if (item.children && item.children.some(child => child.id === itemId)) {
                return {
                  ...item,
                  children: item.children.map(child => {
                    if (child.id === itemId) {
                      return {
                        ...child,
                        isCompleted: !child.isCompleted
                      };
                    }
                    return child;
                  })
                };
              }
              
              return item;
            }),
          };
        }
        return section;
      })
    );
  };

  const handleToggleExpand = (sectionId: string) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            isExpanded: !section.isExpanded,
          };
        }
        return section;
      })
    );
  };
  
  const handleAddPhoto = (sectionId: string, itemId: string, photoUrl: string) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item) => {
              // Check if this is the target item
              if (item.id === itemId) {
                return {
                  ...item,
                  hasPhoto: true,
                  photoUrl,
                };
              }
              
              // Check if the target is in children
              if (item.children && item.children.some(child => child.id === itemId)) {
                return {
                  ...item,
                  children: item.children.map(child => {
                    if (child.id === itemId) {
                      return {
                        ...child,
                        hasPhoto: true,
                        photoUrl,
                      };
                    }
                    return child;
                  })
                };
              }
              
              return item;
            }),
          };
        }
        return section;
      })
    );
    toast.success("Фото прикреплено");
  };

  const handleAddNote = (sectionId: string, itemId: string, note: string) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item) => {
              // Check if this is the target item
              if (item.id === itemId) {
                return {
                  ...item,
                  notes: note,
                };
              }
              
              // Check if the target is in children
              if (item.children && item.children.some(child => child.id === itemId)) {
                return {
                  ...item,
                  children: item.children.map(child => {
                    if (child.id === itemId) {
                      return {
                        ...child,
                        notes: note,
                      };
                    }
                    return child;
                  })
                };
              }
              
              return item;
            }),
          };
        }
        return section;
      })
    );
    toast.success("Заметка сохранена");
  };

  const resetChecklist = () => {
    setSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        items: section.items.map((item) => ({
          ...item,
          isCompleted: false,
          children: item.children ? item.children.map(child => ({
            ...child,
            isCompleted: false,
          })) : undefined
        })),
      }))
    );
    toast.info("Чек-лист сброшен");
  };

  const exportChecklist = () => {
    const data = {
      date: new Date().toISOString(),
      sections: sections.map(section => ({
        title: section.title,
        items: section.items.map(item => ({
          text: item.text,
          isCompleted: item.isCompleted,
          hasPhoto: item.hasPhoto,
          notes: item.notes || "",
          children: item.children ? item.children.map(child => ({
            text: child.text,
            isCompleted: child.isCompleted,
            hasPhoto: child.hasPhoto,
            notes: child.notes || ""
          })) : undefined,
          condition: item.condition
        }))
      }))
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `sigma_checklist_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Экспорт выполнен");
  };
  
  const handleImport = (checklist: Checklist) => {
    if (!checklist.sections || checklist.sections.length === 0) {
      toast.error("Импортируемый чек-лист не содержит разделов");
      return;
    }
    
    setSections(checklist.sections);
    setImportDialogOpen(false);
    toast.success("Чек-лист импортирован успешно");
  };
  
  // Enhanced to handle conditional items
  const getVisibleItems = (items: ChecklistItemType[]) => {
    return items.filter(item => {
      if (!item.condition) return true;
      
      // Find the item this depends on
      const dependentItem = findItemById(item.condition.dependsOn);
      if (!dependentItem) return true; // If not found, just show it
      
      // Check if the condition matches
      return dependentItem.isCompleted === item.condition.value;
    });
  };
  
  const findItemById = (itemId: string): ChecklistItemType | undefined => {
    for (const section of sections) {
      const item = section.items.find(item => item.id === itemId);
      if (item) return item;
      
      // Check in children
      for (const parentItem of section.items) {
        if (parentItem.children) {
          const childItem = parentItem.children.find(child => child.id === itemId);
          if (childItem) return childItem;
        }
      }
    }
    return undefined;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="container py-4 flex-1">
        <Tabs defaultValue="checklist" className="mb-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="checklist" className="flex items-center gap-2">
              <Check className="h-4 w-4" /> Чек-лист
            </TabsTrigger>
            <TabsTrigger value="weather" className="flex items-center gap-2">
              <CloudSun className="h-4 w-4" /> Погода
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="checklist" className="mt-4">
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-bold text-sigma-primary">Чек-лист подготовки полета</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={resetChecklist}
                >
                  Сбросить
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setImportDialogOpen(true)}
                  className="flex items-center gap-1"
                >
                  <Upload className="h-4 w-4" /> Импорт
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={exportChecklist}
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" /> Экспорт
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                  className="flex items-center gap-1"
                >
                  <Link to="/checklist-manager">
                    <FilePlus className="h-4 w-4" /> Конструктор
                  </Link>
                </Button>
              </div>
            </div>
            
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Импорт чек-листа</DialogTitle>
                </DialogHeader>
                <ChecklistImport onImport={handleImport} />
              </DialogContent>
            </Dialog>
            
            <div className="space-y-4">
              {sections.map((section) => (
                <ChecklistSection
                  key={section.id}
                  section={{
                    ...section,
                    items: getVisibleItems(section.items) // Filter items based on conditions
                  }}
                  onToggleItem={handleToggleItem}
                  onToggleExpand={handleToggleExpand}
                  onAddPhoto={handleAddPhoto}
                  onAddNote={handleAddNote}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="weather" className="mt-4">
            <WeatherCheck />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-sigma-primary text-white p-3 text-center text-sm">
        miniSIGMA БЛА - Приложение для предполетной подготовки
      </footer>
    </div>
  );
};

export default Index;
