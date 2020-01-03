import moment from 'moment';
import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Corner,
  Mosaic,
  MosaicWindow,
  getLeaves,
  createBalancedTreeFromLeaves,
  getPathToCorner,
  getNodeAtPath,
  getOtherDirection,
  updateTree
} from 'react-mosaic-component';
import { Navbar, Button, Classes, Icon, EditableText } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { dropRight } from '../components/helper';
import { TabContext } from "../components/tabSystem";

let windowCount = 3;

const Dashboard = () => {
  const tab = useContext(TabContext);
  const location = useLocation();
  const [dashboardTitle, setDashboardTitle] = useState(tab.tabs[tab.activeTab].title || "New Dashboard");
  const [timeRange, setTimeRange] = useState([new Date(), new Date()]);
  const [currentNode, setCurrentNode] = useState({
    direction: 'row',
    first: 1,
    second: {
      direction: 'column',
      first: 2,
      second: 3,
    },
    splitPercentage: 50
  })
  useEffect(() => {
    tab.setCurrentTabState({
      title: dashboardTitle,
      path: location.pathname
    })
  }, [dashboardTitle]);// eslint-disable-line react-hooks/exhaustive-deps
  const createNode = () => ++windowCount;
  const autoArrange = () => {
    const leaves = getLeaves(currentNode);
    setCurrentNode(createBalancedTreeFromLeaves(leaves));
  }
  const addNewWindow = () => {
    let curNode = { ...currentNode };
    if (curNode) {
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
      if (Object.entries(curNode).length === 0) {
        first = ++windowCount;
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
          <div style={{ marginRight: 8 }}>
            <DateInput
              formatDate={date => moment(date).format('dddd, DD MMM YY\'')}
              parseDate={str => moment(str)}
              onChange={v => setTimeRange([v, timeRange[1]])}
              value={timeRange[0]} />
          </div>
          <Icon style={{ marginRight: 8 }} icon="arrow-right" />
          <DateInput
            formatDate={date => moment(date).format('dddd, DD MMM YY\'')}
            parseDate={str => moment(str)}
            onChange={v => setTimeRange([timeRange[0], v])}
            value={timeRange[1]} />
          <Navbar.Divider />
          <Button icon="grid-view" onClick={autoArrange} text="Re-arrange" />
          <Navbar.Divider />
          <Button icon="insert" onClick={addNewWindow} text="Add New Window" />
        </Navbar.Group>
      </Navbar>
      <div className="flex-grow">
        <Mosaic
          renderTile={(count, path) => (
            <MosaicWindow
              title={`Window ${count}`}
              createNode={createNode}
              path={path}>
              <div>Bijon</div>
            </MosaicWindow>
          )}
          // style={{ width: 0, height: 0 }}
          onChange={currentNode => { setCurrentNode(currentNode) }}
          value={currentNode} />
      </div>
    </div>
  )
}

export default Dashboard;