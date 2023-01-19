const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const UserModel = require('./Models/User.Model')
const app = express()
const port = 3200
const connection = require('./config/db')
require('dotenv').config()

app.use(cors())
app.use(express.static('page'));

app.get('/', (req, res) => {
    res.send({ 'msg': "welcome" })
})

app.get('/emailverify', (req, res) => {
    let token = req.query.token
    // console.log(token);
    jwt.verify(token, process.env.EMAILVARIFICATION, async (err, decoded) => {
        if (err) {
            console.log(err);
            res.sendFile(__dirname + '/page/expire.html');
            console.log('failed expire:', err);
        } else {
            // console.log(decoded)
            let { email, hash, name } = decoded
            let userExist = await UserModel.find({ email })
            if (userExist.length == 0) {
                console.log(decoded);
                try {
                    let newUser = new UserModel({ email, name, password: hash })
                    await newUser.save()
                    console.log('user saved');
                } catch (err) {
                    console.log(err);
                    // return res.status(500).json({ err: 'error while saving user' })
                }
                return res.sendFile(__dirname + '/page/sucess.html');
                console.log(decoded);
            } else {
                res.sendFile(__dirname + '/page/allready.html');
            }
        }
    });
})

app.listen(port, async () => {
    try {
        await connection
        console.log('connected to db');
    } catch (err) {
        console.log('failed to connect to db: ', err);
    }
})