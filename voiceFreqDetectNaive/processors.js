import {max_freq} from './correlation.js'

const FSIZE = 256;
const NO_OF_CHUNKS = 256;

let frequencyList = []
for(let i = 0; i < FSIZE; i++) {
  frequencyList.push(i+1);
}

// We need this global buffer because the samples come in chunks of 128 and we need more
let longBuffer = [];
let currentCount = 0;


class FrequencyProcessor extends AudioWorkletProcessor {
    // Static getter to define AudioParam objects in this custom processor.
    static get parameterDescriptors() {
        return [{
        name: 'myParam',
        defaultValue: 0.707
        }];
    }

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
            const domFreq = max_freq(frequencyList, longBuffer, 44100);
            this.port.postMessage(`${domFreq}`);
            longBuffer = [];
            currentCount = 0;
        }

        return true;
    }
  }
  
  registerProcessor('frequency-processor', FrequencyProcessor);