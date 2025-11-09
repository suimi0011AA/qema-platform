// createAdmin.js
import bcrypt from 'bcryptjs';
import { sequelize, User } from './models/index.js';

const createAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const [admin, created] = await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        name: 'Admin User',
        password_hash: hashedPassword,
        role_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log(created ? 'Admin created' : 'Admin exists');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();