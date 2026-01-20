const requireMedia = (allowedMediaTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const mediaArray = Array.isArray(allowedMediaTypes)
      ? allowedMediaTypes
      : [allowedMediaTypes];

    if (!mediaArray.includes(req.user.media_type_id)) {
      return res.status(403).json({ message: 'Acceso denegado por media' });
    }

    next();
  };
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permisos' });
    }
    next();
  };
};

module.exports = {
  requireMedia,
  authorize
};
