const logger = require('../utils/logger');
const db = require('../config/connection'); // load DB instance
const State = db.State; // get model

exports.stateReg = async (req, res) => {
  const { state_name } = req.body;

  if (!state_name) {
    return res.status(400).json({
      success: false,
      message: 'State name is required.',
    });
  }

  try {
    const existState = await State.findOne({ where: { state_name } });
    if (existState) {
      return res.status(404).json({
        success: false,
        message: 'State name already taken.',
      });
    }

    await State.create({
      state_name
    });

    return res.status(200).json({
      success: true,
      message: 'New state successfully Add.'
    });
  } catch (error) {
    logger.log_error('Error during register process', 500, { error: error.message });
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.getAllState = async (req, res) => {

  try {
    const allStates = await State.findAndCountAll();

    return res.status(200).json({
      success: true,
      message: 'All state fetched successfully.',
      data: allStates.rows
    });
  } catch (error) {
    // Log error if something goes wrong
    logger.log_error('Error fetching state list', 500, { error: error.message });
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
