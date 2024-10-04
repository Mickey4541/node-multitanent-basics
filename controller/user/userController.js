const { users } = require("../../model");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");






exports.registerUser = async (req, res) => {
    //yesari try catch bhitra garepani hunxa.
    // try {
          //console.log(req.body);
    const { email, username, password } = req.body
    //insert in to table (users)
    await users.create({
        email: email,
        password: bcrypt.hashSync(password, 8),
        username: username,
    })
    res.send("user Created Successfully")
    // } catch (e) {
    //     //res.send(e.message)
    //     req.flash("error","Something went wrong, Try Again.")
    //     res.redirect("/register")
    // }
}



//LOGIN STARTS FORM HERE:::::::::::::::::::::::::::::::;;;

exports.loginUser = async (req, res) => {
    console.log(req.body)

    const { email, password } = req.body
    //serverside validation
    if (!email || !password) {
        return res.send("Email and password are required")
    }



    //check if that email exists or not
    //findByPk -> returns {}.{}is object.
    //findAll -> returns [{}] and this is array bhitra object.
    const associateDataWithEmail = await users.findAll({
        where: {
            email: email

        }
    })
    //aani findbypk or findone garim vani tala length ==0 garera length check
    //garako xam tyo garna paidaina.
    if (associateDataWithEmail.length == 0) {
        res.send("User with thar email doesn't exists")
    } else {
        //check if password also matches
        const associateDataWithEmailPassowrd = associateDataWithEmail[0].password
        const isMatched = bcrypt.compareSync(password, associateDataWithEmailPassowrd)//it returns true or false
        if (isMatched) {
            //Generate token here:::::::::
            const token = jwt.sign({ id: associateDataWithEmail[0].id }, "haha", {
                expiresIn: "15d"
            })
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 //15 min ko millisocond means 15 min paxi token expire hunxa,
            }) //browser maa application tab vitra cookie vanney maa save hunxa.


            console.log("This is token..." + token);

            res.send("Logged in")
        } else {
            res.send("Invalid password or email ")
        }
    }
    //if the email exist it gives=>[] and xa vaney[{name: "", password: "", email: ""}]
}
