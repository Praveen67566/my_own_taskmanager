import mongoose from "mongoose";

const CompletedtaskSchema = new mongoose.Schema({
  due:{
    type:Date
  },
  title:{
    type:String,
  },
  assoc:{
    type:String
  },
  status:{
    type:String,
    enum:['Completed','Pending'],
    default:'Pending'
  },
  lastupdated:{
    type:Date
  },important:{
    type:Boolean,
  },
  module:{
    type:String,
  },
  category:{
    type:String
  },
  subtask:[
    {type:String}
  ],
  marks:{
    type:Number
  },
  taskid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Task"
  }
},{timestamps:true})

export const CompletedTask = mongoose.model("CompletedTask",CompletedtaskSchema);