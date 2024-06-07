//@ts-nocheck

import { logger } from '../utils'

import logic from '../logic'

import { useContext } from '../context'

function Register({ onUserRegistered, onLoginClick }) {
    const { showFeedback } = useContext()

    const handleSubmit = event => {
        event.preventDefault()

        const form = event.target

        const name = form.name.value
        const email = form.email.value
        const password = form.password.value
        const confirmedPassword = form.confirm.value

        try {
            logic.registerUser(name, email, password, confirmedPassword)
                .then(() => {
                    form.reset()

                    onUserRegistered()
                })
                .catch(error => showFeedback(error, 'error'))
        } catch (error) {
            showFeedback(error)
        }
    }

    const handleLoginClick = event => {
        event.preventDefault()

        onLoginClick()
    }

    logger.debug('Register -> render')

    return (
        <main className="flex justify-center items-center h-screen bg-[#F4C84B] ">

            <div>

                <div className="flex justify-center items-center">
                    <img className="w-[150px] absolute top-[70px]" src="../../public/icons/Logo JiveHub.png" alt="LOGO" />
                </div>


                <form onSubmit={handleSubmit} className="flex flex-col items-center mt-14">

                    <div className="flex flex-col mb-4">
                        <label htmlFor="name" className="text-black font-semibold mb-1">Full Name</label>
                        <input type="text" id="name" className="rounded-lg px-2 py-1" />
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="email" className="text-black font-semibold mb-1 mt-2">E-mail</label>
                        <input type="email" id="email" className="rounded-lg px-2 py-1" />
                    </div>

                    <div className="flex flex-col mb-4">
                    <label htmlFor="password" className="text-black font-semibold mb-1 mt-2">Password</label>
                    <input type="password" id="password" className="rounded-lg px-2 py-1" />
                    </div>

                    <div className="flex flex-col mb-4">
                    <label htmlFor="confirm" className="text-black font-semibold mb-1 mt-2">Confirm Password</label>
                    <input type="password" id="confirm" className="rounded-lg px-2 py-1" />
                    </div>

                    <div className="flex items-center">
                        <input type="checkbox" id="terms" required className="mr-2" />
                        <label htmlFor="ageConfirmation" className="text-black font-semibold">Confirm that I am 18 years old</label>
                    </div>

            <button className="bg-[#249D8C] hover:bg-[#6B99C3] text-white font-bold py-2 px-4 rounded mt-8" type="submit">Register</button>

        </form>

            </div >

        <div className="fixed bottom-[140px] items-center">
            <a href=""
                onClick={handleLoginClick} className="text-[#249D8C] mt-2 font-bold">Login</a>
        </div>

        </main >
    )
}


export default Register