import React, { useContext, useState, useEffect } from 'react';
import { Colors, Card, Classes, Elevation, H4, Button, NonIdealState } from '@blueprintjs/core';
import Wrapper from 'components/wrapper';
import Container from 'components/container';
import { Link } from 'react-router-dom';
import InputCopy from 'components/inputCopy';
import moment from 'moment';
import { FeathersContext } from 'components/feathers';
import LinkButton from 'components/linkButton';
import { Helmet } from 'react-helmet';
import { abbreviateNumber } from 'components/helper';

const stateOption = {
  data: [],
  total: 0
}

const Overview = () => {
  const [dashboards, setDashboards] = useState(stateOption);
  const [devices, setDevices] = useState(stateOption);
  const [data, setData] = useState(stateOption);
  const [tokens, setTokens] = useState(stateOption);
  const feathers = useContext(FeathersContext);
  useEffect(() => {
    const fetch = async () => {
      let dashboards = await feathers.dashboards.find({
        query: {
          $limit: 5,
          $select: ["_id", 'title'],
          $sort: { updatedAt: -1 }
        }
      });
      let devices = await feathers.devices.find({
        query: {
          $limit: 3,
          $select: ["_id", 'name'],
          $sort: { updatedAt: -1 }
        }
      });
      let data = await feathers.dataLake.find({
        query: {
          $limit: 3,
          $select: ["_id", 'deviceId', 'updatedAt'],
          createdAt: 'all',
          $sort: { createdAt: -1 }
        }
      });
      let tokens = await feathers.tokens.find({
        query: {
          $limit: 3,
          $select: ["_id", 'name', 'key', 'updatedAt'],
          $sort: { updatedAt: -1 }
        }
      });
      setDashboards({
        total: dashboards.total,
        data: dashboards.data.map(v => {
          return {
            title: v.title,
            path: v._id
          }
        })
      })
      setDevices({
        total: devices.total,
        data: devices.data.map(v => {
          return {
            title: v.name,
            path: v._id
          }
        })
      })
      setData({
        total: data.total,
        data: await Promise.all(data.data.map(async v => {
          let d = {
            name: "Unkown"
          };
          try {
            d = await feathers.devices.get(v.deviceId, {
              query: { $select: ['name'] }
            });
          } catch (e) {
            console.error(e);
          }
          return {
            title: `${moment(v.updatedAt).calendar()} on ${d.name}`,
            path: d._id
          }
        }))
      })
      setTokens({
        total: tokens.total,
        data: tokens.data.map(v => {
          return {
            title: v.name,
            path: v.key,
            updatedAt: v.updatedAt
          }
        })
      })
    }
    fetch();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <Helmet>
        <title>Overview | Ovor</title>
        <meta name="description" content="Overview application" />
      </Helmet>
      <div style={{ backgroundColor: Colors.LIGHT_GRAY5, height: '100%', position: "relative" }}>
        <Wrapper style={{ overflowY: 'auto' }}>
          <Container style={{ paddingTop: 12 }}>
            <div style={{ margin: '0 -8px', marginBottom: 16 }} className="flex flex--wrap">
              <div style={{ width: `${100 / 3}%`, padding: '0 8px' }}>
                <Card elevation={Elevation.TWO}>
                  <div className="flex">
                    <div style={{ width: `${100 / 2}%` }}>
                      <h1 className={Classes.HEADING}>{dashboards.total}</h1>
                      <h5 className={Classes.HEADING}>Dashboards</h5>
                    </div>
                    <div style={{ width: `${100 / 2}%` }}>
                      {[...dashboards.data].splice(0, 3).map((v) => (
                        <h6 key={v.path} className={`${Classes.HEADING}`}>
                          <Link to={`/dashboards/${v.path}`}
                            className={`${Classes.TEXT_OVERFLOW_ELLIPSIS}`}
                            style={{ display: 'block' }}>
                            <small>{v.title}</small>
                          </Link>
                        </h6>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
              <div style={{ width: `${100 / 3}%`, padding: '0 8px' }}>
                <Card elevation={Elevation.ONE}>
                  <div className="flex">
                    <div style={{ width: `${100 / 2}%` }}>
                      <h1 className={Classes.HEADING}>{devices.total}</h1>
                      <h5 className={Classes.HEADING}>Devices</h5>
                    </div>
                    <div style={{ width: `${100 / 2}%` }}>
                      {devices.data.map((v) => (
                        <h6 key={v.path} className={`${Classes.HEADING}`}>
                          <Link to={`/devices/${v.path}`}
                            className={`${Classes.TEXT_OVERFLOW_ELLIPSIS}`}
                            style={{ display: 'block' }}>
                            <small>{v.title}</small>
                          </Link>
                        </h6>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
              <div style={{ width: `${100 / 3}%`, padding: '0 8px' }}>
                <Card elevation={Elevation.ZERO}>
                  <div className="flex">
                    <div style={{ width: `${100 / 3}%` }}>
                      <h1 className={Classes.HEADING}>{abbreviateNumber(data.total)}</h1>
                      <h5 className={Classes.HEADING}>Data</h5>
                    </div>
                    <div style={{ width: `${100 / 3 * 2}%` }}>
                      {data.data.map((v, i) => (
                        <h6 key={i} className={`${Classes.HEADING} ${Classes.TEXT_OVERFLOW_ELLIPSIS}`}>
                          <Link to={`/devices/${v.path}`}>
                            <small>{v.title}</small>
                          </Link>
                        </h6>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            <div style={{ margin: '0 -8px', marginBottom: 16 }} className='flex'>
              <div style={{ width: `${100 / 2}%`, margin: '0 16px' }}>
                <h2 className={Classes.HEADING}>Welcome to OVOR</h2>
                <p style={{ marginBottom: 16 }}>Start something new or continue your work</p>
                <h5 className={Classes.HEADING}>Create something</h5>
                <div style={{ marginBottom: 8 }} className="flex flex--col flex--i-start">
                  <div className="flex flex--col">
                    <LinkButton style={{ marginBottom: 8 }}
                      minimal fill
                      alignText="left"
                      icon="application"
                      text="Create a dashboard"
                      to="/dashboards" />
                    <LinkButton style={{ marginBottom: 16 }}
                      minimal fill
                      alignText="left"
                      icon="helper-management"
                      text="Create a device"
                      to={`/devices`} />
                  </div>
                </div>
                {dashboards.total > 0 && <>
                  <h5 className={Classes.HEADING}>Recent dashboards</h5>
                  <div style={{ marginBottom: 8 }} className="flex flex--col flex--i-start">
                    <div className="flex flex--col">
                      {dashboards.data.map((v) => (
                        <LinkButton key={v.path}
                          style={{ marginBottom: 8 }}
                          minimal
                          alignText="left"
                          icon="application"
                          text={v.title}
                          to={`/dashboards/${v.path}`} />
                      ))}
                      {dashboards.total > dashboards.data.length &&
                        <LinkButton style={{ marginBottom: 8 }}
                          minimal
                          alignText="left"
                          icon="applications"
                          text="View more..."
                          to="/dashboards" />}
                    </div>
                  </div>
                </>}
              </div>
              <div style={{ width: `${100 / 2}%`, margin: '0 8px' }}>
                <Card style={{ marginBottom: 16 }}>
                  <div className="flex">
                    <div className="flex-grow">
                      <H4><Link to='/tokens'>Access Token</Link></H4>
                    </div>
                    <div className="flex-shrink-0">
                      <LinkButton small
                        minimal
                        to="/tokens"
                        rightIcon="plus"
                        text="Generate" />
                    </div>
                  </div>
                  <p>You need API access token to configure on device.</p>
                  {tokens.total === 0 &&
                    <NonIdealState
                      icon="issue"
                      title="Empty"
                      description={(<>
                        <span>You need to create one.</span>
                        <br />
                        <Button minimal small text="Generate new token" />
                      </>)} />}
                  {tokens.data.map((v, i) => (
                    <div key={v.path}
                      style={{
                        borderBottomColor: (tokens.data.length - 1 === i) ? 'transparent' : Colors.LIGHT_GRAY3,
                        borderBottomWidth: 1, borderBottomStyle: 'solid',
                        marginBottom: (tokens.data.length - 1 === i) ? 0 : 8
                      }}>
                      <p>{v.title}</p>
                      <div style={{ marginBottom: 10 }}>
                        <InputCopy fill defaultValue={v.path} />
                      </div>
                      <p><strong>Last modified:</strong> {moment(v.updatedAt).calendar()}</p>
                    </div>
                  ))}
                </Card>
                <Card elevation={Elevation.ONE}>
                  <H4><Link to='/'>Discover</Link></H4>
                  <p>Explore some documentation and public APIs you might find useful.</p>
                  <NonIdealState
                    icon="code-block"
                    title="Sorry"
                    description={(<>
                      <span>Currently documentation page is not available.</span>
                      <br />
                      <span>Please come back again later.</span>
                    </>)} />
                </Card>
              </div>
            </div>
          </Container>
        </Wrapper>
      </div >
    </>
  )
}

export default Overview;