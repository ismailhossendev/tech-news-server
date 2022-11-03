const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectID } = require('bson');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.odx3u2z.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run=async()=>{
    try{
        const allNews = client.db("techNews").collection("news");

        app.get('/news',async(req,res)=>{
            const cursor = allNews.find({});
            const news = await cursor.toArray();
            res.send(news)
        });
        app.delete('/news',async(req,res)=>{
            const id = req.query.id;
            const filter = {_id:ObjectID(id)}
            const result = await allNews.deleteOne(filter);
            if(result.deletedCount){
                res.send({
                    success:true,
                    message:"Successfully Deleted"
                })
            }else{
                res.send({
                    success:false,
                    message:'Please try again'
                })
            }
        })

    }
    catch{

    }
}
run().catch(e=>console.log(e));





app.listen(port,()=>{
    console.log('server is running');
})
