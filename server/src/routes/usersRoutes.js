const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/requireMedia');

// Todas protegidas por Super Admin
router.use(authenticate, authorize(['Super Admin']));

router.get('/', usersController.getAll.bind(usersController));
router.get('/:id', usersController.getById.bind(usersController));
router.post('/', usersController.createAuditor.bind(usersController));
router.put('/:id', usersController.update.bind(usersController));
router.delete('/:id', usersController.delete.bind(usersController));

module.exports = router;
