import { useState } from 'react';
import styled from 'styled-components';
import { doneTaskColor } from '../../configs/colors';
import { isTaskAvailable, isTaskDone, wasTaskJustCompleted } from '../../services/tasks';

import { Nullable, ExpandedTask } from "../../services/types"
import { isNil } from '../../services/utils';
import Tooltip from '../Tooltip';

type CellProps = Readonly<{
  active?: boolean
  color?: string;
  faded?: boolean;
}>

const Cell = styled.div<CellProps>`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid black;

  background-color: ${({active = false, color}) => active ? color : 'white'};

  > * {
    opacity: ${({faded = false}) => faded ? '0.3' : 1};
  }
`

type Props = Readonly<{
  task: ExpandedTask;
  prevState: Nullable<ExpandedTask>
}>

const Task = ({task}: Props) => {
  const isAvailable = isTaskAvailable(task);
  const isDone = isTaskDone(task);
  const wasJustCompleted = wasTaskJustCompleted(task);

  if (!isAvailable) {
    return <Cell />;
  }

  if (isDone && !wasJustCompleted) {
    return (
      <Cell faded active color={doneTaskColor}>
        <div>{task.name}</div>
      </Cell>
    )
  }

  return (
    <Tooltip
      body={(
        <div>
          <p>until completion: {task.timeUntil.completion}</p>
        </div>
      )}>
      <Cell {...task}>{task.name}</Cell>
    </Tooltip>
  )
}

export default Task;
