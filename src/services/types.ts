export type Miliseconds = number;

export type Task = Readonly<{
  id: string;
  name: string;
  timeUntil: Readonly<{
    availability: Miliseconds;
    completion: Miliseconds;
    deadline: Miliseconds;
  }>;
}>
export type Tasks = readonly Task[];

export type ProcessTasks = (tasks: Tasks) => Tasks;

export type TickableProcessTask = (tasks?: Tasks) => Tasks;
export type MakeTickableProcessTask = (processTasks: ProcessTasks, tasks: Tasks) => TickableProcessTask;
export type MakeTickUntil = (tickable: TickableProcessTask) => (tasks: Tasks, steps?: number) => Tasks;

export type MinMax<T> = Readonly<{min: T, max: T}>
export type Nullable<T> = T | null | undefined;

export type GenerateRandomTaskConfig = Readonly<{
  [key in keyof Task['timeUntil']]: MinMax<Miliseconds>
}>;

export type GenerateRandomTask = (config: GenerateRandomTaskConfig, index: number) => Task;

export type Fn<T, U> = (arg: T) => U;

export default {}
