module.exports = function(req, res, next) {
    const { email, name, password } = req.body;
    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
  
    if (req.path === "/register") {
      if (![email, name, password].every(Boolean)) {
        return res.status(401).json({"message":"Hãy nhập đủ thông tin"});
      } else if (!validEmail(email)) {
        return res.status(401).json({"message":"Email không hợp lệ"});
      }
    } else if (req.path === "/login") {
      if (![email, password].every(Boolean)) {
        return res.status(401).json({"message":"Hãy nhập đủ thông tin"});
      } else if (!validEmail(email)) {
        return res.status(401).json({"message":"Email không hợp lệ"});
      }
    }
    next();
  };