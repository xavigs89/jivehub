import { validate } from 'com'

function isUserLoggedIn() {
    try {
        validate.token(sessionStorage.token)
        return true
        // return !!sessionStorage.token
    } catch (error) {
        return false
        // console.error(error)
    }

}

export default isUserLoggedIn