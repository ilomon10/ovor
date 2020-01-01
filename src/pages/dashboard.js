import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import { AppContext } from '../App';

const Dashboard = () => {
  const { tab } = useContext(AppContext);
  const location = useLocation();
  const [currentNode, setCurrentNode] = useState({
    direction: 'row',
    first: {
      direction: 'column',
      first: 1,
      second: 4,
    },
    second: {
      direction: 'column',
      first: 2,
      second: 3,
    },
    splitPercentage: 50
  })
  useEffect(() => {
    tab.setCurrentTabState({
      title: 'Dashboard',
      path: location.pathname
    })
  }, [])
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Mosaic
        renderTile={(count, path) => (
          <MosaicWindow
            title={`Window ${count}`}
            path={path}>
            <div>Bijon {count}</div>
          </MosaicWindow>
        )}
        onChange={currentNode => { setCurrentNode(currentNode) }}
        value={currentNode}
        className="mosaic-blueprint-theme" />
    </div>
  )
}

export default Dashboard;