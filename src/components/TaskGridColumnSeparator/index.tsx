import styled from "styled-components";

type Props = Readonly<{
  content: number;
}>

const TaskGridColumnSeparator = styled.div<Props>`
  height: 100%;
  background:black;
  width: 1px;
  position: relative;

  &::before {
    position: absolute;
    content: '${({content}) => content}s';
    top: -4px;
    left: 50%;
    transform: translate(-50%, -100%);
  }
`

export default TaskGridColumnSeparator;
