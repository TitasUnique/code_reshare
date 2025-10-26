const logger = require('../utils/logger');
const db = require('../config/connection'); // load DB instance
const District = db.District; // get model

exports.districtReg = async (req, res) => {
  const { district_name, state_id } = req.body;

  if (!district_name || !state_id) {
    return res.status(400).json({
      success: false,
      message: 'Name and state id is required.',
    });
  }

  try {
    const existDist = await District.findOne({ where: { district_name } });
    if (existDist) {
      return res.status(404).json({
        success: false,
        message: 'District name already taken.',
      });
    }

    await District.create({
      district_name,
      state_id
    });

    return res.status(200).json({
      success: true,
      message: 'New District successfully Add.'
    });
  } catch (error) {
    logger.log_error('Error during register process', 500, { error: error.message });
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.getAllDistrict = async (req, res) => {

  const { state_id } = req.query;

  if (!state_id) {
    return res.status(400).json({
      success: false,
      message: 'Business ID is required.',
    });
  }

  try {
    const allDistrict = await District.findAndCountAll({
      where: { state_id },
      order: [['id', 'ASC']],
    });

    return res.status(200).json({
      success: true,
      message: 'All district fetched successfully.',
      data: allDistrict.rows
    });
  } catch (error) {
    // Log error if something goes wrong
    logger.log_error('Error fetching distrct list.', 500, { error: error.message });
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
