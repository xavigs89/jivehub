import { validate, errors } from 'com'

import { UserType, User } from '../data/index.ts'

const { DuplicityError, SystemError, CredentialsError } = errors

function registerUser(name: string, email: string, password: string, confirmedPassword: string): Promise<void> {
    validate.text(name, 'name')
    validate.email(email)
    validate.password(password)

    if (password !== confirmedPassword) throw new CredentialsError('passwords do not match')

    return User.findOne({ $or: [{ email }, { name }] })
        .catch(error => { throw new SystemError(error.message) })
        .then((user: UserType) => {
            if (user)
                throw new DuplicityError('user already exists')

            user = {
                name: name.trim(),
                email: email,
                password: password,
                avatar: null,
                about: null
            }

            return User.create(user)
                .catch(error => { throw new SystemError(error.message) })
                .then(user => { })
        })

}

export default registerUser