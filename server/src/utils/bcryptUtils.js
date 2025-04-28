import { hash, compare } from 'bcrypt';

// Número de rondas de sal — 10 a 12 está bien para producción
const saltRounds = 10;

async function hashPassword(password) {
    return await hash(password, saltRounds);
}

async function comparePassword(plainPassword, hashedPassword) {
    return await compare(plainPassword, hashedPassword);
}

export { hashPassword, comparePassword };
