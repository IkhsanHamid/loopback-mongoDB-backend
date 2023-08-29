'use strict';

module.exports = function(Reviewer) {
    Reviewer.insertData = async (data) => {
        try {
            const datas = {
                email : data.email,
                password : data.password
            }
            await Reviewer.create(datas)
            return {status : "data berhasil dibuat", data : datas}
        } catch (error) {
            return Promise.reject(error)
        }
    }

    Reviewer.remoteMethod("insertData", {
        description: ["Create data Reviewer"],
        accepts: [
            { arg: "data", type: "object", http: { source: 'body' }, required: true, description: "body" },
        ],
        returns: {
            arg: "status", type: "object", root: true, description: "Return value"
        },
        http: { verb: "POST"}
    })

    Reviewer.getAll = async () => {
        try {
            const getData = await Reviewer.find()
            const counters = getData.length
            return {status : "data berhasil didapatkan", jumlah_data : counters, data: getData}
        } catch (error) {
            return Promise.reject(error)
        }
    }

    Reviewer.remoteMethod("getAll", {
        description: ["Get data Reviewers"],
        returns: {
            arg: "status", type: "array", root: true, description: "Return value"
        },
        http: { verb: "GET"}
    })
};
