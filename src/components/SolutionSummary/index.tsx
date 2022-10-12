import { Fragment } from 'react';

import styled from "styled-components";
import { abbreviateTaskName } from "../../services/tasks";
import { SolutionSummary as SolutionSummaryType } from "../../services/types";
import Box, { toSpacing } from "../Box";
import Rows from "../Rows";

const SolutionSummaryTable = styled.div`
  display: grid;
  grid-auto-columns: auto;
  grid-template-rows: repeat(3, auto);
  grid-auto-flow: column;

  > * {
    border: 1px solid black;
    display: flex;
    justify-content: center;
    width: 100%;
    padding: ${toSpacing(2)} ${toSpacing(4)};
  }
`

type Props = Readonly<{
  summary: SolutionSummaryType;
}>

const SolutionSummary = ({summary}: Props ) => {
  return (
    <Rows gap={4} center>
      <h5>Lmax = {summary.lMax}</h5>
      <h5>Optimal order = {summary.optimalOrder.map((task) => abbreviateTaskName(task.name)).join(', ')}</h5>

      <SolutionSummaryTable>
        <Box></Box>
        <Box>Start</Box>
        <Box>End</Box>
        {summary.executionSummary.map((task) => (
          <Fragment key={`${task.id}${task.start}`}>
            <Box>{task.name}</Box>
            <Box>{task.start}s</Box>
            <Box>{task.stop}s</Box>
          </Fragment>
        ))}
      </SolutionSummaryTable>
    </Rows>
  )
}

export default SolutionSummary;
