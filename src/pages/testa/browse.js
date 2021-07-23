import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Card, Classes, Colors, Dialog, Icon, NonIdealState, Button, Text, Popover, Menu } from '@blueprintjs/core';
import { Link } from "react-router-dom";
import AspectRatio from "components/aspectratio";
import Wrapper from "components/wrapper";
import Container from "components/container";
import { FeathersContext } from 'components/feathers';
import AddNewSaraf from "./addNewSaraf";
import { Helmet } from "react-helmet";
import { Flex, Box } from "components/utility/grid";
import DeleteSaraf from "./deleteSaraf";

const Testa = () => {
  const feathers = useContext(FeathersContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSaraf, setSelectedSaraf] = useState(null);
  const [list, setList] = useState([]);
  useEffect(() => {
    const onSarafCreated = (e) => {
      setList([{
        _id: e._id,
        name: e.name,
        updatedAt: e.updatedAt,
      }, ...list]);
    }
    const onSarafRemoved = (e) => {
      setList(ls => (
        [...ls.filter(itm => itm._id !== e._id)]
      ))
    }
    feathers.testa.on('created', onSarafCreated)
    feathers.testa.on('removed', onSarafRemoved)
    return () => {
      feathers.testa.removeListener('created', onSarafCreated);
      feathers.testa.removeListener('removed', onSarafRemoved)
    }
  }, [list, feathers])
  useEffect(() => {
    feathers.testa.find({
      query: {
        $select: ["_id", 'name', 'updatedAt'],
        $sort: {
          updatedAt: -1
        }
      }
    }).then((e) => {
      setList([...e.data])
    })
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <Helmet>
        <title>Testa | Ovor</title>
        <meta name="description" content="Saraf testa browser" />
      </Helmet>
      <div style={{ backgroundColor: Colors.LIGHT_GRAY5, position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}>
        <Wrapper style={{ overflowY: 'auto' }}>
          <Container style={{ paddingTop: 24 }}>
            {list.length > 0 &&
              <div style={{ margin: "0 -8px" }} className="flex flex--wrap">
                <Box width={[1, 1 / 2, 1 / 3]}
                  px={2} mb={3}>
                  <Card interactive onClick={() => setIsDialogOpen(true)}
                    style={{ padding: 0, height: '100%', backgroundColor: "transparent" }}>
                    <AspectRatio ratio="4:3">
                      <div className="flex flex--i-center flex--j-center" style={{ height: "100%" }}>
                        <Icon icon="plus" iconSize={64} color={Colors.GRAY1} />
                      </div>
                    </AspectRatio>
                  </Card>
                </Box>
                {list.map((v) => (
                  <Box key={v._id}
                    width={[1, 1 / 2, 1 / 3]}
                    px={2} mb={3}>
                    <Card style={{ padding: 0 }}>
                      <AspectRatio ratio="4:3">
                        <Flex justifyContent="center" alignItems="center" height="100%" backgroundColor={Colors.LIGHT_GRAY3}>
                          <Box>
                            <Icon iconSize={24} icon="layout" color={Colors.GRAY2} />
                          </Box>
                        </Flex>
                        {/* <img style={{ height: '100%', width: '100%', display: 'block', backgroundColor: Colors.LIGHT_GRAY3 }} alt="boo" /> */}
                        <Flex bg="white" pl={3} pr={2}
                          style={{ position: "absolute", right: 0, bottom: 0, left: 0 }}>
                          <Box flexGrow="1" flexShrink="1" width="1%" py={2}>
                            <h6 className={`${Classes.HEADING}`}>
                              <Text ellipsize={true}>
                                <Link to={`/testa/saraf/${v._id}`}
                                  style={{ lineHeight: 1.5 }}>
                                  {v.name}
                                </Link>
                              </Text>
                            </h6>
                            <Text
                              ellipsize
                              style={{ margin: 0, width: "100%" }}>
                              <span>
                                {moment(v.updatedAt).format('LLLL')}
                              </span>
                            </Text>
                          </Box>
                          <Flex flexShrink="0" alignItems="center">
                            <Popover
                              position="auto-end"
                              content={
                                <Menu>
                                  <Menu.Item
                                    icon="globe"
                                    text="Public"
                                    title="Make dashboard go Private" />
                                  <Menu.Item
                                    icon="duplicate"
                                    text="Duplicate"
                                    title="Duplicate dashboard" />
                                  <Menu.Item
                                    intent="danger"
                                    icon="trash"
                                    text="Delete"
                                    title="Delete dashboard"
                                    onClick={() => {
                                      setSelectedSaraf(v._id);
                                      setIsDeleteOpen(true);
                                    }} />
                                </Menu>
                              }>
                              <Button minimal icon="more" title="More" />
                            </Popover>
                          </Flex>
                        </Flex>
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
                  <p>You didn't have any saraf of testa created</p>
                  <Button outlined large
                    onClick={() => setIsDialogOpen(true)}
                    icon="plus" text="Make new one" />
                </>} />}
            <Dialog
              title="Add New Saraf"
              canOutsideClickClose={false}
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}>
              <AddNewSaraf onClose={() => setIsDialogOpen(false)} />
            </Dialog>
            <Dialog
              title="Delete Saraf"
              canOutsideClickClose={false}
              isOpen={isDeleteOpen}
              onClose={() => setIsDeleteOpen(false)}>
              <DeleteSaraf data={selectedSaraf} onClose={() => setIsDeleteOpen(false)} onDeleted={() => setIsDeleteOpen(false)} />
            </Dialog>
          </Container>
        </Wrapper>
      </div>
    </>
  )
}

export default Testa;