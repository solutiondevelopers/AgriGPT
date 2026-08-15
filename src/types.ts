export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export type CropInsight = {
  name: string;
  health: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  healthScore: number;
  stage: string;
  expectedYield: string;
  nextAction: string;
};

export type WeatherData = {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
};
