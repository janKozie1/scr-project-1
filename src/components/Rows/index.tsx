import styled from 'styled-components';
import { toSpacing } from '../Box';


export type Props = Readonly<{
  gap: number;
  regular?: boolean;
}>;

const Rows = styled.div<Props>`
  display: grid;
  gap: ${({ gap }) => toSpacing(gap)};
  grid-auto-flow: row;
  grid-auto-rows: ${({ regular = false }) => (regular ? '1fr' : 'auto')};
  grid-template-columns: 1fr;
  list-style-type: none;
  width: 100%;
`;

export default Rows;
