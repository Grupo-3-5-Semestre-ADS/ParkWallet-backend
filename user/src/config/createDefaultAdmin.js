import User from '../models/userModel.js';

export const createDefaultAdmin = async () => {
  const adminEmail = 'admin@admin.com';

  const existingAdmin = await User.findOne({ where: { email: adminEmail } });
  if (existingAdmin) {
    console.log('Admin já existe.');
    return;
  }

  const admin = await User.create({
    name: 'Admin',
    email: adminEmail,
    cpf: '00000000000',
    password: 'Admin123',
    birthdate: '1970-01-01',
    active: true,
    role: 'ADMIN' // Define diretamente a role
  });

  console.log('Usuário admin criado com sucesso.');
};
