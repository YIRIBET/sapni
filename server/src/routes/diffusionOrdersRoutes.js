const express = require('express');
const diffusionOrdersController = require('../controllers/diffusionOrdersController');
const validateRequest = require('../middlewares/validateRequest');
const { create, update, idParamSchema } = require('../validators/diffusionOrdersValidator');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require("../middlewares/requireMedia");

const router = express.Router();

router.use(authenticate, authorize(['Super Admin']));

router.get('/', diffusionOrdersController.getAll);
router.get('/:id', validateRequest(idParamSchema, 'params'), diffusionOrdersController.getById);
router.post('/', validateRequest(create), diffusionOrdersController.create);
router.put('/:id', validateRequest(idParamSchema, 'params'), validateRequest(update), diffusionOrdersController.update);
router.delete('/:id', validateRequest(idParamSchema, 'params'), diffusionOrdersController.delete);

module.exports = router;