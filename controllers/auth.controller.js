const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const logger = require('../utils/logger');
const db = require('../config/connection'); // load DB instance
const SuperAdmin = db.SuperAdmin; // get model
const {jwtBlacklist} = require('../utils/middleware');

exports.superAdminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required.',
    });
  }

  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({
        success: false,
        message: 'Username and password must be strings.',
    });
}

  try {
    const user = await SuperAdmin.findOne({ where: { username } });
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

    const fullName = `${user.f_name} ${user.m_name} ${user.l_name}`.trim();

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
        full_name: fullName,
        role: user.role,
      },
    });
  } catch (error) {
    logger.log_error('Error during login process', 500, { error: error.message });
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.superAdminReg = async (req, res) => {
  const { username, password, f_name, m_name, l_name } = req.body;

  if (!username || !password || !f_name || !m_name || !l_name) {
    return res.status(400).json({
      success: false,
      message: 'All field are required.',
    });
  }

  try {
    const user = await SuperAdmin.findOne({ where: { username } });
    if (user) {
      return res.status(404).json({
        success: false,
        message: 'Username is already taken.',
      });
    }

    const hashedPassword = bcrypt.hashSync(password);

    await SuperAdmin.create({
      username,
      password: hashedPassword,
      f_name,
      m_name,
      l_name,
      role: 1000
    });

    return res.status(200).json({
      success: true,
      message: 'Register successful'
    });
  } catch (error) {
    logger.log_error('Error during register process', 500, { error: error.message });
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.superAdminLogOut = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    
    // Check if the token is provided in Bearer format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Access token missing.',
            data: []
        });
    }

    // Extract the token from the Bearer header
    const token = authHeader.split(' ')[1];

    jwtBlacklist.add(token);

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
    
  } catch (error) {
    logger.log_error('Error during register process', 500, { error: error.message });
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
