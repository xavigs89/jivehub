//@ts-nocheck
import dotenv from 'dotenv'

import mongoose from 'mongoose'
import logic from './index.ts'
import { expect, use } from 'chai'
import { errors } from 'com'
import chaiAsPromised from 'chai-as-promised'

dotenv.config()

use(chaiAsPromised)


import { User, Review, Meeting } from '../data/index.ts'

describe('createReview', () => {
    before(() => mongoose.connect(process.env.MONGODB_TEST_URL))

    it('creates a review with rate and optional comment from existing user', () =>
        Promise.all([
            User.deleteMany(),
            Review.deleteMany()
        ])
            .then(() =>
                User.create({ name: 'Paquito Chocolatero', email: 'paquito@gmail.com', password: '123qwe123', avatar: null, about: null })
            )
            .then(user =>
                Meeting.create({
                    author: user.id,
                    title: 'My Event',
                    address: 'Calle falsa 1,2,3',
                    location: {
                        type: 'Point',
                        coordinates: [41.27443363157467, 1.9994984529610935]
                    },
                    date: new Date('2024-02-15T21:30:00'),
                    description: 'We are gonna have some fun',
                    image: 'http://images.com'
                })
                    .then(meeting =>
                        logic.createReview(user.id, 4, 'I enjoyed the meeting', meeting.id))
            )
            .then(() => Review.findOne({}))
            .then(review => {
                expect(review).to.exist
                expect(review.rate).to.equal(4)
                expect(review.comment).to.equal('I enjoyed the meeting')
                expect(review.author).to.exist
                expect(review.meeting).to.exist
            })
    )

    after(() => mongoose.disconnect())

})