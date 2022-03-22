let completeBlob = null;
let recorder = null;
let chunks = [];
let stream = null;
let options ={
    video:{
    mediaSource: 'screen'
    },
    audio: false
};
// Buttons
let videoElem = document.getElementById("recording");
let video = document.getElementById('videoResult');
let micbtn = document.getElementById("mic");
let downloadButton = document.getElementById('downloadbtn');
// Configurations
let videoSRC = document.getElementById("videoSRC")
async function startRecord() {
    try {
        // Reset
        chunks = [];
        completeBlob = null;
        // Stream setup
        if (document.getElementById("videoSRC").value == "scr"){
            stream = await navigator.mediaDevices.getDisplayMedia(options);
        }
        else if (document.getElementById("videoSRC").value == "cam"){
            stream = await navigator.mediaDevices.getUserMedia(options);
        }
        // Video Element Setup
        videoElem.srcObject = stream;
        videoElem.volume = 0;
        videoElem.style.display = 'block';
        video.style.display = 'none';
        // Recorder Setup        
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.start();
        recorder.onstop = onstop
        // Button Setup
        document.getElementById("startBtn").style.display = "none";
        document.getElementById("stopBtn").style.display = "block";
        downloadButton.style.display  = 'none';
        micbtn.style.display = 'none';
    } catch (error) {
        window.alert(error);
        console.log(error);
    }
}

async function stopScreen() {
    // Stopping Recorder
    recorder.stop()
    // Button Setup
    document.getElementById("stopBtn").style.display = "none";
    document.getElementById("startBtn").style.display = "block";
    micbtn.style.display = 'block';
    // Stream Stopping
    stream.getTracks().forEach(function (track) {
        track.stop();
    });
    let tracks = videoElem.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    // Video Element Setup
    videoElem.srcObject = null;
    videoElem.style.display = 'none';
    video.style.display = 'block';
    
}

function onstop() {
    // Creating Blob
    completeBlob = new Blob(chunks, {
        type: chunks[0].type
    });
    
    // Setting up video element for preview
    video.style.display = 'block'
    video.src = URL.createObjectURL(completeBlob);
    // Download Button Setup
    downloadButton.style.display  = 'unset';
    downloadButton.href = URL.createObjectURL(completeBlob);
    downloadButton.download = 'recording' + '.mp4';
}

function mic(){
    if(options.audio == false){
        options.audio = true;
        micbtn.innerHTML = "Mute Audio";
    }else{
        options.audio = false;
        micbtn.innerHTML = "Unmute Audio";
    }
}