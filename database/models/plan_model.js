// models/master_plan.js
module.exports = (sequelize, DataTypes) => {
  const MasterPlan = sequelize.define('MasterPlan', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    plan_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,  // 1 = active, 0 = inactive
      allowNull: false
    },
    max_employee: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    plan_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    duration_days: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    current_users: {
      type: DataTypes.INTEGER,
      defaultValue: 0,  // Default value for current_users
      allowNull: false
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
    tableName: 'master_plan', // Ensures the table name matches exactly
    timestamps: false,        // Disable Sequelize's auto-created createdAt/updatedAt
    paranoid: true            // Enable soft deletes with `deleted_at`
  });

  return MasterPlan;
};
