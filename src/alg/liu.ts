import { flow, isNil } from "../services/utils";
import { Nullable, ProcessTasks, ExpandedTask } from "../services/types";
import { isTaskAvailable, isTaskDone } from "../services/tasks";

export const getSoonest = (prevTask: Nullable<ExpandedTask>, currentTask: ExpandedTask): Nullable<ExpandedTask> => {
  if (!isTaskAvailable(currentTask) || isTaskDone(currentTask)) {
    return prevTask;
  }

  if (isNil(prevTask)) {
    return currentTask;
  }

  return prevTask.timeUntil.deadline <= currentTask.timeUntil.deadline ? prevTask : currentTask;
}


type TickDownTimeArg = Readonly<{
  task: ExpandedTask;
  tickTimeUntil: (keyof ExpandedTask['timeUntil'])[],
  min?: number;
}>

const tickDownTime = ({task, tickTimeUntil: keys, min}: TickDownTimeArg): ExpandedTask => ({
  ...task,
  timeUntil: {
    ...task.timeUntil,
    ...Object.fromEntries(keys.map((key) => {
      const newValue = task.timeUntil[key] - 1;

      if (isNil(min)) {
        return [key, newValue]
      }

      return [key, Math.max(min, newValue)];
    }))
  } as ExpandedTask['timeUntil']
})

const updateAvailability = (task: ExpandedTask) => tickDownTime({task, tickTimeUntil: ['availability'], min: 0});
const updateDeadlines = (task: ExpandedTask): ExpandedTask => tickDownTime({task, tickTimeUntil: ['deadline']});
const updateCompletion = (currentlyProcessing: Nullable<ExpandedTask>) => (task: ExpandedTask): ExpandedTask => task.id === currentlyProcessing?.id
  ? tickDownTime({task, tickTimeUntil: ['completion'], min: 0})
  : task;
const updateActivity = (currentlyProcessing: Nullable<ExpandedTask>) => (task: ExpandedTask): ExpandedTask => task.id === currentlyProcessing?.id
  ? {...task, active: true}
  : {...task, active: false};

const liuAlg: ProcessTasks = (withoutUpdatedAvailability) => {
  const tasks = withoutUpdatedAvailability.map(updateAvailability);
  const currentlyProcessing = tasks.reduce<Nullable<ExpandedTask>>(getSoonest, null);

  return tasks.map(flow(
    updateCompletion(currentlyProcessing),
    updateActivity(currentlyProcessing),
    updateDeadlines
  ))
};

export default liuAlg;
