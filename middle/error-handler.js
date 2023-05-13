let _ = require('lodash');
const Sentry = require('@sentry/node');
require('dotenv').config();

module.exports = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
        .catch(err => {
            const status = err.status || 500;
            if (status >= 500 && process.env.FLAVOR !== 'dev') {
                /*
                * Sentry report
                */
                Sentry.withScope((scope) => {
                    scope.setLevel('error');
                    if (typeof req.user != "undefined") {
                        scope.setUser({'email': req.user.email});
                        scope.setExtra("user", req.user);
                    }
                    scope.setExtra("errors", err);
                    Sentry.captureException(err);
                });
            }

            console.log(err);
            next(err);
        });
};
