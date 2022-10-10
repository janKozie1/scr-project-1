import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import Box from '../Box';

const TooltipContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
`

type FloatingBoxProps = Readonly<{
  visible: boolean;
}>

const FloatingBox = styled.div<FloatingBoxProps>`
  position: absolute;
  left: 50%;
  top: 0%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: opacity 0.15s;
  opacity: ${({visible}) => visible ? '1' : '0'};
  background-color: white;
  border-radius: 4px;
  width: max-content;
  height: max-content;
  box-shadow: 0 1px 4px 0px rgba(58,58,58,0.08),
    0 6px 12px 2px rgba(9,26,17,0.12);
`

type Props = Readonly<{
  children: ReactNode;
  body: ReactNode;
}>

const Tooltip = ({children, body}: Props) => {
  const [shouldShowInfo, setShouldShowInfo] = useState(false);

  const showTooltip = () => setShouldShowInfo(true);
  const hideTooltip = () => setShouldShowInfo(false);

  return (
    <TooltipContainer onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
      <FloatingBox visible={shouldShowInfo}>
        <Box my={3} mx={3}>
          {body}
        </Box>
      </FloatingBox>
      {children}
    </TooltipContainer>
  )
}

export default Tooltip;
