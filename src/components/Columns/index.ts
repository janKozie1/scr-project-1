import styled from 'styled-components';
import { toSpacing } from '../Box';

export type Props = Readonly<{
  gap: number;
  regular?: boolean;
  alignCenter?: boolean;
}>;

const Columns = styled.div<Props>`
  align-items: ${({ alignCenter }) => (alignCenter === true ? 'center' : 'initial')};
  display: grid;
  gap: ${({ gap }) => toSpacing(gap)};
  grid-auto-columns: ${({ regular = false }) => (regular ? '1fr' : 'max-content')};
  grid-auto-flow: column;
  grid-template-rows: 1fr;
  width: 100%;
`;

export default Columns;
