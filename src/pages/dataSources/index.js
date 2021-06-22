import React, { useState, useEffect, useContext, useCallback } from "react";
import Helmet from "react-helmet";
import moment from "moment";
import { useParams, Link } from "react-router-dom";
import {
  AnchorButton, Navbar, Classes, Colors,
  ResizeSensor, Button, Dialog,
  Card, H5, H4, Text, Checkbox, HTMLSelect,
  Tag
} from "@blueprintjs/core";
import { useMedia } from "components/helper";
import { Flex, Box } from "components/utility/grid";
import { container } from "components/utility/constants";
import { FeathersContext } from "components/feathers";
import Wrapper from 'components/wrapper';
import Timeseries from 'components/widgets/timeseries';

import ConfigFields from "./configFields";
import Table from "./Table";

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

const DataSource = () => {
  const feathers = useContext(FeathersContext);
  const params = useParams();
  const columnCount = useMedia(
    container.map((v) => `(min-width: ${v})`).reverse(),
    [5, 4, 3, 2], 1
  )

  const [isDialogOpen, setIsDialogOpen] = useState(null);

  const [dataSource, setDataSource] = useState({
    _id: "",
    name: "",
    fields: []
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

  const [timeRange, setTimeRange] = useState([
    moment().startOf("day").toDate(),
    moment().endOf("day").toDate(),
  ])

  // Component Did Mount
  useEffect(() => {
    const fetch = async () => {
      try {
        const dataSource = await feathers.dataSources.get(params.id, {
          query: {
            $select: ["_id", "name", "fields"]
          }
        });
        await setDataSource({ ...dataSource });
        const data = await feathers.dataLake.find({
          query: {
            $limit: 2000,
            dataSourceId: params.id,
            $select: ["_id", "data", "createdAt"],
            $sort: {
              createdAt: -1
            },
            createdAt: {
              $gte: moment(timeRange[0]).toISOString(),
              $lte: moment(timeRange[1]).toISOString()
            }
          }
        })
        console.log(data, dataSource);
        setData([...data.data]);
      } catch (err) {
        console.error(err);
      }
    }
    fetch();
  }, [params, timeRange]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <Helmet>
        <title>Coba - Ember | Ovor</title>
        <meta name="description" content="Ember overview" />
      </Helmet>
      <Flex flexDirection={"column"} height="100%">
        <Navbar>
          <Box maxWidth={[container.xl]} mx="auto">
            <Navbar.Group>
              <Link
                to="/ember"
                icon="chevron-left"
                component={React.forwardRef(({ navigate, ...props }, ref) => (
                  <AnchorButton ref={ref} {...props} />
                ))}
              />
              <Navbar.Divider />
              <h4
                style={{ margin: 0, maxWidth: columnCount < 2 ? 130 : 'initial' }}
                className={`${Classes.HEADING} flex flex--i-center`}
              >Coba</h4>
            </Navbar.Group>
          </Box>
        </Navbar>
        <div className="flex-grow" style={{ backgroundColor: Colors.LIGHT_GRAY5, position: 'relative' }}>
          <ResizeSensor onResize={(entries) => {
            entries.forEach(e => setContentHeight(e.contentRect.height));
          }}>
            <Wrapper style={{ overflowY: "auto" }}>
              <Box py={3} maxWidth={[container.sm, container.sm, container.md, container.lg]} mx="auto">
                <Box px={3}>
                  <Flex alignItems="center" mb={2}>
                    <Box flexGrow={1}>
                      <h5 style={{ margin: 0 }} className={Classes.HEADING}>Fields</h5>
                    </Box>
                    <Box flexShrink={0}>
                      <Button
                        small={true}
                        minimal={true}
                        text="Configure fields"
                        onClick={() => { setIsDialogOpen("config") }}
                      />
                      <Dialog
                        title="Configure Fields"
                        isOpen={isDialogOpen === "config"}
                        onClose={() => { setIsDialogOpen(null) }}
                      >
                        <ConfigFields
                          data={dataSource}
                          onClose={() => { setIsDialogOpen(null) }}
                        />
                      </Dialog>
                    </Box>
                  </Flex>
                  <Flex mx={-1} flexWrap="wrap">
                    {dataSource.fields.filter((field) => field !== "timestamp").map((v) => (
                      <Box
                        key={v._id}
                        px={1}
                        mb={3}
                        width={`${100 / ((dataSource.fields.length - 1) % 2 === 0 ? 2 : 3)}%`}>
                        <Card style={{ padding: 0 }}>
                          <H5 style={{ padding: "6px 12px 0 12px", margin: 0 }}>
                            <Text ellipsize={true}>{v.name}  ({v.type})</Text>
                          </H5>
                          <div style={{ height: 64 }}>
                            <Timeseries
                              timeRange={timeRange}
                              options={{
                                ...dummy.mini.options,
                                stroke: {
                                  ...dummy.mini.options.stroke,
                                  curve: (v.type === 'boolean') ? 'stepline' : 'smooth'
                                }
                              }}
                              series={[{
                                dataSource: dataSource._id,
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
                      <Box pl={2}>
                        <span>last </span>
                        <HTMLSelect
                          options={Object.keys(dateRange)}
                          onChange={changeTimeRange}
                        />
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
                              ...dataSource.fields.map(({ name, type }) => {
                                let result = {
                                  dataKey: `data.${name}`,
                                  label: name,
                                  width: 100
                                }
                                if (type === "date") {
                                  result.width = 200;
                                  result.cellRenderer = ({ cellData }) => (
                                    <Box px={2}>
                                      <Text ellipsize={true}>{moment(cellData).calendar()}</Text>
                                    </Box>
                                  )
                                }
                                return result;
                              })
                            ]}
                            data={data}
                            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
                          />
                        }
                      </Wrapper>
                    </div>
                  </Card>
                </Box>
              </Box>
            </Wrapper>
          </ResizeSensor>
        </div>
      </Flex>
    </>
  )
}

export default DataSource;