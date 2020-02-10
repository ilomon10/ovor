import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { Card, Classes, Colors, Dialog, Icon } from '@blueprintjs/core';
import { Link } from "react-router-dom";
import AspectRatio from "components/aspectratio";
import Wrapper from "components/wrapper";
import { TabContext } from "components/tabSystem";
import Container from "components/container";
import AddNewDashboard from "./addNewDashboard";

const Dashboards = () => {
  const tab = useContext(TabContext);
  const location = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const list = [{
    name: "Lampu Rumah",
    update_at: moment().format(),
    thumbnail: 'moment().format()'
  }, {
    name: "Lampu Rumah",
    update_at: moment().format(),
    thumbnail: 'moment().format()'
  }, {
    name: "Lampu Rumah",
    update_at: moment().format(),
    thumbnail: 'moment().format()'
  }, {
    name: "Lampu Rumah",
    update_at: moment().format(),
    thumbnail: 'moment().format()'
  }];
  useEffect(() => {
    tab.setCurrentTabState({
      title: 'Dashboards',
      path: location.pathname
    })
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div style={{ backgroundColor: Colors.LIGHT_GRAY5, height: '100%', position: 'relative' }}>
      <Wrapper style={{ overflowY: 'auto' }}>
        <Container style={{ paddingTop: 24 }}>
          <div style={{ margin: "0 -8px" }} className="flex flex--wrap">
            <div style={{ width: `${100 / 3}%`, padding: "0 8px", marginBottom: 16 }}>
              <Card interactive onClick={() => setIsDialogOpen(true)}
                style={{ padding: 0, height: '100%', backgroundColor: "transparent" }}>
                <div className="flex flex--i-center flex--j-center" style={{ height: "100%" }}>
                  <Icon icon="plus" iconSize={64} color={Colors.GRAY1} />
                </div>
              </Card>
            </div>
            {list.map((v, i) => (
              <div key={i}
                style={{ width: `${100 / 3}%`, padding: "0 8px", marginBottom: 16 }}>
                <Card style={{ padding: 0 }}>
                  <AspectRatio ratio="16:9">
                    <img style={{ height: '100%', width: '100%', display: 'block', backgroundColor: Colors.LIGHT_GRAY3 }} alt="boo" />
                  </AspectRatio>
                  <div style={{ padding: "8px 15px" }}>
                    <h5 className={Classes.HEADING}>
                      <Link to={`/dashboards/${i}`}>{v.name}</Link>
                    </h5>
                    <div>{moment(v.update_at).format('LLLL')}</div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </Container>
        <Dialog
          title="Add New Dashboard"
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}>
          <AddNewDashboard onClose={() => setIsDialogOpen(false)} />
        </Dialog>
      </Wrapper>
    </div>
  )
}

export default Dashboards;