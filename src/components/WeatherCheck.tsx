
import React, { useState } from "react";
import { WeatherCondition } from "@/types";
import { Wind, CloudRain, Eye, AlertTriangle, Check, MapPin, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  const [isAssessed, setIsAssessed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof WeatherCondition, value: string | number) => {
    setWeather((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const assessWeather = () => {
    setIsAssessed(true);
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
      
      setIsAssessed(true);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast.error("Ошибка при загрузке метеоданных");
    } finally {
      setIsLoading(false);
    }
  };

  const hasWarnings = 
    weather.windSpeed > 8 || 
    weather.windGusts > 12 || 
    weather.visibility !== "good" || 
    weather.precipitation !== "none" || 
    weather.forecast === "worsening";

  const hasDangers = 
    weather.windSpeed >= 10 || 
    weather.windGusts >= 15 || 
    weather.windDirection === "crosswind" || 
    weather.visibility === "poor" || 
    weather.precipitation !== "none";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5 text-sigma-primary" />
          Оценка погодных условий
          <div className="flex-1"></div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1 ml-auto"
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

          <Button 
            className="w-full" 
            onClick={assessWeather}
          >
            Оценить условия
          </Button>

          {isAssessed && hasDangers && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Опасные условия!</AlertTitle>
              <AlertDescription>
                Рекомендуется отложить полет из-за неблагоприятных погодных условий.
              </AlertDescription>
            </Alert>
          )}

          {isAssessed && !hasDangers && hasWarnings && (
            <Alert className="mt-4 border-sigma-warning bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-sigma-warning" />
              <AlertTitle className="text-sigma-warning">Предупреждение</AlertTitle>
              <AlertDescription>
                Обратите внимание на пограничные погодные условия. Будьте осторожны.
              </AlertDescription>
            </Alert>
          )}

          {isAssessed && !hasDangers && !hasWarnings && (
            <Alert className="mt-4 border-sigma-success bg-green-50">
              <Check className="h-4 w-4 text-sigma-success" />
              <AlertTitle className="text-sigma-success">Подходящие условия</AlertTitle>
              <AlertDescription>
                Погодные условия подходят для выполнения полета.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCheck;
