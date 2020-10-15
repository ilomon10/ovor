import moment from 'moment';
import React, { useEffect, useContext, useState, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Colors, Classes, Navbar, EditableText, Card, H4, HTMLSelect, H5, Button, ResizeSensor, NavbarDivider, Dialog, Text, NonIdealState } from '@blueprintjs/core';
import { Helmet } from 'react-helmet';

import Table from 'components/exp.table';
import BaseTimeseries from 'components/widgets/baseTimeseries';
import BaseBarChart from 'components/widgets/baseBarChart';
import { getRandomData } from 'components/helper';
import Wrapper from 'components/wrapper';
import { FeathersContext } from 'components/feathers';
import InputCopy from 'components/inputCopy';
import { Flex, Box } from 'components/utility/grid';
import { container } from 'components/utility/constants';

import DeleteDevice from './deleteDevice';
import ConfigFields from './configFields';

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
      stroke: {
        // show: false,
        width: 1
      },
      markers: {
        show: true,
        size: 5
      },
      chart: {
        sparkline: {
          enabled: true,
        },
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

const dateRange = {
  'day': 1,
  '3 day': 3,
  'week': 7,
  'month': 30
}

const Device = () => {
  const feathers = useContext(FeathersContext);
  const params = useParams();
  const history = useHistory();
  const [isDialogOpen, setIsDialogOpen] = useState({
    delete: false,
    config: false
  });
  const [timeRange, setTimeRange] = useState([
    moment().startOf('day').toDate(),
    moment().endOf('day').toDate()
  ]);
  const [device, setDevice] = useState({
    _id: '',
    name: '',
    key: '',
    fields: [],
    pinned: []
  });
  const [data, setData] = useState([]);
  const transformData = useCallback((d, type) => {
    const fields = device.fields.map(field => {
      if (type === 'chart') {
        if (field.type === 'boolean')
          if (d.data[field.name])
            return 1;
          else
            return 0;
      }

      if (field.type === 'date')
        return moment(d.createdAt).format('DD MMMM YYYY, h:mm:ss a');

      if (typeof d.data[field.name] === 'undefined') return '';

      return String(d.data[field.name]);
    });
    return ([...fields]);
  }, [device.fields]);

  const [contentHeight, setContentHeight] = useState(278);

  const changeTimeRange = useCallback(({ target }) => {
    const now = moment();
    const past = moment().subtract(dateRange[target.value], 'days');
    setTimeRange([
      past.startOf('day').toDate(),
      now.endOf('day').toDate()
    ])
  }, []);

  // Component Did Mount
  useEffect(() => {
    const fetch = async () => {
      try {
        const device = await feathers.devices.get(params.id);
        await setDevice({ ...device });
        const data = await feathers.dataLake.find({
          query: {
            $limit: 10000,
            deviceId: params.id,
            $select: ['data', 'createdAt'],
            $sort: {
              createdAt: -1
            },
            createdAt: {
              $gte: moment(timeRange[0]).toISOString(),
              $lte: moment(timeRange[1]).toISOString()
            }
          }
        })
        setData([...data.data]);
      } catch (e) {
        console.error(e);
      }
    }
    fetch();

    const onDataCreated = (e) => { setData(d => [...d, e]) }
    feathers.dataLake.on('created', onDataCreated);
    return () => {
      feathers.dataLake.removeListener('created', onDataCreated);
    }
  }, [params.id, timeRange]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <Helmet>
        <title>{device.name} - Device | Ovor</title>
        <meta name="description" content="Device overview" />
      </Helmet>
      <div className="flex flex--col" style={{ height: "100%" }}>
        <Navbar className="flex-shrink-0">
          <Box maxWidth={[container.sm, container.sm, container.md, container.xl]} mx="auto">
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
                <div className={`${Classes.HEADING} ${Classes.MONOSPACE_TEXT}`}
                  style={{ margin: 0 }}>{device._id}</div>
              </div>
              <div style={{ marginLeft: 16 }}>
                <div className={Classes.TEXT_SMALL} style={{ color: Colors.GRAY3 }}>KEY</div>
              </div>
              <div style={{ marginLeft: 8 }}>
                <InputCopy size="24" value={`${device.key}`} />
              </div>
              <NavbarDivider />
              <Button icon="data-lineage" onClick={() => history.push(`/rete/${device.reteId}`, { device })} />
            </Navbar.Group>
          </Box>
        </Navbar>
        <div className="flex-grow" style={{ backgroundColor: Colors.LIGHT_GRAY5, position: 'relative' }}>
          <ResizeSensor onResize={(entries) => {
            entries.forEach(e => setContentHeight(e.contentRect.height));
          }}>
            <Wrapper style={{ overflowY: 'auto' }}>
              <Box py={3} maxWidth={[container.sm, container.sm, container.md, container.lg]} mx="auto">
                <Box px={3} mb={3}>
                  <Card style={{ padding: 0 }}>
                    <div className="flex" style={{ padding: "16px 16px 0 16px" }}>
                      <H4 className="flex-grow" style={{ margin: 0 }}>Recent Activity</H4>
                      <div>
                        <span>last </span>
                        <HTMLSelect options={Object.keys(dateRange)} />
                      </div>
                    </div>
                    <div style={{ height: 127 }}>
                      <BaseBarChart options={dummy.incoming.options} series={dummy.incoming.series} />
                    </div>
                  </Card>
                </Box>
                <Box px={3}>
                  <Flex alignItems="center" mb={2}>
                    <Box flexGrow={1}>
                      <h5 style={{ margin: 0 }} className={Classes.HEADING}>Pinned fields</h5>
                    </Box>
                    <Box flexShrink={0}>
                      <Button small minimal text="Configure fields"
                        onClick={() => { setIsDialogOpen(s => ({ ...s, config: true })); }} />
                      <Dialog
                        title="Configure Fields"
                        isOpen={isDialogOpen['config']}
                        onClose={() => { setIsDialogOpen(s => ({ ...s, config: false })); }}>
                        <ConfigFields data={device} onClose={() => { setIsDialogOpen(s => ({ ...s, config: false })); }} />
                      </Dialog>
                    </Box>
                  </Flex>
                  <Flex mx={-1} flexWrap="wrap">
                    {device.fields.filter(field => field.name !== 'timestamp').map((v, i) => (
                      <Box key={v._id} px={1} mb={3} 
                        width={`${100 / (device.fields.length - 1 > 3 ? 3 : device.fields.length - 1)}%`}>
                        <Card style={{ padding: 0 }}>
                          <H5 style={{ padding: "12px 12px 0 12px", margin: 0 }}><Text ellipsize>{v.name} ({v.type})</Text></H5>
                          <div style={{ height: 127 }}>
                            <BaseTimeseries options={{
                              ...dummy.mini.options,
                              stroke: {
                                ...dummy.mini.options.stroke,
                                curve: (v.type === 'boolean') ? 'stepline' : 'smooth'
                              }
                            }} series={[{
                              name: `${v.name} (${v.type})`,
                              data: [...data.map(d => {
                                const dt = transformData(d, 'chart');
                                return ([dt[0], dt[i + 1]]);
                              })]
                            }]} />
                          </div>
                        </Card>
                      </Box>
                    ))}
                  </Flex>
                </Box>
                <Box px={3} mb={3}>
                  <Card className="flex flex--col" style={{ height: contentHeight - 36 }}>
                    <div className="flex-shrink-0 flex">
                      <H4 className="flex-grow" style={{ margin: 0 }}>Recent Incoming Data</H4>
                      <div>
                        <span>last </span>
                        <HTMLSelect options={Object.keys(dateRange)}
                          onChange={changeTimeRange} />
                      </div>
                    </div>
                    <div className="flex-grow" style={{ position: "relative" }}>
                      <Wrapper>
                        {data.lenght > 0 &&
                          <div style={{ overflowY: 'auto', height: '100%' }}>
                            <Table interactive
                              options={{ labels: [...device.fields.map((e) => e.name)] }}
                              series={data.map(d => transformData(d))} />
                          </div>}
                        {data.length === 0 &&
                          <NonIdealState
                            icon="array"
                            title="Empty"
                            description={<>
                              <p>Currently there is no data to show</p>
                            </>} />}
                      </Wrapper>
                    </div>
                  </Card>
                </Box>
                <Box mb={3} px={3}>
                  <Flex alignItems="center">
                    <Box flexGrow={1}>
                      <h4 className={Classes.HEADING}>Delete this device</h4>
                      <p>Once you delete a device, there is no going back. Please be certain</p>
                    </Box>
                    <Box flexShrink={0} >
                      <Button text="Delete this device" intent="danger" onClick={() => setIsDialogOpen(s => ({ ...s, delete: true }))} />
                    </Box>
                  </Flex>
                </Box>
              </Box>
              <Dialog usePortal={true}
                title="Delete device"
                isOpen={isDialogOpen['delete']}
                onClose={() => { setIsDialogOpen(s => ({ ...s, delete: false })); }}>
                <DeleteDevice data={device} onClose={() => { setIsDialogOpen(s => ({ ...s, delete: false })); }} onDeleted={() => history.goBack()} />
              </Dialog>
            </Wrapper>
          </ResizeSensor>
        </div>
      </div>
    </>
  )
}

export default Device;