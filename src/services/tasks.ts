import { taskColors } from '../configs/colors';
import { ExpandedTask, ExpandTask, GenerateRandomTask, GenerateRandomTaskConfig, Nullable, Tasks } from './types'
import { getRandomId, getRandomMs, isNil, isNumber } from './utils';

export const getTaskName = (index: number) => `Task ${index}`;
export const getTaskColor = (index: number) => taskColors[index % taskColors.length];

export const isTaskAvailable = (task: ExpandedTask): boolean => task.timeUntil.availability === 0;
export const isTaskDone = (task: ExpandedTask): boolean => task.timeUntil.completion === 0;
export const hasTaskReachedDeadline = (task: ExpandedTask): boolean => task.timeUntil.deadline === 0;

export const wasTaskJustCompleted = (task: ExpandedTask): boolean => isTaskDone(task) && task.active;
export const wasTaskJustMadeAvailable = (task: ExpandedTask, prevTask: Nullable<ExpandedTask>): boolean => task.timeUntil.availability === 0
  && !isNil(prevTask) && prevTask.timeUntil.availability !== 0;

export const generateRandomTask: GenerateRandomTask = (config) => {
  const availability = getRandomMs(config.availability);
  const completion = getRandomMs(config.completion) + availability;
  const deadline = getRandomMs(config.deadline) + completion;

  return ({
    id: getRandomId(),
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

export const expandTask: ExpandTask = (task, index) => ({
  ...task,
  active: false,
  name: getTaskName(index),
  color: getTaskColor(index),
})
