import moment from "moment";
import React, { useContext, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Card, Classes, Colors } from '@blueprintjs/core';
import { Link } from "react-router-dom";
import AspectRatio from "../components/aspectratio";
import { TabContext } from "../components/tabSystem";

const Dashboards = () => {
  const tab = useContext(TabContext);
  const location = useLocation();
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
    <div style={{ backgroundColor: Colors.LIGHT_GRAY5, height: '100%' }}>
      <div style={{ width: 1024, margin: '0 auto', paddingTop: 24 }}>
        <div style={{ margin: "0 -8px" }} className="flex flex--wrap">
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
      </div>
    </div>
  )
}

export default Dashboards;