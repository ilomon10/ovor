import React, { useState } from "react";
import Helmet from "react-helmet";
import { Box, Flex } from "components/utility/grid";
import { FungsiMajuProvider } from "components/hocs/fungsiMaju";
import {
  DeviceInComponent,
  DeviceOutComponent,
  DataSourceInComponent,
  DataSourceOutComponent,
  JoinComponent,
  SwitchComponent,
  ChangeComponent,
  FunctionComponent
} from "components/fungsiMajuNodes";
import Canvas from "./canvas";
import Toolbar from "./toolbar";
import Dock from "./dock";
import { Colors } from "@blueprintjs/core";

const Saraf = ({ className }) => {
  const [components] = useState([
    new DeviceInComponent(),
    new DeviceOutComponent(),
    new DataSourceInComponent(),
    new DataSourceOutComponent(),
    new JoinComponent(),
    new SwitchComponent(),
    new ChangeComponent(),
    new FunctionComponent(),
  ]);
  const onEditorCreated = (editor) => {
    components.forEach(c => {
      try {
        editor.register(c);
      } catch (err) {
        console.error(err);
      }
    })
  }
  return (
    <>
      <Helmet>
        <title>Saraf Editor | Ovor</title>
        <meta name="description" content="Saraf editor" />
      </Helmet>
      <FungsiMajuProvider version={"0.1.0"} components={components}>
        <Flex
          className={className}
          height="100%"
          width="100%"
          flexDirection={"column"}
        >
          <Toolbar />
          <Flex flexGrow={1}>
            <Box flexShrink={0} width={200} style={{ borderRight: `1px solid ${Colors.GRAY5}` }}>
              <Dock />
            </Box>
            <Box flexGrow={1} style={{ position: "relative" }}>
              <Canvas onCreated={onEditorCreated} />
            </Box>
          </Flex>
        </Flex>
      </FungsiMajuProvider>
    </>
  )
}

export default Saraf;