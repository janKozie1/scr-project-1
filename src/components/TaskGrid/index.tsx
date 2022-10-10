import { Fragment, useEffect, useRef } from 'react';
import styled from 'styled-components';

import Task from '../Task';
import { ExpandedTasks } from "../../services/types"
import TaskGridColumnSeparator from '../TaskGridColumnSeparator';


const Grid = styled.div`
  display: grid;
  grid-auto-columns: auto 90px;
  grid-auto-flow: column;
  grid-gap: 4px;
  width: max-content;
`

const Column = styled.div`
  display: grid;
  grid-auto-rows: 30px;
  grid-auto-flow: row;
  grid-gap: 4px;
`

const getColumnIds = (row: ExpandedTasks, second: number) => `${row.map((task) => task.id).join('')}${second}`

type Props = Readonly<{
  tasksPerSecond: ExpandedTasks[];
}>

const TaskGrid = ({ tasksPerSecond }: Props) => {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(()  => {
  }, [tasksPerSecond])

  return (
    <Grid ref={gridRef}>
      {tasksPerSecond.map((tasks, second) => (
        <Fragment  key={getColumnIds(tasks, second)}>
          <TaskGridColumnSeparator content={second} />
          <Column>
            {tasks.map((task, taskIndex) => (
              <Task
                key={task.id}
                task={task}
                prevState={tasksPerSecond[second - 1]?.[taskIndex]}
              />
            ))}
          </Column>
        </Fragment>
      ))}
    </Grid>
  )
}

export default TaskGrid;
