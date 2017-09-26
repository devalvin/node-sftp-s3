"use strict";

var Promise = require('bluebird');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('hawkeye', 'root', 'root', {
    host: 'mysql'
});

class UserValidator {
    constructor(params){
        this.username = params.username;
        this.password = params.password;
    }

    Validate(){
        return new Promise((resolve,reject) => {
            var result = {};
            sequelize.query("SELECT id FROM user where email = :username AND password = sha1(concat(salt, :password)) ",
                { replacements: { username: this.username, password : this.password }, type: sequelize.QueryTypes.SELECT }
            ).then(res => {

                if(typeof res === 'object' && Object.keys(res).length <= 0){
                    result = {
                        "res" : false,
                        "code" : "invalid username and/or password"
                    };
                    console.log("invalid username and/or password");
                }else{
                    result = {
                        "res" : true,
                        "api_user" : res[0]
                    };
                    console.log("user found in the db");
                }
                resolve(result);
            }).catch((err)=>{
                result = {
                    "res" : false,
                    "code" : err.message
                };
                console.log("validating username and password: ERR",err.message);
                reject(result);
            });
        });
    }
}

module.exports = UserValidator;