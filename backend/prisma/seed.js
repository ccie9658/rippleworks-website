const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Full system access'
    }
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Basic user access'
    }
  });

  const subscriberRole = await prisma.role.upsert({
    where: { name: 'subscriber' },
    update: {},
    create: {
      name: 'subscriber',
      description: 'Paid subscriber access'
    }
  });

  const clientRole = await prisma.role.upsert({
    where: { name: 'client' },
    update: {},
    create: {
      name: 'client',
      description: 'Active consulting client access'
    }
  });

  // Create permissions
  const permissions = [
    { name: 'read_posts', resource: 'posts', action: 'read', description: 'Read blog posts' },
    { name: 'write_posts', resource: 'posts', action: 'write', description: 'Create and edit blog posts' },
    { name: 'manage_posts', resource: 'posts', action: 'manage', description: 'Full blog post management' },
    { name: 'read_users', resource: 'users', action: 'read', description: 'View user information' },
    { name: 'manage_users', resource: 'users', action: 'manage', description: 'Full user management' },
    { name: 'access_admin', resource: 'admin', action: 'access', description: 'Access admin panel' },
    { name: 'read_resources', resource: 'resources', action: 'read', description: 'Download resources' },
    { name: 'manage_resources', resource: 'resources', action: 'manage', description: 'Manage resource library' }
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission
    });
  }

  // Assign permissions to roles
  const allPermissions = await prisma.permission.findMany();
  
  // Admin gets all permissions
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id
        }
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id
      }
    });
  }

  // Basic user permissions
  const userPermissions = allPermissions.filter(p => 
    ['read_posts', 'read_resources'].includes(p.name)
  );
  
  for (const permission of userPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: userRole.id,
          permissionId: permission.id
        }
      },
      update: {},
      create: {
        roleId: userRole.id,
        permissionId: permission.id
      }
    });
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123!', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@rippleworks.com' },
    update: {},
    create: {
      email: 'admin@rippleworks.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      isVerified: true
    }
  });

  // Assign admin role to admin user
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

  // Create sample blog post
  await prisma.blogPost.upsert({
    where: { slug: 'welcome-to-rippleworks' },
    update: {},
    create: {
      title: 'Welcome to RippleWorks',
      slug: 'welcome-to-rippleworks',
      excerpt: 'Your trusted partner for small business technology modernization.',
      content: `# Welcome to RippleWorks

We're excited to launch our new website and begin sharing insights about small business technology modernization.

## What We Do

RippleWorks specializes in helping small businesses modernize their IT infrastructure with:

- Network consulting and optimization
- Website development and maintenance  
- Cloud migration and server management
- Technical training and documentation

## Get Started

Ready to modernize your business technology? Contact us today for a consultation.`,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: adminUser.id,
      metaTitle: 'Welcome to RippleWorks - Small Business IT Consulting',
      metaDescription: 'Professional technology consulting for small business modernization. Network, cloud, and website solutions.'
    }
  });

  // Create sample case study
  await prisma.caseStudy.upsert({
    where: { slug: 'small-business-network-upgrade' },
    update: {},
    create: {
      title: 'Small Business Network Upgrade',
      slug: 'small-business-network-upgrade',
      client: 'Local Manufacturing Company',
      industry: 'Manufacturing',
      challenge: 'Outdated network infrastructure causing productivity issues and security concerns.',
      solution: 'Complete network redesign with modern switches, wireless access points, and security implementation.',
      results: 'Improved network speed by 300%, eliminated downtime, and enhanced security posture.',
      technologies: ['Cisco', 'Ubiquiti', 'pfSense', 'VPN'],
      featured: true,
      metaTitle: 'Network Upgrade Case Study - RippleWorks',
      metaDescription: 'How we helped a manufacturing company modernize their network infrastructure.'
    }
  });

  console.log('✅ Database seed completed successfully!');
  console.log('📧 Admin user: admin@rippleworks.com');
  console.log('🔑 Admin password: admin123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });