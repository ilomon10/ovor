import React from "react";
import { useHistory } from "react-router-dom";
import { Navbar, Button } from "@blueprintjs/core";

const Toolbar = () => {
  const history = useHistory();
  return (
    <Navbar>
      <Navbar.Group>
        <Button icon="chevron-left" onClick={() => { history.push("/testa") }} />
        <Navbar.Divider />
        <Navbar.Heading></Navbar.Heading>
      </Navbar.Group>
    </Navbar>
  )
}

export default Toolbar;