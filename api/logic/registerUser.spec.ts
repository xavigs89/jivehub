import dotenv from 'dotenv'

import mongoose from "mongoose";

import { User } from '../data/index.ts'

import logic from './index.ts'
import { expect } from 'chai'
import { errors } from 'com'

dotenv.config()

const { DuplicityError, CredentialsError } = errors

describe('registerUser', () => {
    before(() => mongoose.connect(process.env.MONGODB_TEST_URL))

    it('succeeds a new user', () =>
        User.deleteMany()
            .then(() => logic.registerUser('Xavi Gonzalez', 'xavigs1989@gmail.com', 'Isdicoders1', 'Isdicoders1'))
            .then(() => User.findOne({ email: 'xavigs1989@gmail.com' }))
            .then(user => {
                expect(!!user).to.be.true
                expect(user.name).to.equal('Xavi Gonzalez')
                expect(user.email).to.equal('xavigs1989@gmail.com')
                expect(user.password).to.equal('Isdicoders1')
                expect(user.avatar).to.equal(null)
                expect(user.about).to.equal(null)
            })
    )

    it('fails on existing user', () =>
        User.deleteMany()
            .then(() => User.create({ name: 'Paquito Chocolatero', email: 'paquito@gmail.com', password: 'Isdicoders1' }))
            .then(() =>
                logic.registerUser('Paquito Chocolatero', 'paquito@gmail.com', 'Isdicoders1', 'Isdicoders1')
                    .catch(error => {
                        expect(error).to.be.instanceOf(DuplicityError)
                        expect(error.message).to.equal('user already exists')
                    })
            )
    )

    it('fails on non string name', () => {
        let errorThrown

        try {
            // @ts-ignore
            logic.registerUser(123, 'paquito@gmail.com', 'Isdicoders1')
        } catch (error) {
            errorThrown = error
        }

        expect(errorThrown).to.be.instanceOf(TypeError)
        expect(errorThrown.message).to.equal('name 123 is not a string')
    })

    it('fails on empty name', () => {
        let errorThrown

        try {
            logic.registerUser('', 'paquito@gmail.com', 'Isdicoders1', 'Isdicoders1')
        } catch (error) {
            errorThrown = error
        }

        expect(errorThrown).to.be.instanceOf(Error)
        expect(errorThrown.message).to.equal('name >< is empty or blank')
    })

    // it('fails on non string birthdate', () => {
    //     let errorThrown

    //     try {
    //         // @ts-ignore
    //         logic.registerUser('Paquito Chocolatero', 123, 'paquito@gmail.com', 'paquito', 'Isdicoders1')
    //     } catch (error) {
    //         errorThrown = error
    //     }

    //     expect(errorThrown).to.be.instanceOf(TypeError)
    //     expect(errorThrown.message).to.equal('birthdate 123 is not a string')
    // })

    // it('fails on incorrect birthdate format', () => {
    //     let errorThrown

    //     try {
    //         logic.registerUser('Paquito Chocolatero', '1989/04/25', 'paquito@gmail.com', 'paquito', 'Isdicoders1', 'Isdicoders1')
    //     } catch (error) {
    //         errorThrown = error
    //     }

    //     expect(errorThrown).to.be.instanceOf(Error)
    //     expect(errorThrown.message).to.equal('birthdate 1989/04/25 does not have a valid format')
    // })



    // TODO add other unhappy test cases

    it('fails on non-valid email', () => {
        let errorThrown

        try {
            logic.registerUser('Paquito Chocolatero', 'I am not an email', 'Isdicoders1', 'Isdicoders1')
        } catch (error) {
            errorThrown = error
        }

        expect(errorThrown).to.be.instanceOf(Error)
        expect(errorThrown.message).to.equal('email I am not an email is not an email')
    })

    it('fails on non-valid password', () => {
        let errorThrown

        try {
            logic.registerUser('Paquito Chocolatero', 'paquito@gmail.com', 'I am not a valid password', 'I am not a valid password')
        } catch (error) {
            errorThrown = error
        }

        expect(errorThrown).to.be.instanceOf(Error)
        expect(errorThrown.message).to.equal('password is not acceptable')
    })


    it('fails on non-matching passwords', () =>
        User.deleteMany()
            .then(() => User.create({ name: 'Paquito Chocolatero', email: 'paquito@gmail.com', password: 'Isdicoders1' }))
            .then(() => {
                let errorThrown

                try {
                    logic.registerUser('Paquito Chocolatero', 'paquito@gmail.com', 'Isdicoders1', 'Isdicoders2')
                } catch (error) {
                    errorThrown = error
                }

                expect(errorThrown).to.be.instanceOf(CredentialsError)
                expect(errorThrown.message).to.equal('passwords do not match')
            })
    )

    after(() => mongoose.disconnect())


})

