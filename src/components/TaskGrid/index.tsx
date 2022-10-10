import { Fragment } from 'react';
import styled from 'styled-components';

import Task from '../Task';
import { Tasks } from "../../services/types"
import { isTaskAvailable } from '../../services/tasks';
import TaskGridColumnSeparator from '../TaskGridColumnSeparator';


const Grid = styled.div`
  display: grid;
  grid-auto-columns: 150px auto;
  grid-auto-flow: column;
  grid-gap: 4px;
`

const Column = styled.div`
  display: grid;
  grid-auto-rows: 50px;
  grid-auto-flow: row;
  grid-gap: 4px;
`

const getColumnIds = (row: Tasks, second: number) => `${row.map((task) => task.id).join('')}${second}`

type Props = Readonly<{
  tasksPerSecond: Tasks[];
}>

const TaskGrid = ({ tasksPerSecond }: Props) => {
  return (
    <Grid>
      {tasksPerSecond.map((tasks, second) => (
        <Fragment  key={getColumnIds(tasks, second)}>
          <Column>
            {tasks.map((task, taskIndex) => (
              <Task
                key={task.id}
                task={task}
                prevState={tasksPerSecond[second - 1]?.[taskIndex]}
              />
            ))}
          </Column>
          <TaskGridColumnSeparator content={second} />
        </Fragment>
      ))}
    </Grid>
  )
}

export default TaskGrid;
