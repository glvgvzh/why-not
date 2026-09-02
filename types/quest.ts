export type Quest = {
  id: number;
  title: string;
  description: string;
}

export type DateString = `${number}-${number}-${number}`

export type DailyQuest = {
  quest: Quest;
  date: DateString;
  status: 'active' | 'completed' | 'missed';
}
