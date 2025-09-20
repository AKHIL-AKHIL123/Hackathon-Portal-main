const { verifyAccessToken, verifyRefreshToken, generateTokens, setTokenCookies } = require('../utils/auth');
const { AppError } = require('../utils/errorHandler');

function authMiddleware(allowedRoles = []) {
  return async (req, res, next) => {
    try {
      // Get access token from cookie
      const accessToken = req.cookies.accessToken;
      if (!accessToken) {
        throw new AppError('Access denied. Please log in.', 401);
      }

      // Verify access token
      const decoded = verifyAccessToken(accessToken);
      if (!decoded) {
        // Try to refresh using refresh token
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          throw new AppError('Access denied. Please log in.', 401);
        }

        const refreshDecoded = verifyRefreshToken(refreshToken);
        if (!refreshDecoded) {
          throw new AppError('Session expired. Please log in again.', 401);
        }

        // Generate new tokens
        const user = await User.findById(refreshDecoded.id);
        if (!user) {
          throw new AppError('User no longer exists.', 401);
        }

        const tokens = generateTokens(user);
        setTokenCookies(res, tokens);
        req.user = { id: user._id, email: user.email, role: user.role };
      } else {
        req.user = decoded;
      }

      // Check role authorization
      if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
        throw new AppError('Access denied. Insufficient permissions.', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = authMiddleware;
