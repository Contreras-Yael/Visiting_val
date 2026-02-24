export const generateAccessCode = (): string => {
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
let result = '';

for (let i = 0; i < 4; i++) {
  const randomIndex = Math.floor(Math.random() * characters.length);
  result += characters[randomIndex];
}

return `VIS-${result}`;
};
