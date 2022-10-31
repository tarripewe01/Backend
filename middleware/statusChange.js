const ProductModel = require('../models/Product')
const moment = require('moment')
const cron = require('node-cron')

function sumStr(str){
    let strArr = str.split("-");
    // let sum = strArr.reduce(function(total, num){
    //   return parseInt(total) + parseInt(num);
    // });
    let sum = strArr.join("")
    return parseInt(sum);
}


const statusChange = async() => {
    cron.schedule('* * * * *', async() => {
        const data = await ProductModel.find()
    data.forEach(async function(dat) {
        const DateNow = sumStr(moment(Date.now()).format("YYYY-MM-DD").valueOf())
        const StartDate = sumStr(moment(new Date(dat.tanggal_mulai)).format("YYYY-MM-DD"))
        const EndDate= sumStr(moment(new Date(dat.tanggal_selesai)).format("YYYY-MM-DD"))
        if(StartDate <= DateNow && DateNow <= EndDate ){
            await ProductModel.findByIdAndUpdate(dat._id, {
                $set : { status_lelang: "Aktif" }
            })
        }else {
            await ProductModel.findByIdAndUpdate(dat._id, {
                $set : { status_lelang: "Tidak Aktif" }
            })
            
        }
    })
      });

    
}

module.exports = statusChange;