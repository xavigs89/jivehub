import dotenv from 'dotenv'

import mongoose from 'mongoose'
import logic from './index.ts'
import { expect, use } from 'chai'
import { errors } from 'com'
import chaiAsPromised from 'chai-as-promised'

dotenv.config()

use(chaiAsPromised)


import { User, Meeting } from '../data/index.ts'

describe('createMeeting', () => {
    before(() => mongoose.connect(process.env.MONGODB_TEST_URL))

    it('creates a meeting with title, address, location, date, description and image from existing user', () =>
        Promise.all([
            User.deleteMany(),
            Meeting.deleteMany()
        ])
            .then(() =>
                User.create({ name: 'Paquito Chocolatero', email: 'paquito@gmail.com', password: '123qwe123', avatar: null, about: null })
            )
            .then(user =>
                logic.createMeeting(user.id, 'My Event', 'Calle falsa 1,2,3', [41.93584282753891, 1.7719600329709349], '2024-02-15 : 21:30', 'We are gonna have some fun', 'http://images.com'))
            .then(() => Meeting.findOne({ }))
            .then(meeting => {
                expect(meeting.title).to.equal('My Event')
                expect(meeting.address).to.equal('Calle falsa 1,2,3')
                // expect(meeting.location).to.deep.equal([41.93584282753891, 1.7719600329709349])
                expect(meeting.date).to.be.instanceOf(Date)
                expect(meeting.description).to.equal('We are gonna have some fun')
                expect(meeting.image).to.equal('http://images.com')
            })
    )




    after(() => mongoose.disconnect())


})