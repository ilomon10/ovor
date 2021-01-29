import React, { Component } from "react";
import { Button, Dialog } from "@blueprintjs/core";
import Window from "../Window";
import Empty from "./Empty";
import Settings from "./Settings";

class Widget extends Component {
  state = {
    isDialogOpen: false
  }
  render() {
    const {
      title, type, children,
      onRemove,
      ...props
    } = this.props;
    return (
      <Window title={title}
        toolbarMinimal={true}
        toolbarControls={[
          <Button key={"refresh"} className="default-control" minimal icon="refresh" onClick={() => {
            console.log("refresh");
          }} />,
          <Button key={"cog"} className="default-control" minimal icon="cog" />,
          <Button key={"plus"} className="default-control" minimal icon="plus"
            onClick={() => {
              console.log("tambah");
            }} />,
          <Button key={"cross"} className="default-control" minimal icon="cross"
            onClick={() => {
              onRemove();
            }} />,
        ]} {...props}>
        {<Empty title={"Kosong"} text={(
          <>
            <span>Setup </span>
            <Button small text="widget" />
            <span> at this window</span>
          </>
        )} />}
        {children}
        <Dialog isOpen={this.state.isDialogOpen}>
          <Settings />
        </Dialog>
      </Window>
    )
  }
}

export default Widget;