// models/state.js
module.exports = (sequelize, DataTypes) => {
  const State = sequelize.define('State', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    state_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'states', // Matches your table name exactly
    timestamps: false     // No `createdAt`, `updatedAt`, etc.
  });

  return State;
};
