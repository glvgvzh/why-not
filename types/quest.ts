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

export type MissedDay = {
  date: DateString;
  status: 'missed';
}

export type HistoryItem = DailyQuest | MissedDay
