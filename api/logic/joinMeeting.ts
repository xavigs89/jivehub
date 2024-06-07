import mongoose from 'mongoose'

import { validate, errors } from "com"
import { User, Meeting } from "../data/index.ts"

const { NotFoundError, SystemError, DuplicityError } = errors

function joinMeeting(meetingId: string, userId: string) {
    validate.text(userId, 'userId', true)
    validate.text(meetingId, 'meetingId', true)

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return Meeting.findById(meetingId)
                .catch(error => { throw new SystemError(error.message) })
                .then(meeting => {
                    if (!meeting) throw new NotFoundError('meeting not found')
                    if (meeting.attendees.includes(user.id)) throw new DuplicityError('user already joined meeting')

                    return Meeting.updateOne({ _id: meetingId }, { $push: { attendees: userId } })
                        .catch(error => { throw new SystemError(error.message) })
                        .then(() => { })
                })
        })

}


export default joinMeeting
