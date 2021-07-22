import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Colors, Card, Icon, Classes, Tooltip, Position, Tag, Dialog, NonIdealState, Button } from '@blueprintjs/core';
import AspectRatio from 'components/aspectratio';
import Container from 'components/container';
import Wrapper from 'components/wrapper';
import AddNewDevice from './addNewDataSource';
import { FeathersContext } from 'components/feathers';
import { Helmet } from 'react-helmet';
import { Flex, Box } from 'components/utility/grid';

const DataSources = () => {
  const feathers = useContext(FeathersContext);
  const history = useHistory();
  const [list, setList] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useEffect(() => {
    const onDataSourceCreated = (e) => {
      setList([
        { _id: e._id, name: e.name, fields: e.fields },
        ...list
      ])
    }
    const onDataSourcePatched = (e) => {
      setList((ls) => {
        return ls.map((l) => l._id === e._id ? e : l);
      })
    }
    feathers.dataSources.on('created', onDataSourceCreated);
    feathers.dataSources.on('patched', onDataSourcePatched);
    return () => {
      feathers.dataSources.removeListener('created', onDataSourceCreated);
      feathers.dataSources.removeListener('patched', onDataSourcePatched);
    }
  }, [list, feathers]);
  useEffect(() => {
    feathers.dataSources.find({
      query: {
        $sort: { createdAt: -1 },
        $select: ["_id", 'name', "fields"]
      }
    }).then((e) => {
      console.log(e);
      setList(e.data);
    }).catch(e => {
      console.error(e);
    })
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <Helmet>
        <title>Ember | Ovor</title>
        <meta name="description" content="Ember browser" />
      </Helmet>
      <div style={{ backgroundColor: Colors.LIGHT_GRAY5, position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}>
        <Wrapper style={{ overflowY: "auto" }}>
          <Container style={{ paddingTop: 12 }}>
            {list.length > 0 &&
              <div style={{ padding: '0 8px' }} className="flex flex--wrap">
                <Box width={[1, 1 / 2, 1 / 3, 1 / 4]}
                  px={2} mb={3}>
                  <Card interactive
                    style={{ backgroundColor: "transparent" }}
                    onClick={() => setIsDialogOpen(true)}>
                    <AspectRatio ratio="4:3">
                      <div className="flex flex--j-center flex--i-center" style={{ height: "100%" }}>
                        <Icon iconSize={64} icon="plus" color={Colors.GRAY1} />
                      </div>
                    </AspectRatio>
                  </Card>
                </Box>
                {list.map((v) => (
                  <Box key={v._id}
                    width={[1, 1 / 2, 1 / 3, 1 / 4]}
                    px={2} mb={3}>
                    <Card interactive onClick={() => history.push(`/ember/${v._id}`)}>
                      <AspectRatio ratio="4:3">
                        <div className="flex flex--col" style={{ height: "100%" }}>
                          <div className={`flex flex--col`}>
                            <Tooltip content={<div className={Classes.TEXT_SMALL}>{v._id}</div>} position={Position.BOTTOM_LEFT}>
                              <Tag minimal className={Classes.MONOSPACE_TEXT}>{v._id.slice(0, 3)}..{v._id.slice(v._id.length - 3, v._id.length)}</Tag>
                            </Tooltip>
                            <Box as="h4" pt={2} className={Classes.HEADING}>{v.name}</Box>
                          </div>
                          <Flex flexGrow={1} flexWrap="wrap" alignContent="baseline" backgroundColor={Colors.LIGHT_GRAY5} >
                            {v.fields.map(({ name, _id }) => (
                              <Box key={_id} my={1} mx={1}>
                                <Tag key={_id} minimal={true}>{name}</Tag>
                              </Box>
                            ))}
                          </Flex>
                        </div>
                      </AspectRatio>
                    </Card>
                  </Box>
                ))}
              </div>}
            {list.length === 0 &&
              <NonIdealState
                icon="application"
                title="Empty"
                description={<>
                  <p>You didn't have any device registered</p>
                  <Button outlined large
                    onClick={() => setIsDialogOpen(true)}
                    icon="plus" text="Register new one" />
                </>} />}
            <Dialog isOpen={isDialogOpen}
              usePortal={true}
              canOutsideClickClose={false}
              title="Add New Ember"
              onClose={() => setIsDialogOpen(false)}>
              <AddNewDevice onClose={() => setIsDialogOpen(false)} />
            </Dialog>
          </Container>
        </Wrapper>
      </div>
    </>
  )
}

export default DataSources;