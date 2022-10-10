import { useState } from 'react';
import styled from 'styled-components';
import { isTaskAvailable, isTaskDone } from '../../services/tasks';

import { Nullable, Task as TaskType } from "../../services/types"
import { isNil } from '../../services/utils';
import Tooltip from '../Tooltip';

type CellProps = Readonly<{

}>

const Cell = styled.div<CellProps>`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid black;
`

type Props = Readonly<{
  task: TaskType;
  prevState: Nullable<TaskType>
}>

const Task = ({task}: Props) => {
  const isAvailable = isTaskAvailable(task);
  const isDone = isTaskDone(task);

  if (!isAvailable || isDone) {
    return <Cell>-</Cell>;
  }

  return (
    <Tooltip
      body={(
        <div>
          <p>until completion: {task.timeUntil.completion}</p>
        </div>
      )}>
      <Cell>{task.name}</Cell>
    </Tooltip>
  )
}

export default Task;
