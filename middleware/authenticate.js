module.exports = function(req, res, next) {
    // Authentication logic here
    // For example, check if the user is authenticated
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).send('Unauthorized');
    }
};
