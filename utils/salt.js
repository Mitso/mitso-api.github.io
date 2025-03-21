//Password hashing
const bcrypt = require('bcrypt');

async function hashPassword(password) {
    const rounds = 10;
    const hashedPassword = await bcrypt.hash(password, rounds);
    return hashedPassword;
}

async function verifyPassword(password, hashedPassword) {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
}

module.exports = { 
    hashPassword,
    verifyPassword
}