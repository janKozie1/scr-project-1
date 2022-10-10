import styled from 'styled-components';
import { Nullable } from '../../services/types';
import { isNil } from '../../services/utils';

type SpacingType = 'm' | 'p';
type Directions = 'x' | 'y' | 'l' | 'r' | 't' | 'b' | '';

type Keys =  `${SpacingType}${Directions}`;

export const toSpacing = (amount: Nullable<number>): string => {
  const val = amount ?? 0;

  return `${val * 4}px`;
}

const getSpacing = (keys: Keys[]) => (props: Partial<Props>): string => {
  const firstExisting = keys.find((key) => !isNil(props[key]));
  return toSpacing(isNil(firstExisting) ? null : props[firstExisting]);
}

type Props = Readonly<{
  [key in Keys]?: number;
}> & Readonly<{
  fullWidth?: boolean;
}>

const Box = styled.div<Props>`
  margin-top: ${getSpacing(['mt', 'my', 'm'])};
  margin-right: ${getSpacing(['mr', 'mx', 'm'])};
  margin-bottom: ${getSpacing(['mb', 'my', 'm'])};
  margin-left: ${getSpacing(['ml', 'mx', 'm'])};

  padding-top: ${getSpacing(['pt', 'py', 'p'])};
  padding-right: ${getSpacing(['pr', 'px', 'p'])};
  padding-bottom: ${getSpacing(['pb', 'py', 'p'])};
  padding-left: ${getSpacing(['pl', 'px', 'p'])};

  width: ${({fullWidth = false}) => fullWidth ? '100%' : 'max-content'};
`

export default Box;
