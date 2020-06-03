import React, { useEffect, useContext, useState, useRef, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Colors, Classes, Navbar, EditableText, Card, H4, HTMLSelect, H5, InputGroup, ControlGroup, Button, ResizeSensor } from '@blueprintjs/core';
import Table from 'components/exp.table';
import BaseTimeseries from 'components/widgets/baseTimeseries';
import BaseBarChart from 'components/widgets/baseBarChart';
import { getRandomData } from 'components/helper';
import moment from 'moment';
import Wrapper from 'components/wrapper';
import Container from 'components/container';
import { FeathersContext } from 'components/feathers';

const dummy = {
  incoming: {
    options: {
      legend: {
        show: false
      },
      chart: {
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          columnWidth: '5%'
        },
        dataLabels: {
          position: 'top'
        }
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        show: false
      },
      markers: {
        size: 5
      },
      tooltip: {
        enabledOnSeries: [1]
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
        offsetY: -8,
        formatter: (v) => (v.toFixed(2)),
        style: {
          colors: [Colors.BLACK]
        }
      }
    },
    series: (() => {
      const d = getRandomData(25, true);
      return ([{
        name: 'Data used',
        type: 'column',
        data: d
      }, {
        name: 'Data used',
        type: 'line',
        data: d
      }])
    })()
  },
  mini: {
    options: {
      chart: {
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      xaxis: {
        show: false,
        type: 'datetime'
      },
      yaxis: {
        show: false
      }
    }
  }
}

const Device = () => {
  const feathers = useContext(FeathersContext);
  const params = useParams();
  const history = useHistory();
  const [device, setDevice] = useState({
    _id: '',
    name: '',
    fields: []
  });
  const [data, setData] = useState([]);
  const transformData = (d) => 
    [moment(d.createdAt).format('DD MMMM YYYY, h:mm:ss a'), ...d.data];
  const eventIdRef = useRef();
  const [contentHeight, setContentHeight] = useState(278);

  // Component Did Mount
  useEffect(() => {
    feathers.devices().get(params.id)
      .then((e) => {
        setDevice({ ...e });
      })
      .catch((e) => console.log(e));
    feathers.dataLake().find({
      query: { deviceId: params.id, $select: ['data', 'createdAt'] }
    })
      .then(e => { setData([...e.data.map(transformData)]); })
      .catch(e => console.log(e));

    const onDataCreated = (e) => { setData(d => [...d, transformData(e)]) }
    feathers.dataLake().on('created', onDataCreated);
    return () => {
      feathers.dataLake().removeListener('created', onDataCreated);
    }
  }, [params.id]) // eslint-disable-line react-hooks/exhaustive-deps
  const copyToClipboard = useCallback((e) => {
    let eventIdRefCurrent = eventIdRef.current;
    eventIdRefCurrent.select();
    document.execCommand('copy');
    e.target.focus();
  }, [eventIdRef]);
  return (
    <div className="flex flex--col" style={{ height: "100%" }}>
      <Navbar className="flex-shrink-0">
        <div style={{ maxWidth: 1024, margin: '0 auto', height: '100%' }}>
          <Navbar.Group>
            <Button icon="chevron-left" onClick={() => { history.goBack() }} />
            <Navbar.Divider />
            <h4 className={`${Classes.HEADING} flex flex--i-center`}
              style={{ margin: 0 }}>
              <EditableText selectAllOnFocus value={device.name}
                onChange={v => setDevice({ ...device, name: v })} />
            </h4>
          </Navbar.Group>
          <Navbar.Group align="right">
            <div style={{ marginLeft: 16 }}>
              <div className={`${Classes.TEXT_SMALL}`} style={{ color: Colors.GRAY3 }}>IP ADDRESS</div>
              <div className={`${Classes.HEADING} ${Classes.MONOSPACE_TEXT}`}
                style={{ margin: 0 }}>192.168.43.{Math.floor(Math.random() * 255)}</div>
            </div>
            <div style={{ marginLeft: 16 }}>
              <div className={Classes.TEXT_SMALL} style={{ color: Colors.GRAY3 }}>IMEI</div>
              <div className={`${Classes.HEADING} ${Classes.MONOSPACE_TEXT}`}
                style={{ margin: 0 }}>{Math.floor(Math.random() * 99999999999)}</div>
            </div>
            <div style={{ marginLeft: 16 }}>
              <div className={Classes.TEXT_SMALL} style={{ color: Colors.GRAY3 }}>DEVICE ID</div>
            </div>
            <div style={{ marginLeft: 8 }}>
              <ControlGroup>
                <InputGroup size="24" readOnly defaultValue={device._id} inputRef={eventIdRef} />
                <Button icon="clipboard" onClick={copyToClipboard} />
              </ControlGroup>
            </div>
          </Navbar.Group>
        </div>
      </Navbar>
      <div className="flex-grow" style={{ backgroundColor: Colors.LIGHT_GRAY5, position: 'relative' }}>
        <ResizeSensor onResize={(entries) => {
          entries.forEach(e => setContentHeight(e.contentRect.height));
        }}>
          <Wrapper style={{ overflowY: 'auto' }}>
            <Container style={{ paddingTop: 12, paddingBottom: 24 }}>
              <Card style={{ marginBottom: 12, padding: 0 }}>
                <div className="flex" style={{ padding: "16px 16px 0 16px" }}>
                  <H4 className="flex-grow" style={{ margin: 0 }}>Recent Activity</H4>
                  <div>
                    <span>last </span>
                    <HTMLSelect options={["day", "3 day", "week", "month"]} />
                  </div>
                </div>
                <div style={{ height: 127 }}>
                  <BaseBarChart options={dummy.incoming.options} series={dummy.incoming.series} />
                </div>
              </Card>
              <div className="flex" style={{ marginBottom: 16, marginLeft: -6, marginRight: -6 }}>
                {device.fields.map((v, i) => (
                  <div key={v._id} style={{ width: `${100 / device.fields.length}%`, paddingRight: 6, paddingLeft: 6 }}>
                    <Card style={{ padding: 0 }}>
                      <H5 style={{ padding: "12px 12px 0 12px", margin: 0 }}>{v.name}</H5>
                      <div style={{ height: 127 }}>
                        <BaseTimeseries options={dummy.mini.options} series={[{
                          name: v.name,
                          data: [...data.map(v => [v[0], v[i + 1]])]
                        }]} />
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
              <Card className="flex flex--col" style={{ height: contentHeight - 36 }}>
                <div className="flex-shrink-0 flex">
                  <H4 className="flex-grow" style={{ margin: 0 }}>Recent Incoming Data</H4>
                  <div>
                    <span>last </span>
                    <HTMLSelect options={["day", "3 day", "week", "month"]} />
                  </div>
                </div>
                <div className="flex-grow" style={{ position: "relative" }}>
                  <Wrapper>
                    <div style={{ overflowY: 'auto', height: '100%' }}>
                      <Table interactive
                        options={{ labels: ['timestamp', ...device.fields.map((e) => e.name)] }}
                        series={data.slice().reverse()} />
                    </div>
                  </Wrapper>
                </div>
              </Card>
            </Container>
          </Wrapper>
        </ResizeSensor>
      </div>
    </div >
  )
}

export default Device;