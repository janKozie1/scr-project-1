import { append, flow, isNil, isNotNil, last, pop, sum } from "../services/utils";
import { Nullable, ProcessTasks, ExpandedTask, ExpandedTasks, GetSolutionSummary, SolutionSummary } from "../services/types";
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
const updateDeadlines = (shouldStopAfterCompletion: boolean) => (task: ExpandedTask): ExpandedTask => shouldStopAfterCompletion && isTaskDone(task)
  ? task
  : tickDownTime({task, tickTimeUntil: ['deadline']});
const updateCompletion = (currentlyProcessing: Nullable<ExpandedTask>) => (task: ExpandedTask): ExpandedTask => task.id === currentlyProcessing?.id
  ? tickDownTime({task, tickTimeUntil: ['completion'], min: 0})
  : task;
const updateActivity = (currentlyProcessing: Nullable<ExpandedTask>) => (task: ExpandedTask): ExpandedTask => task.id === currentlyProcessing?.id
  ? {...task, active: true}
  : {...task, active: false};

const liuAlg: ProcessTasks = (withoutUpdatedAvailability, shouldStopAfterCompletion = false) => {
  const tasks = withoutUpdatedAvailability.map(updateAvailability);
  const currentlyProcessing = tasks.reduce<Nullable<ExpandedTask>>(getSoonest, null);

  return tasks.map(flow(
    updateDeadlines(shouldStopAfterCompletion),
    updateCompletion(currentlyProcessing),
    updateActivity(currentlyProcessing),
  ))
};

export const intialLiuAlg: ProcessTasks = (tasks) => {
  const currentlyProcessing = tasks.filter(isTaskAvailable).reduce<Nullable<ExpandedTask>>(getSoonest, null);
  return tasks.map(flow(updateCompletion(currentlyProcessing), updateActivity(currentlyProcessing)))
}

export const solve = (expandedTasks: ExpandedTasks[], alg: ProcessTasks = liuAlg): ExpandedTasks[] => {
  const recurse = (tasks: ExpandedTasks[]): ExpandedTasks[] => {
    const prevStep = last(tasks);

    if (prevStep.every(isTaskDone)) {
      return tasks;
    }

    return recurse(append(alg(prevStep))(tasks));
  }

  return recurse(expandedTasks);
}

export const getSolutionSummary: GetSolutionSummary = (expandedTasks) => {
  const solved = solve([expandedTasks], (tasks) => liuAlg(tasks, true));
  const executionOrder = solved.map((tasks) => tasks.find((task) => task.active)).filter(isNotNil);

  const executionSummary = executionOrder.reduce<SolutionSummary['executionSummary']>((groups, task, index) => {
      const prevGroup = last(groups);
      const rest = pop(groups);

      if (isNil(prevGroup)) {
        return [{...task, start: index, stop: index + 1}];
      }

      if (prevGroup.id === task.id) {
        return [...rest, { ...prevGroup, stop: index + 1}];
      }

      return [...groups, { ...task, start: index, stop: index + 1}];
  }, [])

  const optimalOrder = executionOrder.reduce<SolutionSummary['optimalOrder']>((order, task) => {
    const prevTask = last(order);

    if (isNil(prevTask)) {
      return [task];
    }

    if (prevTask.id === task.id) {
      return order;
    }

    return [...order, task];
  }, []);

  return {
    lMax: last(solved).map((task) => task.timeUntil.deadline).reduce(sum),
    executionSummary,
    optimalOrder,
  }
}


export default liuAlg;
