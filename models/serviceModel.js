const mongoose=require('mongoose')

const serviceSchema = new mongoose.Schema({
  post: String,
});


const Service=mongoose.model('Service',serviceSchema)

module.exports=Service