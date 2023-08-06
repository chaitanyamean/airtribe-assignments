const moment = require("moment");

const dateUtils = {
  getTime: () => {
    return moment().format("hh:mm a");
  },
};

module.exports = dateUtils;
