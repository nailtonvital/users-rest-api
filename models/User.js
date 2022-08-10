const bcrypt = require("bcrypt")
const knex = require("../database/connection")

class User{

    async findAll() {
        try{
            let result = await knex.select(["id","name","email","role"]).table("users")
            return result
        } catch(err){
            console.log(err)
            return []
        }
    }

    async findById(id) {
        try {
            let result = await knex.select(["id", "name", "email", "role"]).where({id:id}).table("users")
            if(result.length > 0){
                return result[0]
            } else{
                return undefined
            }
        } catch (err) {
            console.log(err)
            return undefined
        }
    }


    async new(email, password, name){
        try {

            var hash = await bcrypt.hash(password, 10)
            await knex.insert({ email, password: hash, name, role: 0 }).table("users")

            
        } catch (error) {
            console.log(error)
        }
    }

    async findEmail(email){
        try {
            var result = await knex.select("*").from("users").where({email: email})

            if(result.length > 0){
                return true
            } else {
                return false
            }

        } catch (error) {
            console.log(error)
            return false
        }
    }

    async update(id,email,name,role){
        let user = await this.findById(id)

        if(user != undefined){
            var editUser = {}
            if(email != undefined){
                if(email != user.email){
                    var result = await this.findEmail(email)
                    if (result == false){
                        editUser.email = email
                    } else{
                        return { status: false, err: "Email alredy exists"}
                    }
                }
            }
            if(name != undefined){
                editUser.name = name
            }

            if (role != undefined) {
                editUser.role = role
            }

            try {                
                await knex.update(editUser).where({id: id}).table("users")
                return true
            } catch (error) {
                console.log(error)
            }

        } else{
            return {status:false, err: "the user doesn't exist"}
        }
    }
}

module.exports = new User()