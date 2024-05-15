import crypto from 'crypto';

const algorithm = 'aes-256-ctr';
const privateKey = '37LvDSm4XvjYOh9Y';
const IV_LENGTH = 16;
// method to decrypt data(password)
export const decrypt = (password: string) => {
  try {
    const decipher = crypto.createDecipher(algorithm, privateKey);
    let dec = decipher.update(password, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return { success: true, result: dec };
  } catch (ex) {
    return { success: false, info: 'Bad input' };
  }
};

// method to encrypt data(password)
export const encrypt = (password: string) => {
  try {
    const cipher = crypto.createCipher(algorithm, privateKey);
    let crypted = cipher.update(password, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return { success: true, result: crypted };
  } catch (ex) {
    throw ex;
    return { success: false, info: 'Bad input' };
  }
};
