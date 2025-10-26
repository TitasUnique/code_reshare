const bcrypt = require('bcryptjs'); // <-- use bcryptjs instead of bcrypt

// Normal function to hash a value
function hashValue(value) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds); // synchronous salt
    const hashedValue = bcrypt.hashSync(value, salt); // synchronous hash
    return hashedValue;
}

// Example usage
const hashed = hashValue('1234');
console.log('Hashed Value:', hashed);
