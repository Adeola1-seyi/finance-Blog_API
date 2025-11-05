import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import prisma from './prisma/index.js';

async function testDBConnection() {
  try {
    await prisma.$connect();
    console.log(' Database connected successfully');
  } catch (err) {
    console.error(' Database connection failed:', err);
    process.exit(1);
  }
}

testDBConnection();


export default prisma;
