const mongoose = require("mongoose");
module.exports.isValidObjectId = (id) =>{
    if(mongoose.Schema.Types.ObjectId.valid(id))
        return true;
    return false;
}