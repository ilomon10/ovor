import moment from 'moment';
import React, { useEffect, useContext, useState, useCallback } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import {
  Colors, Classes, Navbar, EditableText, Card, H4, HTMLSelect, H5,
  Button, ResizeSensor, Dialog, Text, NonIdealState, Checkbox, Divider,
  AnchorButton,
  Tag
} from '@blueprintjs/core';
import { Helmet } from 'react-helmet';

import Timeseries from 'components/widgets/timeseries';
import Wrapper from 'components/wrapper';
import { FeathersContext } from 'components/feathers';
import InputCopy from 'components/inputCopy';
import { useMedia } from 'components/helper';
import { Flex, Box } from 'components/utility/grid';
import { container } from 'components/utility/constants';

import DeleteDevice from './deleteDevice';
import DeleteData from './deleteData';
import ConfigFields from './configFields';
import IncomingChart from './IncomingChart';
import Table from './Table';

const dummy = {
  mini: {
    options: {
      stroke: { width: 2 },
      chart: {
        sparkline: { enabled: true, },
        zoom: { enabled: false },
        toolbar: { show: false }
      },
      xaxis: {
        show: false,
        type: 'datetime'
      },
      yaxis: { show: false }
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
  const columnCount = useMedia(
    container.map((v) => `(min-width: ${v})`).reverse(),
    [5, 4, 3, 2], 1
  )
  const [isDialogOpen, setIsDialogOpen] = useState({
    delete_data: false,
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
  const [contentHeight, setContentHeight] = useState(278);
  const [selectedDataIds, setSelectedDataIds] = useState([]);

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
        const device = await feathers.devices.get(params.id, {
          query: {
            $select: ["_id", "name", "hostname", "reteId", "fields", "key"]
          }
        });
        await setDevice({ ...device });
        const data = await feathers.dataLake.find({
          query: {
            $limit: 2000,
            deviceId: params.id,
            $select: ["_id", 'data', 'createdAt', 'collectedAt'],
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

    const onDataCreated = (e) => {
      const result = {
        _id: e._id,
        data: e.data,
        createdAt: e.createdAt,
        collectedAt: e.collectedAt
      }
      setData(d => [result, ...d]);
    }
    const onDevicePatched = (e) => {
      setDevice(e);
    }
    feathers.dataLake.on('created', onDataCreated);
    feathers.devices.on('patched', onDevicePatched);
    return () => {
      feathers.dataLake.removeListener('created', onDataCreated);
      feathers.devices.removeListener('patched', onDevicePatched);
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
              <Link
                to="/devices"
                icon="chevron-left"
                component={React.forwardRef(({ navigate, ...props }, ref) => (
                  <AnchorButton ref={ref} {...props} />
                ))}
              />
              <Navbar.Divider />
              <h4
                className={`${Classes.HEADING} flex flex--i-center`}
                style={{ margin: 0, maxWidth: columnCount < 2 ? 130 : "initial" }}
              >
                <EditableText
                  selectAllOnFocus
                  value={device.name}
                  onChange={v => setDevice({ ...device, name: v })}
                />
              </h4>
            </Navbar.Group>
            <Navbar.Group align="right">
              <Link
                to={{
                  pathname: `/rete/${device.reteId}`,
                  search: `?deviceId=${device._id}`
                }}
                outlined
                text="Rule"
                icon="data-lineage"
                component={React.forwardRef(({ navigate, ...props }, ref) => (
                  <AnchorButton ref={ref} {...props} />
                ))}
              />
            </Navbar.Group>
          </Box>
        </Navbar>
        <div className="flex-grow" style={{ backgroundColor: Colors.LIGHT_GRAY5, position: 'relative' }}>
          <ResizeSensor onResize={(entries) => {
            entries.forEach(e => setContentHeight(e.contentRect.height));
          }}>
            <Wrapper style={{ overflowY: 'auto' }}>
              <Box py={3} maxWidth={[container.sm, container.sm, container.md, container.lg]} mx="auto">
                <Box mx={-3}>
                  <Flex px={3} mb={3} flexDirection={columnCount < 2 ? "column" : "row"}>
                    <Box px={3} width={columnCount < 2 ? `100%` : `50%`}>
                      <Box mb={2}>
                        <div className={Classes.TEXT_SMALL} style={{ color: Colors.GRAY3 }}>DEVICE ID</div>
                        <InputCopy fill value={`${device._id}`} />
                      </Box>
                      <Box mb={2}>
                        <div className={Classes.TEXT_SMALL} style={{ color: Colors.GRAY3 }}>KEY</div>
                        <InputCopy fill value={`${device.key}`} />
                      </Box>
                    </Box>
                    <Box px={3} width={columnCount < 2 ? `100%` : `50%`}>
                      <Box mb={2}>
                        <div className={`${Classes.TEXT_SMALL}`} style={{ color: Colors.GRAY3 }}>LAST ADDRESS</div>
                        <Box lineHeight="30px" className={`${Classes.HEADING} ${Classes.MONOSPACE_TEXT}`}
                          style={{ margin: 0 }}>{device.hostname || "-.-.-.-"}</Box>
                      </Box>
                      <Box mb={2}>
                        <div className={`${Classes.TEXT_SMALL}`} style={{ color: Colors.GRAY3 }}>LAST LOCATION</div>
                        <Box lineHeight="30px" className={`${Classes.HEADING} ${Classes.MONOSPACE_TEXT}`}
                          style={{ margin: 0 }}>
                          <span>...</span>
                        </Box>
                      </Box>
                    </Box>
                  </Flex>
                </Box>
                <Box px={3} mb={3}>
                  <Card style={{ padding: 0 }}>
                    <div className="flex" style={{ padding: "16px 16px 0 16px" }}>
                      <H4 className="flex-grow" style={{ margin: 0 }}>Recent Latency</H4>
                      <div>
                        <span>last </span>
                        <HTMLSelect options={Object.keys(dateRange)} />
                      </div>
                    </div>
                    <IncomingChart style={{ height: 127 }} data={data} />
                  </Card>
                </Box>
                <Box px={3}>
                  <Flex alignItems="center" mb={2}>
                    <Box flexGrow={1}>
                      <h5 style={{ margin: 0 }} className={Classes.HEADING}>Fields</h5>
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
                        width={`${100 / ((device.fields.length - 1) % 2 === 0 ? 2 : 3)}%`}>
                        <Card style={{ padding: 0 }}>
                          <H5 style={{ padding: "6px 12px 0 12px", margin: 0 }}>
                            <Text ellipsize>{v.name} ({v.type})</Text>
                          </H5>
                          <div style={{ height: 64 }}>
                            <Timeseries
                              options={{
                                ...dummy.mini.options,
                                stroke: {
                                  ...dummy.mini.options.stroke,
                                  curve: (v.type === 'boolean') ? 'stepline' : 'smooth'
                                }
                              }}
                              series={[{
                                device: device._id,
                                field: v._id
                              }]} />
                          </div>
                        </Card>
                      </Box>
                    ))}
                  </Flex>
                </Box>
                <Box px={3} mb={3}>
                  <Card className="flex flex--col" style={{ height: contentHeight - 36 }}>
                    <Flex flexShrink={0}>
                      <Flex flexGrow={1} alignItems="center">
                        <H4 style={{ margin: 0 }}>Recent Incoming Data</H4>
                        <Box ml={2}>
                          <Tag round={true} minimal={true}>{data.length}</Tag>
                        </Box>
                      </Flex>
                      {selectedDataIds.length > 0 &&
                        (<>
                          <Box>
                            <Button
                              minimal
                              intent="danger"
                              text={(<Text>Delete {selectedDataIds.length} selected data</Text>)}
                              onClick={() => setIsDialogOpen(s => ({ ...s, "delete_data": true }))}
                            />
                          </Box>
                          <Divider />
                        </>)}
                      <Box pl={2}>
                        <span>last </span>
                        <HTMLSelect options={Object.keys(dateRange)}
                          onChange={changeTimeRange} />
                      </Box>
                    </Flex>
                    <div className="flex-grow" style={{ position: "relative" }}>
                      <Wrapper>
                        {data.length > 0 &&
                          <Table
                            columns={[
                              {
                                dataKey: "_id",
                                label: (
                                  <Checkbox
                                    style={{ marginBottom: 0 }}
                                    checked={selectedDataIds.length === data.length}
                                    indeterminate={selectedDataIds.length > 0 && selectedDataIds.length < data.length}
                                    onClick={(e) => {
                                      let value = e.target.checked;
                                      if (value) setSelectedDataIds([...data.map(d => d._id)]);
                                      else setSelectedDataIds([]);
                                    }}
                                  />
                                ),
                                width: 50,
                                cellRenderer: ({ rowData, cellData }) => (
                                  <Box px={2}>
                                    <Checkbox
                                      style={{ marginBottom: 0 }}
                                      checked={selectedDataIds.indexOf(rowData["_id"]) !== -1}
                                      onChange={(e) => {
                                        let value = e.target.checked;
                                        if (value) setSelectedDataIds(ids => [...ids, cellData]);
                                        else setSelectedDataIds(ids => [...ids.filter((id) => id !== cellData)]);
                                      }}
                                    />
                                  </Box>
                                )
                              },
                              ...device.fields.map(field => {
                                let result = {
                                  dataKey: `data.${field.name}`,
                                  label: field.name,
                                  width: 100
                                }
                                if (field.type === "date") {
                                  result.width = 200;
                                  result.cellRenderer = ({ cellData }) => (
                                    <Box px={2}>
                                      <Text ellipsize>{moment(cellData).calendar()}</Text>
                                    </Box>
                                  );
                                }

                                return result;
                              })]}
                            data={data}
                            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
                          />}
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
                title="Delete data"
                isOpen={isDialogOpen["delete_data"]}
                onClose={() => { setIsDialogOpen(s => ({ ...s, "delete_data": false })); }}>
                <DeleteData data={selectedDataIds} onClose={() => { setIsDialogOpen(s => ({ ...s, "delete_data": false })); }} onDeleted={() => history.go(0)} />
              </Dialog>
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