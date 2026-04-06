const db = require("../config/database");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");
const { ValidationError, UnauthorizedError } = require("../utils/errors");

class AuthService {
  async register(data) {
    const { email, password, role_id } = data;

    const [insertedId] = await db('users').insert({
      role_id,
      nombre: data.nombre,
      apellidos: data.apellidos,
      email,
      password: await hashPassword(password)
    });

    const user = await this.getUser(insertedId);

    if (!user) {
      throw new Error('Error al recuperar el usuario después de la creación');
    }

    const token = generateToken(user.id, user.role_id);

    return {
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role_id: user.role_id,
      },
      token
    };
  }

  async login(email, password) {
    const user = await db("users").where({ email }).first();

    if (!user) {
      throw new UnauthorizedError("Email o contraseña incorrectos");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Email o contraseña incorrectos");
    }

    const token = generateToken(user.id, user.role_id);

    return {
      user: {
        id: user.id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        role_id: user.role_id,
      },
      token,
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await db("users").where({ id: userId }).first();

    if (!user) {
      throw new UnauthorizedError("Usuario no encontrado");
    }

    const isPasswordValid = await comparePassword(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Contraseña actual incorrecta");
    }

    const hashedPassword = await hashPassword(newPassword);

    await db("users").where({ id: userId }).update({ password: hashedPassword });

    return { message: "Contraseña actualizada exitosamente" };
  }

  async getUserProfile(userId) {
    const user = await this.getUser(userId);

    if (!user) {
      throw new UnauthorizedError("Usuario no encontrado");
    }

    return {
      id: user.id,
      nombre: user.nombre,
      apellidos: user.apellidos,
      email: user.email,
      role_id: user.role_id,
    };
  }

  async getUser(userId) {
    return await db("users")
      .select(
        "users.id",
        "users.nombre",
        "users.apellidos",
        "users.email",
        "users.role_id",
      )
      .where("users.id", userId)
      .first();
  }
}

module.exports = new AuthService();