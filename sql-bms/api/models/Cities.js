const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const Cities = sequelize.define(
  "Cities",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  { timestamps: false }
);

(async () => {
  await Cities.sync({ force: true });
})();

module.exports = Cities;
