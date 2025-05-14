import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
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
  ]

},{timestamps:true})

export const Task = mongoose.model("Task",taskSchema);





