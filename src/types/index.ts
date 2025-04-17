
export type ChecklistItem = {
  id: string;
  text: string;
  isCompleted: boolean;
  hasPhoto: boolean;
  photoUrl?: string;
  notes?: string;
  children?: ChecklistItem[]; // Support for nested items
  condition?: {
    dependsOn: string; // ID of the item this depends on
    value: boolean; // The required value of the dependent item to show this
  };
};

export type ChecklistSection = {
  id: string;
  title: string;
  items: ChecklistItem[];
  isExpanded: boolean;
};

export type Checklist = {
  id: string;
  name: string;
  description?: string;
  sections: ChecklistSection[];
  createdAt: string;
  updatedAt: string;
  weather?: WeatherCondition; // Добавляем погоду в чеклист
};

export type WeatherCondition = {
  windSpeed: number;
  windGusts: number;
  windDirection: string;
  visibility: string;
  precipitation: string;
  forecast: string;
  location?: {
    lat: number;
    lon: number;
    name?: string;
  };
  savedAt?: string; // Время сохранения погодных данных
};
