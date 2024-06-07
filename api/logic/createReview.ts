import mongoose from 'mongoose'
import { validate, errors } from 'com'
import { User, Meeting, Review } from '../data/index.ts'
const { Types: { ObjectId } } = mongoose

const { SystemError, NotFoundError } = errors

function createReview(userId: string, rate: number, comment: string, meetingId: string): Promise<void> {

    validate.text(userId, 'userId', true)
    validate.rating(rate, 'rating')
    if(comment)
        validate.text(comment, 'comment')

    return Promise.all([
        User.findById(userId),
        Meeting.findById(meetingId)
    ])
    .then(([user, meeting]) => {
        if(!user)
            throw new NotFoundError('user not found')

        if(!meeting)
            throw new NotFoundError('meeting not found')

        const review = {
            author: user._id,
            rate,
            comment: comment.trim(),
            date: new Date(),
            meeting: meeting._id
        }

        return Review.create(review)
            .then(review => {})
            .catch(error => { throw new SystemError(error.message) })
    })
    .catch(error => { throw new SystemError(error.message) })
}

export default createReview
