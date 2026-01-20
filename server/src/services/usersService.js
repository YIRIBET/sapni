const db = require('../config/database');
const { hashPassword } = require('../utils/password');
const { NotFoundError, ValidationError } = require('../utils/errors');

class UsersService {
  async getAllUsers() {
    return await db('users')
      .join('media_types', 'users.media_type_id', '=', 'media_types.id')
      .select(
        'users.id',
        'users.nombre',
        'users.apellidos',
        'users.email',
        'users.role_id',
        'users.media_type_id',
        'media_types.type_name'
      )
      .orderBy('users.id', 'desc');
  }

  async getUserById(id) {
    const user = await db('users')
      .join('media_types', 'users.media_type_id', '=', 'media_types.id')
      .select(
        'users.id',
        'users.nombre',
        'users.apellidos',
        'users.email',
        'users.role_id',
        'users.media_type_id',
        'media_types.type_name'
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
  const mediaType = await db('media_types').where({ id: data.media_type_id }).first();
  if (!mediaType) {
    throw new ValidationError('El tipo de medio especificado no existe');
  }

  const role = await this.getRoleByName('Auditor');

  const hashedPassword = await hashPassword(data.password);

  const [id] = await db('users').insert({
    role_id: role.id,
    media_type_id: data.media_type_id,
    nombre: data.nombre,
    apellidos: data.apellidos,
    email: data.email,
    password: hashedPassword
  });

  return this.getUserById(id);
}


  async updateUser(id, data) {
    await this.getUserById(id);
    
    if (data.media_type_id) {
      const mediaType = await db('media_types').where({ id: data.media_type_id }).first();
      if (!mediaType) {
        throw new ValidationError('El tipo de medio especificado no existe');
      }
    }
    
    const updateData = {};
    if (data.nombre) updateData.nombre = data.nombre;
    if (data.apellidos) updateData.apellidos = data.apellidos;
    if (data.email) updateData.email = data.email;
    if (data.role_id) updateData.role_id = data.role_id;
    if (data.media_type_id) updateData.media_type_id = data.media_type_id;
    
    // Solo actualizar password si se proporciona
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
      .join('media_types', 'users.media_type_id', '=', 'media_types.id')
      .select(
        'users.id',
        'users.nombre',
        'users.apellidos',
        'users.email',
        'users.role_id',
        'users.media_type_id',
        'media_types.type_name'
      )
      .where('users.email', email)
      .first();
  }
}

module.exports = new UsersService();
