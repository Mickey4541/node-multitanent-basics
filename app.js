const express = require("express")
const app = express()

//requiring database
require("./model/index")


app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get("/",(req,res)=>{
    res.send("I am alive")
})



app.listen(3000,()=>{
    console.log("Nodejs has started at port 3000");
})