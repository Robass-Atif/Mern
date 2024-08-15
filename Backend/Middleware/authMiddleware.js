const authMiddleware = async (req, res, next) => {
  try {
      const token = req.headers.authorization.split(" ")[1];
      console.log("Received Token:", token); // Debug log
      const decoded = jwt.verify(token, "default_secret_key");
      req.user = decoded;
      next();
  } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: "Not authorized" });
  }
};





