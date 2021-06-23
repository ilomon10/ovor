import React from "react";

const ConfigNode = (props) => {
  const component = props.node.component;
  const { ConfigView } = component;
  return (
    <ConfigView {...props} />
  )
}

export default ConfigNode;