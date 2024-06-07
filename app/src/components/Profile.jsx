import logic from '../logic'
import { logger } from '../utils'

import { useContext } from '../context'
import { useState, useEffect } from 'react'

import MeetingsList from './MeetingsList'
import CreateReview from './CreateReview'


function Profile({ user, onEditMeetingClick }) {

    const { showFeedback, stamp, setStamp } = useContext()

    const [meeting, setMeeting] = useState(false)

    const [view, setView] = useState('close')

    const [createdMeetingsList, setCreatedMeetingsList] = useState(false)
    const [joinedMeetingsList, setJoinedMeetingsList] = useState(false)

    const clearView = () => setView('close')

    const toogleViewCreated = () => {
        setView(view === 'open-createdMeetings' ? 'close' : 'open-createdMeetings')
    }

    const toogleViewJoined = () => {
        setView(view === 'open-joinedMeetings' ? 'close' : 'open-joinedMeetings')
    }

    const toogleViewAboutMe = () => {
        setView(view === 'open-aboutMe' ? 'close' : 'open-aboutMe')
    }

    const loadCreatedMeetings = () => {

        logger.debug('CreatedMeetingList -> loadMeetings')

        try {
            logic.retrieveCreatedMeetings()
                .then(setCreatedMeetingsList)
                .catch(error => showFeedback(error, 'error'))
        } catch (error) {
            showFeedback(error)
        }
    }

    useEffect(() => {
        loadCreatedMeetings()
    }, [stamp])


    const loadJoinedMeetings = () => {
        logger.debug('JoinedMeetingList -> loadMeetings')

        try {
            logic.retrieveJoinedMeetings()
                .then(setJoinedMeetingsList)
                .catch(error => showFeedback(error, 'error'))
        } catch (error) {
            showFeedback(error)
        }
    }

    useEffect(() => {
        loadJoinedMeetings()
    }, [stamp])


    const handleJoinedMeetingsClick = () => {
        loadJoinedMeetings()
    }

    const handleUnJoinMeetingClick = () => {
        loadCreatedMeetings()
    }


    const handleMeetingEdited = () => setView('open-createdMeetings')

    const handleEditMeetingCancelClick = () => setView('open-createdMeetings')

    const handleEditClick = meeting => {
        onEditMeetingClick(meeting)
        setView('edit-meeting')
    }

    const handleReviewClick = (meeting) => {
        setView('create-review')
        setMeeting(meeting)
    }

    const handleCreateReviewCancelClick = () => {
        clearView()
        setMeeting(null)
    }

    const handleReviewCreated = () => {
        clearView()
        setMeeting(null)
        setStamp(Date.now())
    }

    return <main className="flex flex-col items-center min-h-screen px-[1vw] bg-[#249D8C]">

        <div className="rounded-xl space-between flex items-center grid-cols-4 gap-4 px-4 pt-6">

            <button onClick={toogleViewCreated} id="createdmeetings-button" className="bg-[#f4f3f7] text-black font-bold py-2 px-4 rounded">Created Meetings</button>

            <button onClick={toogleViewJoined} id="joinedmeetings-button" className="bg-[#f4f3f7] text-black font-bold py-2 px-4 rounded">Joined Meetings</button>

            <button onClick={toogleViewAboutMe} id="aboutme-button" className="bg-[#f4f3f7] text-black font-bold py-2 px-4 rounded">About Me</button>
        </div>

        <section >

            {view === 'open-createdMeetings' && (
                <>
                    {createdMeetingsList.length === 0 ? (
                        <div className="mt-[250px] p-4 bg-white rounded-xl text-center text-wrap font-bold">
                            <p>You don't have any created meetings.</p>
                        </div>
                    ) : (
                        <MeetingsList
                            meetings={createdMeetingsList}
                            onEditMeetingClick={handleEditClick}
                            onJoinMeetingClick={handleJoinedMeetingsClick}
                            onUnjoinMeetingClick={handleUnJoinMeetingClick}
                            onCancelClick={handleEditMeetingCancelClick}
                            onMeetingEdited={handleMeetingEdited}
                            stamp={stamp}
                        />
                    )}
                </>
            )}

            {view === 'open-joinedMeetings' && (
                <>
                    {joinedMeetingsList.length === 0 ? (
                        <div className="mt-[250px] p-4 bg-white rounded-xl text-center text-wrap font-bold">
                            <p>You haven't joined any meetings yet.</p>
                        </div>
                    ) : (
                        <MeetingsList
                            meetings={joinedMeetingsList}
                            onEditMeetingClick={handleEditClick}
                            onUnjoinMeetingClick={handleUnJoinMeetingClick}
                            onJoinMeetingClick={handleJoinedMeetingsClick}
                            onReviewClick={handleReviewClick}
                            onCancelClick={handleEditMeetingCancelClick}
                            onMeetingEdited={handleMeetingEdited}
                            stamp={stamp}
                        />
                    )}
                </>
            )}

            {view === 'open-aboutMe' && (
                <div className="mt-[250px] p-4 bg-white rounded-xl text-center text-wrap">
                    <p className="mt-2"><strong>Full name:</strong> {user.name}</p>
                    <p className="mt-2"><strong>Contact:</strong> {user.email}</p>
                </div>
            )}

            {view === 'create-review' && <CreateReview
                user={user}
                meeting={meeting}
                onCancelClick={handleCreateReviewCancelClick}
                onReviewCreated={handleReviewCreated}
                onReviewClick={handleReviewClick} />}

        </section>
    </main >
}

export default Profile


