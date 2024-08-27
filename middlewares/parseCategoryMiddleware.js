
const parseCategoryMiddleware = (req, res, next) => {
    try {
      const { category } = req.query;    
      req.parsedCategory = JSON.parse(category ?? "[]");
      next();
    } catch (error) {      
      res.status(400).json({ error: 'Invalid category format' });
    }
  };
  
  export default parseCategoryMiddleware;
  