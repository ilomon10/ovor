import styled from 'styled-components';
import {
  space,
  color,
  layout,
  flexbox,
  typography,
  compose
} from 'styled-system';

const boxProps = compose(
  space,
  color,
  layout,
  typography,
  flexbox,
)
export const Box = styled('div')({
  boxSizing: 'border-box'
},
  boxProps,
)

Box.displayName = 'Box';

export const Flex = styled(Box)({
  display: 'flex'
})

Flex.displayName = 'Flex';