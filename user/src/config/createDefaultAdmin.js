import { User, Role } from '../models/index.js'; // Adicione a importação do modelo Role

export const createDefaultAdmin = async () => {
  const adminEmail = 'admin@admin.com';

  const existingAdmin = await User.findOne({ where: { email: adminEmail } });
  if (existingAdmin) {
    console.log('Admin já existe.');
    return;
  }

  const adminRole = await Role.findOne({ where: { name: 'ADMIN' } });
  if (!adminRole) {
    console.log('Role Admin não encontrada.');
    return;
  }

  const admin = await User.create({
    name: 'Admin',
    email: adminEmail,
    cpf: '00000000000',
    password: 'Admin123',
    birthdate: '1970-01-01',
    active: true
  });

  await admin.addRole(adminRole);

  console.log('Usuário admin criado com sucesso.');
};