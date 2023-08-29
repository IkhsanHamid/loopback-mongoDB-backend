'use strict';

module.exports = function(Review) {
    // ==== insert data =====
    Review.insertData = async (data) => {
        try {
            const {ObjectID} = Review.getDataSource()
            const {Reviewer, CoffeeShop} = Review.app.models

            let inPublisherId, inCoffeeShopId
            inPublisherId = ObjectID(data.publisherId)
            inCoffeeShopId = ObjectID(data.coffeeshopId)

            const findReviewer = await Reviewer.findById(inPublisherId)
            if (!findReviewer) throw new Error('data dengan id tersebut tidak ditemukan')
            const findCoffeeShop = await CoffeeShop.findById(inCoffeeShopId)
            if (!findCoffeeShop) throw new Error('data dengan id tersebut tidak ditemukan')
            
            // return {status :"done ga bg? don", data_1 : findReviewer, data_2 : findCoffeeShop}
            if(findReviewer && findCoffeeShop) {
                const datas = {
                    date : new Date(),
                    rating: data.rating,
                    comments : data.comments,
                    publisherId : inPublisherId,
                    coffeeshopId : inCoffeeShopId
                }
                // await CoffeeShop.update()
                await Review.create(data)
                const findAll = await Review.find()
                const counters = findAll.reduce((sum,review) => sum + review.rating, 0)
                const average = counters / findAll.length
                await CoffeeShop.update({ _id: inCoffeeShopId }, { ratingCafe: average })
                return {status : "berhasil membuat data review", data : datas}
            } 

        } catch (error) {
            return Promise.reject(error)
        }
    }
    Review.remoteMethod("insertData", {
        description: ["Create data Review"],
        accepts: [
            { arg: "data", type: "object", http: { source: 'body' }, required: true, description: "body" },
        ],
        returns: {
            arg: "status", type: "object", root: true, description: "Return value"
        },
        http: { verb: "POST"}
    })

    // ====== get data ======
    Review.getDataJoin = async () => {
        try {
            const { ObjectID, connector } = Review.getDataSource();
            const CoffeeShopCollection = connector.collection("CoffeeShop");
    
            const ReviewCursor = await CoffeeShopCollection.aggregate([
                {
                    $lookup: {
                        from: "Review",
                        localField: "_id",
                        foreignField: "coffeeshopId",
                        as: "Reviews"
                    }
                },
                {
                    $unwind: { path: "$Reviews", preserveNullAndEmptyArrays: true }
                },
                {
                    $lookup: {
                        from: "Reviewer",
                        localField: "Reviews.publisherId",
                        foreignField: "_id",
                        as: "Reviewers"
                    }
                },
                {
                    $unwind: { path: "$Reviewers", preserveNullAndEmptyArrays: true }
                },
                {
                    $group: {
                        _id : "$_id",
                        name: {$first : "$name"},
                        city: {$first : "$city"},
                        alamat: { $first: "$alamat" },
                        reviewCafe : {
                            $push : {
                                _id : "$Reviews._id",
                                reviewDate: "$Reviews.date",
                                rating : "$Reviews.rating",
                                comments : "$Reviews.comments",
                                reviewerEmail: "$Reviewers.email"
                        }},
                    }
                }
            ]);
    
            const result = await ReviewCursor.toArray();
            return { status: "berhasil mendapatkan data", data: result };
        } catch (error) {
            return Promise.reject(error);
        }
    };
    
    Review.remoteMethod("getDataJoin", {
        description: "Mendapatkan data CoffeeShop beserta Review dan Reviewer",
        returns: {
            arg: "data",
            type: "object",
            root: true,
            description: "Data CoffeeShop, Review, dan Reviewer"
        },
        accepts: [
            {
                arg: "coffeeshopId",
                type: "string",
                // required: true,
                description: "ID dari coffee shop"
            },
            {
                arg: "publisherId",
                type: "string",
                // required: true,
                description: "ID dari reviewers"
            }
        ],
        http: { verb: "get" }
    });
    
    // soft delete =======
    Review.softdelete = async (reviewId) =>{
        try {
            const findId = await Review.findById({where : {id : reviewId }})
            if(findId) {
                await Review.deleteAll({id : reviewId})
                return {status : "sukses softdelete"}
            } else {
                throw new Error("gagal")
            }
        } catch (error) {
            return error
        }
    }

    Review.remoteMethod("softdelete", {
        description : ["soft delete"],
        accepts : [
            {arg : "reviewId", type : "string", required : true, description : "id review yang akan di delete"}
        ],
        returns : {arg : "Data", type : "array", root : true, description : "Return Value"},
        http : {verb : "PUT"}
    })

    Review.softdeleteV2 = async (reviewId) => {
        try {
            if(reviewId){
                const find = await Review.findById(reviewId)
                if(find) {
                    await Review.update({ _id : reviewId },{ isDeleted : true })
                    return {status : "sukses"}
                } else {
                    return "gagal"
                }
            }
        } catch (error) {
            throw error
        }
    }

    Review.remoteMethod("softdeleteV2", {
        description : ["soft delete"],
        accepts : [
            {arg : "reviewId", type : "string", required : true, description : "id review yang akan di delete"}
        ],
        returns : {arg : "Data", type : "array", root : true, description : "Return Value"},
        http : {verb : "PUT"}
    })
};
