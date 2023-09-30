const localVideo = document.getElementById('localVideo');
const remoteVideos = document.getElementById('remoteVideos');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
let localStream;
let peerConnection;

// Set up user media
async function setupUserMedia() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
    } catch (error) {
        console.error('Error accessing the camera and microphone:', error);
    }
}

// Start the call
startButton.addEventListener('click', () => {
    setupUserMedia();
    createPeerConnection();
    startButton.disabled = true;
    stopButton.disabled = false;
});

// Stop the call
stopButton.addEventListener('click', () => {
    localStream.getTracks().forEach((track) => track.stop());
    peerConnection.close();
    startButton.disabled = false;
    stopButton.disabled = true;
    remoteVideos.innerHTML = '';
});

// Create peer connection
function createPeerConnection() {
    peerConnection = new RTCPeerConnection();
    localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

    // Handle remote streams
    peerConnection.ontrack = (event) => {
        const remoteVideo = document.createElement('video');
        remoteVideo.srcObject = event.streams[0];
        remoteVideo.autoplay = true;
        remoteVideos.appendChild(remoteVideo);
    };

    // Offer and answer
    peerConnection.createOffer()
        .then((offer) => peerConnection.setLocalDescription(offer))
        .then(() => {
            // Send the offer to the other peer (not shown in this example)
            // You'll need a signaling server for this part.
        })
        .catch((error) => console.error('Error creating offer:', error));
}

