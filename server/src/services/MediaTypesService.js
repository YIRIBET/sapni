const db = require('../config/database');
const { NotFoundError, ValidationError } = require('../utils/errors');

class MediaTypesService {

  async getAll() {
    return db('media_types')
      .select('id', 'type_name', 'is_active')
      .where({ is_active: 1 })
      .orderBy('id', 'asc');
  }

  async getById(id) {
    const media = await db('media_types')
      .where({ id, is_active: 1 })
      .first();

    if (!media) {
      throw new NotFoundError('Tipo de medio no encontrado');
    }

    return media;
  }

  async create(data) {
    if (!data.type_name) {
      throw new ValidationError('type_name es requerido');
    }

    const exists = await db('media_types')
      .where({ type_name: data.type_name })
      .first();

    if (exists && exists.is_active === 1) {
      throw new ValidationError('El tipo de medio ya existe');
    }

    // Si existe pero estaba inactivo → reactivar
    if (exists && exists.is_active === 0) {
      await db('media_types')
        .where({ id: exists.id })
        .update({ is_active: 1 });

      return this.getById(exists.id);
    }

    const [id] = await db('media_types').insert({
      type_name: data.type_name,
      is_active: 1
    });

    return this.getById(id);
  }

  async update(id, data) {
    await this.getById(id);

    if (!data.type_name) {
      throw new ValidationError('type_name es requerido');
    }

    await db('media_types')
      .where({ id })
      .update({ type_name: data.type_name });

    return this.getById(id);
  }

  async delete(id) {
    await this.getById(id);
    
     const usersUsing = await db('users')
    .where({ media_type_id: id })
    .count('id as total')
    .first();

  if (usersUsing.total > 0) {
    throw new ValidationError('No se puede eliminar: hay usuarios asignados a este tipo de medio');
  }

    await db('media_types')
      .where({ id })
      .update({ is_active: 0 });

    return true;
  }
}

module.exports = new MediaTypesService();
