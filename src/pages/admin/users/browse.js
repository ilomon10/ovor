import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { Button, Colors, H2, Dialog } from "@blueprintjs/core";

import Container from "components/container";
import Wrapper from "components/wrapper";
import { Box, Flex } from "components/utility/grid";
import { FeathersContext } from "components/feathers";
import { useMedia } from "components/helper";
import { container } from "components/utility/constants";

import AddNewUser from "./addNewUser";
import { useQuery } from "react-query";
import { List } from "./list";

const Users = () => {
  const feathers = useContext(FeathersContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const listSkip = useState(0);
  const columnCount = useMedia(
    container.map((v) => `(min-width: ${v})`).reverse(),
    [5, 4, 3, 2],
    1
  );

  const { isLoading, isError, data, refetch } = useQuery(
    ["users", listSkip[0]],
    async () => {
      return await feathers.users.find({
        query: {
          $skip: listSkip[0],
          $sort: { createdAt: -1 },
          $select: ["_id", "email", "permissions"],
        },
      });
    }
  );

  return (
    <>
      <Helmet>
        <title>Users | Ovor</title>
        <meta name="description" content="User manager" />
      </Helmet>
      <Box
        backgroundColor={Colors.LIGHT_GRAY5}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <Wrapper>
          <Container>
            <Flex>
              <Box flexGrow={1}>
                <H2>Users Manager</H2>
              </Box>
              <Box flexShrink={0}>
                <Button
                  icon="plus"
                  text={columnCount < 2 ? "User" : "Add new User"}
                  onClick={() => setIsDialogOpen(true)}
                />
              </Box>
            </Flex>
            <p>Manage your user</p>
            <List
              isLoading={isLoading}
              isError={isError}
              data={data}
              limit={10}
              skip={listSkip[0]}
              onDelete={(user) => refetch()}
              onPaginate={({ skip }) => {
                listSkip[1](() => {
                  return skip;
                });
              }}
            />
            <Dialog
              usePortal={true}
              title="Add new user account"
              isOpen={isDialogOpen}
              canOutsideClickClose={false}
              onClose={() => {
                setIsDialogOpen(false);
              }}
            >
              <AddNewUser
                onClose={() => {
                  setIsDialogOpen(false);
                  refetch();
                }}
              />
            </Dialog>
          </Container>
        </Wrapper>
      </Box>
    </>
  );
};

export default Users;
