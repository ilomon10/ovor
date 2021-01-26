import React from "react";
import { Button, Colors } from "@blueprintjs/core";
import Window from "./Window";
import BSON from "bson-objectid";
import Empty from "./Widget/Empty";
import GridLayout from "./GridLayout";

class EmbedDashboard extends React.Component {
  state = {
    layouts: {},
    items: ["a", "b", "c", "d"],
  }
  render() {
    return (
      <GridLayout
        layouts={this.state.layouts}
        style={{ height: "100%" }}
        onLayoutChange={(_, all) => {
          this.setState(state => ({
            layouts: {
              ...state.layouts,
              ...all
            }
          }))
        }}
      >
        {this.state.items.map((v) => (
          <Window key={v} title={`Widget ${v}`}
            toolbarControls={[
              <Button key={"refresh"} className="default-control" minimal icon="refresh" onClick={() => {
                let value = new URLSearchParams(this.props.location.search);
                console.log(value.get("t"));
              }} />,
              <Button key={"cog"} className="default-control" minimal icon="cog" />,
              <Button key={"plus"} className="default-control" minimal icon="plus"
                onClick={() => {
                  this.setState(state => ({
                    items: [...state.items, BSON.generate()]
                  }))
                }} />,
              <Button key={"cross"} className="default-control" minimal icon="cross"
                onClick={() => {
                  this.setState(state => {
                    return {
                      ...state,
                      items: state.items.filter((item) => item !== v)
                    }
                  })
                }} />,
            ]}>
            {<Empty title={"Kosong"} text={(
              <>
                <span>Setup </span>
                <Button small text="widget" />
                <span> at this window</span>
              </>
            )} />}
          </Window>
        ))}
      </GridLayout>
    )
  }
}

export default EmbedDashboard;