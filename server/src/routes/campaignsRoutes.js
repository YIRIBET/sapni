const express = require('express');
const campaignsController = require('../controllers/campaignsController');
const validateRequest = require('../middlewares/validateRequest');

const { create, update, idParamSchema } = require('../validators/campaignsValidator');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require("../middlewares/requireMedia");

const router = express.Router();

router.use(authenticate, authorize(['Super Admin']));

router.get('/', campaignsController.getAll);
router.get('/:id', validateRequest(idParamSchema, 'params'), campaignsController.getById);
router.post('/', validateRequest(create), campaignsController.create);
router.put('/:id', validateRequest(idParamSchema, 'params'), validateRequest(update), campaignsController.update);
router.delete('/:id', validateRequest(idParamSchema, 'params'), campaignsController.delete);

module.exports = router;
