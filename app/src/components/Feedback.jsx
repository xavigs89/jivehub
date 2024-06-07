import RoundButton from './library/RoundButton'
import { logger } from '../utils'

function Feedback({ message, level, onAcceptClick }) {
    logger[level](message)

    return (

        <div
            className={`h-screen w-screen fixed top-0 left-0 flex justify-center items-center bg-black bg-opacity-40 `}
        >
            <div
                className={`p-4 rounded-lg shadow-lg flex flex-col animate-jump-in animate-once animate-duration-[1200ms] ${level === 'error'
                        ? 'bg-red-500'
                        : level === 'warn'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                    }`}
            >
                <h3>{message}</h3>
                <RoundButton onClick={onAcceptClick} className="bg-white ">
                    Accept
                </RoundButton>
            </div>
        </div>
    )
}

export default Feedback