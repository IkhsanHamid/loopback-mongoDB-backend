'use strict';
const moment = require('moment');

module.exports = (detection) => {
  function groupDataByTwoHours(data) {
    const groupedData = [];

    const sortedData = data.sort((a, b) => moment(a.timestamp).diff(moment(b.timestamp)));

    let currentGroup = [];
    sortedData.forEach(entry => {
      if (currentGroup.length === 0 || moment(entry.timestamp).diff(moment(currentGroup[0].timestamp), 'hours') < 2) {
        currentGroup.push(entry);
      } else {
        groupedData.push(mergeDataInGroup(currentGroup));
        currentGroup = [entry];
      }
    });

    if (currentGroup.length > 0) {
      groupedData.push(mergeDataInGroup(currentGroup));
    }

    return groupedData;
  }

  function mergeDataInGroup(group) {
    const mergedData = {
      timestamp: group[0].timestamp,
      class_count: group.reduce((acc, entry) => {
        Object.keys(entry.class_count).forEach(key => {
          acc[key] = (acc[key] || 0) + entry.class_count[key];
        });
        return acc;
      }, {}),
    };

    return mergedData;
  }

  detection.getData = async (search, skip, limit) => {
    try {
      if (!search) {
        const getDataWithoutSearch = await detection.find(
          {
            fields: {
              timestamp: true,
              class_count: true,
            },
            order: 'timestamp DESC',
            skip: skip,
            limit: limit,
          }
        );

        const groupedData = groupDataByTwoHours(getDataWithoutSearch);
        const totalDataWithoutSearch = groupedData.length;

        return { data: groupedData, total: totalDataWithoutSearch };
      } else {
        const getDataWithSearch = await detection.find(
          {
            where: {
              timestamp: {
                like: search,
              },
            },
            fields: {
              timestamp: true,
              class_count: true,
            },
            order: 'timestamp DESC',
            skip: skip,
            limit: limit,
          }
        );

        const groupedData = groupDataByTwoHours(getDataWithSearch);
        const totalDataWithSearch = groupedData.length;

        return { data: groupedData, total: totalDataWithSearch };
      }
    } catch (error) {
      throw error;
    }
  };

  // update function, count class_count per 2 jam.

  detection.remoteMethod("getData", {
    description: ["get data sawit"],
    accepts: [
      { arg: "search", type: "string", required: false, description: "search" },
      { arg: "skip", type: "string", required: false, description: "search" },
      { arg: "limit", type: "string", required: false, description: "search" },
    ],
    returns: {
      arg: "status", type: "object", root: true, description: "Return value"
    },
    http: { verb: "GET" }
  })

  detection.getFiles = async (search, skip, limit) => {
    try {
      if (!search) {
        const getDataWithoutSearch = await detection.find({
          fields: {
            timestamp: true,
            file_paths: true
          },
          order: 'timestamp DESC',
          skip: skip,
          limit: limit
        })

        const totalDataWithoutSearch = await detection.count();

        return { data: getDataWithoutSearch, total: totalDataWithoutSearch };
      } else {
        const getDataWithSearch = await detection.find(
          {
            where: {
              timestamp: {
                like: search,
              },
            },
            fields: {
              timestamp: true,
              file_paths: true,
            },
            order: 'timestamp DESC',
            skip: skip,
            limit: limit,
          }
        );

        const totalDataWithSearch = await detection.count();
        return { data: getDataWithSearch, total: totalDataWithSearch };
      }
    } catch (error) {
      throw error
    }
  }

  detection.remoteMethod("getFiles", {
    description: ["get file data sawit"],
    accepts: [
      { arg: "search", type: "string", required: false, description: "search" },
      { arg: "skip", type: "string", required: false, description: "search" },
      { arg: "limit", type: "string", required: false, description: "search" },
    ],
    returns: {
      arg: "status", type: "object", root: true, description: "Return value"
    },
    http: { verb: "GET" }
  })

  detection.history = async (search, skip, limit) => {
    try {
      if (!search) {
        const getHistory = await detection.find({
          order: 'timestamp DESC',
          skip: skip,
          limit: limit
        })
        const totalData = await detection.count();
        return { data: getHistory, total: totalData }
      } else {
        const getHistory = await detection.find({
          where: {
            timestamp: {
              like: search,
            },
          },
        })
      }

    } catch (error) {
      throw error
    }
  }

  detection.remoteMethod("history", {
    description: ["get file data all sawit"],
    accepts: [
      { arg: "search", type: "string", required: false, description: "search" },
      { arg: "skip", type: "string", required: true, description: "search" },
      { arg: "limit", type: "string", required: true, description: "search" },
    ],
    returns: {
      arg: "status", type: "object", root: true, description: "Return value"
    },
    http: { verb: "GET" }
  })
}
