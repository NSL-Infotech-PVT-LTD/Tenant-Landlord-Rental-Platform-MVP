const jwt = require('jsonwebtoken');

function signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, 
        // { expiresIn: '24h' }
    );
}

function handleUndefinedRoutes(req, res, next) {
    res.status(404).json({ statusCode: 404, message: "Endpoint not found" });
}

function validateFields({ email, password }, isSignUp) {
    const errors = [];

    // Validate email
    if (!email) {
        errors.push("Email is required");
    } else if (!isValidEmail(email)) {
        errors.push("Invalid email format");
    }

    // Validate password
    if (!password) {
        errors.push("Password is required");
    } else if (isSignUp && password.length < 6) {
        errors.push("Password must be at least 6 characters long");
    }

    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized token" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: "Unauthorized token" });
    }
};

// Export the functions
module.exports = { handleUndefinedRoutes, validateFields, signToken, authenticateUser };

//