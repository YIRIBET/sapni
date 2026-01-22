const express = require('express');
const authRoutes = require('./authRoutes');
const clientsRoutes = require('./clientsRoutes');
const campaignsRoutes = require('./campaignsRoutes');
//const diffusionOrdersRoutes = require('./diffusionOrdersRoutes');
//const evidenceRecordsRoutes = require('./evidenceRecordsRoutes');
const usersRoutes = require('./usersRoutes');
const mediaTypesRoutes = require('./mediaTypesRoutes');
const mediaChannelsRoutes = require('./mediaChannelsRoutes');

const router = express.Router();

// Rutas públicas
router.use('/auth', authRoutes);

// Rutas protegidas
router.use('/clients', clientsRoutes);
router.use('/campaigns', campaignsRoutes);
//router.use('/diffusion-orders', diffusionOrdersRoutes);
//router.use('/evidence-records', evidenceRecordsRoutes);
router.use('/users', usersRoutes);
router.use('/media-types', mediaTypesRoutes);
router.use('/media-channels', mediaChannelsRoutes);

//router.use('/media-channels', mediaChannelsRoutes);

module.exports = router;