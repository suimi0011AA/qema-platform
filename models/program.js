import { DataTypes } from "sequelize";
import sequelize from "../src/config/db.js"; 

const Program = sequelize.define("Program", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  start_date: { type: DataTypes.DATE, allowNull: false },
  end_date: { type: DataTypes.DATE, allowNull: false },
  created_by: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: "programs",
  timestamps: true,
});

export default Program;