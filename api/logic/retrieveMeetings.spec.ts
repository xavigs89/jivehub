//@ts-nocheck
import dotenv from 'dotenv'

import mongoose from 'mongoose'
import logic from './index.ts'
import { expect, use } from 'chai'
import { errors } from 'com'

import { User, Meeting } from '../data/index.ts'
import chaiAsPromised from 'chai-as-promised'

// dotenv.config()

// use(chaiAsPromised)

const { CredentialsError, NotFoundError, SystemError } = errors

describe('retrieveMeetings', () => {
    before(() => mongoose.connect(process.env.MONGODB_TEST_URL))

    it('retrieves all meetings from existing user', () =>
        Promise.all([
            User.deleteMany(),
            Meeting.deleteMany()
        ])

            .then(() =>
                Promise.all([
                    User.create({ name: 'Xavi Gonzalez', email: 'xavi@gmail.com', password: '123qwe123', avatar: null, about: null }),
                    User.create({ name: 'Perico de los Palotes', email: 'perico@gmail.com', password: 'Isdicoders1', avatar: null, about: null }),
                    User.create({ name: 'Armando Guerra', email: 'armando@gmail.com', password: 'Isdicoders1', avatar: null, about: null }),
                ])

                    .then(user =>
                        Promise.all([

                            User.create({ name: 'Mari Juana', email: 'mari@gmail.com', password: '123qwe123', avatar: null, about: null })
                                .then(user =>
                                    Meeting.create({ author: user.id, title: 'My Event', address: 'Calle falsa 1,2,3', location: {
                                        type: 'Point',
                                        coordinates: [41.27443363157467, 1.9994984529610935]
                                    }, date: new Date(2024, 1, 15), description: 'We are gonna have some fun', image: 'http://images.com', attendees: [user.id] })),

                        ])

                            .then(([meeting1]) =>
                                User.create({ name: 'Paquito Chocolatero', email: 'paquito@gmail.com', password: '123qwe123' })
                                    .then(user => logic.retrieveMeetings(user.id))
                                    .then(meetings => {

                                        expect(meetings).to.have.lengthOf(1)
                                        expect(meeting1.title).to.equal('My Event')
                                        expect(meeting1.address).to.equal('Calle falsa 1,2,3')
                                        // expect(meeting1.location).to.deep.equal[41.27443363157467, 1.9994984529610935]
                                        expect(meeting1.date).to.be.instanceOf(Date)
                                        expect(meeting1.description).to.equal('We are gonna have some fun')
                                        expect(meeting1.image).to.equal('http://images.com')


                                    })
                            )
                    )
            )
    )


   
    after(mongoose.disconnect)
})