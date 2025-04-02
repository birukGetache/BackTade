const bcrypt = require('bcrypt');

const generateSalt = () =>{
    return bcrypt.genSaltSync(10);
}
module.exports = generateSalt;