// This is our custom audio node which which is based on the processor named 'frequency-processor'
class FrequencyDetectorNode extends AudioWorkletNode {

    constructor(context) {
        super(context, 'frequency-processor');
    }
}


const context = new AudioContext();
const freqDisp = document.querySelector('.dom-freq');



// This promise is resolved and tells that the class is ready to be used in the main scope
context.audioWorklet.addModule('processors.js')
.then(() => {

    // Here we can instantiate that custom node
    let frequencyDetectorNode = new FrequencyDetectorNode(context);
    let oscillator = new OscillatorNode(context);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(500, context.currentTime); // value in hertz
    oscillator.connect(frequencyDetectorNode);

    // The processor will send the frequency that it got
    frequencyDetectorNode.port.onmessage = (event) => {
        if(event.data) {
            freqDisp.innerHTML = `The dominant frequncy in the oscillator is ${event.data}`;
        }
    };
    
    const startBtn = document.querySelector('.start-btn');
    startBtn.addEventListener('click', function() {
        oscillator.start();
    });

});


