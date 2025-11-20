import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('ecommerce', 'ecommerce_user', 'userpassword', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

export default sequelize;