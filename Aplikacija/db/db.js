const { MongoClient }= require('mongodb')

let dbConnection;
let uri ='mongodb+srv://akitokivuki:dra.zo969@swe.blyrocw.mongodb.net/'

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(uri)
        .then((client)=>{
            dbConnection=client.db()
            return cb()
        })
        .catch(err=>{
            console.log(err)
            return cb(err)
        })
    },
    getDb: () => dbConnection
}