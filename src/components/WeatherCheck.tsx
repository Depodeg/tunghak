
import React, { useState } from "react";
import { WeatherCondition } from "@/types";
import { Wind, CloudRain, Eye, MapPin, RefreshCw, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { fetchWeatherData, getCurrentLocation } from "@/services/weatherService";

const initialWeather: WeatherCondition = {
  windSpeed: 0,
  windGusts: 0,
  windDirection: "headwind",
  visibility: "good",
  precipitation: "none",
  forecast: "stable",
};

const WeatherCheck: React.FC = () => {
  const [weather, setWeather] = useState<WeatherCondition>(initialWeather);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof WeatherCondition, value: string | number) => {
    setWeather((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchWeatherDataFromCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const position = await getCurrentLocation();
      const { latitude: lat, longitude: lon } = position.coords;
      
      toast.info("Загрузка метеоданных...");
      
      const weatherData = await fetchWeatherData(lat, lon);
      
      setWeather(weatherData);
      
      toast.success(
        weatherData.location?.name
          ? `Метеоданные для ${weatherData.location.name} загружены`
          : "Метеоданные загружены"
      );
    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast.error("Ошибка при загрузке метеоданных");
    } finally {
      setIsLoading(false);
    }
  };

  const saveWeatherToReport = () => {
    // Save weather data to localStorage for now
    const savedWeather = {
      ...weather,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('savedWeatherReport', JSON.stringify(savedWeather));
    toast.success("Погодные условия сохранены в отчёте");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5 text-sigma-primary" />
          Погодные условия
          <div className="flex-1"></div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={fetchWeatherDataFromCurrentLocation}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                    {weather.location?.name || "Получить метеоданные"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Загрузить текущие метеоданные по вашему местоположению</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={saveWeatherToReport}
                  >
                    <Save className="h-4 w-4" />
                    Сохранить в отчёт
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Сохранить текущие погодные условия в отчёт</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="windSpeed">Скорость ветра (м/с)</Label>
              <Input
                id="windSpeed"
                type="number"
                value={weather.windSpeed}
                onChange={(e) => handleChange("windSpeed", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="windGusts">Порывы ветра (м/с)</Label>
              <Input
                id="windGusts"
                type="number"
                value={weather.windGusts}
                onChange={(e) => handleChange("windGusts", Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="windDirection">Направление ветра</Label>
              <Select
                value={weather.windDirection}
                onValueChange={(value) => handleChange("windDirection", value)}
              >
                <SelectTrigger id="windDirection">
                  <SelectValue placeholder="Выберите направление" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="headwind">Встречный</SelectItem>
                  <SelectItem value="tailwind">Попутный</SelectItem>
                  <SelectItem value="crosswind">Боковой</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="visibility">Видимость</Label>
              <Select
                value={weather.visibility}
                onValueChange={(value) => handleChange("visibility", value)}
              >
                <SelectTrigger id="visibility">
                  <SelectValue placeholder="Выберите видимость" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="good">Хорошая</SelectItem>
                  <SelectItem value="moderate">Средняя</SelectItem>
                  <SelectItem value="poor">Плохая</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="precipitation">Осадки</Label>
              <Select
                value={weather.precipitation}
                onValueChange={(value) => handleChange("precipitation", value)}
              >
                <SelectTrigger id="precipitation">
                  <SelectValue placeholder="Выберите тип осадков" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Нет</SelectItem>
                  <SelectItem value="light">Легкие</SelectItem>
                  <SelectItem value="heavy">Сильные</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="forecast">Прогноз</Label>
              <Select
                value={weather.forecast}
                onValueChange={(value) => handleChange("forecast", value)}
              >
                <SelectTrigger id="forecast">
                  <SelectValue placeholder="Выберите прогноз" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stable">Стабильный</SelectItem>
                  <SelectItem value="improving">Улучшается</SelectItem>
                  <SelectItem value="worsening">Ухудшается</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Summary of saved weather data */}
          <div className="pt-4 mt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Данные для отчёта</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-muted-foreground" />
                <span>Ветер: {weather.windSpeed} м/с ({weather.windDirection === "headwind" ? "встречный" : weather.windDirection === "tailwind" ? "попутный" : "боковой"})</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span>Видимость: {weather.visibility === "good" ? "хорошая" : weather.visibility === "moderate" ? "средняя" : "плохая"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CloudRain className="h-4 w-4 text-muted-foreground" />
                <span>Осадки: {weather.precipitation === "none" ? "нет" : weather.precipitation === "light" ? "легкие" : "сильные"}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCheck;
