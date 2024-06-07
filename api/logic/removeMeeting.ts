//@ts-nocheck
import { validate, errors } from 'com'
import { Meeting, User } from '../data/index.ts'


const { SystemError, NotFoundError } = errors

function removeMeeting(userId: string, meetingId: string): Promise<void> {

    validate.text(userId, 'userId', true)
    validate.text(meetingId, 'meetingId', true)

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user)
                throw new NotFoundError('user does not exist')

            return Meeting.findById(meetingId)
                .catch(error => { throw new SystemError(error.message) })
                .then(meeting => {
                    if (!meeting)
                        throw new NotFoundError('meeting not found')

                    if (meeting.author.toString() !== user._id.toString())
                        throw new NotFoundError('meeting does not belong to user')

                    return Meeting.findByIdAndDelete(meetingId)
                })


        })
}
export default removeMeeting


// const meeting = meetings.findOne(meeting => meeting.id === meetingId)

// meetings.deleteOne(meeting => meeting.id === meetingId)


