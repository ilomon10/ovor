import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Card, Classes, Colors, Dialog, Icon, NonIdealState, Button } from '@blueprintjs/core';
import { Link } from "react-router-dom";
import AspectRatio from "components/aspectratio";
import Wrapper from "components/wrapper";
import Container from "components/container";
import { FeathersContext } from 'components/feathers';
import AddNewDashboard from "./addNewDashboard";
import { Helmet } from "react-helmet";
import { Box } from "components/utility/grid";

const Dashboards = () => {
  const feathers = useContext(FeathersContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [list, setList] = useState([]);
  useEffect(() => {
    const onDashboardCreated = (e) => {
      setList([{
        _id: e._id,
        title: e.title,
        updatedAt: e.updatedAt,
      }, ...list]);
    }
    feathers.dashboards.on('created', onDashboardCreated)
    return () => {
      feathers.dashboards.removeListener('created', onDashboardCreated);
    }
  }, [list, feathers])
  useEffect(() => {
    feathers.dashboards.find({
      query: { $select: ['title', 'updatedAt'] }
    }).then((e) => {
      setList([...e.data])
    })
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <Helmet>
        <title>Dashboards | Ovor</title>
        <meta name="description" content="Dashboard browser" />
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
                        <img style={{ height: '100%', width: '100%', display: 'block', backgroundColor: Colors.LIGHT_GRAY3 }} alt="boo" />
                        <Box bg="white"
                          style={{ position: "absolute", right: 0, bottom: 0, left: 0 }}
                          px={3} py={2}>
                          <h6 className={`${Classes.HEADING}`}>
                            <Link to={`/dashboards/${v._id}`}
                              className={`${Classes.TEXT_OVERFLOW_ELLIPSIS}`}
                              style={{ display: 'block' }}>
                              {v.title}
                            </Link>
                          </h6>
                          <p style={{ margin: 0 }}>{moment(v.updatedAt).format('LLLL')}</p>
                        </Box>
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
                  <p>You didn't have any dashboard created</p>
                  <Button outlined large
                    onClick={() => setIsDialogOpen(true)}
                    icon="plus" text="Make new one" />
                </>} />}
            <Dialog
              title="Add New Dashboard"
              canOutsideClickClose={false}
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}>
              <AddNewDashboard onClose={() => setIsDialogOpen(false)} />
            </Dialog>
          </Container>
        </Wrapper>
      </div>
    </>
  )
}

export default Dashboards;