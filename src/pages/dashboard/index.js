import moment from 'moment';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar, Classes, Button, EditableText, ControlGroup, HTMLSelect, AnchorButton } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import _debounce from "lodash.debounce";

import Widget from 'components/widget';
import { FeathersContext } from 'components/feathers';
import { v4 as UUIDV4 } from "uuid";
import DashboardContext from 'components/hocs/dashboard';
import { Helmet } from 'react-helmet';
import GridLayout from 'pages/embed/dashboard/GridLayout';
import { Box } from 'components/utility/grid';
import { usePrevious } from 'components/helper';

const Dashboard = () => {
  const feathers = useContext(FeathersContext);
  const params = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [watchMode, setWatchMode] = useState('Live');
  const [dashboardTitle, setDashboardTitle] = useState("");

  const [widgets, setWidgets] = useState([]);
  const prevWidgets = usePrevious(widgets);

  const [timeRange, setTimeRange] = useState([moment().startOf('day').toDate(), moment().endOf('day').toDate()]);

  const [layouts, setLayouts] = useState({});

  useEffect(() => {
    feathers.dashboards.get(params.id).then(e => {
      setDashboardTitle(e.title);
      setWidgets([...e.widgets]);
      if (e.nodes) setLayouts(e.nodes);
      setIsLoaded(true);
    }).catch(e => {
      console.error(e);
    });
    // feathers.dashboards.on('patched', onDashboardPatched);
    return () => {
      // feathers.dashboards.removeListener('patched', onDashboardPatched);
    }
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateToDB = useCallback(_debounce(({ widgets, layouts }) => {
    if (!isLoaded) {
      setIsSaving(false);
      return;
    }

    const patch = {
      nodes: layouts
    }

    if (widgets !== prevWidgets)
      patch.widgets = widgets;

    feathers.dashboards.patch(params.id, patch).then(() => {
      setIsSaving(false);
    });
  }, 2000), [params.id, isLoaded]);

  const updateCurrentNode = useCallback((widgets, layouts) => {
    setIsSaving(true);
    updateToDB({ widgets, layouts });
  }, [updateToDB]); // eslint-disable-line react-hooks/exhaustive-deps

  const addNewWindow = useCallback(async () => {
    const _id = UUIDV4();
    const submit = [
      ...widgets,
      {
        _id,
        title: 'New Widget',
        type: 'empty',
        options: {},
        series: []
      }
    ];
    setWidgets(submit);
    setIsSaving(true);
  }, [widgets, updateToDB]); // eslint-disable-line react-hooks/exhaustive-deps

  const removeWidget = useCallback(async (_id) => {
    const submit = widgets.filter(widget => widget._id !== _id);
    setWidgets(submit);
    setIsSaving(true);
  }, [updateToDB, widgets]); // eslint-disable-line react-hooks/exhaustive-deps

  const getWidget = useCallback((id) => {
    return widgets.find(v => v._id === id);
  }, [widgets]);
  const getDashboardId = useCallback(() => {
    return params.id;
  }, [params.id]);
  const patchWidget = useCallback((id, props) => {
    let widget = widgets.find(w => w._id === id);
    if (typeof props === "function")
      widget = props(widget);
    setWidgets(
      widgets.map((w) => {
        if (w._id !== widget._id) return w;
        return widget;
      })
    )
    return widget;
  }, [widgets]);
  return (
    <>
      <Helmet>
        <title>{dashboardTitle} - Dashboard | Ovor</title>
        <meta name="description" content="Dashboard view" />
      </Helmet>
      <DashboardContext.Provider value={{ removeWidget, getWidget, getId: getDashboardId, patchWidget }}>
        <div className="flex flex--col" style={{ height: '100%', width: '100%' }}>
          <Navbar className="flex flex-shrink-0">
            <Navbar.Group className="flex-grow" style={{ width: 0 }}>
              <Link
                to="/dashboards"
                title="Go Back"
                icon="chevron-left"
                component={React.forwardRef(({ navigate, ...props }, ref) => (
                  <AnchorButton ref={ref} {...props} />
                ))}
              />
              <Navbar.Divider />
              <Navbar.Heading style={{ width: '100%', paddingRight: 15 }}>
                <h4 className={`${Classes.HEADING} flex flex--i-center`} style={{ margin: 0 }}>
                  <EditableText selectAllOnFocus value={dashboardTitle} onChange={v => setDashboardTitle(v)} />
                </h4>
              </Navbar.Heading>
            </Navbar.Group>
            <Navbar.Group className="flex-shrink-0">
              <Button
                minimal
                title={isSaving ? "Saving" : "Saved"}
                onClick={() => updateCurrentNode(layouts)}
                icon="tick"
                aria-readonly="true"
                loading={isSaving}
              />
              <Navbar.Divider />
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
              <Button icon="insert" onClick={addNewWindow} text="Add New Window" />
            </Navbar.Group>
          </Navbar>
          <Box flexGrow={1} style={{ position: "relative" }}>
            <GridLayout
              layouts={layouts}
              style={{ height: "100%" }}
              onLayoutChange={(_, all) => {
                if (JSON.stringify(all) === JSON.stringify(layouts)) return;
                updateCurrentNode(widgets, all);
                setLayouts(state => ({
                  ...state.layouts,
                  ...all
                }))
              }}
            >
              {widgets.map(({
                _id,
                title,
                type,
                series,
                options
              }) => (
                <Widget
                  key={_id}
                  tileId={_id}
                  title={title}
                  type={type}
                  series={series}
                  options={options}
                  timeRange={watchMode === 'Live' ? null : timeRange}
                />
              ))}
            </GridLayout>
          </Box>
        </div>
      </DashboardContext.Provider>
    </>
  )
}

export default Dashboard;