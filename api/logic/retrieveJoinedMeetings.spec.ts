//@ts-nocheck
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { User, Meeting } from '../data/index.ts'
import logic from './index.ts'
import { expect, use } from 'chai'
import { errors } from 'com'


import chaiAsPromised from 'chai-as-promised'

dotenv.config()

use(chaiAsPromised)

const { Types: { ObjectId } } = mongoose
const { NotFoundError, SystemError } = errors

describe('retrieveJoinedMeetings', () => {
    before(() => mongoose.connect(process.env.MONGODB_TEST_URL));

    it('retrieves only meetings that an existing user has joined', () =>
        Promise.all([
            User.deleteMany({}),
            Meeting.deleteMany({})
        ])
            .then(() =>
                Promise.all([
                    User.create({ name: 'Xavi Gonzalez', email: 'xavi@gmail.com', password: '123qwe123', avatar: null, about: null }),
                    User.create({ name: 'Perico de los Palotes', email: 'perico@gmail.com', password: 'Isdicoders1', avatar: null, about: null }),
                    User.create({ name: 'Armando Guerra', email: 'armando@gmail.com', password: 'Isdicoders1', avatar: null, about: null })
                ])
            )
            .then(([user1, user2]) => {
                return Promise.all([
                    Meeting.create({ author: user1.id, title: 'My Event', address: 'Calle falsa 1,2,3', location: {
                        type: 'Point',
                        coordinates: [41.27443363157467, 1.9994984529610935]
                    }, date: new Date(2024, 1, 15), description: 'We are gonna have some fun', image: 'http://images.com', attendees: [user1.id] }),
                    Meeting.create({ author: user1.id, title: 'My Event 2', address: 'Calle falsa 1,2,3', location: {
                        type: 'Point',
                        coordinates: [41.27443363157467, 1.9994984529610935]
                    }, date: new Date(2024, 1, 15), description: 'We are gonna have some fun', image: 'http://images.com', attendees: [user1.id, user2.id] }),
                    Meeting.create({ author: user1.id, title: 'My Event 3', address: 'Calle falsa 1,2,3', location: {
                        type: 'Point',
                        coordinates: [41.27443363157467, 1.9994984529610935]
                    }, date: new Date(2024, 1, 15), description: 'We are gonna have some fun', image: 'http://images.com', attendees: [user1.id, user2.id] })
                ])
                    .then(([meeting1, meeting2, meeting3]) => {
                     
                        return logic.retrieveJoinedMeetings(user2.id)
                            .then(meetings => {
                           
                                expect(meetings).to.have.lengthOf(2)
                                

                                
                                expect(meetings.map(meeting => meeting.id)).to.include.members([meeting2.id, meeting3.id])
                                expect(meetings.map(meeting => meeting.id)).to.not.include.members([meeting1.id])
                            })
                    })
            })
    )

    after(() => mongoose.disconnect());
})