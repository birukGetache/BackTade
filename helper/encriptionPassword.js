const bcrypt = require("bcrypt");
const generateSalt = require('./generateSalt');
const encryptPassword = (password) =>{
    return bcrypt.hashSync(password,generateSalt());
}
module.exports = encryptPassword;