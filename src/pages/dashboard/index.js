import moment from 'moment';
import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Corner,
  Mosaic,
  MosaicZeroState,
  getLeaves,
  createBalancedTreeFromLeaves,
  getPathToCorner,
  getNodeAtPath,
  getOtherDirection,
  updateTree
} from 'react-mosaic-component';
import { Navbar, Classes, Icon, Button, EditableText, ControlGroup, HTMLSelect } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { dropRight, getRandomData } from 'components/helper';
import { TabContext } from "components/tabSystem";
import Widget from 'components/widget';

const bbb = {
  '1': {
    title: 'Line Chart',
    type: 'plot.line',
    series: [{
      name: 'data 1',
      data: getRandomData(15, true)
    }, {
      name: 'data 2',
      data: getRandomData(10, true)
    }]
  }, '2': {
    title: 'Bar Chart',
    type: 'plot.bar',
    series: [{
      name: 'data 1',
      data: getRandomData(5, true)
    }, {
      name: 'data 2',
      data: getRandomData(5, true)
    }, {
      name: 'data 3',
      data: getRandomData(5, true)
    }]
  }, '3': {
    title: 'Line 3 Chart',
    type: 'plot.line',
    options: {
      yaxis: {
        labels: {
          formatter: (v) => (v.toFixed(2))
        }
      },
      xaxis: {
        type: 'datetime'
      }
    },
    series: [{
      name: 'data 1',
      data: getRandomData(25, true)
    }, {
      name: 'data 2',
      data: getRandomData(25, true)
    }]
  }, '4': {
    title: 'Radial',
    type: 'radial',
    options: {
      labels: ['a', 'b', 'c', 'd', 'e']
    },
    series: [1, 2, 3, 4, 5]
  }, '5': {
    title: 'Numeric',
    type: 'numeric',
    options: {
      labels: ['alfa', 'bravo', 'charlie', 'delta', 'echo foxtrot golf']
    },
    series: [102, 10, 2, 24, 2300]
  }, '6': {
    title: 'Table',
    type: 'table',
    options: {
      labels: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
    },
    series: [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
    ]
  }
}
const cNodes = {
  direction: 'row',
  first: {
    direction: 'column',
    first: {
      direction: 'row',
      first: 1,
      second: 4
    },
    second: {
      direction: 'column',
      first: 6,
      second: 7
    },
  },
  second: {
    direction: 'row',
    first: 2,
    second: {
      direction: 'column',
      first: 3,
      second: 5,
    },
  },
  splitPercentage: 50
}

let windowCount = 7;

const Dashboard = () => {
  const tab = useContext(TabContext);
  const location = useLocation();
  const [watchMode, setWatchMode] = useState('Range');
  const [dashboardTitle, setDashboardTitle] = useState("New Dashboard");
  const [timeRange, setTimeRange] = useState([moment().toDate(), moment().toDate()]);
  const [currentNode, setCurrentNode] = useState(cNodes);
  useEffect(() => {
    tab.setCurrentTabState({
      title: dashboardTitle,
      path: location.pathname
    })
  }, [dashboardTitle]);// eslint-disable-line react-hooks/exhaustive-deps
  const autoArrange = () => {
    const leaves = getLeaves(currentNode);
    setCurrentNode(createBalancedTreeFromLeaves(leaves));
  }
  const createNode = () => ++windowCount;
  const addNewWindow = () => {
    let curNode = { ...currentNode };
    if (curNode && currentNode !== null) {
      const path = getPathToCorner(curNode, Corner.TOP_RIGHT);
      const parent = getNodeAtPath(curNode, dropRight(path));
      const destination = getNodeAtPath(curNode, path);
      const direction = parent ? getOtherDirection(parent.direction) : 'row';
      let first = ++windowCount;
      let second = destination;
      if (direction === 'row') {
        first = destination;
        second = ++windowCount;
      }
      curNode = updateTree(curNode, [
        {
          path,
          spec: {
            $set: {
              direction, first, second,
            }
          }
        }
      ]);
    } else curNode = ++windowCount;
    setCurrentNode(curNode);
  }
  return (
    <div className="flex flex--col" style={{ height: '100%', width: '100%' }}>
      <Navbar className="flex flex-shrink-0">
        <Navbar.Group className="flex-grow" style={{ width: 0 }}>
          <Navbar.Heading style={{ width: '100%', paddingRight: 15 }}>
            <h4 className={`${Classes.HEADING} flex flex--i-center`} style={{ margin: 0 }}>
              <Icon className='flex-shrink-0' icon="full-stacked-chart" style={{ verticalAlign: 'middle', marginRight: 8 }} />
              <EditableText selectAllOnFocus value={dashboardTitle} onChange={v => setDashboardTitle(v)} />
            </h4>
          </Navbar.Heading>
        </Navbar.Group>
        <Navbar.Group className="flex-shrink-0">
          <ControlGroup className="flex--i-center">
            {watchMode === 'Range' && <>
              <DateInput style={{ textAlign: 'center' }}
                maxDate={moment(timeRange[1]).toDate()}
                formatDate={date => moment(date).format('DD-MMM YY\'')}
                parseDate={str => moment(str, 'DD-MM YY\'')}
                onChange={v => setTimeRange([v, timeRange[1]])}
                value={timeRange[0]} inputProps={{ size: 6 }} />
              <span className={Classes.INPUT}>to</span>
              <DateInput
                minDate={moment(timeRange[0]).toDate()}
                formatDate={date => moment(date).format('DD-MMM YY\'')}
                parseDate={str => moment(str, 'DD-MM YY\'')}
                onChange={v => setTimeRange([timeRange[0], v])}
                value={timeRange[1]} inputProps={{ size: 6 }} />
            </>}
            <HTMLSelect options={['Range', 'Realtime']} value={watchMode} onChange={e => setWatchMode(e.target.value)} />
          </ControlGroup>
          <Navbar.Divider />
          <Button icon="grid-view" onClick={autoArrange} text="Re-arrange" />
          <Navbar.Divider />
          <Button icon="insert" onClick={addNewWindow} text="Add New Window" />
        </Navbar.Group>
      </Navbar>
      <div className="flex-grow">
        <Mosaic
          renderTile={(id, path) => {
            return (<Widget path={path} tileId={id} {...bbb[id]} />)
          }}
          zeroStateView={<MosaicZeroState createNode={createNode} />}
          onChange={currentNode => { setCurrentNode(currentNode) }}
          value={currentNode} />
      </div>
    </div>
  )
}

export default Dashboard;