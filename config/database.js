const mongoose = require('mongoose');


module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("ket noi database thanh cong")

    } catch (error) {
        console.log("ket noi database that baiiiii")
        console.log(error)
        
    }
  
}
