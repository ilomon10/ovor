import moment from 'moment';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
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
import { Navbar, Classes, Button, EditableText, ControlGroup, HTMLSelect } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { dropRight } from 'components/helper';
import Widget from 'components/widget';
import { FeathersContext } from 'components/feathers';
import BSON from 'bson-objectid';
import DashboardContext from 'components/hocs/dashboard';
import { Helmet } from 'react-helmet';
import ErrorBoundary from 'components/ErrorBoundary';

const Dashboard = () => {
  const feathers = useContext(FeathersContext);
  const params = useParams();
  const history = useHistory();
  const [watchMode, setWatchMode] = useState('Live');
  const [dashboardTitle, setDashboardTitle] = useState("");
  const [widgets, setWidgets] = useState([]);
  const [timeRange, setTimeRange] = useState([moment().startOf('day').toDate(), moment().endOf('day').toDate()]);
  const [currentNode, setCurrentNode] = useState(null);
  useEffect(() => {
    feathers.dashboards.get(params.id).then(e => {
      setDashboardTitle(e.title);
      setWidgets([...e.widgets]);
      if (e.nodes) setCurrentNode(e.nodes);
    }).catch(e => {
      console.error(e);
    })
    const onDashboardPatched = (e) => {
      setWidgets([...e.widgets]);
      setCurrentNode(e.nodes);
    }
    feathers.dashboards.on('patched', onDashboardPatched);
    return () => {
      feathers.dashboards.removeListener('patched', onDashboardPatched);
    }
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const updateCurrentNodeToDB = useCallback((currentNode) => {
    feathers.dashboards.patch(params.id, { nodes: currentNode });
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const autoArrange = () => {
    const leaves = getLeaves(currentNode);
    updateCurrentNodeToDB(createBalancedTreeFromLeaves(leaves));
  }
  const createNode = useCallback(async () => {
    const _id = BSON.generate();
    await feathers.dashboards.patch(params.id, {
      $push: { widgets: { _id, title: 'New Widget', type: 'empty' } }
    });
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
    updateCurrentNodeToDB(curNode);
  }, [createNode, currentNode]); // eslint-disable-line react-hooks/exhaustive-deps

  const removeWidget = useCallback(async (removeNodeFirst, id) => {
    removeNodeFirst();
    await feathers.dashboards.patch(params.id, { $pull: { widgets: { _id: id } } }, { safe: true });
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const getWidget = useCallback((id) => {
    return widgets.find(v => v._id === id);
  }, [widgets]);
  const getDashboardId = useCallback(() => {
    return params.id;
  }, [params.id]);
  return (
    <>
      <Helmet>
        <title>{dashboardTitle} - Dashboard | Ovor</title>
        <meta name="description" content="Dashboard view" />
      </Helmet>
      <DashboardContext.Provider value={{ removeWidget, getWidget, getId: getDashboardId }}>
        <div className="flex flex--col" style={{ height: '100%', width: '100%' }}>
          <Navbar className="flex flex-shrink-0">
            <Navbar.Group className="flex-grow" style={{ width: 0 }}>
              <Button icon="chevron-left" onClick={() => { history.goBack() }} />
              <Navbar.Divider />
              <Navbar.Heading style={{ width: '100%', paddingRight: 15 }}>
                <h4 className={`${Classes.HEADING} flex flex--i-center`} style={{ margin: 0 }}>
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
                    onChange={v => setTimeRange([moment(v).startOf('day').toDate(), timeRange[1]])}
                    value={timeRange[0]} inputProps={{ size: 6 }} />
                  <span className={Classes.INPUT}>to</span>
                  <DateInput
                    minDate={moment(timeRange[0]).toDate()}
                    formatDate={date => moment(date).format('DD-MMM \'YY')}
                    parseDate={str => moment(str, 'DD-MM \'YY')}
                    onChange={v => setTimeRange([timeRange[0], moment(v).endOf('day').toDate()])}
                    value={timeRange[1]} inputProps={{ size: 6 }} />
                </>}
                <HTMLSelect options={['Range', 'Live']} value={watchMode} onChange={e => setWatchMode(e.target.value)} />
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
                if (typeof widget === 'undefined') return;
                return (
                  <ErrorBoundary>
                    <Widget
                      path={path}
                      tileId={widget._id}
                      title={widget.title}
                      type={widget.type}
                      series={widget.series}
                      options={widget.options}
                      timeRange={watchMode === 'Live' ? null : timeRange} />
                  </ErrorBoundary>
                )
              }}
              zeroStateView={<MosaicZeroState createNode={createNode} />}
              onChange={currentNode => {
                updateCurrentNodeToDB(currentNode);
              }}
              value={currentNode} />
          </div>
        </div>
      </DashboardContext.Provider>
    </>
  )
}

export default Dashboard;