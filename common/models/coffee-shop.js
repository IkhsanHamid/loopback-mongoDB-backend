'use strict';

module.exports = function(Coffeeshop) {
    // ==== insert data ======
    Coffeeshop.insertData = async (data) => {
        try {
            const dataCreate = {
                name : data.name,
                city : data.city,
                alamat : data.alamat
            }
            if(!data.name && !data.city && !data.alamat){
                throw new Error("data nama, city dan alamat tidak boleh kosong!!!")
            } else{
                const result = await Coffeeshop.create(dataCreate)
                return {status : "berhasil membuat data CoffeShop", result}
            }
        } catch (error) {
            throw error
        }
    }

    Coffeeshop.remoteMethod("insertData", {
    description: ["Create data CoffeShop"],
      accepts: [
        { arg: "data", type: "object", http: { source: 'body' }, required: true, description: "body" },
      ],
      returns: {
        arg: "status", type: "object", root: true, description: "Return value"
      },
      http: { verb: "POST"}
    })
    
    // ====== get data ======
    Coffeeshop.getData = async () => {
        try {
            const result = await Coffeeshop.find()
            return Promise.resolve({status : "Berikut Data Coffee Shop", data : result})
        } catch (error) {
            return Promise.reject(error)
        }
    }
    Coffeeshop.remoteMethod("getData", {
    description: ["Get data CoffeShop"],
    //   accepts: [
    //     { arg: "data", type: "object", http: { source: 'body' }, required: true, description: "body" },
    //   ],
      returns: {
        arg: "status", type: "array", root: true, description: "Return value"
      },
      http: { verb: "GET"}
    })
};
