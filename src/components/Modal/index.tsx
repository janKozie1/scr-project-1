import { ReactNode } from 'react';

import styled from "styled-components";
import Box, { toSpacing } from "../Box";
import Button from '../Button';

const ModalBackdrop = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(130, 130, 130, 0.5);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  position: absolute;
`

const ModalBody = styled.div`
  height: max-content;
  width: max-content;
  border-radius: 8px;
  padding: ${toSpacing(8)};
  background: white;
  pointer-events: all;
  box-shadow: 0 1px 4px 0px rgba(58,58,58,0.08),
    0 6px 12px 2px rgba(9,26,17,0.12);
`

type Props = Readonly<{
  children: ReactNode;
  onClose: () => void;
  title: ReactNode;
}>

const Modal = ({children, title, onClose}: Props) => {
  return (
    <ModalBackdrop>
      <ModalBody>
        <Box fullWidth alignItems="center" justifyContent="space-between">
          <h3>{title}</h3>
          <Box ml={10}><Button onClick={onClose}>x</Button></Box>
        </Box>
        <Box mt={8}>
          {children}
        </Box>
      </ModalBody>
    </ModalBackdrop>
  )
}

export default Modal;
