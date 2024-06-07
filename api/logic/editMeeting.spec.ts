//@ts-nocheck
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { expect, use } from 'chai'
import { errors } from 'com'

import logic from './index.ts'
import { User, Meeting } from '../data/index.ts'

dotenv.config()

const { SystemError, NotFoundError } = errors

describe('editMeeting', () => {
    before(() => mongoose.connect(process.env.MONGODB_TEST_URL))

    let userId
    let meetingId

    beforeEach(() => {
        return Promise.all([
            User.deleteMany(),
            Meeting.deleteMany()
        ])
        .then(() => User.create({ name: 'Paquito Chocolatero', email: 'paquito@gmail.com', password: '123qwe123', avatar: null, about: null }))
        .then(user => {
            userId = user.id
            return Meeting.create({ author: user.id, title: 'My Event', address: 'Calle falsa 1,2,3', location: {
                type: 'Point',
                coordinates: [41.27443363157467, 1.9994984529610935]
            }, date: '2024-02-15', description: 'We are gonna have some fun', image: 'http://images.com' })
        })
        .then(meeting => {
            meetingId = meeting.id
        })
    })

    it('succeeds when you edit a meeting', () => {
        const updatedTitle = 'Updated Event Title'
        const updatedAddress = 'Updated Address'
        const updatedLocation = [41.27443363157467, 1.9994984529610935],
        const updatedDate = '2024-03-15'
        const updatedDescription = 'Updated description'
        const updatedImage = 'http://updated-image.com'

        return logic.editMeeting(meetingId, userId, updatedTitle, updatedAddress, updatedLocation, updatedDate, updatedDescription, updatedImage)
            .then(() => Meeting.findById(meetingId))
            .then(updatedMeeting => {

                expect(updatedMeeting).to.exist
                expect(updatedMeeting.title).to.equal(updatedTitle)
                expect(updatedMeeting.address).to.equal(updatedAddress)
                // expect(updatedMeeting.location).to.deep.equal(updatedLocation)
                expect(updatedMeeting.date).to.deep.equal(new Date(updatedDate))
                expect(updatedMeeting.description).to.equal(updatedDescription)
                expect(updatedMeeting.image).to.equal(updatedImage)
            })
    })
    

    after(() => mongoose.disconnect())
})