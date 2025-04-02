const bcrypt = require('bcrypt');

const validatePassword = (password,hashPassword) =>{
    return bcrypt.compare(password, hashPassword);
}
module.exports = validatePassword;
