const express = require('express');
const app = express(); // Initialize express


const db = require("../../model/index")
const { QueryTypes } = require("sequelize")
const sequelize = db.sequelize

const generateRandomOrganizationNumber = () => {
    return Math.floor(10000000 + Math.random() * 90000000)
};


exports.createOrganization = async (req,res)=>{
    const userId = req.userId
    const {name,address,vatNo} = req.body
    let organizationNumber = generateRandomOrganizationNumber();

    if(!name || !address || !vatNo){
        res.send("Please send name, address, vatNo")
    }

    //CREATE BLOG TABLE IF NOT EXISTS
    await sequelize.query(`CREATE TABLE IF NOT EXISTS organization_${organizationNumber}(
        id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
        userId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        name VARCHAR(255),
        address VARCHAR(255),
        vatNo VARCHAR(255)
    )`,{
        type : QueryTypes.CREATE
    })


    await sequelize.query(`INSERT INTO userHistory_${userId}(organizationNumber)
        VALUES(?)`,{
            type : QueryTypes.INSERT,
            replacements : [organizationNumber]
        })


    await sequelize.query(`CREATE TABLE IF NOT EXISTS payment_${organizationNumber}(
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        amount REAL,
        partyName VARCHAR(255)
    )`,{
        type : QueryTypes.CREATE
    })



    const userData = await db.users.findAll({
        where : {
            id : userId
        }
    })
    userData[0].currentOrganization = organizationNumber
    await userData[0].save()


    //INSERTING
    await sequelize.query(`INSERT INTO organization_${organizationNumber}(name, address, vatNo, userId) VALUES(?,?,?,?)`,{
        type : QueryTypes.INSERT,
        replacements : [name,address,vatNo,userId]
    })
    res.json({
        message : "Organization created Successfully",
        organizationNumber : organizationNumber
    })
}





exports.createPayment = async(req, res) => {
    const organizationNumber = req.organizationNumber

    const {partyName, amount} = req.body

    await sequelize.query(`INSERT INTO payment_${organizationNumber}(partyName,amount) VALUES(?,?)`,{
        type : QueryTypes.INSERT,
        replacements : [partyName, amount]
    })
    res.json({
        message : "Payment inserted successfully"
    })
}



//DELETE user
exports.deleteUser = async (req,res)=>{
    const userId = req.userId

    //grab all assoociated organization
    const orgs = await sequelize.query(`SELECT organizationNumber FROM userHistory_${userId}`,{
        type : QueryTypes.SELECT
    })

    // res.json({orgs})
    await sequelize.query(`DELETE FROM users WHERE id=?`,{
        type : QueryTypes.DELETE,
        replacements  : [userId]
    })

    for(var i=0;i<orgs.length;i++){
        await sequelize.query(`DROP TABLE organization_${orgs[i].organizationNumber}`,{
            type : QueryTypes.DELETE
        })
    }
    res.json({
        message : `User Deleted Successfully ${userId}`
    })
}

//join table
exports.getOrganization = async(req,res)=>{
    const currentOrganization = req.organizationNumber
    const data = await sequelize.query(`SELECT * FROM organization_${currentOrganization} JOIN users ON organization_${currentOrganization}.userId = users.id`,{
        type : QueryTypes.SELECT
    })
    res.json({
        data
    })
    // const data = await sequelize.query(`SELECT users.username,org.* FROM organization_${currentOrganization} JOIN users ON organization_${currentOrganization} org JOIN users users ON org.userId = users.id`,{
    //     type : QueryTypes.SELECT
    // })
    // res.json({
    //     data
    // })
}