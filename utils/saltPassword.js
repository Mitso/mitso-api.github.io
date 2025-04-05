const { hashPassword, verifyPassword } = require( './hashSalt');
const saltPassword = async (password) => {
    const hashedPassword = await hashPassword(password);
    const isPasswordMatch = await verifyPassword(password, hashedPassword);
    if (!isPasswordMatch) {
        throw new Error('Passwords do not match');
    }
    return {
        match: isPasswordMatch, 
        pass: hashedPassword
    }
};

module.exports = {
    saltPassword
};