// It will fill the amplitude array corresponding to the frequecies 
function correlation(frequencies, audioData, samplingRate, amplitudes) {
    const sampleSize = audioData.length;

    for(let f = 1; f < FSIZE+1; f++) {

        // The constant that multiples with the frequency and n is (2*pi*T)
        const c = (2*Math.PI)/samplingRate;

        // This gives the real and imaginary part of complex number obtained
        // We are not caring about signs, as at the end, we will take magnitude
        let finalComplex = [0,0];
        for(let n = 0; n < sampleSize; n++) {
            finalComplex[0] += audioData[n]*Math.cos(c*f*n);
            finalComplex[1] += audioData[n]*Math.sin(c*f*n);
        }

        amplitudes[f] = Math.sqrt(finalComplex[0]**2 + finalComplex[1]**2);
    }
}



function max_freq(frequencies, audioData, samplingRate) {
  let amplitudes = new Array(FSIZE);
  correlation(frequencies, audioData, samplingRate, amplitudes);

  let max_val = amplitudes[1];
  let max_ind = 1;
  for(let f = 1; f <= FSIZE; f++) {
      if(amplitudes[f] > max_val) {
          max_val = amplitudes[f];
          max_ind = f;
      }
  }

  return (max_ind);
}








const FSIZE = 1024;
let frequencyList = []
for(let i = 0; i < FSIZE; i++) {
  frequencyList.push(i+1);
}

// This is "processor.js" file, evaluated in AudioWorkletGlobalScope upon
// audioWorklet.addModule() call in the main global scope.
let longBuffer = [];
let currentCount = 0;



class MyWorkletProcessor extends AudioWorkletProcessor {
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

        // The processor may have multiple inputs and outputs. Get the first input and
        // output.
        const input = inputs[0];

        // Each input or output may have multiple channels. Get the first channel.
        const inputChannel0 = input[0];

      
        currentCount += 1;
        for (let i = 0; i < inputChannel0.length; ++i) {
            longBuffer.push(inputChannel0[i]);
        }

        if(currentCount === 32) {
            const domFreq = max_freq(frequencyList, longBuffer, 44100);
            this.port.postMessage(`${domFreq}`);
            longBuffer = [];
            currentCount = 0;
        }

        // To keep this processor alive.
        return true;
    }
  }
  
  registerProcessor('my-worklet-processor', MyWorkletProcessor);