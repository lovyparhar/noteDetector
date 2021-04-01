let freqPosition = 0;

const dial = document.querySelector('.dial');
function applyTransform() {
    const noteDeviation = (freqPosition%5);
    const noteBefore = ((freqPosition - noteDeviation)/5)%12;
    const angle = noteDeviation*6 + noteBefore*30;

	dial.style.transform = `rotate(${-angle}deg)`;
}


// This is our custom audio node which which is based on the processor named 'frequency-processor'
class FrequencyDetectorNode extends AudioWorkletNode {
    constructor(context) {
        super(context, 'frequency-processor');
    }
}


if(navigator.mediaDevices) {
    console.log('getUserMedia supported');

    // This will return a promise, we need to handle that
    navigator.mediaDevices.getUserMedia({audio:true, video:false})
    .then(function(stream) { 
        
        const context = new AudioContext();
        const freqDisp = document.querySelector('.dom-freq');

        // This promise is resolved and tells that the class is ready to be used in the main scope
        context.audioWorklet.addModule('processors.js')
        .then(() => {

            // Here we can instantiate that custom node
            let frequencyDetectorNode = new FrequencyDetectorNode(context);

            // The processor will send the frequency that it got
            frequencyDetectorNode.port.onmessage = (event) => {
                console.log(event.data);
                if(event.data && event.data != -1) {
                    freqPosition = event.data;
                    applyTransform();
                }
            };

            const source = context.createMediaStreamSource(stream);
            source.connect(frequencyDetectorNode);

        });
    })
    .catch(function(err) {
        console.log(err);
    })

} else {
    console.log('getUserMedia not supported');
}











