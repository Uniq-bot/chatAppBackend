import jwt from 'jsonwebtoken';

export const authenticationOfToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || '';
        const isBearer = authHeader.startsWith('Bearer ');
        const token = isBearer ? authHeader.slice(7) : undefined;

        if (!token) {
            return res.status(401).send({ message: 'No token provided' });
        }
  const secretKey = process.env.JWT_SECRET || "defaultSecretKey"
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        return next();
    } catch (error) {
        console.error('Auth error:', error.message);
        return res.status(401).send({ message: 'Unauthorized' });
    }
};