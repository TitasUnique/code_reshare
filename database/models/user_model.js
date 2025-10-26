module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    business_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    district_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dept_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    pin_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    employee_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    designation: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    personal_email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    work_email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    pan_no: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    joining_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    blood_group: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    emergency_contact: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    bank_account_no: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    bank_ifsc: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    bank_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    uan: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    reporting_to: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    remark: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    f_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    m_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    l_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    contact_no: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '1=super_admin, 2=business_admin, 3=employee',
    },
    skills: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    extra_skills: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'users',
    timestamps: false, // handled manually with created_at/updated_at fields
  });

  Users.associate = (models) => {
    Users.belongsTo(models.Business, { foreignKey: 'business_id' });
    Users.belongsTo(models.State, { foreignKey: 'state_id' });
    Users.belongsTo(models.District, { foreignKey: 'district_id' });
    Users.belongsTo(models.BusinessDept, { foreignKey: 'dept_id' });
    Users.belongsTo(models.Users, { foreignKey: 'reporting_to' });
  };

  return Users;
};
