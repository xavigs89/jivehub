import { validate, errors } from 'com'
import { User, Meeting, PointType } from '../data/index.ts'
import mongoose from 'mongoose'

const { SystemError, NotFoundError } = errors

function editMeeting(meetingId: string, userId: string, title: string, address: string, location: [number, number], date: string, description: string, image: string):Promise<any> {

    validate.text(meetingId, 'meetingId', true)
    validate.text(userId, 'userId', true)
    validate.text(title, 'title')
    validate.text(address.trim(), 'address')
    validate.coords(location, 'coords')
    validate.text(date, 'date')
    validate.text(description, 'description')
    validate.url(image, 'image')

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user =>{
            if (!user) throw new NotFoundError('user not found')


            return Meeting.updateOne({ _id: meetingId, author: userId }, {

                $set: {
                    title,
                    address,
                    location: {
                        type: 'Point',
                        coordinates: location
                    },
                    date: new Date(date),
                    description,
                    image
                }
            })
            .catch(error => { throw new SystemError(error.message) })
        })
        .then(() => { })
}

export default editMeeting