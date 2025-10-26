const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const db = require('../config/connection'); // load DB instance
const { Op } = require('sequelize');
const Users = db.Users; 
const {jwtBlacklist} = require('../utils/middleware');
const BusinessDept = db.BusinessDept;
const Business = db.Business;

exports.userRegister = async (req, res) => {
  try {
    const {
      business_id,
      state_id,
      district_id,
      dept_id,
      f_name,
      m_name,
      l_name,
      username,
      password,
      contact_no,
      pin_code,
      employee_code,
      bank_account_no,
      bank_ifsc,
      bank_name,
      role, // 1=super_admin, 2=business_admin, 3=employee
      address,
      city,
      designation,
      personal_email,
      work_email,
      pan_no,
      joining_date,
      blood_group,
      emergency_contact,
      uan,
      reporting_to,
      remark,
      gender,
      dob,
      skills,
      extra_skills
    } = req.body;

    console.log(req.body);

    // ✅ Validate required fields
    if (
      !business_id || !state_id || !district_id ||
      !f_name || !l_name || !username || !password ||
      !contact_no || !pin_code || !employee_code ||
      !bank_account_no || !bank_ifsc || !bank_name || !role
    ) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing.',
      });
    }

    // ✅ Combined duplicate check
    const existingUser = await Users.findOne({
        where: {
            [Op.or]: [
            { username },
            { employee_code },
            personal_email ? { personal_email } : null,
            work_email ? { work_email } : null,
            pan_no ? { pan_no } : null,
            uan ? { uan } : null
            ].filter(Boolean) // remove nulls (for optional fields)
        }
    });

    if (existingUser) {
        let conflictField = 'User';

        if (existingUser.username === username) conflictField = 'Username';
        else if (existingUser.employee_code === employee_code) conflictField = 'Employee code';
        else if (personal_email && existingUser.personal_email === personal_email) conflictField = 'Personal email';
        else if (work_email && existingUser.work_email === work_email) conflictField = 'Work email';
        else if (pan_no && existingUser.pan_no === pan_no) conflictField = 'PAN number';
        else if (uan && existingUser.uan === uan) conflictField = 'UAN (Aadhaar)';

        return res.status(400).json({
            success: false,
            message: `${conflictField} already exists.`,
        });
    }

    let deptIdValue = null;

    if (role === 3) { // Employee
        if (!dept_id) {
            return res.status(400).json({
            success: false,
            message: 'Department is required for employees.',
            });
        }
        deptIdValue = dept_id;

        const selectDept = await BusinessDept.findOne({ where: { id: dept_id } });

        if (!selectDept) {
        return res.status(404).json({
            success: false,
            message: 'Depertment not found.',
        });
        }

        const updatedUsersCount = selectDept.current_users + 1;

        await BusinessDept.update({ current_users: updatedUsersCount }, { where: { id: dept_id } });
    }


    // ✅ Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // ✅ Create new user record
    await Users.create({
      business_id,
      state_id,
      district_id,
      dept_id: deptIdValue,
      address,
      city,
      pin_code,
      employee_code,
      designation,
      personal_email,
      work_email,
      pan_no,
      joining_date,
      blood_group,
      emergency_contact,
      bank_account_no,
      bank_ifsc,
      bank_name,
      uan,
      reporting_to,
      remark,
      gender,
      f_name,
      m_name,
      l_name,
      username,
      password: hashedPassword,
      dob,
      contact_no,
      role,
      skills,
      extra_skills,
    });

    return res.status(200).json({
      success: true,
      message: 'User registered successfully.',
    });

  } catch (error) {
    logger?.log_error('Error during user registration', 500, { error: error.message });
    console.error('Registration Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.userLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required.',
    });
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Username and password must be strings.',
    });
  }

  try {
    const user = await Users.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

    
    const selectBusiness = await Business.findOne({ where: { id: user.business_id } });

    if (!selectBusiness) {
        return res.status(404).json({
            success: false,
            message: 'Business not found.',
        });
    }

    // JWT generation (8-hour expiry)
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        userDetails: user,
        businessDetails: selectBusiness
      },
    });

  } catch (error) {
    logger.log_error('Error during user login', 500, { error: error.message });
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.userLogout = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token missing.',
        data: []
      });
    }

    const token = authHeader.split(' ')[1];

    // Add token to blacklist
    jwtBlacklist.add(token);

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });

  } catch (error) {
    logger.log_error('Error during user logout', 500, { error: error.message });
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
