
const crypto = require("crypto");
function decrypt(encryptedText, secretKey) {
  const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
const handleValidateKey = (request, response, next) => {
  try{
    const user = decrypt(request.body.apiKey, process.env.secret);
    if(user === process.env.user)next();
    else response.status(401);
  } catch(error){
    response.status(500).json({error})
  }

}

module.exports = { handleValidateKey }