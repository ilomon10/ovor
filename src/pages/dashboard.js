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
import { dropRight } from '../components/helper';
import { AppContext } from '../App';

let windowCount = 3;

const Dashboard = () => {
  const { tab } = useContext(AppContext);
  const location = useLocation();
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
      title: `Dashboard ${location.pathname}`,
      path: location.pathname
    })
  }, [])
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
    <div style={{ height: '100%', width: '100%' }}>
      <Navbar>
        <Navbar.Group>
          <Navbar.Heading>
            <h4 className={Classes.HEADING} style={{ margin: 0 }}>
              <Icon icon="document" style={{ verticalAlign: 'middle', marginRight: 8 }} />
              <EditableText selectAllOnFocus />
            </h4>
          </Navbar.Heading>
        </Navbar.Group>
        <Navbar.Group align="right">
          <Button icon="grid-view" onClick={autoArrange} text="Re-arrange" />
          <Navbar.Divider />
          <Button icon="insert" onClick={addNewWindow} text="Add New Window" />
        </Navbar.Group>
      </Navbar>
      <Mosaic
        renderTile={(count, path) => (
          <MosaicWindow
            title={`Window ${count}`}
            createNode={createNode}
            path={path}>
            <div>Bijon</div>
          </MosaicWindow>
        )}
        onChange={currentNode => { setCurrentNode(currentNode) }}
        value={currentNode} />
    </div>
  )
}

export default Dashboard;