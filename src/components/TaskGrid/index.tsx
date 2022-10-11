import { Fragment, useEffect, useRef } from 'react';
import styled from 'styled-components';

import Task from '../Task';
import { ExpandedTasks } from "../../services/types"
import TaskGridColumn from '../TaskGridColumn';
import { last } from '../../services/utils';
import { isTaskDone } from '../../services/tasks';

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
    top: calc(-5% - 10px);
    transform: translate(50%, -50%);
  }
`

const getColumnIds = (row: ExpandedTasks, second: number) => `${row.map((task) => task.id).join('')}${second}`

type Props = Readonly<{
  tasksPerSecond: ExpandedTasks[];
  currentIndex: number;
}>

const TaskGrid = ({ tasksPerSecond, currentIndex }: Props) => {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(()  => {
  }, [tasksPerSecond])

  return (
    <GridContainer>
      <Grid ref={gridRef} currentIndex={currentIndex} endReached={last(tasksPerSecond).every(isTaskDone)}>
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
      </Grid>
    </GridContainer>
  )
}

export default TaskGrid;
