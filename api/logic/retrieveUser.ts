//@ts-nocheck
import { Schema } from 'mongoose'

const { Types: { ObjectId } } = Schema

import { UserType, User } from '../data/index.ts'

import { validate, errors } from 'com'

const { NotFoundError, SystemError } = errors

type UserResponse = {
    name: string,
    email: string,
    avatar: null,
    about:null
}

function retrieveUser(userId: string, targetUserId: string): Promise<UserResponse> {
    validate.text(userId, 'userId', true)
    validate.text(targetUserId, 'targetUserId', true)

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return User.findById(targetUserId).select('id name email avatar about').lean()
        })
        .then(user => {
            if (!user) throw new NotFoundError('target user not found')

            return { id: user._id, name: user.name, email: user.email, avatar: user.avatar, about: user.about }
        })
}

export default retrieveUser