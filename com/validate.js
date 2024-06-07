import { ContentError, UnauthorizedError } from './errors.js';
import util from './util.js';
// const DATE_REGEX = /^\d{2}-\d{2}-\d{4}$/;
// const DATE_REGEX = /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4} (?:[01]\d|2[0-3]):[0-5]\d$/;
// const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const DATE_REGEX = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[A-Za-z])[A-Za-z0-9]+$/;
const URL_REGEX = /^(http|https):\/\//;
const validate = {
    text(text, explain, checkEmptySpaceInside) {
        if (typeof text !== 'string')
            throw new TypeError(explain + ' ' + text + ' is not a string');
        if (!text.trim().length)
            throw new ContentError(explain + ' >' + text + '< is empty or blank');
        if (checkEmptySpaceInside)
            if (text.includes(' '))
                throw new ContentError(explain + ' ' + text + ' has empty spaces');
    },
    date(date, explain) {
        if (typeof date !== 'string')
            throw new TypeError(explain + ' ' + date + ' is not a string');
        if (!DATE_REGEX.test(date))
            throw new ContentError(explain + ' ' + date + ' does not have a valid format');
    },
    email(email, explain = 'email') {
        if (!EMAIL_REGEX.test(email))
            throw new ContentError(`${explain} ${email} is not an email`);
    },
    password(password, explain = 'password') {
        if (!PASSWORD_REGEX.test(password))
            throw new ContentError(`${explain} is not acceptable`);
    },
    url(url, explain) {
        if (!URL_REGEX.test(url))
            throw new ContentError(explain + ' ' + url + ' is not an url');
    },
    callback(callback, explain = 'callback') {
        if (typeof callback !== 'function')
            throw new TypeError(`${explain} is not a function`);
    },
    token(token, explain = 'token') {
        if (typeof token !== 'string')
            throw new TypeError(`${explain} is not a string`);
        const { exp } = util.extractJwtPayload(token);
        if (exp * 1000 < Date.now())
            throw new UnauthorizedError('session expired');
    },
    coords(coords, explain = 'coords') {
        if (!Array.isArray(coords) || coords.length !== 2 || !coords.every(coord => typeof coord === 'number')) {
            throw new ContentError(`${explain} must be an array of two numbers`);
        }
    },
    number(value, explain = 'number') {
        if (typeof value !== 'number')
            throw new TypeError(explain + ' ' + value + ' is not a number');
        if (typeof value !== 'number' && !Array.isArray(value))
            throw new TypeError(explain + ' ' + value + ' is not a number or array of numbers');
    },
    rating(value, explain = 'rating') {
        if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 5) {
            throw new TypeError(explain + ' ' + value + ' is not a valid rating (it should be a number between 1 and 5)');
        }
    }
};
export default validate;

