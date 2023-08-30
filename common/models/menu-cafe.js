'use strict';

module.exports = function(Menucafe) {
    // === post menu =====
    Menucafe.insertData = async (data) => {
        try {
            const {ObjectID} = Menucafe.getDataSource()
            // const {CoffeeShop} = Menucafe.app.models
            // const MenucafeCollection = connector.collection("Menucafe")

            let inCoffeeShopId = ObjectID(data.coffeshopId)

            const find = await Menucafe.findOne({where : {menuName: data.menuName}})
            const exist = data.menuName
            if(exist === find.menuName){
                throw new Error("nama menu telah tersedia, masukkan menu yang lain")
            } else {
                if (!["coffee", "non-Coffee", "food"].includes(data.category)) {
                    return { status: "Category tidak valid. Pilih di antara: coffee, non-Coffee, food" };
                }
                const datas = {
                    coffeshopId : inCoffeeShopId,
                    menuName : data.menuName,
                    category : data.category,
                    stock : data.stock
                }
                await Menucafe.create(datas)
                return {status : "berhasil menambahkan data", data : datas}
            }
        } catch (error) {
            throw error
        }
    }

    Menucafe.remoteMethod("insertData", {
        description: ["Create data menu cafe"],
      accepts: [
        { arg: "data", type: "object", http: { source: 'body' }, required: true, description: "body" },
      ],
      returns: {
        arg: "status", type: "object", root: true, description: "Return value"
      },
      http: { verb: "POST"}
    })

    // ==== update stock =====
    Menucafe.updateStock = async (menucafeId, data) => {
        try {
            const find = await Menucafe.findOne({where: {id : menucafeId}});
            console.log("find", find);
            console.log("data", data);
            if (!find) {
                throw new Error("Data tidak ditemukan");
            } else {
                const currentDate = new Date();
                // find.lastStock = find.stock
                // find.stock = data.stock
                // find.updatedStockAt = currentDate
                // await find.save()
                const updatedData = {
                    updatedStockAt: currentDate,
                    stock: data.stock,
                    lastStock: find.stock
                }
                // console.log("mmasuk", updatedData);
                await Menucafe.update({id : find.id},updatedData);
                return { status: "Berhasil update stock" };
            }
        } catch (error) {
            throw error;
        }
    };
    Menucafe.remoteMethod("updateStock", {
        description : ["update stock"],
        accepts : [
            {arg : "menucafeId", type : "string", required : true, description : "id menu yang akan di update"},
            {arg : "data", type : "object", http: { source: 'body' }, description : "data stock"}
        ],
        returns : {arg : "Data", type : "array", root : true, description : "Return Value"},
        http : {verb : "PUT"}
    })

    

};
