// models/super_admin.js
module.exports = (sequelize, DataTypes) => {
  const SuperAdmin = sequelize.define('SuperAdmin', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    f_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    m_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    l_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'super_admin', // 👈 matches your table name exactly
    timestamps: false          // we already have created_at/deleted_at
  });

  return SuperAdmin;
};
