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
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);

            const cursor = allNews.find({});
            const count = await cursor.count();
            const news = await cursor.skip(page * size).limit(size).toArray();
            res.send({news,count})
        });
        app.delete('/news',async(req,res)=>{
            const id = req.query.id;
            const filter = {_id:ObjectID(id)}
            const result = await allNews.deleteOne(filter);
            if(result.deletedCount > 0){
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
        });

        app.patch('/post/edit',async(req,res)=>{
            const id = req.query.id;
            const {title,media,summary} = req.body;
            const filter = {_id: ObjectID(id)};
            const updatedDoc = {
                $set:{
                    title,media,summary
                }
            };
            const result = await allNews.updateOne(filter,updatedDoc);
            // res.send(result.matchedCount)
            if(result.modifiedCount){
                res.send('server ok')
                console.log(result);
            }
        });

        app.get('/post/:id',async(req,res)=>{
            const id = req.params.id;
            const filter = {_id:ObjectID(id)};
            const result = await allNews.findOne(filter);
            res.send(result);
        })

    }
    catch{

    }
}
run().catch(e=>console.log(e));





app.listen(port,()=>{
    console.log('server is running');
})
