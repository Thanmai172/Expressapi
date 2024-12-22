const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

//configure dotenv to load the .env files

dotenv.config();

//initialize the express application

const app = express();
//access the env variables
const PORT = process.env.PORT;
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("mongodb is connected successfully"))
.catch((error) => console.log("error", error));

const itemSchema = new mongoose.Schema({
    name:{type:String, required:true},
    description :{type:String},
    price:{type:Number, required:true}
});

const Item = mongoose.model("Item", itemSchema);

// do the api call
app.get('/api/items', async(req, res) => {
    try{
        const items = await Item.find();
        res.status(200).json(items);
    } catch(error){
        res.status(500).json({error:error.message})
    }
})

app.post("/api/items", async(req,res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch(error){
        res.status(400).json({error:error.message})
    }
})

app.listen(PORT, () => {
    console.log(`Server is running at the port number https://localhost:${PORT}`)
})
