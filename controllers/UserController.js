const User = require("../models/User")
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
}

module.exports = new UserController()