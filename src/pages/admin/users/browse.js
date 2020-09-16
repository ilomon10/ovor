import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Button, ButtonGroup, HTMLTable, Colors, H2, Dialog, Tag } from "@blueprintjs/core";
import Container from "components/container";
import Wrapper from "components/wrapper";
import { Box, Flex } from "components/utility/grid";
import { FeathersContext } from 'components/feathers';
import AddNewUser from './addNewUser';
import { useHistory } from 'react-router-dom';
import DeleteUser from './deleteUser';

const Users = () => {
  const feathers = useContext(FeathersContext);
  const history = useHistory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(undefined);
  const [list, setList] = useState([]);
  useEffect(() => {
    feathers.users.find({
      query: {
        $sort: { createdAt: -1 },
        $select: ['email', 'permissions']
      }
    }).then((e) => {
      setList(e.data);
    }).catch(e => {
      console.error(e);
    })
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const removeUser = useCallback((user) => {
    setSelectedUser(user);
  }, []);
  return (
    <>
      <Helmet>
        <title>Users | Ovor</title>
        <meta name="description" content="User manager" />
      </Helmet>
      <Box backgroundColor={Colors.LIGHT_GRAY5} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Wrapper>
          <Container>
            <Flex>
              <Box flexGrow={1}>
                <H2>Users Manager</H2>
              </Box>
              <Box flexShrink={0}>
                <Button icon="plus" text="Add new User"
                  onClick={() => setIsDialogOpen(true)} />
              </Box>
            </Flex>
            <p>Manage your user</p>
            <HTMLTable striped style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Permissions</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map((u) => (<tr key={u._id}>
                  <td>{u.email}</td>
                  <td>{u.permissions.map((p) => (
                    <Box key={p} display="inline-block" mr={1}><Tag>{p}</Tag></Box>))}</td>
                  <td>
                    <ButtonGroup minimal>
                      <Button small icon="edit" onClick={() => history.push(`/users/${u._id}`)} />
                      <Button small icon="trash" intent="danger" onClick={() => removeUser(u)} />
                    </ButtonGroup>
                  </td>
                </tr>))}
              </tbody>
            </HTMLTable>
            <Dialog usePortal={true}
              title="Add new user account"
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)} >
              <AddNewUser onClose={() => setIsDialogOpen(false)} />
            </Dialog>
            <Dialog usePortal={true}
              title="Delete account"
              isOpen={typeof selectedUser !== 'undefined'}
              onClose={() => { setSelectedUser(undefined); }}>
              <DeleteUser data={selectedUser} onClose={() => { setSelectedUser(undefined); }} />
            </Dialog>
          </Container>
        </Wrapper>
      </Box>
    </>
  )
}

export default Users;