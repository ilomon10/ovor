import React from "react";
import GridLayout from "./GridLayout";
import Widget from "./Widget";

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
          <Widget
            key={v}
            title={`Widget ${v}`}
            onRemove={() => {
              this.setState(state => ({
                items: [
                  ...state.items.filter(item => item !== v)
                ]
              }))
            }}
          />
        ))}
      </GridLayout>
    )
  }
}

export default EmbedDashboard;