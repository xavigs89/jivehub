//@ts-nocheck
import dotenv from 'dotenv'

import mongoose from 'mongoose'
import logic from './index.ts'
import { expect } from 'chai'
import { errors } from 'com'

import { User, Meeting } from '../data/index.ts'

dotenv.config()

const { NotFoundError } = errors

describe('retrieveCreatedMeetings', () => {
    before(() => mongoose.connect(process.env.MONGODB_TEST_URL))

    it('retrieves meetings created by a specific user', () =>
        Promise.all([
            User.deleteMany(),
            Meeting.deleteMany()
        ])

            .then(() =>
                Promise.all([
                    User.create({ name: 'Xavi Gonzalez', email: 'xavi@gmail.com', password: '123qwe123' }),
                    User.create({ name: 'Perico de los Palotes', email: 'perico@gmail.com', password: 'Isdicoders1' }),
                    User.create({ name: 'Armando Guerra', email: 'armando@gmail.com', password: 'Isdicoders1' }),
                ])

                    .then(users =>
                        User.create({ name: 'Mari Juana', email: 'mari@gmail.com', password: '123qwe123' })
                            .then(user =>
                                Meeting.create({ author: user.id, title: 'My Event', address: 'Calle falsa 1,2,3', location: {
                                    type: 'Point',
                                    coordinates: [41.27443363157467, 1.9994984529610935]
                                }, date: new Date(2024, 1, 15), description: 'We are gonna have some fun', image: 'http://images.com' })
                                    .then(meeting =>
                                        logic.retrieveCreatedMeetings(user.id)
                                            .then(meetings => {
                                                expect(meetings).to.have.lengthOf(1)
                                                const [retrievedMeeting] = meetings
                                                expect(retrievedMeeting.title).to.equal('My Event')
                                                expect(retrievedMeeting.address).to.equal('Calle falsa 1,2,3')
                                                // expect(retrievedMeeting.location).to.deep.equal([41.93584282753891, 1.7719600329709349])
                                                expect(retrievedMeeting.date).to.be.instanceOf(Date)
                                                expect(retrievedMeeting.description).to.equal('We are gonna have some fun')
                                                expect(retrievedMeeting.image).to.equal('http://images.com')
                                            })
                                    )
                            )
                    )
            )
    )

    after(mongoose.disconnect)
})