const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: `Access denied. Required role : ${allowedRoles.join(
            " or "
          )}`,
        });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  };
};

export default authorize;
