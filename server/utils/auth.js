const jwt = require('jsonwebtoken');

const generateTokens = (user) => {
    // Access token - short lived (15 minutes)
    const accessToken = jwt.sign(
        { 
            id: user._id, 
            email: user.email, 
            role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );

    // Refresh token - longer lived (7 days)
    const refreshToken = jwt.sign(
        { 
            id: user._id 
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    return {
        accessToken,
        refreshToken
    };
};

const setTokenCookies = (res, { accessToken, refreshToken }) => {
    // Set access token in HTTP-only cookie
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/auth/refresh', // Only sent with refresh token requests
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

const clearTokenCookies = (res) => {
    res.cookie('accessToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0
    });

    res.cookie('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/auth/refresh',
        maxAge: 0
    });
};

const verifyAccessToken = (token) => {
    if (!token) {
        throw new Error('No token provided');
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token');
        } else {
            throw new Error('Failed to authenticate token');
        }
    }
};

const verifyRefreshToken = (token) => {
    if (!token) {
        throw new Error('No refresh token provided');
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        return decoded;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Refresh token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid refresh token');
        } else {
            throw new Error('Failed to verify refresh token');
        }
    }
};

module.exports = {
    generateTokens,
    setTokenCookies,
    clearTokenCookies,
    verifyAccessToken,
    verifyRefreshToken
};