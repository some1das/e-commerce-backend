const { json } = require("body-parser");

exports.checkData = (req, res, next) => {
  const email = req.body.email;
  const emailLength = email.length;
  if (emailLength < 5)
    return res.json({
      error: "email length is too short",
    });
  else {
    let isGood = false;
    const emailLength = req.body.email.length;
    const email = req.body.email;
    for (let i = 0; i < emailLength; i++) {
      if (email[i] === "@") isGood = true;
    }
    if (isGood === false)
      return res.json({
        error: "this is not an email",
      });
  }
  //here we will check password
  let password = req.body.password;
  const passwordLength = password.length;
  if (passwordLength < 4) {
    return res.json({
      error: "the length of password should be atleast 4 characters",
    });
  }
  let isContainNumber = false;
  for (let i = 0; i < passwordLength; i++) {
    if (parseInt(password[i]) >= 0) {
      isContainNumber = true;
      break;
    }
  }
  if (isContainNumber === false) {
    return res.json({
      error: "your password should contain atleast one number",
    });
  }
  next();
};
