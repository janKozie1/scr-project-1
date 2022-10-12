import styled from "styled-components";

type Props = Readonly<{
  second: number;
  gap: number;
}>

const TaskGridColumn = styled.div<Props>`
  display: grid;
  grid-auto-rows: 30px;
  grid-auto-flow: row;
  grid-gap: 4px;
  position: relative;

  &::before {
    position: absolute;
    content: '';
    height: calc(100% + 10px);
    left: -${({gap}) => Math.floor(gap / 2) + 1}px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    background: black;
  }

  &::after {
    position: absolute;
    content: '${({second}) => second}s';
    top: calc(0% - 15px);
    transform: translate(-50%, -50%);
    left: -${({gap}) => Math.floor(gap / 2) - 1}px;
  }
`

export default TaskGridColumn;
