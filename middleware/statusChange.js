const ProductModel = require("../models/Product");
const moment = require("moment");
const cron = require("node-cron");

function sumStr(date, time) {
  let strArr1 = date.split("-");
  let strArr2 = time.split(":");
  // let sum = strArr.reduce(function(total, num){
  //   return parseInt(total) + parseInt(num);
  // });
  let sum = strArr1.join("") + strArr2.join("");
  return parseInt(sum);
}

const statusChange = async () => {
  // cron.schedule('* * * * *', async() => {
  const data = await ProductModel.find();
  data.forEach(async function (dat) {
    const DateNow = sumStr(
      moment(Date.now()).format("YYYY-MM-DD").valueOf(),
      moment(Date.now()).format("HH:mm").valueOf()
    );
    const StartDate = sumStr(
      moment(new Date(dat.tanggal_mulai)).format("YYYY-MM-DD"),
      dat.waktu_mulai
    );
    const EndDate = sumStr(
      moment(new Date(dat.tanggal_selesai)).format("YYYY-MM-DD"),
      dat.waktu_selesai
    );
    if (StartDate <= DateNow && DateNow <= EndDate) {
      await ProductModel.findByIdAndUpdate(dat._id, {
        $set: { status_lelang: "Aktif" },
      });
    } else if (DateNow > EndDate) {
      await ProductModel.findByIdAndUpdate(dat._id, {
        $set: { status_lelang: "Selesai" },
      });
    } else if (DateNow < StartDate) {
      await ProductModel.findByIdAndUpdate(dat._id, {
        $set: { status_lelang: "Tidak Aktif" },
      });
    } else {
      await ProductModel.findByIdAndUpdate(dat._id, {
        $set: { status_lelang: "Tidak Aktif" },
      });
    }
  });
  //   });
};

module.exports = statusChange;
