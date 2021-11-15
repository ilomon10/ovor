export const fetchData = async (onErr, feathers, query = {}, series) => {
  const deviceIds = [];
  const dataSourceIds = [];

  series.map((s) => {
    switch (s.type) {
      case "dataSource":
        dataSourceIds.push(s.id);
        break;
      case "device":
      default:
        deviceIds.push(s.id);
    }
  });

  let dataSources = [];
  let devices = [];

  try {
    if (deviceIds.length > 0) {
      let { data } = await feathers.devices.find({
        query: {
          _id: { $in: deviceIds },
          $select: ["_id", 'fields', 'name']
        }
      });
      devices = data;
    }
    if (dataSourceIds.length > 0) {
      let { data } = await feathers.dataSources.find({
        query: {
          _id: { $in: dataSourceIds },
          $select: ["_id", 'fields', 'name']
        }
      });
      dataSources = data;
    }
  } catch (e) {
    onErr(e);
    return;
  }

  const q = {
    dataSourceId: { $in: dataSourceIds },
    $select: ["_id", 'data', 'dataSourceId', "createdAt"],
    $sort: { createdAt: -1 },
    ...query,
  }

  let dataLake = [];
  try {
    let { data } = await feathers.dataLake.find({ query: q });
    dataLake = data;
  } catch (e) {
    onErr(e);
    return;
  }

  return {
    deviceIds,
    dataSourceIds,
    devices,
    dataSources,
    dataLake
  }
}