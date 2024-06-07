//@ts-nocheck
import logic from './index.ts'
import mongoose from 'mongoose'
import { expect, use } from 'chai'

import { User, Meeting } from '../data/index.ts'


describe('joinMeeting', () => {
    before(() => mongoose.connect(process.env.MONGODB_TEST_URL))

    it('succeeds when you join a meeting', () =>

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

                    .then(([user1, user2]) =>

                        Meeting.create({ author: user1.id, title: 'My Event', address: 'Calle falsa 1,2,3', location: {
                            type: 'Point',
                            coordinates: [41.27443363157467, 1.9994984529610935]
                        }, date: new Date(2024, 1, 15), description: 'We are gonna have some fun', image: 'http://images.com', attendees: [user1.id] })
                            .then(meeting =>

                                logic.joinMeeting(meeting.id, user2.id)

                                    .then(() => Meeting.findOne({ title: 'My Event' }))
                                    .then(updatedMeeting => {

                                        expect(!!updatedMeeting).to.be.true
                                    })
                            )
                    )
            )
    )

    it('fails when user tries to join a meeting that is already joined to', () =>
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
                }, date: new Date(2024, 1, 15), description: 'We are gonna have some fun', image: 'http://images.com', attendees: [user1.id, user2.id] })
                    .then(meeting =>
                        logic.joinMeeting(meeting.id, user2.id)
                            .catch(error => {
                                expect(error.message).to.equal('user already joined meeting');
                            })
                    )
            )
    )

    after(() => mongoose.disconnect())
})