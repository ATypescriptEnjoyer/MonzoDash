import { PrismaClient } from '@prisma/client';
import { settingsData } from './settings.json';
const prisma = new PrismaClient();

settingsData.forEach(async (element) => {
  const exist = await prisma.settings.count({ where: { name: element.name } });
  if (exist === 0) {
    await prisma.settings.create({
      data: {
        name: element.name,
        value: element.value,
      },
    });
    console.log(`Seeded ${element.name}`);
  }
});
