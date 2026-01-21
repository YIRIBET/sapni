const express = require('express');
const clientsController = require('../controllers/clientsController');
const validateRequest = require('../middlewares/validateRequest');
const { createClientSchema, updateClientSchema, idParamSchema } = require('../validators/clientValidator');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require("../middlewares/requireMedia");

const router = express.Router();

router.use(authenticate, authorize(['Super Admin']));

router.get('/', authenticate,authorize(['Super Admin']), clientsController.getAll);
router.get('/:id', authenticate, validateRequest(idParamSchema, 'params'), clientsController.getById);
router.post('/', authenticate, validateRequest(createClientSchema), clientsController.create);
router.put('/:id', authenticate, validateRequest(idParamSchema, 'params'), validateRequest(updateClientSchema), clientsController.update);
router.delete('/:id', authenticate, validateRequest(idParamSchema, 'params'), clientsController.delete);
router.get('/:id/campaigns', authenticate, validateRequest(idParamSchema, 'params'), clientsController.getCampaigns);

module.exports = router;
