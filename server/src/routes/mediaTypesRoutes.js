const express = require('express');
const router = express.Router();

const mediaTypesController = require('../controllers/mediaTypesController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/requireMedia');

// SOLO Super Admin
router.use(authenticate, authorize(['Super Admin']));

router.get('/', mediaTypesController.getAll);
router.get('/:id', mediaTypesController.getById);
router.post('/', mediaTypesController.create);
router.put('/:id', mediaTypesController.update);
router.delete('/:id', mediaTypesController.delete);

module.exports = router;
