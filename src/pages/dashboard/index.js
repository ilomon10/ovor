import moment from 'moment';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
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
import { dropRight } from 'components/helper';
import { TabContext } from "components/tabSystem";
import Widget from 'components/widget';
import { FeathersContext } from 'components/feathers';
import BSON from 'bson-objectid';
import DashboardContext from 'components/hocs/dashboard';

const Dashboard = () => {
  const tab = useContext(TabContext);
  const feathers = useContext(FeathersContext);
  const location = useLocation();
  const params = useParams();
  const [watchMode, setWatchMode] = useState('Range');
  const [dashboardTitle, setDashboardTitle] = useState("");
  const [widgets, setWidgets] = useState([]);
  const [timeRange, setTimeRange] = useState([moment().toDate(), moment().toDate()]);
  const [currentNode, setCurrentNode] = useState(null);
  useEffect(() => {
    feathers.dashboards().get(params.id).then(e => {
      console.log(e);
      setDashboardTitle(e.title);
      setWidgets([...e.widgets]);
      if (e.nodes) setCurrentNode(e.nodes);
    }).catch(e => {
      console.log(e);
    })
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (dashboardTitle !== '') {
      tab.setCurrentTabState({
        title: dashboardTitle,
        path: location.pathname
      })
    }
  }, [dashboardTitle]); // eslint-disable-line react-hooks/exhaustive-deps
  const updateCurrentNodeToDB = useCallback((currentNode) => {
    feathers.dashboards().patch(params.id, { nodes: currentNode });
    setCurrentNode(currentNode);
  }, [feathers]);
  const autoArrange = () => {
    const leaves = getLeaves(currentNode);
    updateCurrentNodeToDB(createBalancedTreeFromLeaves(leaves));
  }
  const createNode = useCallback(async () => {
    const _id = BSON.generate();
    const dashboard = await feathers.dashboards().patch(params.id, {
      $push: { widgets: { _id, title: 'New Widget', type: null } }
    });
    console.log(_id);
    setWidgets([...dashboard.widgets]);
    return _id.toString();
  }, [feathers, params.id]);
  const addNewWindow = useCallback(async () => {
    let curNode = currentNode;
    if (currentNode !== null && typeof curNode === 'object') curNode = { ...currentNode };
    if (curNode && currentNode !== null) {
      const path = getPathToCorner(curNode, Corner.TOP_RIGHT);
      const parent = getNodeAtPath(curNode, dropRight(path));
      const destination = getNodeAtPath(curNode, path);
      const direction = parent ? getOtherDirection(parent.direction) : 'row';
      let first;
      let second;
      if (direction === 'row') {
        first = destination;
        second = await createNode();
      } else {
        first = await createNode();
        second = destination;
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
    } else curNode = await createNode();
    console.log('add', curNode);
    updateCurrentNodeToDB(curNode);
  }, [createNode, currentNode]); // eslint-disable-line react-hooks/exhaustive-deps

  const removeWidget = useCallback(async (id) => {
    let { widgets } = await feathers.dashboards().patch(params.id, { $pull: { widgets: { _id: id } } }, { safe: true });
    setWidgets([...widgets]);
  }, [feathers, widgets, params.id]);
  const getWidget = useCallback((id) => {
    return widgets.find(v => v._id === id);
  })
  return (
    <DashboardContext.Provider value={{ removeWidget, getWidget }}>
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
                  formatDate={date => moment(date).format('DD-MMM \'YY')}
                  parseDate={str => moment(str, 'DD-MM \'YY')}
                  onChange={v => setTimeRange([v, timeRange[1]])}
                  value={timeRange[0]} inputProps={{ size: 6 }} />
                <span className={Classes.INPUT}>to</span>
                <DateInput
                  minDate={moment(timeRange[0]).toDate()}
                  formatDate={date => moment(date).format('DD-MMM \'YY')}
                  parseDate={str => moment(str, 'DD-MM \'YY')}
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
              const widget = widgets.find(v => v._id === id);
              return (<Widget
                path={path}
                tileId={widget._id}
                title={widget.title}
                type={widget.type}
                series={widget.series}
                options={widget.options} />)
            }}
            zeroStateView={<MosaicZeroState createNode={createNode} />}
            onChange={currentNode => {
              console.log('change', currentNode);
              updateCurrentNodeToDB(currentNode);
            }}
            value={currentNode} />
        </div>
      </div>
    </DashboardContext.Provider>
  )
}

export default Dashboard;