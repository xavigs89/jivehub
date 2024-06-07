import { validate, errors } from 'com'
import { User } from '../data/index.ts'
import mongoose from 'mongoose'

const { SystemError, NotFoundError } = errors

function editAbout(userId: string, description: string): Promise<void> {
    validate.text(userId, 'userId', true)
    validate.text(description, 'description')

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return User.updateOne({ _id: userId }, {
                $set: {
                    about: description
                }
            })
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(() => { })
}


export default editAbout