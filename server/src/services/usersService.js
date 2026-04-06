const db = require('../config/database');
const { hashPassword } = require('../utils/password');
const { NotFoundError, ValidationError } = require('../utils/errors');

class UsersService {
  async getAllUsers() {
    return await db('users')
      .select(
        'users.id',
        'users.nombre',
        'users.apellidos',
        'users.email',
        'users.role_id',
        'users.is_active'
      )
      .orderBy('users.id', 'desc');
  }

  async getUserById(id) {
    const user = await db('users')
      .select(
        'users.id',
        'users.nombre',
        'users.apellidos',
        'users.email',
        'users.role_id',
        'users.is_active'
      )
      .where('users.id', id)
      .first();

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }
    return user;
  }

  async getRoleByName(roleName) {
    const role = await db('roles').where({ role_name: roleName }).first();
    if (!role) {
      throw new ValidationError(`Rol ${roleName} no existe`);
    }
    return role;
  }

  async createAuditor(data) {
    const role = await this.getRoleByName('Auditor');
    const hashedPassword = await hashPassword(data.password);

    const [id] = await db('users').insert({
      role_id: role.id,
      nombre: data.nombre,
      apellidos: data.apellidos,
      email: data.email,
      password: hashedPassword
    });

    return this.getUserById(id);
  }

  async updateUser(id, data) {
    await this.getUserById(id);

    const updateData = {};
    if (data.nombre)    updateData.nombre    = data.nombre;
    if (data.apellidos) updateData.apellidos = data.apellidos;
    if (data.email)     updateData.email     = data.email;
    if (data.role_id)   updateData.role_id   = data.role_id;

    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    await db('users').where({ id }).update(updateData);
    return this.getUserById(id);
  }

  async deleteUser(id) {
    await this.getUserById(id);
    return await db('users').where({ id }).delete();
  }

  async getUserByEmail(email) {
    return await db('users')
      .select(
        'users.id',
        'users.nombre',
        'users.apellidos',
        'users.email',
        'users.role_id',
        'users.is_active'
      )
      .where('users.email', email)
      .first();
  }
}

module.exports = new UsersService();