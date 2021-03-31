import {max_freq} from './correlation.js'

// ----------------------------- INITIAL SETUP ------------------------------------

// The external data needed for the application
let frequencies = [65.406,69.296, 73.416,77.782,82.407,	87.307,	92.499,	97.999,	103.826, 110, 116.541, 123.471,	130.813, 138.591, 146.832, 155.563, 164.814, 174.614, 184.997, 195.998, 207.652, 220, 233.082, 246.942,	261.626, 277.183, 293.665, 311.127,329.628, 349.228, 369.994, 391.995, 415.305, 440,466.164, 493.883, 523.251, 554.365, 587.33, 622.254, 659.255, 698.456, 739.989, 783.991, 830.609, 880, 932.328, 987.767, 1046.502, 1108.731, 1174.659, 1244.508, 1318.51, 1396.913, 1479.978, 1567.982, 1661.219, 1760, 1864.655, 1975.533 ];
// let noteNames = ['C', 'C# / Db', 'D', 'D# / Eb', 'E', 'F', 'F# / Gb', 'G', 'G# / Ab', 'A', 'A# / Bb', 'B' ]; 
// let octaves = [2,3,4,5,6];

// Adding some intermediate frequencies to get if a note is sharp or flat
let usefulFreq = [];
for(let i = 1; i < frequencies.length; i++) {
    const freqInterval = (frequencies[i] - frequencies[i-1])/5;
    usefulFreq.push(frequencies[i-1]);
    usefulFreq.push(frequencies[i-1]+freqInterval);
    usefulFreq.push(frequencies[i-1]+2*freqInterval);
    usefulFreq.push(frequencies[i-1]+3*freqInterval);
    usefulFreq.push(frequencies[i-1]+4*freqInterval);
}
usefulFreq.push(frequencies[frequencies.length-1]);

// If index is a multiple of 5, then you have hit the note

// ---------------------------------------------------------------------------------




// ----------- BUFFER FUNCTIONALITY --------------
const NO_OF_CHUNKS = 200;
let longBuffer = [];
let currentCount = 0;

// We need this global buffer because the samples come in chunks of 128 and we need more
// -----------------------------------------------




class FrequencyProcessor extends AudioWorkletProcessor {

    constructor() {
        super();

        this.port.onmessage = (event) => {
            // Handling data from the node.
            console.log(event.data);
        };
    }
  

    process(inputs, outputs, parameters) {

        // The processor may have multiple inputs and outputs. Get the first input
        const input = inputs[0];

        // Each input or output may have multiple channels. Get the first channel.
        const inputChannel0 = input[0];

        currentCount += 1;
        for (let i = 0; i < inputChannel0.length; ++i) {
            longBuffer.push(inputChannel0[i]);
        }

        if(currentCount === NO_OF_CHUNKS) {
            const domFreqIndex = max_freq(usefulFreq, longBuffer, 44100);
            this.port.postMessage(domFreqIndex);
            longBuffer = [];
            currentCount = 0;
        }

        return true;
    }
}

registerProcessor('frequency-processor', FrequencyProcessor);