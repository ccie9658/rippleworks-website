const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupAuthentication() {
  try {
    console.log('Setting up authentication data...');

    // Create default roles if they don't exist
    const adminRole = await prisma.role.upsert({
      where: { name: 'ADMIN' },
      update: {},
      create: {
        name: 'ADMIN',
        description: 'Administrator with full access'
      }
    });

    const userRole = await prisma.role.upsert({
      where: { name: 'USER' },
      update: {},
      create: {
        name: 'USER',
        description: 'Regular user with limited access'
      }
    });

    console.log('✅ Roles created:', { adminRole: adminRole.name, userRole: userRole.name });

    // Hash the admin password
    const adminPassword = await bcrypt.hash('admin123', 12);

    // Update existing admin user with hashed password
    const adminUser = await prisma.user.update({
      where: { email: 'admin@rippleworks.com' },
      data: {
        password: adminPassword
      }
    });

    // Ensure admin user has ADMIN role
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: adminUser.id,
          roleId: adminRole.id
        }
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: adminRole.id
      }
    });

    console.log('✅ Admin user updated with hashed password and ADMIN role');

    console.log('🎉 Authentication setup complete!');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  setupAuthentication()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = setupAuthentication;