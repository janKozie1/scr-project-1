import { flow, isNil } from "../services/utils";
import { Nullable, ProcessTasks, Task } from "../services/types";
import { getSoonestAvailableTo } from "../services/tasks";

type TickDownTimeArg = Readonly<{
  task: Task;
  tickTimeUntil: (keyof Task['timeUntil'])[],
  min?: number;
}>

const tickDownTime = ({task, tickTimeUntil: keys, min}: TickDownTimeArg): Task => ({
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
  } as Task['timeUntil']
})

const updateAvailability = (task: Task) => tickDownTime({task, tickTimeUntil: ['availability'], min: 0});

const updateCompletion = (currentlyProcessing: Nullable<Task>) => (task: Task) => task.id === currentlyProcessing?.id
  ? tickDownTime({task, tickTimeUntil: ['completion'], min: 0})
  : task;
const updateDeadlines = (task: Task) => task.timeUntil.completion === 0
  ? task
  : tickDownTime({task, tickTimeUntil: ['deadline']});

const liuAlg: ProcessTasks = (tasks) => tasks.map(flow(
  updateAvailability,
  updateCompletion(tasks.reduce<Nullable<Task>>(getSoonestAvailableTo('deadline'), null)),
  updateDeadlines
));

export default liuAlg;
