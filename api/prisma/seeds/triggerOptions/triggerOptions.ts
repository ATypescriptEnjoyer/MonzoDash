import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import * as path from 'path';
const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/ban-types
const getKeys = (parentKey: string, object: {}): string[] => {
  const keys = Object.keys(object);
  let returnKeys = [];
  keys.forEach((key) => {
    const keyValueType = typeof object[key];
    const keyName = `${parentKey ? `${parentKey}.${key}` : key}`;
    if (keyValueType === 'object' && object[key] !== null) {
      returnKeys = [...returnKeys, keyName, ...getKeys(key, object[key])];
    } else {
      returnKeys = [...returnKeys, keyName];
    }
  });
  return returnKeys;
};

const main = async () => {
  const data = (await fs.readFile(path.join(__dirname, 'data.json'))).toString();
  const dataJson = JSON.parse(data);
  const triggerOptions = getKeys('', dataJson);
  await prisma.triggerOption.createMany({
    data: triggerOptions.map((key) => ({ id: undefined, key })),
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
