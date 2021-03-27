// This is our custom audio node which which is based on the processor named 'my-worklet-processor'
class MyWorkletNode extends AudioWorkletNode {

    // Javascript constructor is defined like this
    constructor(context) {
        super(context, 'my-worklet-processor');
    }
}

const context = new AudioContext();
const freqDisp = document.querySelector('.dom-freq');

// This promise is resolved and tells that the class is ready to be used in the main scope
context.audioWorklet.addModule('processors.js')
.then(() => {

    // Here you can instantiate that custom node
    let node = new MyWorkletNode(context);
    let oscillator = new OscillatorNode(context);
    let gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0.02, context.currentTime);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(500, context.currentTime); // value in hertz
    oscillator.connect(node);
    node.connect(gainNode);
    gainNode.connect(context.destination);

    // If there is a message to node from its processor, then what should it do
    node.port.onmessage = (event) => {
        // Handling data from the processor.
        if(event.data) {
            freqDisp.innerHTML = `The dominant frequncy in the oscillator is ${event.data}`;
        }
    };
    
    const playBtn = document.querySelector('.play-btn');
    playBtn.addEventListener('click', function() {
        oscillator.start();
    });

});


