//@ts-nocheck
// import dotenv from 'dotenv'
import mongoose from "mongoose"
import { User, Meeting } from '../data/index.ts'
import { expect } from 'chai'
import logic from "./index.ts"

describe('unjoinMeeting', () => {
    before(() => mongoose.connect(process.env.MONGODB_TEST_URL))

    it('should remove userId from meeting attendees', () =>
        Promise.all([
            User.deleteMany({}),
            Meeting.deleteMany({})
        ])
            .then(() =>
                Promise.all([
                    User.create({ name: 'Xavi Gonzalez', email: 'xavi@gmail.com', password: '123qwe123', avatar: null, about: null }),
                    User.create({ name: 'Perico de los Palotes', email: 'perico@gmail.com', password: 'Isdicoders1', avatar: null, about: null }),
                    User.create({ name: 'Armando Guerra', email: 'armando@gmail.com', password: 'Isdicoders1', avatar: null, about: null }),
                ])
            )
            .then(([user1, user2, user3]) =>

                Meeting.create({ author: user1.id, title: 'My Event', address: 'Calle falsa 1,2,3', location: {
                    type: 'Point',
                    coordinates: [41.27443363157467, 1.9994984529610935]
                }, date: new Date(2024, 1, 15), description: 'We are gonna have some fun', image: 'http://images.com', attendees: [user1.id, user2.id, user3.id] })
                    .then(meeting => {

                        logic.unjoinMeeting(meeting.id, user2.id)

                            .then(() => Meeting.findOne({ title: 'My Event' }))
                            .then(updatedMeeting => {

                                expect(!!updatedMeeting).to.be.true

                            })
                    })
            )
    )

    it('fails when user tries to unjoin a meeting that is not joined to', () =>
        Promise.all([
            User.deleteMany({}),
            Meeting.deleteMany({})
        ])
            .then(() =>
                Promise.all([
                    User.create({ name: 'Xavi Gonzalez', email: 'xavi@gmail.com', password: '123qwe123', avatar: null, about: null }),
                    User.create({ name: 'Perico de los Palotes', email: 'perico@gmail.com', password: 'Isdicoders1', avatar: null, about: null }),
                ])
            )
            .then(([user1, user2]) =>
                Meeting.create({ author: user1.id, title: 'My Event', address: 'Calle falsa 1,2,3', location: {
                    type: 'Point',
                    coordinates: [41.27443363157467, 1.9994984529610935]
                }, date: new Date(2024, 1, 15), description: 'We are gonna have some fun', image: 'http://images.com', attendees: [user1.id] })
                    .then(meeting =>
                        logic.unjoinMeeting(meeting.id, user2.id)
                            .catch(error => {
                                expect(error.message).to.equal('user is not joined to this meeting');
                            })
                    )
            )
    )

    after(() => mongoose.disconnect())
})