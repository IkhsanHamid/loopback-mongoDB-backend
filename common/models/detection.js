'use strict';

module.exports = (detection) => {
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
              class_count: true,
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
      throw error;
    }
  };

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
