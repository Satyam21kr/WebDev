
// MODULE REQUIRES START

const express = require('express')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const UserModel = require('./UserModel')
const jwt = require('jsonwebtoken')
const Cookies = require('cookies')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt');
const ContactModel = require('./ContactModel')
const cors = require('cors')

// MODULE REQUIRES END


// BASIC BUILD UP START

const PORT = 5000 || process.env.PORT

mongoose.connect('mongodb+srv://nikunj05108:qwertylana@data.ulz8yxy.mongodb.net/?retryWrites=true&w=majority').then(res => {
    console.log('DB Connected Successfully')
}).catch(err => {
    console.log('ERROR Connecting DB')
})

const app = express()

app.use(cors({
    origin : "*"
}))
app.use(express.json())


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nikunj05108@gmail.com',
        pass: process.env.GMAIL_PASSWORD
    }
});

let mailOptions = {
    from: 'nikunj05108@gmail.com',
    to: '',
    subject: 'Sending Email using Node.js',
    text: ''
};


// BASIC BUILD UP END

// MIDDLEWARE START

function AuthVerify(req, res, next) {
    
    let cookies = new Cookies(req, res)

    jwt.verify(cookies.get('token'), 'SECRET', {} ,(err, dec) => {
        if(err) {
            res.send({
                error : 'Token Expired',
                status : false
            })
        }else {
            next()
        }
    })
}

// MIDDLEWARE END


// ROUTINGS START

app.post('/POST_LOGIN', (req, res) => {
    console.log(req.body)
    if(req.body.email && req.body.password) {



        UserModel.findOne({ 'email' : req.body.email }).then(findResult => {

            bcrypt.compare(req.body.password, findResult.password, function(err, result) {
                if(err) {
                    res.send({
                        error : 'Password Incorrect',
                        status : false
                    })
                }
                else {
                    const token = jwt.sign({
                        email : req.body.email
                    },'SECRET', { expiresIn : '1hr' })

                    let cookie = new Cookies(req, res)

                    cookie.set('access_token', token)

                    res.send({
                        success : 'Logined Successfully',
                        status : true
                    })
                }
            });


        }).catch(findErr => {
            console.log('ERROR')
            res.send({
                error : 'Wrong Email or Password',
                status : false
            })
        })
    }else {
        res.send({
            error : 'Must provide Email and Password',
            status : false
        })
    }
})

app.post('/POST_REGISTER', (req, res) => {
    console.log(req.body)

    if(req.body.email && req.body.password && req.body.firstName) {
        UserModel.findOne({ 'email' : req.body.email }).then(findResult => {
            if(findResult == null) {

                bcrypt.hash(req.body.password, 10).then(hash => {
                    req.body.password = hash

                    const token = jwt.sign({
                        data : req.body
                    },'SECRET', { expiresIn : '10min' })

                    mailOptions.to = req.body.email
                    mailOptions.text = process.env.WEB_START_ADD+'GET_VERIFY_EMAIL/'+token

                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

                    res.send({
                        success : 'Email Sended Successfully',
                        status : true
                    })
                })
            }
            else{
                res.send({
                    success : 'Already Signed Up',
                    status : false
                })
            }

        }).catch(findErr => {
            console.log('ERROR')
            res.send({
                error : 'Wrong Data Provided',
                status : false
            })
        })
    }else {
        res.send({
            error : 'Must provide FirstName, Email and Password',
            status : false
        })
    }
})

app.get('/GET_VERIFY_EMAIL/:token', (req, res) => {
    jwt.verify(req.params.token, 'SECRET', {} ,(err, dec) => {
        if(err) {
            console.log(err)
            res.send({
                error : 'Token Expired',
                status : false
            })
        }else {
            console.log(dec)

            UserModel.findOne({ 'email' : dec.data.email }).then((findResult) => {
                if(findResult == null) {
                    UserModel.create(dec.data).then(createResult => {
                        console.log('Created New User and Verified')
                    })
                }else {
                    console.log('Already User is Inserted')
                }
            })



            res.send({
                success : 'Successfully Signed Up',
                status : true
            })
        }
    })
})

app.post('/POST_CONTACT_US', AuthVerify, (req, res) => {
    if(req.body.email && req.body.name) {
        ContactModel.create(req.body).then(createRes => {
            console.log('Contact Added')

            res.send({
                success : 'Contact Added',
                status : true
            })
        })
    }else {
        res.send({
            error : 'Must provide E-Mail and Name',
            status : false
        })
    }
})

// ROUTINGS END


// SERVER LISTEN START

app.listen(PORT, () => {
    console.log(`SEVER IS ON AT PORT ----> ${PORT}`)
})

// SERVER LISTEN END
