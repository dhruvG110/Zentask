// Minimal client-side type
export interface TaskWithSubTasks {
  id: string;
  title: string;
  isCompleted: boolean;
  subTasks: {
    id: string;
    title: string;
    isCompleted: boolean;
  }[];
}
