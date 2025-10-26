const router = require("express-promise-router")()
// const multer = require('multer')

// ------------------------- fieldSize: max size of file in bytes ----------------------------
// let upload = multer({ dest: 'public/uploads/temp', limits: { fieldSize: 5 * 1024 * 1024 } })

// ------------------------- All Controllers ----------------------------
const authController = require('../controllers/auth.controller');

const stateController = require('../controllers/state.controller');

const districtController = require('../controllers/district.controller');

const masterPlanController = require('../controllers/plan.controller');

const businessController = require('../controllers/business.controller');

const userController = require('../controllers/user.controller');

const businessDeptController = require('../controllers/dept.controller');

// ------------------------- Middleware ----------------------------
const middleware = require('../utils/middleware')

// ------------------------- Auth Routes ----------------------------
router.post('/super_admin/login',authController.superAdminLogin);
router.post('/super_admin/register', authController.superAdminReg);
router.post('/super_admin/logout', middleware.authenticateToken, authController.superAdminLogOut);
// router.get('/check-session', middleware.authenticateToken, authController.checkSession);

// ------------------------- State Routes ----------------------------
router.post('/state/add', stateController.stateReg);
router.get('/state/get', stateController.getAllState);

// ------------------------- District Routes ----------------------------
router.post('/district/add', districtController.districtReg);
router.get('/district/get', districtController.getAllDistrict); //district/get?state_id={*}

// ------------------------- Master Paln Routes ----------------------------
router.post('/master_plan/add', middleware.authenticateToken, masterPlanController.marterPalnReg);
router.get('/master_plan/get', middleware.authenticateToken, masterPlanController.getAllPlans);

// ------------------------- Business Routes ----------------------------
router.post('/business/create', middleware.authenticateToken, businessController.businessReg);
router.get('/business/list', middleware.authenticateToken, businessController.getAllBusinesses);

// ------------------------- User Routes ----------------------------
router.post('/user/create', userController.userRegister);
router.post('/user/login', userController.userLogin);
router.post('/user/logout',  middleware.authenticateToken, userController.userLogout);

// ------------------------- Depertment Routes ----------------------------
router.post('/dusiness_dept/add', businessDeptController.addDepartment);
router.get('/dusiness_dept/get', businessDeptController.getAllDepartments); //dusiness_dept/get?business_id={*}

// ------------------------- Health Check Route ----------------------------
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Eventra API is running',
        data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.ENVIRONMENT || 'development'
        }
    });
});

// ------------------------- Final Setup & 404 Routes ----------------------------
router.get('/', (_request, response) => { response.status(200).json({ message: `API version: ${process.env.APP_VERSION || '1.0.0'}` }) })
router.use("*", (_request, response) => { response.status(404).json({ message: "API endpoint not found" }) })

module.exports = router
