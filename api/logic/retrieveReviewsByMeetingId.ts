//@ts-nocheck
import { ObjectId } from 'mongoose';
import { User, Review } from '../data/index.ts';
import { validate, errors } from 'com';

const { NotFoundError, SystemError } = errors;

function retrieveReviewsByMeetingId(userId: string, meetingId: string): Promise<any> {

    validate.text(userId, 'userId', true);
    validate.text(meetingId, 'meetingId', true);

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')
        })
        .then(() => {
            return Review.find({meeting: meetingId}).populate<{ author: { _id: ObjectId, name: string } }>('author', '_id name').lean()
                .catch(error => { throw new SystemError(error.message) })
                .then(reviews =>
                    reviews.map(({ _id, author, rate, comment, date, meeting }) => ({
                        id: _id.toString(),
                        author: {
                            id: author._id.toString(),
                            name: author.name
                        },
                        rate,
                        comment: comment.trim(),
                        date,
                        meeting
                    }))
                )
        })
        .catch(error => {
            throw new SystemError(error.message)
        })
}

export default retrieveReviewsByMeetingId