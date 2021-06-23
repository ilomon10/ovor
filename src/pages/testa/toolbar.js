import React, { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Navbar, Button } from "@blueprintjs/core";
import { useFungsiMaju } from "components/hocs/fungsiMaju";
import { useFeathers } from "components/feathers";

const Toolbar = () => {
  const params = useParams();
  const history = useHistory();
  const feathers = useFeathers();
  const { editor } = useFungsiMaju();
  const onDeploy = useCallback(async () => {
    const json = editor.toJSON(true);
    console.log("deploy", json);
    const { id } = params;
    feathers.testa.patch(id, {
      version: json.version,
      nodes: json.nodes
    });
  }, [feathers, editor, params.id]);
  return (
    <Navbar>
      <Navbar.Group>
        <Button icon="chevron-left" onClick={() => { history.push("/testa") }} />
        <Navbar.Divider />
        <Navbar.Heading></Navbar.Heading>
      </Navbar.Group>
      <Navbar.Group align="right">
        <Button
          disabled={editor === null}
          icon="upload"
          text="deploy"
          onClick={() => { onDeploy() }}
        />
      </Navbar.Group>
    </Navbar>
  )
}

export default Toolbar;