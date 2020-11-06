import React, { useState } from 'react';
import { Tab, Tabs, Classes, Colors, ResizeSensor } from '@blueprintjs/core';
import styled from 'styled-components';
import { Group } from '@visx/group';
import { Text } from '@visx/text';
import { Box } from 'components/utility/grid';

const Comp = ({ options, className, ...props }) => {
  const [contentSize, setContentSize] = useState({
    height: 0,
    width: 0
  });
  let data = options.labels.map((v, i) => ({
    label: v,
    data: props.series[i]
  }));
  const series = data.map((v, i) => {
    let text = `${Number(v.data).toPrecision(options.precision)}`;
    if (options.unit) text = (`${text}${options.unit}`)
    return (<Tab
      id={i} title={v.label} key={i} panel={(
        <Box style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}>
          <svg xmlns='http://www.w3.org/2000/svg'
            width={"100%"}
            height={"100%"}>
            <Text scaleToFit={true}
              dy={'50%'}
              width={contentSize.width}
              style={{ fill: Colors.DARK_GRAY1, fontSize: "1em" }}
              textAnchor="start"
              verticalAnchor="middle">{text}</Text>
          </svg>
        </Box>
      )} />)
  });
  return (
    <div className={className}>
      <ResizeSensor onResize={(entries) => {
        entries.forEach(e => setContentSize({ height: e.contentRect.height, width: e.contentRect.width }));
      }}>
        <Tabs defaultSelectedTabId={0}>
          {series}
        </Tabs>
      </ResizeSensor>
    </div>
  )
}

const BaseNumeric = styled(Comp)`
  height: 100%;
  .${Classes.TABS} {
    height: 100%;
    display: flex;
    flex-direction: column;
    .${Classes.TAB_LIST} {
      justify-content: center;
    }
    .${Classes.TAB_PANEL} {
      margin-top: 0;
      flex: 1 0 auto;
      position: relative;
      // display: flex;
      // justify-content: center;
      // align-items: center;
    }
  }
`

export default BaseNumeric;