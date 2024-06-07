import { validate, errors } from "com"
import { User, Meeting } from "../data/index.ts"

const { NotFoundError, SystemError, DuplicityError } = errors

function unjoinMeeting(meetingId, userId): Promise<any> {
    debugger
    validate.text(meetingId, 'meetingId', true)
    validate.text(userId, 'userId', true)

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return Meeting.findById(meetingId)
                .catch(error => { throw new SystemError(error.message); })
                .then(meeting => {
                    if (!meeting) throw new NotFoundError('meeting not found')

                    if (!meeting.attendees.includes(user.id)) throw new NotFoundError('user is not joined to this meeting')

                    return Meeting.updateOne({ _id: meetingId }, { $pull: { attendees: userId } })
                })
        })
}

export default unjoinMeeting