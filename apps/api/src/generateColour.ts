export const generateColour = (): string => '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substring(0, 6);
