import { Role } from '../models/index.js';

export const createMainRoles = async () => {

    const admin = 'ADMIN';
    const customer ='CUSTOMER';
    const seller = 'SELLER';

    const existingAdminRole = await Role.findOne({ where: { name: admin } });
    const existingCustomerRole = await Role.findOne({ where: { name: customer } });
    const existingSellerRole = await Role.findOne({ where: { name: seller } });

    if (existingAdminRole) {
        console.log('Role Admin já existe.');
    } else {
        await Role.create({
            name: admin,
            description: 'Role de administrador do sistema.'
        });
        console.log('Role Admin criada com sucesso.');
    }

    if (existingCustomerRole) {
        console.log('Role Customer já existe.');
    } else{    
        await Role.create({
            name: customer,
            description: 'Role de cliente.'
        });
        console.log('Role Customer criada com sucesso.');
    }

    if (existingSellerRole) {
        console.log('Role Seller já existe.');
    } else {
        await Role.create({
            name: seller,
            description: 'Role de vendedor.'
        });
        console.log('Role Seller criada com sucesso.');
    }
    
};