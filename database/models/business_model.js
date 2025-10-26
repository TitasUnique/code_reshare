// models/business.js
module.exports = (sequelize, DataTypes) => {
  const Business = sequelize.define('Business', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    business_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    has_valid_subscription: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    plan_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    district_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {                               // ✅ changed from "city" to "address"
      type: DataTypes.STRING(255),
      allowNull: true
    },
    business_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    sub_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'business', // matches your table name exactly
    timestamps: false,      // we already have created_at/updated_at/deleted_at
    paranoid: true          // Enables soft deletes (deleted_at)
  });

  // Associations
  Business.associate = (models) => {
    Business.belongsTo(models.MasterPlan, { foreignKey: 'plan_id' });
    Business.belongsTo(models.State, { foreignKey: 'state_id' });
    Business.belongsTo(models.District, { foreignKey: 'district_id' });
  };

  return Business;
};
