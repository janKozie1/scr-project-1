import styled, { css } from 'styled-components';
import { Nullable } from '../../services/types';
import { isNil } from '../../services/utils';

type SpacingType = 'm' | 'p';
type Directions = 'x' | 'y' | 'l' | 'r' | 't' | 'b' | '';

type Keys =  `${SpacingType}${Directions}`;

type FlexKeys = 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'left' | 'right' | 'space-between' | 'space-around' | 'space-evenly';
type FlexDireciton = 'column' | 'row';

export const toSpacing = (amount: Nullable<number>): string => {
  const val = amount ?? 0;
  return `${val * 4}px`;
}

const getSpacing = (keys: Keys[]) => (props: Partial<Props>): string => {
  const firstExisting = keys.find((key) => !isNil(props[key]));
  return toSpacing(isNil(firstExisting) ? null : props[firstExisting]);
}

const flexIfKeys = (keys: (keyof FlexProps)[]) => (props: FlexProps) => keys.some((key) => !isNil(props[key]))
  ? 'flex'
  : undefined;

type FlexProps = Readonly<{
  alignItems?: FlexKeys;
  justifyContent?: FlexKeys;
  flexDirection?: FlexDireciton;
}>

type Props = Readonly<{
  [key in Keys]?: number;
}> & FlexProps & Readonly<{
  fullWidth?: boolean;
  hideOverflow?: boolean;
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
  display: ${flexIfKeys(['alignItems', 'flexDirection', 'justifyContent'])};
  justify-content: ${({justifyContent}) => justifyContent};
  align-items: ${({alignItems}) => alignItems};
  flex-direction: ${({flexDirection}) => flexDirection};

  ${({hideOverflow = false}) => hideOverflow && css`
    overflow: hidden;
  `}
`

export default Box;
