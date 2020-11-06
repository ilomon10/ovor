import React from 'react';
import { Tab, Tabs, Classes, Colors } from '@blueprintjs/core';
import styled from 'styled-components';
import { Group } from '@vx/group';
import { Text } from '@vx/text';

const Comp = ({ options, className, ...props }) => {
  let data = options.labels.map((v, i) => ({
    label: v,
    data: props.series[i]
  }));
  const series = data.map((v, i) => {
    let text = `${Number(v.data).toPrecision(options.precision)}`;
    // if(options.unit) text = (`${text} ${options.unit}`)
    return (<Tab
      id={i} title={v.label} key={i} panel={(
        <svg style={{ height: '100%', width: '100%' }} viewBox="0 0 36 24">
          <Group top={12} left={18}>
            <Text style={{ fill: Colors.DARK_GRAY1 }} textAnchor="middle" verticalAnchor="end">{text}</Text>
            <Text width={36} style={{ fontSize: '40%', fill: Colors.GRAY1 }} dy={1} lineHeight={5} textAnchor="middle" verticalAnchor="start">{options.unit}</Text>
          </Group>
        </svg>
      )} />)
  });
  return (
    <div className={className}>
      <Tabs defaultSelectedTabId={0}>
        {series}
      </Tabs>
    </div>
  )
}

const BaseNumeric = styled(Comp)`
  height: 100%;
  .${Classes.TABS} {
    height: 100%;
    .${Classes.TAB_LIST} {
      justify-content: center;
    }
    .${Classes.TAB_PANEL} {
      height: 100%;
      > div {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }
    }
  }
`

export default BaseNumeric;