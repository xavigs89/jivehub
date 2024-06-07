import React, { useEffect, useState } from 'react'
import { useContext } from '../context'
import { logger } from '../utils'

import logic from '../logic'

import moment from 'moment'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function SearchMap() {

    const { showFeedback } = useContext()
    const [meetings, setMeetings] = useState([])
    const [map, setMap] = useState(null)

    const loadMeetings = () => {
        logger.debug('MeetingsList -> loadMeetings')

        try {
            logic.retrieveMeetings()
                .then(retrievedMeetings => {
                    const upcomingMeetings = retrievedMeetings.filter(meeting => new Date(meeting.date) > new Date())
                    setMeetings(upcomingMeetings)
                })
                .catch(error => showFeedback(error, 'error'))
        } catch (error) {
            showFeedback(error)
        }
    }

    useEffect(() => {
        loadMeetings()
        const map = L.map('map').setView([41.3851, 2.1734], 13)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map)

        map.locate({ setView: true, maxZoom: 14 })

        map.on('locationfound', (e) => {
            const radius = e.accuracy / 2

            const marker = L.marker(e.latlng).addTo(map)
                .bindPopup(`You are here!`)

            L.circle(e.latlng, { radius }).addTo(map)

        })

        map.on('locationerror', (e) => {
            showFeedback(e.message, 'error')
        })

        setMap(map)

    }, [])
    

    useEffect(() => {
        if (meetings.length === 0 || !map) return

        meetings.forEach(meeting => {
            const latitude = meeting.location.latitude
            const longitude = meeting.location.longitude
            const date = moment(meeting.date).format('Do MMMM YYYY, h:mm a')
            const marker = L.marker([latitude, longitude]).addTo(map)
            marker.bindPopup(`<b>${meeting.title}</b><br>${meeting.address}<br>${date}`)
        })
    }, [meetings, map])

    return (
        <div id="map" className='h-screen z-0'></div>
    )

}

export default SearchMap