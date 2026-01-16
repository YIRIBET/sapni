const express = require('express');
const clientsController = require('../controllers/clientsController');
const validateRequest = require('../middlewares/validateRequest');
const { createClientSchema, updateClientSchema, idParamSchema } = require('../validators/clientValidator');

const router = express.Router();

router.get('/', clientsController.getAll.bind(clientsController));
router.get('/:id', validateRequest(idParamSchema, 'params'), clientsController.getById.bind(clientsController));
router.post('/', validateRequest(createClientSchema), clientsController.create.bind(clientsController));
router.put('/:id', validateRequest(idParamSchema, 'params'), validateRequest(updateClientSchema), clientsController.update.bind(clientsController));
router.delete('/:id', validateRequest(idParamSchema, 'params'), clientsController.delete.bind(clientsController));
router.get('/:id/campaigns', validateRequest(idParamSchema, 'params'), clientsController.getCampaigns.bind(clientsController));

module.exports = router;