"use strict";

var Promise = require('bluebird');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('hawkeye', 'root', 'root', {
    host: 'localhost'
});

class UserValidator {
    constructor(params){
        this.username = params.username;
        this.password = params.password;
    }

    Validate(){
        // return new Promise((resolve,reject) => {
        //
        // });
        var result = {};
        sequelize.query("SELECT id FROM user where email = :username AND password = sha1(concat(salt, :password)) ",
            { replacements: { username: this.username, password : this.password }, type: sequelize.QueryTypes.SELECT }
        ).then(res => {

            if(typeof res === 'object' && Object.keys(res).length <= 0){
                result = {
                    "res" : false,
                    "msg" : "invalid username and/or password"
                };
                console.log("invalid username and/or password");
            }else{
                result = {
                    "res" : true,
                    "msg" : res[0]
                };
                console.log("user found in the db");
            }
            return result;
        }).catch((err)=>{
            result = {
                "res" : false,
                "msg" : err.message
            };
            console.log("validating username and password: ERR",err.message);
            return result;
        });
    }
}

module.exports = UserValidator;