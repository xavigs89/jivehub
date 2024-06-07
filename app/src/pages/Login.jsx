//@ts-nocheck

import { logger } from '../utils'

import logic from '../logic'

import { useContext } from '../context'

function Login({ onUserLoggedIn, onRegisterClick }) {
    const { showFeedback } = useContext()

    const handleSubmit = event => {
        event.preventDefault()

        const form = event.target

        const email = form.email.value
        const password = form.password.value

        logger.debug('Login -> handleSubmit', email, password)

        try {
            logic.loginUser(email, password)
                .then(() => {
                    form.reset()

                    onUserLoggedIn()
                })
                .catch(error => showFeedback(error, 'error'))
        } catch (error) {
            showFeedback(error)
        }
    }

    const handleRegisterClick = event => {
        event.preventDefault()

        onRegisterClick()
    }

    logger.debug('Login -> render')

    return <main className="flex justify-center items-center h-screen bg-[#F4C84B]">

        <div>
            <div className="flex justify-center items-center">
                <img className="w-[150px] absolute top-[120px]" src="../../public/icons/Logo JiveHub.png" alt="LOGO" />
            </div>

            <form onSubmit={handleSubmit} 
            className="flex flex-col items-center mt-10">
                <div className="flex flex-col mb-4">
                    <label htmlFor="email" className="text-black font-semibold mb-1">Email</label>
                    <input id="email" className="rounded-lg px-2 py-2" />
                </div>

                <div className="flex flex-col mb-4">
                    <label htmlFor="password" className="text-black font-semibold mb-1">Password</label>
                    <input type="password" id="password" className="rounded-lg px-2 py-2" />
                </div>

                <button className="bg-[#249D8C] hover:bg-[#6B99C3] text-white w-full font-bold py-2 px-4 rounded mt-4" type="submit">Login</button>
            </form>

        </div>
        <div className="fixed bottom-[140px] items-center">
            <p className="font-bold text-black">Don't have an account?<a href="" onClick={handleRegisterClick} className="text-[#249D8C] mt-2"> Register</a></p>
        </div>

    </main>
}

export default Login