//@ts-nocheck
import { ObjectId } from 'mongoose'

import { validate, errors } from 'com'

import { User, Meeting } from '../data/index.ts'

const { SystemError, NotFoundError } = errors

function retrieveMeetings(userId: string): Promise<any> {
    validate.text(userId, 'userId', true)


    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user)
                throw new NotFoundError('user not found')

            return Meeting.find().sort({ date: 1 })
                .populate<{ author: { _id: ObjectId, name: string } }>('author', 'name').lean()
                .populate<{ attendees: [{ id: ObjectId, name: string }] }>('attendees', '_id name').lean()

                .catch(error => { throw new SystemError(error.message) })
                .then(meetings =>
                    meetings.map<{ id: string, author: { id: string, name: string }, title: string, address: string, location: [number, number], date: Date, description: string, image: string, attendees: [{ id: ObjectId, name: string }] }>(({ _id, author, title, address, location, date, description, image, attendees }) => ({
                        id: _id.toString(),
                        author: {
                            id: author._id.toString(),
                            name: author.name
                        },
                        title,
                        address,
                        location: {
                            type: location.type,
                            latitude: location.coordinates[0],
                            longitude: location.coordinates[1]
                        },
                        date,
                        description,
                        image,
                        attendees: attendees.map(attendee => attendee.name)
                    }))
                )
        })
}

export default retrieveMeetings



// [{ id: string, author: { id: string, name: string }, title: string, address: string, location: [Number, Number], date: Date, description: string, image: string, attendees: [string] }] | { id: string; author: { id: string, name: string; }; title: string; address: string; location: [Number, Number]; date: Date; description: string; image: string; attendees: [string]; }[]

//date.toLocaleString('es-ES').slice(0, -3),


//date.toLocaleString('es-ES').slice(0, -3),