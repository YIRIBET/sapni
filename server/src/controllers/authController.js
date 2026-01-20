const db = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await db('users')
    .join('roles', 'users.role_id', 'roles.id')
    .select('users.*', 'roles.role_name')
    .where('users.email', email)
    .first();

  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role_name,
      media_type_id: user.media_type_id
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token });
};
