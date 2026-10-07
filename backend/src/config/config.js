import dotenv from 'dotenv';
dotenv.config();

function getEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not defined!`);
  }

  return value;
}

export { getEnv };
