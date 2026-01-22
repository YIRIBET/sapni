const express = require('express');
const mediaChannelsController = require('../controllers/mediaChannelsController');
const validateRequest = require('../middlewares/validateRequest');
const { create, update, idParamSchema } = require('../validators/mediaChannelsValidator');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require("../middlewares/requireMedia");

const router = express.Router();

router.use(authenticate, authorize(['Super Admin']));

router.get('/', mediaChannelsController.getAll);
router.get('/:id', validateRequest(idParamSchema, 'params'), mediaChannelsController.getById);
router.post('/', validateRequest(create), mediaChannelsController.create);
router.put('/:id', validateRequest(idParamSchema, 'params'), validateRequest(update), mediaChannelsController.update);
router.delete('/:id',validateRequest(idParamSchema, 'params'),mediaChannelsController.delete);


module.exports = router;