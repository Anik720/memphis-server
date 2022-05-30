const express=require('express')
const cors=require('cors')
const serviceRoutes=require('./Routes/serviceRoutes')

const app=express()



app.use(cors())
app.use(express.json());

app.use('/api/v1/service',serviceRoutes)

module.exports=app