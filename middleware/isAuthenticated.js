const jwt = require("jsonwebtoken")
const promisify = require("util").promisify


const {users} = require("../model")
// const { decodeToken } = require("../services/decodeToken")


exports.isAuthenticated = async(req,res,next)=>{
    const token = req.cookies.token
    //check if token given or not
    if(!token){
        return res.send("You must be logged In first !!")
    }
    // verify token if it is legit or not
    const decryptedResult = await promisify(jwt.verify)(token, "haha")////haha is password here: yaha huna parni chai process.env.SECRETKEY yo ho.
    /*This is a alternative approach of promisify */
    // await promisify (jwt.verify)(token, process.env.SECRETKEY,(error,success)=>{
    //     if(success){

    //     }else{

    //     }
    // })



        //console.log(decryptedResult);
        
    //check if that id(userID) users table maa exist xa ki nai:::;
    const userExist = await users.findAll({
        where: {
            id : decryptedResult.id
        }
    })    
    //console.log(userExist)

    //check if length is zero or not(zero-> userExist Gardaina)
    if(userExist.length == 0){
        res.send("user with that token doesn't exist")
    }else{
        req.user = userExist; 
        req.userId  = userExist[0].id
        req.organizationNumber = userExist[0].currentOrganization

        //decryptedResult.id

        //mathi hamile userExist ko pura array nai pass gareko xau
        //or if id matra pass garnu parey::
        //req.userId  = userExist[0].id   grnu paryo

        //if userExist garxa vani usle blog create pani garna pauxa,
        next() //next vaneko aba createBlog maa jani blogController.js bhitra.
    }
    }
