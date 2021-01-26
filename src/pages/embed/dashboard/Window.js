import React from "react";
import { Box, Flex } from "components/utility/grid";
import styled from "styled-components";
import { ButtonGroup, Colors, Text } from "@blueprintjs/core";

const Component = ({
  children,
  title, toolbarControls,
  ...props }) => {
  return (
    <Flex
      {...props}
      bg={Colors.WHITE}
      flexDirection="column"
    >
      <Flex className="toolbar" justifyContent="space-between">
        <Flex className="title window-drag-handle" px={2} flexGrow={1} alignItems="center" width="1%">
          <Text ellipsize title={title}>{title}</Text>
        </Flex>
        {toolbarControls &&
          <Box className="controls" flexShrink={0}>
            <ButtonGroup>
              {toolbarControls}
            </ButtonGroup>
          </Box>}
      </Flex>
      <Box className="body" flexGrow={1} bg={Colors.LIGHT_GRAY4}>
        {children}
      </Box>
    </Flex>
  )
}

const Window = styled(Component)`
  border-radius: 3px;
  box-shadow: 0 0 0 1px rgba(16, 22, 26, 0.15), 0 0 0 rgba(16, 22, 26, 0), 0 0 0 rgba(16, 22, 26, 0);
  > .toolbar {
    z-index: 4;
    height: 30px;
    border-radius: 3px 3px 0 0;
    box-shadow: 0 1px 1px rgba(16, 22, 26, 0.15);
    > .title {
      font-weight: 600;
      color: ${Colors.DARK_GRAY5};
    }
  }
  > .body {
    border-radius: 0 0 3px 3px;
  }
  
  & .window-drag-handle {
    cursor: inherit;
  }
  &.react-draggable .window-drag-handle {
    cursor: move;
  }
  &.react-resizable-hide .react-resizable-handle {
    display: none;
  }
  
`

export default Window;