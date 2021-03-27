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
        

        //////////////////////// MAIN CODE HERE //////////////////////////
        const context = new AudioContext();
        const freqDisp = document.querySelector('.dom-freq');

        // This promise is resolved and tells that the class is ready to be used in the main scope
        context.audioWorklet.addModule('processors.js')
        .then(() => {

            // Here we can instantiate that custom node
            let frequencyDetectorNode = new FrequencyDetectorNode(context);

            // The processor will send the frequency that it got
            frequencyDetectorNode.port.onmessage = (event) => {
                if(event.data) {
                    freqDisp.innerHTML = `The dominant frequncy in the voice is ${event.data}`;
                }
            };
            
            const startBtn = document.querySelector('.start-btn');

            const source = context.createMediaStreamSource(stream);
            source.connect(frequencyDetectorNode);
            // source.connect(context.destination);

        });
        //////////////////////////////////////////////////////////////////
    })
    .catch(function(err) {
        console.log(err);
    })

} else {
    console.log('getUserMedia not supported');
}











