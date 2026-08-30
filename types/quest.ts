export type Quest = {
  id: number;
  title: string;
  description: string;
}

export type DailyQuest = {
  quest: Quest;
  date: number;
  status: 'active' | 'completed';
}
