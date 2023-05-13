let _ = require('lodash');
let Validator = require('validatorjs');

module.exports = (data, rules) => {
    return new Promise((resolve, reject) => {
        let validator = new Validator(data, rules, {
            array: 'The :attribute must be an array', // custom message
        });
        validator.passes(() => resolve(false));

        validator.fails(() => {
            let errors = validator.errors.all();
            if (!_.isObject(errors)) {
                return resolve(errors);
            }
            let messageError = '';
            for (let param in errors) {
                messageError = errors[param][0];
                break;
            }
            return resolve(messageError);
        });
    })
}
