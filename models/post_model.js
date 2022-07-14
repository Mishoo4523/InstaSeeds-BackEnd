const mongoose = require('mongoose');
const {ObjectId}= mongoose.Schema.Types;


const postSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String ,
        required:true 
    },
    image:{
        type:String,
        default:"no image available"
    },
    author :{
        type:ObjectId,
        ref:"UserModel"
    }
});

mongoose.model("PostModel",postSchema);