const jwt = require('jsonwebtoken');
const config = require('config');
let SECKET = config.get("jwtPrivateKety");
module.exports.generateToken = (payload)=>{
    return jwt.sign(payload , SECKET);
}
