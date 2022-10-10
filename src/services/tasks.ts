import { GenerateRandomTask, GenerateRandomTaskConfig, MakeTickableProcessTask, MakeTickUntil, Nullable, Task, Tasks, TickableProcessTask } from './types'
import { getRandomId, getRandomMs, isNil, isNumber } from './utils';

export const getTaskName = (index: number) => `Task ${index}`;

export const makeTickable: MakeTickableProcessTask = (taskProcesser, tasks) => {
  let prevTasks = tasks;

  const tick: TickableProcessTask = (selectedTasks) => {
    const currentTasks = isNil(selectedTasks) ? prevTasks : selectedTasks;
    prevTasks = taskProcesser(currentTasks);

    return prevTasks;
  }

  return tick;
}

export const isTaskAvailable = (task: Task): boolean => task.timeUntil.availability === 0;
export const isTaskDone = (task: Task): boolean => task.timeUntil.completion === 0;

export const makeTickUntil: MakeTickUntil = (tick) => {
  const recurse: ReturnType<MakeTickUntil> = (tasks, ticks) => {
    if (tasks.every(isTaskDone) || ticks === 0) {
      return tasks;
    }

    return recurse(tick(tasks), isNil(ticks) ? ticks : ticks - 1);
  }

  return recurse;
}

export const generateRandomTask: GenerateRandomTask = (config, index) => {
  const availability = getRandomMs(config.availability);
  const completion = getRandomMs(config.completion, availability);
  const deadline = getRandomMs(config.deadline, completion);

  return ({
    id: getRandomId(),
    name: getTaskName(index),
    timeUntil: {
      availability,
      completion,
      deadline,
    }
  })
}

export function generateRandomTasks(amount: number, config: GenerateRandomTaskConfig): Tasks
export function generateRandomTasks(configs: GenerateRandomTaskConfig[]): Tasks
export function generateRandomTasks(amountOrConfigs: number | GenerateRandomTaskConfig[], sharedConfig?: GenerateRandomTaskConfig): Tasks {
  if (isNumber(amountOrConfigs)) {
    return isNil(sharedConfig) ? [] : Array.from({length: amountOrConfigs}, () => sharedConfig).map(generateRandomTask);
  }

  return amountOrConfigs.map(generateRandomTask);
}




export const getSoonestAvailableTo = <T extends keyof Task['timeUntil']>(key: T) => (prevTask: Nullable<Task>, currentTask: Task): Nullable<Task> => {
  if (isNil(prevTask) && !isTaskAvailable(currentTask)) {
    return null;
  }

  if (isNil(prevTask)) {
    return currentTask;
  }

  return prevTask.timeUntil.deadline <= currentTask.timeUntil.deadline ? prevTask : currentTask;
}
