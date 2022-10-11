import styled from 'styled-components';
import { toSpacing } from '../Box';

export type Props = Readonly<{
  gap: number;
  regular?: boolean;
  center?: boolean;
}>;

const Columns = styled.div<Props>`
  align-items: ${({ center }) => (center === true ? 'center' : 'initial')};
  display: grid;
  gap: ${({ gap }) => toSpacing(gap)};
  grid-auto-columns: ${({ regular = false }) => (regular ? '1fr' : 'max-content')};
  grid-auto-flow: column;
  grid-template-rows: 1fr;
  width: max-content;
`;

export default Columns;
