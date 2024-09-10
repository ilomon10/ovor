import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Navbar, Button } from "@blueprintjs/core";
import { useFungsiMaju } from "components/hocs/fungsiMaju";
import { useFeathers } from "components/feathers";
import _debounce from "lodash.debounce";

const Toolbar = () => {
  const params = useParams();
  const history = useHistory();
  const feathers = useFeathers();
  const { editor } = useFungsiMaju();
  const [isReady, setIsReady] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const onDeploy = useCallback(async () => {
    const json = editor.toJSON(true);
    setIsLoading(true);
    console.log("deploy", json);
    const id = params.id;
    await feathers.testa.patch(id, {
      version: json.version,
      nodes: json.nodes
    });
    setIsReady(false);
    setIsLoading(false);
  }, [feathers, editor, params.id]);

  useEffect(() => {
    if (editor === null) return;

    const callback = _debounce(() => {
      setIsReady((v) => {
        if (v === null) {
          return false;
        } else {
          return true;
        }
      });
    }, 250);

    const events = [
      editor.on("connectioncreated", callback),
      editor.on("connectionremoved", callback),
      editor.on("nodecreated", callback),
      editor.on("noderemoved", callback),
      editor.on("nodetranslated", callback),
      editor.on("nodeconfigured", callback),
    ];
    return () => {
      events.forEach(event => event());
    }
  }, [editor]);
  return (
    <Navbar>
      <Navbar.Group>
        <Button icon="chevron-left" onClick={() => { history.push("/testa") }} />
        <Navbar.Divider />
        <Navbar.Heading></Navbar.Heading>
      </Navbar.Group>
      <Navbar.Group align="right">
        <Button
          icon="upload"
          text="deploy"
          loading={isLoading}
          disabled={editor === null || isReady !== true}
          onClick={() => { onDeploy() }}
        />
      </Navbar.Group>
    </Navbar>
  )
}

export default Toolbar;