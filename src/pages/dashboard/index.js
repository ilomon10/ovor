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
    options: {
      chart: {
        id: 'Line Chart'
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        labels: {
          formatter: (v) => (v.toFixed(2))
        }
      },
    },
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
    options: {
      chart: {
        id: 'Bar Chart'
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        labels: {
          formatter: (v) => (v.toFixed(2))
        }
      }
    },
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
      chart: {
        id: 'Line 3 Chart'
      },
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
      chart: {
        id: 'Radial'
      },
      labels: ['a', 'b', 'c', 'd', 'e']
    },
    series: [1, 2, 3, 4, 5]
  }, '5': {
    title: 'Gauge',
    type: 'radial',
    options: {
      chart: {
        id: 'Gauge'
      },
      labels: ['a', 'b', 'c', 'd', 'e']
    },
    series: [1, 2, 3, 4, 5]
  }, '6': {
    title: 'Table',
    type: 'table',
    options: {
      labels: ['a', 'b', 'c', 'd', 'e']
    },
    series: [
      [1,2,3,4,5],
      [6,7,8,9,10],
      [1,2,3,4,5],
      [6,7,8,9,10],
      [1,2,3,4,5],
      [6,7,8,9,10],
      [1,2,3,4,5],
      [6,7,8,9,10],
      [1,2,3,4,5],
      [6,7,8,9,10],
      [1,2,3,4,5],
      [6,7,8,9,10],
      [1,2,3,4,5],
      [6,7,8,9,10],
      [1,2,3,4,5],
      [6,7,8,9,10],
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
    second: 6,
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
  const [dashboardTitle, setDashboardTitle] = useState("New Dashboard");
  const [timeRange, setTimeRange] = useState([new Date(), new Date()]);
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
            <HTMLSelect options={['Range', 'Realtime']} />
            <DateInput style={{ textAlign: 'center' }}
              formatDate={date => moment(date).format('DD-MMM YY\'')}
              parseDate={str => moment(str)}
              onChange={v => setTimeRange([v, timeRange[1]])}
              value={timeRange[0]} inputProps={{ size: 6 }} />
            <span className={Classes.INPUT}>to</span>
            <DateInput
              formatDate={date => moment(date).format('DD-MMM YY\'')}
              parseDate={str => moment(str)}
              onChange={v => setTimeRange([timeRange[0], v])}
              value={timeRange[1]} inputProps={{ size: 6 }} />
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
            return (<Widget path={path} {...bbb[id]} />)
          }}
          zeroStateView={<MosaicZeroState createNode={createNode} />}
          onChange={currentNode => { setCurrentNode(currentNode) }}
          value={currentNode} />
      </div>
    </div>
  )
}

export default Dashboard;