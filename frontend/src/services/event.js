export const verifyUser = (access_token) => {
    // todo
    return true
}

export const startEventListener = (client_id, streamerName) => {
    return fetch(`https://streamlabs-backend.herokuapp.com/start/twitch/${streamerName}?client_id=${client_id}`)
}