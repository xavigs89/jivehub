import { Link } from 'react-router-dom';

function Footer({ user, handleCreateMeetingClick }) {

    return (
        <footer className="fixed bottom-0 w-full h-[60px] flex justify-between space-x-4 items-center bg-[#F4C84B] p-1">

            <Link to="/maps">
            <button className="w-10 h-10 rounded-full ml-2"><img src="../../public/icons/TablerSearch.png" alt="search" /></button>
            </Link>
            

            <button onClick={handleCreateMeetingClick} className="w-10 h-10 rounded-full mr-4"><img src="../../public/icons/CreateMeeting.png" alt="create-meeting" /></button>

            <Link to="/profile">
                <button>
                    <img className="w-11 h-11 rounded-full mr-2" src="../../public/icons/Profile.png" alt="profile pic" />
                </button>
            </Link>
        </footer>
    )
}

export default Footer