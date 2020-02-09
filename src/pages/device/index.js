import React, { useEffect, useContext, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Colors, Classes, Navbar, Icon, EditableText, Card, H4, HTMLSelect, H5, InputGroup, ControlGroup, Button, ResizeSensor } from '@blueprintjs/core';
import { TabContext } from '../../components/tabSystem';
import Table from '../../components/exp.table';
import PlotLine from '../../components/widgets/plot.line';
import PlotBar from '../../components/widgets/plot.bar';
import { getRandomData } from '../../components/helper'
import moment from 'moment';
import Wrapper from '../../components/wrapper';
import Container from '../../components/container';

const data = {
  incoming: {
    options: {
      legend: {
        show: false
      },
      chart: {
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
    },
    series: [{
      name: "data",
      data: getRandomData(10, true)
    }]
  },
  table: {
    options: {
      labels: ["Time", "Temperature", "Humidity", "Voltage", "Current"]
    },
    series: getRandomData(25, true).map((v) => ([moment(v[0]).format('DD MMMM YYYY, h:mm:ss a'), (v[1] * 40).toFixed(2), (v[1] * 70).toFixed(2), (v[1] * 24).toFixed(2), (v[1] * 1).toFixed(2)]))
  }
}

const Device = () => {
  const tab = useContext(TabContext);
  const location = useLocation();
  const [deviceTitle, setsDeviceTitle] = useState('New Device')
  const eventIdRef = useRef();
  const [contentHeight, setContentHeight] = useState(278);
  useEffect(() => {
    tab.setCurrentTabState({
      title: deviceTitle,
      path: location.pathname
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const copyToClipboard = useCallback(
    (e) => {
      eventIdRef.current.select();
      document.execCommand('copy');
      e.target.focus();
    },
    [eventIdRef],
  )
  return (
    <div className="flex flex--col" style={{ height: "100%" }}>
      <Navbar className="flex-shrink-0">
        <div style={{ maxWidth: 1024, margin: '0 auto', height: '100%' }}>
          <Navbar.Group>
            <h4 className={`${Classes.HEADING} flex flex--i-center`} style={{ margin: 0 }}>
              <Icon className='flex-shrink-0' icon="stacked-chart" style={{ verticalAlign: 'middle', marginRight: 8 }} />
              <EditableText selectAllOnFocus value={deviceTitle} onChange={v => setsDeviceTitle(v)} />
            </h4>
          </Navbar.Group>
          <Navbar.Group align="right" style={{ textAlign: "right" }}>
            <div style={{ marginLeft: 16 }}>
              <div className={`${Classes.TEXT_SMALL}`} style={{ color: Colors.GRAY3 }}>IP ADDRESS</div>
              <div className={`${Classes.HEADING} ${Classes.MONOSPACE_TEXT}`} style={{ margin: 0 }}>192.168.43.{parseInt(Math.random() * 255)}</div>
            </div>
            <div style={{ marginLeft: 16 }}>
              <div className={Classes.TEXT_SMALL} style={{ color: Colors.GRAY3 }}>IMEI</div>
              <div className={`${Classes.HEADING} ${Classes.MONOSPACE_TEXT}`} style={{ margin: 0 }}>{parseInt(Math.random() * 99999999999)}</div>
            </div>
            <div style={{ marginLeft: 16 }}>
              <div className={Classes.TEXT_SMALL} style={{ color: Colors.GRAY3 }}>DEVICE ID</div>
              <div className={`${Classes.HEADING} ${Classes.MONOSPACE_TEXT}`} style={{ margin: 0 }}>{parseInt(Math.random() * 99999)}</div>
            </div>
            <div style={{ marginLeft: 16 }}>
              <ControlGroup>
                <InputGroup readOnly defaultValue={`device-023`} inputRef={eventIdRef} size={10} />
                <Button icon="clipboard" onClick={copyToClipboard} />
              </ControlGroup>
            </div>
          </Navbar.Group>
        </div>
      </Navbar>
      <div className="flex-grow" style={{ backgroundColor: Colors.LIGHT_GRAY5, position: 'relative' }}>
        <ResizeSensor onResize={(entries) => {
          entries.map(e => setContentHeight(e.contentRect.height))
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
                  <PlotBar options={data.incoming.options} series={data.incoming.series} />
                </div>
              </Card>
              <div className="flex" style={{ marginBottom: 16 }}>
                <div style={{ width: `${100 / 4}%`, paddingRight: 12 }}>
                  <Card style={{ padding: 0 }}>
                    <H5 style={{ padding: "12px 12px 0 12px", margin: 0 }}>Temperature</H5>
                    <div style={{ height: 127 }}>
                      <PlotLine options={data.mini.options} series={data.mini.series} />
                    </div>
                  </Card>
                </div>
                <div style={{ width: `${100 / 4}%`, paddingRight: 12 }}>
                  <Card style={{ padding: 0 }}>
                    <H5 style={{ padding: "12px 12px 0 12px", margin: 0 }}>Humidity</H5>
                    <div style={{ height: 127 }}>
                      <PlotLine options={data.mini.options} series={data.mini.series} />
                    </div>
                  </Card>
                </div>
                <div style={{ width: `${100 / 4}%`, paddingRight: 12 }}>
                  <Card style={{ padding: 0 }}>
                    <H5 style={{ padding: "12px 12px 0 12px", margin: 0 }}>Voltage</H5>
                    <div style={{ height: 127 }}>
                      <PlotLine options={data.mini.options} series={data.mini.series} />
                    </div>
                  </Card>
                </div>
                <div style={{ width: `${100 / 4}%` }}>
                  <Card style={{ padding: 0 }}>
                    <H5 style={{ padding: "12px 12px 0 12px", margin: 0 }}>Current</H5>
                    <div style={{ height: 127 }}>
                      <PlotLine options={data.mini.options} series={data.mini.series} />
                    </div>
                  </Card>
                </div>
              </div>
              <Card className="flex flex--col" style={{ height: contentHeight - 36 }}>
                <div className="flex-shrink-0 flex">
                  <H4 className="flex-grow" style={{ margin: 0 }}>Recent Incoming Data</H4>
                  <div>
                    <span>last </span>
                    <HTMLSelect options={["day", "3 day", "week", "month"]} />
                  </div>
                </div>
                <div className="flex-grow" style={{position: "relative"}}>
                  <Wrapper>
                    <div style={{ overflowY: 'auto', height: '100%' }}>
                      <Table
                        interactive
                        options={data.table.options} series={data.table.series} />
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