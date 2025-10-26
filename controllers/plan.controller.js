const logger = require('../utils/logger');
const db = require('../config/connection'); // load DB instance
const MasterPlan = db.MasterPlan; // get model

exports.marterPalnReg = async (req, res) => {
  const { plan_name, description, is_active, max_employee, plan_price, duration_days } = req.body;

  if (!plan_name || !description || !is_active || !max_employee || !plan_price || !duration_days ) {
    return res.status(400).json({
      success: false,
      message: 'All fields is required.',
    });
  }

  try {
    const existPlan = await MasterPlan.findOne({ where: { plan_name } });
    if (existPlan) {
      return res.status(404).json({
        success: false,
        message: 'Plan name already taken.',
      });
    }

    await MasterPlan.create({
      plan_name, 
      description, 
      is_active, 
      max_employee, 
      plan_price, 
      duration_days,
      current_users: 0
    });

    return res.status(200).json({
      success: true,
      message: 'New Paln successfully Add.'
    });
  } catch (error) {
    logger.log_error('Error during register process', 500, { error: error.message });
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.getAllPlans = async (req, res) => {
  try {
    const plans = await MasterPlan.findAll({
      attributes: ['id', 'plan_name', 'is_active', 'max_employee', 'plan_price', 'duration_days'], 
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      message: 'Master plans fetched successfully.',
      data: plans
    });
  } catch (error) {
    logger.log_error('Error fetching master plan list', 500, { error: error.message });
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

