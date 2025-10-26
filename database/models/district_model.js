// models/district.js
module.exports = (sequelize, DataTypes) => {
  const District = sequelize.define('District', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    district_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'districts', // Matches your table name exactly
    timestamps: false,      // No `createdAt`, `updatedAt`, etc.
  });

  // Associations
  District.associate = (models) => {
    District.belongsTo(models.State, { foreignKey: 'state_id', onDelete: 'RESTRICT' });
  };

  return District;
};
