
export type ChecklistItem = {
  id: string;
  text: string;
  isCompleted: boolean;
  hasPhoto: boolean;
  photoUrl?: string;
  notes?: string;
};

export type ChecklistSection = {
  id: string;
  title: string;
  items: ChecklistItem[];
  isExpanded: boolean;
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
};
