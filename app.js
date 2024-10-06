const express = require("express")
const app = express()


const userRoute = require("./route/userRoute")
const organizationRoute = require("./route/organizationRoute")
const { Server, Socket } = require("socket.io")
const { users, sequelize } = require("./model/index")
const { QueryTypes } = require("sequelize")

//requiring database
require("./model/index")

app.set("view engine", "ejs")

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(require('cookie-parser')())

app.get("/",(req,res)=>{
    res.render("home")
})

//chat page here
app.get("/chat/:id", (req,res)=>{

    sequelize.query(`CREATE TABLE IF NOT EXISTS chats(
        id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        senderId INT REFERENCES users(id),
        receiverId INT REFERENCES users(id),
        messages VARCHAR(255) NOT NULL
        )`,{
            type : QueryTypes.CREATE
        })
    res.render("chat")
})


//individual private chat system:::
app.get("/users", async (req,res)=>{
    const userList = await users.findAll()
    res.render("users",{userList})
})


app.use("",userRoute)
app.use("",organizationRoute)

const server = app.listen(3000,()=>{
    console.log("Nodejs has started at port 3000");
})

//configuring socket.io
const io = new Server(server)

//emit vaneko pathauni on vaneko listen garni
// io.on("connection", (socket)=>{
//     console.log("User connected");
    
//     socket.on("register",async(data)=>{
//         console.log(data);
//         const { username, password, email } = data;
//         try {
//             await users.create({ 
//                 username, 
//                 password, 
//                 email 
//             });
//             socket.emit("response", "Registration successful");
//         } catch (error) {
//             console.error(error);
//             socket.emit("response", "Registration failed");
//         }
//     // console.log("A user connected");
//     // socket.on("hello", (data)=>{
//     //     console.log(data);
//     //     socket.emit("response", "Data was received in backend")
//     // })
// })
// socket.on("disconnect",()=>{
//     console.log("User disconnected")
// })
// })





//chat system starts here::::::::::
io.on("connection",(socket)=>{
    socket.on("message",async (msg)=>{
        //table maa insert
        console.log(msg);
        
        await sequelize.query(`INSERT INTO chats(senderId, receiverId,messages) VALUES(?,?,?)`,{
            type : QueryTypes.INSERT,
            replacements : [msg.senderId, msg.receiverId, msg.message]
        })
        //console.log(msg)
        io.emit("broadCastMessage",msg)//broadcast to all connected clients
    })
})