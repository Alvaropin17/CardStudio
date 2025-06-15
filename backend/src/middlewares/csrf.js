const crypto = require('crypto');

function csrfTokenMiddleware(req, res, next) {


    console.log('Cookie establecida:', req.cookies['XSRF-TOKEN']);
    console.log('CSRF Debug', {
        method: req.method,
        hasCookie: !!req.cookies['XSRF-TOKEN'],
        headerReceived: req.headers['x-xsrf-token'] || 'No header',
        path: req.path
    });


    if (!req.cookies['XSRF-TOKEN']) {
        const token = crypto.randomBytes(32).toString('hex');
        res.cookie('XSRF-TOKEN', token, {
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
            path: '/',
        });
        req.csrfToken = token;
    }

    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const cookieToken = req.cookies['XSRF-TOKEN'];
        const headerToken = req.headers['x-xsrf-token']?.toLowerCase();

        if (!cookieToken || !headerToken || cookieToken !== headerToken) {
            return res.status(403).json({ error: 'Token CSRF inválido' });
        }
    }

    next();
}

module.exports = { csrfTokenMiddleware };