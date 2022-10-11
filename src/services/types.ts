export type Miliseconds = number;

export type Task = Readonly<{
  id: string;
  timeUntil: Readonly<{
    availability: Miliseconds;
    completion: Miliseconds;
    deadline: Miliseconds;
  }>;
}>

export type ExpandedTask = Readonly<{
  name: string;
  active: boolean;
  color: string;
}> & Task;

export type Tasks = readonly Task[];
export type ExpandedTasks = readonly ExpandedTask[];

export type ExpandTask = (task: Task, index: number) => ExpandedTask;

export type ProcessTasks = (tasks: ExpandedTasks) => ExpandedTasks;

export type MinMax<T> = Readonly<{min: T, max: T}>
export type Nullable<T> = T | null | undefined;

export type GenerateRandomTaskConfig = Readonly<{
  [key in keyof Task['timeUntil']]: MinMax<Miliseconds>
}>;

export type GenerateRandomTask = (config: GenerateRandomTaskConfig, index: number) => Task;

export type Fn<T, U> = (arg: T) => U;

export type Literal = Record<string, unknown>

export default {}
