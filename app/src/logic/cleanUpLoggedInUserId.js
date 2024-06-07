//@ts-nocheck
function cleanUpLoggedInUserId() {
    delete sessionStorage.userId
}

export default cleanUpLoggedInUserId