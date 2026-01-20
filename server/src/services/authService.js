const db = require("../config/database");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");
const { ValidationError, UnauthorizedError } = require("../utils/errors");

class AuthService {
 async register(data) {
  const { email, password, role_id } = data;

  // 1. Limpiar el media_type_id para el Admin
  const mediaTypeId = role_id === 1 ? null : data.media_type_id;

  // 2. Insertar (Knex devuelve un array con el ID en la posición 0)
  const [insertedId] = await db('users').insert({
    role_id,
    media_type_id: mediaTypeId,
    nombre: data.nombre,
    apellidos: data.apellidos,
    email: email,
    password: await hashPassword(password)
  });

  // 3. RECUPERAR EL USUARIO (Crucial para no tener undefined)
  const user = await this.getUserWithMediaType(insertedId);
  
  if (!user) {
    throw new Error('Error al recuperar el usuario después de la creación');
  }

  // 4. Generar Token (Asegúrate de pasar user.id, no solo id)
  const token = generateToken(user.id, user.role_id);

  return {
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      role_id: user.role_id,
      media_type_name: user.media_type_name // Este vendrá como null para Admin
    },
    token
  };
}

  async login(email, password) {
    // Buscar usuario por email
    const user = await db("users").where({ email }).first();

    if (!user) {
      throw new UnauthorizedError("Email o contraseña incorrectos");
    }

    // Verificar contraseña
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Email o contraseña incorrectos");
    }

    // Obtener usuario con datos del media_type
    const userWithMedia = await this.getUserWithMediaType(user.id);

    // Generar token
    const token = generateToken(
      userWithMedia.id,
      userWithMedia.role_id,
      userWithMedia.media_type_id,
    );

    return {
      user: {
        id: userWithMedia.id,
        nombre: userWithMedia.nombre,
        apellidos: userWithMedia.apellidos,
        email: userWithMedia.email,
        role_id: userWithMedia.role_id,
        media_type_id: userWithMedia.media_type_id,
        media_type_name: userWithMedia.type_name,
      },
      token,
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await db("users").where({ id: userId }).first();

    if (!user) {
      throw new UnauthorizedError("Usuario no encontrado");
    }

    // Verificar contraseña actual
    const isPasswordValid = await comparePassword(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("Contraseña actual incorrecta");
    }

    // Hash nueva contraseña
    const hashedPassword = await hashPassword(newPassword);

    // Actualizar contraseña
    await db("users").where({ id: userId }).update({
      password: hashedPassword,
    });

    return { message: "Contraseña actualizada exitosamente" };
  }

  async getUserProfile(userId) {
    const user = await this.getUserWithMediaType(userId);

    if (!user) {
      throw new UnauthorizedError("Usuario no encontrado");
    }

    return {
      id: user.id,
      nombre: user.nombre,
      apellidos: user.apellidos,
      email: user.email,
      role_id: user.role_id,
      media_type_id: user.media_type_id,
      media_type_name: user.type_name,
    };
  }

  async getUserWithMediaType(userId) {
    return await db("users")
      .leftJoin("media_types", "users.media_type_id", "=", "media_types.id")
      .select(
        "users.id",
        "users.nombre",
        "users.apellidos",
        "users.email",
        "users.role_id",
        "users.media_type_id",
        "media_types.type_name",
      )
      .where("users.id", userId)
      .first();
  }
}

module.exports = new AuthService();
