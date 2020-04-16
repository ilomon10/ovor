import styled from 'styled-components';
import { Classes } from '@blueprintjs/core';
import Wrapper from './wrapper';

export default styled(Wrapper)`
  font-size: 13px;
  .${Classes.SPINNER} {
    height: 100%;
  }
`