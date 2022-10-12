import { memo } from 'react';

import styled, { css } from 'styled-components';
import { doneTaskColor } from '../../configs/colors';
import { hasTaskReachedDeadline, isTaskAvailable, isTaskDone, wasTaskJustCompleted } from '../../services/tasks';

import { Nullable, ExpandedTask } from "../../services/types"
import { isNil } from '../../services/utils';

type CellProps = Readonly<{
  active?: boolean
  color?: string;
  faded?: boolean;
  done?: boolean;
  reachedDeadline?: boolean;
}>

const colors = (props: CellProps) => {
  const {
    active = false,
    done = false,
    faded = false,
    color,
  } = props;

  return css`
    background-color: ${done ? doneTaskColor : active ? color : 'white'};
    color: ${active && !faded ? 'white' : 'black'};

    &::after {
      background-color: ${color};
    }
  `
}

const Cell = styled.div<CellProps>`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 1px solid black;

  ${colors}

  > * {
    opacity: ${({faded = false}) => faded ? '0.3' : 1};
  }

  &::after {
    content: '';
    width: 5px;
    position: absolute;
    height: 100%;
    left: 0;
    top: 50%;
    transform: translate(-10px, -50%);
    opacity: ${({reachedDeadline}) => reachedDeadline ? '1' : '0'};
    z-index: 2;

    pointer-events: none;
  }
`

type Props = Readonly<{
  task: ExpandedTask;
  prevState: Nullable<ExpandedTask>
}>

const Task = memo(({task, prevState}: Props) => {
  const isAvailable = isTaskAvailable(task);
  const isDone = isTaskDone(task);

  const wasJustCompleted = wasTaskJustCompleted(task);
  const reachedDeadline = !isNil(prevState) && hasTaskReachedDeadline(task);

  if (!isAvailable) {
    return <Cell />;
  }

  if (isDone && !wasJustCompleted) {
    return (
      <Cell {...task} done faded reachedDeadline={reachedDeadline}>
        <div>{task.name}</div>
      </Cell>
    )
  }

  return <Cell {...task} reachedDeadline={reachedDeadline}>{task.name}</Cell>
})

export default Task;
