import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { HTMLTable, Menu, MenuItem, Colors } from '@blueprintjs/core';
import { FeathersContext } from 'components/feathers';
import { Box } from 'components/utility/grid';

const Notification = () => {
  const feathers = useContext(FeathersContext);
  const [log, setLog] = useState([]);
  useEffect(() => {
    const onLoggerCreated = (log) => {
      console.log(log);
    }
    feathers.logger().on('created', onLoggerCreated);
    return () => {
      feathers.logger().removeListener('created', onLoggerCreated);
    }
  }, []);
  useEffect(() => {
    const fetch = async () => {
      let log = (await feathers.logger().find({
        query: { $select: ['intent', 'message', 'createdAt'], $sort: { createdAt: -1 } }
      })).data;
      setLog(log);
    }
    fetch();
  }, []);
  return (
    <Box py={2}>
      {log.map(l => (
        <Box key={l._id} px={3} mb={2}>
          <Box fontSize={0} color={Colors.GRAY3}>{moment(l.createdAt).calendar()}</Box>
          <Box fontSize={2}>{l.message}</Box>
        </Box>
      ))}
    </Box>
  )
}

export default Notification;