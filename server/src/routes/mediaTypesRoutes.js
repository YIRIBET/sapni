const express = require('express');
const router = express.Router();
const mediaTypesController = require('../controllers/mediaTypesController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/requireMedia');
const validateRequest = require('../middlewares/validateRequest');

const {createMediaTypeSchema,updateMediaTypeSchema,idParamSchema} = require('../validators/mediaTypesValidator');

router.use(authenticate, authorize(['Super Admin']));

router.get('/', mediaTypesController.getAll);
router.get('/:id', validateRequest(idParamSchema, 'params'), mediaTypesController.getById);
router.post('/', validateRequest(createMediaTypeSchema), mediaTypesController.create);
router.put('/:id',validateRequest(idParamSchema, 'params'),validateRequest(updateMediaTypeSchema),mediaTypesController.update);
router.delete('/:id',validateRequest(idParamSchema, 'params'),mediaTypesController.delete);

module.exports = router;
