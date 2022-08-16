const User = require("../models/User")
const PasswordToken = require("../models/PasswordToken")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

var secret = "Google API Client Library for JavaScript"
class UserController{

    async index(req,res){
        var users = await User.findAll()
        res.json(users)
    }

    async findUser(req, res){
        let { id } = req.params
        var user = await User.findById(id)
        if(user == undefined){
            res.status(404).json({})
        }else{
            res.status(200).json(user)
        }
    }
    
    async create(req,res){
        const { email, name, password } = req.body

        if (email == undefined) {
            res.status(400).json({ err: "invalid email" }) 
            return
        };

        const emailExists = await User.findEmail(email)

        if(emailExists){
            res.status(406).json("Email alredy exists")
            return
        }

        await User.new(email,password,name)
            
        res.status(200).json("OK")


    }

    async edit(req, res){
        var { id, name, role, email } = req.body
        var result = await User.update(id,email,name,role)
        
        if(result != undefined){
            if(result == true){
                res.status(200).json("OK!")
            }else{
                res.status(406).json(result.err)
            }
        }else{
            res.status(406).json("server error")
        }
    }

    async remove(req, res){
        var { id } = req.params

        var result = await User.delete(id)

        if(result.status){
            res.status(200)
            res.send("OK")
        } else{
            res.status(200)
            res.send(result.err)
        }
    }

    async recoverPassword(req, res){
        const email = req.body.email
        var result = await PasswordToken.create(email)
        if(result.status){
            res.status(200).json(result.token)
        } else{
            res.status(406).json(result.err)
        }
    }

    async changePassword(req, res){
        let {token} = req.body
        let { password } = req.body

        let isTokenValid = await PasswordToken.validate(token)

        if(isTokenValid.status){
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token)
            res.status(200).json("password changed")
        } else{
            res.status(406).json("Invalid Token")
        }
    }

    async login(req,res){
        let {email, password} = req.body
        
        var user = await User.findByEmail(email)

        if(user != undefined){
           let result= await  bcrypt.compare(password, user.password)
           if(result){
                var token = jwt.sign({email: user.email, role: user.role}, secret)
                res.status(200).json({token: token})
           }else{
            res.status(404).json("senha incorreta")
           }
        }else{
            res.json({status: false})
        }
    }
}

module.exports = new UserController()