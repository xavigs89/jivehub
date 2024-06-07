import mongoose from 'mongoose'
import { validate, errors } from 'com'
import { User, Meeting, PointType } from '../data/index.ts'

import { ObjectId } from 'mongoose'

const { Types: { ObjectId }} = mongoose


const { SystemError, NotFoundError } = errors

function createMeeting(userId: string, title: string, address: string, location: [number, number], date: string, description: string, image: string): Promise<void> {
    
    validate.text(userId, 'userId', true)
    validate.text(title, 'title')
    validate.text(address.trim(), 'address')
    validate.coords(location, 'coords')
    validate.text(date, 'date')
    validate.text(description, 'description')
    validate.url(image, 'image')

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user)
                throw new NotFoundError('user not found')
            const formattedDate = new Date(date)

            const formattedPoint: PointType = {
                type: 'Point',
                coordinates: location
            }

            const meeting = {
                author: user._id,
                title: title.trim(),
                address: address.trim(),
                location: formattedPoint,
                date: formattedDate,
                description: description.trim(),
                image,
                attendees: new ObjectId(userId),
            }
           
            return Meeting.create(meeting)
                .catch((error) => { throw new Error(error.message) })

                .then(meeting => { })
        })
}

export default createMeeting