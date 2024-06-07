//@ts-nocheck
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { User, Meeting, Review } from '../data/index.ts'
import logic from './index.ts'
import { expect, use } from 'chai'
import { errors } from 'com'


import chaiAsPromised from 'chai-as-promised'

dotenv.config()

use(chaiAsPromised)

const { Types: { ObjectId } } = mongoose
const { NotFoundError, SystemError } = errors

describe('retrieveReviewsByMeetingId', () => {
    before(() => mongoose.connect(process.env.MONGODB_TEST_URL));

    it('retrieves a review from existing user and meetingId', () =>
        Promise.all([
            User.deleteMany({}),
            Meeting.deleteMany({}),
            Review.deleteMany({})
        ])
            .then(() => Promise.all([
                User.create({ name: 'Xavi Gonzalez', email: 'xavi@gmail.com', password: '123qwe123', avatar: null, about: null }),
                User.create({ name: 'Perico de los Palotes', email: 'perico@gmail.com', password: 'Isdicoders1', avatar: null, about: null }),
            ]))
            .then(([user1, user2]) =>
                Promise.all([
                    Meeting.create({
                        author: user1.id, title: 'My Event', address: 'Calle falsa 1,2,3', location: {
                            type: 'Point',
                            coordinates: [41.27443363157467, 1.9994984529610935]
                        }, date: '2024-02-15', description: 'We are gonna have some fun', image: 'http://images.com'
                    }),
                    Meeting.create({
                        author: user2.id, title: 'My Event', address: 'Calle falsa 1,2,3', location: {
                            type: 'Point',
                            coordinates: [41.27443363157467, 1.9994984529610935]
                        }, date: '2024-02-15', description: 'We are gonna have some fun', image: 'http://images.com'
                    }),
                    Meeting.create({
                        author: user2.id, title: 'My Event', address: 'Calle falsa 1,2,3', location: {
                            type: 'Point',
                            coordinates: [41.27443363157467, 1.9994984529610935]
                        }, date: '2024-02-15', description: 'We are gonna have some fun', image: 'http://images.com'
                    })
                ])
                    .then(([meeting1, meeting2, meeting3]) =>
                        Promise.all([
                            Review.create({ author: user1, rate: 2, comment: 'I did not enjoy the meeting', date: new Date(), meeting: meeting1.id }),
                            Review.create({ author: user1, rate: 4, comment: 'I really enjoyed the meeting', date: new Date(), meeting: meeting2.id }),
                            Review.create({ author: user2, rate: 5, comment: 'All perfect', date: new Date(), meeting: meeting3.id })
                        ])
                            .then(([review1, review2, review3]) =>
                                logic.retrieveReviewsByMeetingId(user1.id, meeting1.id)
                                    .then(review => {
                                        expect(review1).to.exist
                                        expect(review1.rate).to.equal(2)
                                        expect(review2.rate).to.equal(4)
                                        expect(review3.rate).to.equal(5)
                                        expect(review1.comment).to.equal('I did not enjoy the meeting')
                                    })
                            )
                    )
            )


    )


    it('retrieves multiple reviews from existing user and meetingId', () =>
        Promise.all([
            User.deleteMany({}),
            Meeting.deleteMany({}),
            Review.deleteMany({})
        ])
            .then(() => Promise.all([
                User.create({ name: 'Xavi Gonzalez', email: 'xavi@gmail.com', password: '123qwe123', avatar: null, about: null }),
                User.create({ name: 'Perico de los Palotes', email: 'perico@gmail.com', password: 'Isdicoders1', avatar: null, about: null }),
            ]))
            .then(([user1, user2]) =>
                Promise.all([
                    Meeting.create({
                        author: user1.id, title: 'My Event', address: 'Calle falsa 1,2,3', location: {
                            type: 'Point',
                            coordinates: [41.27443363157467, 1.9994984529610935]
                        }, date: '2024-02-15', description: 'We are gonna have some fun', image: 'http://images.com'
                    }),
                    Meeting.create({
                        author: user2.id, title: 'My Event', address: 'Calle falsa 1,2,3', location: {
                            type: 'Point',
                            coordinates: [41.27443363157467, 1.9994984529610935]
                        }, date: '2024-02-15', description: 'We are gonna have some fun', image: 'http://images.com'
                    }),
                    Meeting.create({
                        author: user2.id, title: 'My Event', address: 'Calle falsa 1,2,3', location: {
                            type: 'Point',
                            coordinates: [41.27443363157467, 1.9994984529610935]
                        }, date: '2024-02-15', description: 'We are gonna have some fun', image: 'http://images.com'
                    })
                ])
                    .then(([meeting1, meeting2, meeting3]) =>
                        Promise.all([
                            Review.create({ author: user1, rate: 2, comment: 'I did not enjoy the meeting', date: new Date(), meeting: meeting1.id }),
                            Review.create({ author: user1, rate: 4, comment: 'I really enjoyed the meeting', date: new Date(), meeting: meeting1.id }),
                            Review.create({ author: user2, rate: 5, comment: 'All perfect', date: new Date(), meeting: meeting3.id })
                        ])
                            .then(([review1, review2, review3]) =>
                                logic.retrieveReviewsByMeetingId(user1.id, meeting1.id)
                                    .then(review => {
                                        expect(review1).to.exist
                                        expect(review1.rate).to.equal(2)
                                        expect(review2.rate).to.equal(4)
                                        expect(review3.rate).to.equal(5)
                                        expect(review1.comment).to.equal('I did not enjoy the meeting')
                                    })
                            )
                    )
            )


    )

    after(() => mongoose.disconnect())
})
