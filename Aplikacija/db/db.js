const { MongoClient }= require('mongodb')

let dbConnection;
let uri ='mongodb+srv://xxx'

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