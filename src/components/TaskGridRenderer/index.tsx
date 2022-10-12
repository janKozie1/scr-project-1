import { Fragment, memo } from "react";
import { ExpandedTasks } from "../../services/types";
import Task from "../Task";
import TaskGridColumn from "../TaskGridColumn";

const getColumnIds = (row: ExpandedTasks, second: number) => `${row.map((task) => task.id).join('')}${second}`

type Props = Readonly<{
  tasksPerSecond: ExpandedTasks[];
  gap: number;
}>

const TaskGridRenderer = memo(({tasksPerSecond, gap}: Props) => {
  return (
    <>
      {tasksPerSecond.map((tasks, second) => (
          <Fragment key={getColumnIds(tasks, second)}>
            <TaskGridColumn second={second} gap={gap}>
              {tasks.map((task, taskIndex) => (
                <Task
                  key={task.id}
                  task={task}
                  prevState={tasksPerSecond[second - 1]?.[taskIndex]}
                />
              ))}
            </TaskGridColumn>
          </Fragment>
        ))}
    </>
  )
})

export default TaskGridRenderer;
