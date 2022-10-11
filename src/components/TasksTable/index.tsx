import { Fragment } from 'react';

import styled from "styled-components";
import { ExpandedTasks } from "../../services/types"
import Box from "../Box";

const TaskTableGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, auto);
  grid-auto-rows: max-content;
  width: max-content;


  > * {
    width: 100%;
    height: 100%;
    border: 1px solid black;

    display: flex;
    justify-content: center;
    align-items: center;
  }
`

type TaskNameCellProps = Readonly<{
  color: string;
}>

const TaskNameCell = styled(Box)<TaskNameCellProps>`
  background-color: ${({color}) => color};
`

type Props = Readonly<{
  tasks: ExpandedTasks;
}>

const TasksTable = ({tasks}: Props) => {
  return (
    <TaskTableGrid>
      <Box />
      <Box>P</Box>
      <Box>R</Box>
      <Box>D</Box>
      {tasks.map((task) =>{
        const r = task.timeUntil.availability;
        const p = task.timeUntil.completion;
        const d = task.timeUntil.deadline;

        return  (
          <Fragment key={task.id}>
            <TaskNameCell color={task.color} px={4} py={2}>
              {task.name}
            </TaskNameCell>
            <Box px={4} py={2}>{p}</Box>
            <Box px={4} py={2}>{r}</Box>
            <Box px={4} py={2}>{d}</Box>
          </Fragment>
        )
      })}
    </TaskTableGrid>
  )
}

export default TasksTable;
