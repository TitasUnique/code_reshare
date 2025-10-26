const logger = require('../utils/logger');
const db = require('../config/connection'); // load DB instance
const BusinessDept = db.BusinessDept; // get model

// Add a new department
exports.addDepartment = async (req, res) => {
  const { dept_name, business_id } = req.body;

  if (!dept_name || !business_id) {
    return res.status(400).json({
      success: false,
      message: 'Department name and business ID are required.',
    });
  }

  try {
    const existingDept = await BusinessDept.findOne({ where: { dept_name, business_id } });
    if (existingDept) {
      return res.status(409).json({
        success: false,
        message: 'Department name already exists for this business.',
      });
    }

    await BusinessDept.create({
      dept_name,
      business_id
    });

    return res.status(201).json({
      success: true,
      message: 'New department successfully added.',
    });
  } catch (error) {
    logger.log_error('Error during department creation', 500, { error: error.message });
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

// Fetch all departments
exports.getAllDepartments = async (req, res) => {
   const { business_id } = req.query;

  if (!business_id) {
    return res.status(400).json({
      success: false,
      message: 'Business ID is required.',
    });
  }

  try {
    const allDepartments = await BusinessDept.findAndCountAll({
      where: { business_id },
      order: [['id', 'ASC']],
    });

    return res.status(200).json({
      success: true,
      message: 'All departments fetched successfully.',
      data: allDepartments.rows,
    });
  } catch (error) {
    logger.log_error('Error fetching department list.', 500, { error: error.message });
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
