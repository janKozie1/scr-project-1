import { useMemo } from 'react';
import styled from 'styled-components';

import { ExpandedTasks } from "../../services/types"
import { last } from '../../services/utils';
import { isTaskDone } from '../../services/tasks';
import TaskGridRenderer from '../TaskGridRenderer';

const gap = 13;
const cellWidth = 70;

type GridProps = Readonly<{
  currentIndex: number;
  endReached: boolean;
}>

const GridContainer = styled.div`
  left: calc(50% + 10px);
  position: relative;
`

const Grid = styled.div<GridProps>`
  position: relative;
  display: grid;
  grid-auto-columns: ${cellWidth}px;
  grid-auto-flow: column;
  grid-gap: ${gap}px;
  width: max-content;

  transform: translate(calc(calc(-${cellWidth}px - ${gap}px) * ${({currentIndex}) => currentIndex}));
  transition: transform 0.3s;

  &::before, &::after {
    display: ${({endReached}) => endReached ? 'block' : 'none' };
  }

  &::after {
    content: '';
    right: -${Math.floor(gap / 2) + 1}px;
    position: absolute;
    height: 100%;
    width: 1px;
    background: black;
  }

  &::before {
    content: 'End';
    position: absolute;
    right: -4px;
    top: calc(0% - 15px);
    transform: translate(50%, -50%);
  }
`


type Props = Readonly<{
  tasksPerSecond: ExpandedTasks[];
  currentIndex: number;
}>

const TaskGrid = ({ tasksPerSecond, currentIndex }: Props) => {
  const endReached = useMemo(() => last(tasksPerSecond).every(isTaskDone), [tasksPerSecond])

  return (
    <GridContainer>
      <Grid currentIndex={currentIndex} endReached={endReached}>
        <TaskGridRenderer tasksPerSecond={tasksPerSecond} gap={gap} />
      </Grid>
    </GridContainer>
  )
}

export default TaskGrid;
