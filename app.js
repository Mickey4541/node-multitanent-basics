const express = require("express")
const app = express()


const userRoute = require("./route/userRoute")
const organizationRoute = require("./route/organizationRoute")
const { Server, Socket } = require("socket.io")
const { users } = require("./model/index")

//requiring database
require("./model/index")

app.set("view engine", "ejs")

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(require('cookie-parser')())

app.get("/",(req,res)=>{
    res.render("home")
})

app.use("",userRoute)
app.use("",organizationRoute)

const server = app.listen(3000,()=>{
    console.log("Nodejs has started at port 3000");
})

//configuring socket.io
const io = new Server(server)

//emit vaneko pathauni on vaneko listen garni
io.on("connection", (socket)=>{
    socket.on("register",async(data)=>{
        console.log(data);
        const { username, password, email } = data;
        try {
            await users.create({ username, password, email });
            socket.emit("response", "Registration successful");
        } catch (error) {
            console.error(error);
            socket.emit("response", "Registration failed");
        }
    // console.log("A user connected");
    // socket.on("hello", (data)=>{
    //     console.log(data);
    //     socket.emit("response", "Data was received in backend")
    // })
})
})