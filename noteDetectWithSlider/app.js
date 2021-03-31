let noteNames = ['C', 'C# / Db', 'D', 'D# / Eb', 'E', 'F', 'F# / Gb', 'G', 'G# / Ab', 'A', 'A# / Bb', 'B' ]; 
let freqPosition = 0;

// Filling up the slides
const slideContainer = document.querySelector('.slider-container');
for(let i = 0; i < noteNames.length; i++) {
    const currentSlide = document.createElement('DIV');
    currentSlide.classList.add('slide');
    currentSlide.dataset.id = `${i}`;
    currentSlide.dataset.note = noteNames[i];
    currentSlide.innerHTML = noteNames[i];
    currentSlide.style.left = `${i*100}%`;
    slideContainer.appendChild(currentSlide);
}

// Getting the pointer to those slides
const slides = document.querySelectorAll('.slide');


// transforming according to the currentfrequency
function applyTransform() {
    const noteDeviation = (freqPosition%5);
    const noteBefore = ((freqPosition - noteDeviation)/5)%12;

    slides.forEach(function(slide) {
		slide.style.transform = `translateX(${-noteBefore*100 - 25*noteDeviation}%)`;
	});
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
                if(event.data) {
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











