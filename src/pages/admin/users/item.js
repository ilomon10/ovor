import React, { useState } from "react";
import { Button, ButtonGroup, Dialog, Tag } from "@blueprintjs/core";
import { Box } from "components/utility/grid";
import { useHistory } from "react-router-dom";
import DeleteUser from "./deleteUser";

export const Item = ({ user: u, onRemoved }) => {
  const history = useHistory();
  const [dialogOpen, setDialogOpen] = useState(null);

  return (
    <>
      <tr>
        <td>{u.email}</td>
        <td style={{ minWidth: 150 }}>
          {u.permissions.map((p) => (
            <Box key={p} display="inline-block" mr={1}>
              <Tag>{p}</Tag>
            </Box>
          ))}
        </td>
        <td>
          <ButtonGroup minimal>
            <Button
              small
              icon="edit"
              onClick={() => history.push(`/users/${u._id}`)}
            />
            <Button
              small
              icon="trash"
              intent="danger"
              onClick={() => setDialogOpen("delete")}
            />
          </ButtonGroup>
          <Dialog
            usePortal={true}
            title="Delete account"
            isOpen={dialogOpen === "delete"}
            onClose={() => {
              setDialogOpen(null);
            }}
          >
            <DeleteUser
              data={u}
              onClose={() => {
                setDialogOpen(null);
              }}
              onDeleted={() => {
                onRemoved();
              }}
            />
          </Dialog>
        </td>
      </tr>
    </>
  );
};
