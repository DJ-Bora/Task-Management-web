const mongoose = require("mongoose")

const conn = async (req, res) =>{
    try{
        await mongoose.connect("mongodb+srv://user:admin@cluster0.uw9qo.mongodb.net/")
    .then(() =>{
        console.log("connect");
    });
    } catch(error){
        res.status(400).json({
            message:"not connected"
        });
    }
};

conn();