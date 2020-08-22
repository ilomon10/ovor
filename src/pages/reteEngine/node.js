import React from "react";
import { Node as RNode, Socket as RSocket, Control } from "rete-react-render-plugin";
import { Box } from "components/utility/grid";
import { Colors } from "@blueprintjs/core";
import styled from "styled-components";

const NodeStyle = styled(Box)`
  border-radius: 8px;
  box-shadow: 0px 0px 0px 0px ${Colors.BLUE1};
  && {
    background-color: ${Colors.GRAY1};
    border: 1px solid ${Colors.DARK_GRAY1};
  }
  &.selected {
    box-shadow: 0px 0px 0px 4px ${Colors.GOLD4};
  }
`

const SocketStyle = styled(Box)`
  height: 16px;
  width: 16px;
  margin: 8px;
  background-color: ${Colors.GRAY5};
  &.used {
    background-color: ${Colors.COBALT3};
  }
  &.output {
    margin-right: -8px;
  }
  &.input {
    margin-left: -8px;
  }
`

function kebab(str) {
  const replace = s => s.toLowerCase().replace(/ /g, '-');

  return Array.isArray(str) ? str.map(replace) : replace(str);
}

export class Socket extends RSocket {
  render() {
    const { socket, type, used } = this.props;
    return (
      <SocketStyle className={`socket ${type} ${used ? 'used' : ''} ${kebab(socket.name)}`}
        title={socket.name}
        ref={el => this.createRef(el)} // force update for new IO with a same key 
      />
    )
  }
}

export class Node extends RNode {
  render() {
    const { node, bindSocket, bindControl } = this.props;
    const { outputs, controls, inputs, selected } = this.state;
    return (
      <NodeStyle className={`node ${selected}`}>
        <Box p={2}
          color={"white"}
          fontSize={1}
          style={{ borderRadius: "8px 8px 0 0" }}
          bg={node.meta.color}>
          {node.name}
        </Box>
        {/* Outputs */}
        {outputs.map(output => (
          <div className="output" key={output.key}>
            <div className="output-title">{output.name}</div>
            <Socket
              type="output"
              used={output.connections.length > 0}
              socket={output.socket}
              io={output}
              innerRef={bindSocket}
            />
          </div>
        ))}
        {/* Controls */}
        {controls.map(control => (
          <Control
            className="control"
            key={control.key}
            control={control}
            innerRef={bindControl}
          />
        ))}
        {/* Inputs */}
        {inputs.map(input => (
          <div className="input" key={input.key}>
            <Socket
              type="input"
              used={input.connections.length > 0}
              socket={input.socket}
              io={input}
              innerRef={bindSocket}
            />
            {!input.showControl() && (
              <div className="input-title">{input.name}</div>
            )}
            {input.showControl() && (
              <Control
                className="input-control"
                control={input.control}
                innerRef={bindControl}
              />
            )}
          </div>
        ))}
      </NodeStyle>
    );
  }
}
