const db = require('../config/database');
const { NotFoundError } = require('../utils/errors');

class ClientsService {
  async getAllClients() {
    return await db('clients')
      .select('*')
      .orderBy('created_at', 'desc');
  }

  async getClientById(id) {
    const client = await db('clients').where({ id }).first();
    if (!client) {
      throw new NotFoundError('Cliente no encontrado');
    }
    return client;
  }

  async createClient(data) {
    const [id] = await db('clients').insert({
      ...data,
      created_at: new Date(),
      updated_at: new Date()
    });
    return this.getClientById(id);
  }

  async updateClient(id, data) {
    await this.getClientById(id);
    await db('clients').where({ id }).update({
      ...data,
      updated_at: new Date()
    });
    return this.getClientById(id);
  }

  async deleteClient(id) {
    await this.getClientById(id);
    return await db('clients').where({ id }).delete();
  }

  async getClientCampaigns(clientId) {
    return await db('campaigns')
      .where({ client_id: clientId })
      .orderBy('created_at', 'desc');
  }
}

module.exports = new ClientsService();