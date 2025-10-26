const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const logger = require('../utils/logger');
const db = require('../config/connection');
const Business = db.Business;
const MasterPlan = db.MasterPlan;

exports.businessReg = async (req, res) => {
  try {
    const { business_name, business_code, plan_id, state_id, district_id, address } = req.body;

    // Step 1: Basic validation
    if (!business_name || !business_code) {
      return res.status(400).json({ success: false, message: 'Business name and code are required.' });
    }

    if (!plan_id || !state_id || !district_id) {
      return res.status(400).json({ success: false, message: 'Plan, state, and district are required.' });
    }

    // Step 2: Check for duplicate business code
    const existing = await Business.findOne({ where: { business_code } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Business code is already taken.' });
    }

    // Step 3: Fetch plan details
    const plan = await MasterPlan.findOne({ where: { id: plan_id } });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found.' });
    }

    // Step 4: Calculate sub_end_date (duration_days from plan)
    const startDate = moment();
    const subEndDate = startDate.clone().add(plan.duration_days, 'days').endOf('day');

    // Step 5: Update plan usage count
    await MasterPlan.update(
      { current_users: plan.current_users + 1 },
      { where: { id: plan_id } }
    );

    // Step 6: Create the business record
    const newBusiness = await Business.create({
      business_name,
      business_code,
      plan_id,
      state_id,
      district_id,
      address,                      // ✅ now using address instead of city
      has_valid_subscription: true,
      sub_end_date: subEndDate.toDate(),
      created_at: startDate.toDate(),
      updated_at: startDate.toDate()
    });

    return res.status(201).json({
      success: true,
      message: 'Business successfully registered.',
      data: newBusiness
    });

  } catch (error) {
    logger.log_error('Error during business registration', 500, { error: error.message });
    console.error('Business registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

exports.getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.findAll({
      order: [['created_at', 'DESC']],
      include: [
        {
          model: db.State,
          attributes: ['id', 'state_name']
        },
        {
          model: db.District,
          attributes: ['id', 'district_name']
        },
        {
          model: db.MasterPlan,
          attributes: ['id', 'plan_name', 'plan_price', 'duration_days']
        }
      ]
    });

    return res.status(200).json({
      success: true,
      message: 'Businesses fetched successfully with related details.',
      data: businesses
    });

  } catch (error) {
    logger.log_error('Error fetching businesses with relations', 500, { error: error.message });
    console.error('Error fetching businesses with relations:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

