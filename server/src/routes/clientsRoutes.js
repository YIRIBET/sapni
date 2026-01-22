const express = require('express');
const clientsController = require('../controllers/clientsController');
const validateRequest = require('../middlewares/validateRequest');
const { createClientSchema, updateClientSchema, idParamSchema } = require('../validators/clientValidator');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require("../middlewares/requireMedia");

const router = express.Router();

router.use(authenticate, authorize(['Super Admin']));

router.get('/' , clientsController.getAll);
router.get('/:id', validateRequest(idParamSchema, 'params'), clientsController.getById);
router.post('/', validateRequest(createClientSchema), clientsController.create);
router.put('/:id', validateRequest(idParamSchema, 'params'), validateRequest(updateClientSchema), clientsController.update);
router.delete('/:id', validateRequest(idParamSchema, 'params'), clientsController.delete);
router.get('/:id/campaigns',validateRequest(idParamSchema, 'params'), clientsController.getCampaigns);

module.exports = router;
