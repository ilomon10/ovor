import React from "react";
import { HTMLTable, NonIdealState, Spinner } from "@blueprintjs/core";
import { Box } from "components/utility/grid";
import { Pagination } from "components/pagination";
import { Item } from "./item";

export const List = ({
  skip,
  limit,
  isLoading,
  isError,
  data,
  onDelete,
  onPaginate,
}) => {
  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <NonIdealState icon="error" description="Something went wrong" />;
  }

  return (
    <Box overflowY={"auto"}>
      <HTMLTable striped style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Permissions</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((u) => (
            <Item key={u._id} user={u} onRemoved={() => onDelete()} />
          ))}
        </tbody>
      </HTMLTable>
      <Pagination
        onClick={onPaginate}
        total={data.total}
        skip={skip}
        limit={limit}
      />
    </Box>
  );
};
