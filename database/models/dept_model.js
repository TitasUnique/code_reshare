module.exports = (sequelize, DataTypes) => {
    const BusinessDept = sequelize.define('BusinessDept', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    dept_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    business_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
        model: 'business', // name of the target table
        key: 'id',
        },
    },
    current_users: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    }, {
    tableName: 'business_dept',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true, // enables soft delete using deleted_at
    deletedAt: 'deleted_at',
    });
    
    return BusinessDept;
};