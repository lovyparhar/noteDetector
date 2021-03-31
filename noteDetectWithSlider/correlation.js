
// It will fill the amplitudes array corresponding to the frequecies 
function correlation(frequencies, audioData, samplingRate, amplitudes) {
    const sampleSize = audioData.length;
    const freqLen = frequencies.length;

    for(let i = 0; i < freqLen; i++) {

        // The constant that multiples with the frequency and n is (2*pi*T), T is the sampling period
        const c = (2*Math.PI)/samplingRate;

        // This gives the real and imaginary part of complex number obtained
        // We are not caring about signs, as at the end, we will take magnitude
        let finalComplex = [0,0];
        for(let n = 0; n < sampleSize; n++) {
            finalComplex[0] += audioData[n]*Math.cos(c*frequencies[i]*n);
            finalComplex[1] += audioData[n]*Math.sin(c*frequencies[i]*n);
        }

        amplitudes[i] = Math.sqrt(finalComplex[0]**2 + finalComplex[1]**2);
    }
}


// It will give the frequency corresponding to the maximum amplitude
export function max_freq(frequencies, audioData, samplingRate) {
    const freqLen = frequencies.length;
    let amplitudes = new Array(freqLen);
    correlation(frequencies, audioData, samplingRate, amplitudes);

    let max_val = amplitudes[1];
    let max_ind = 0;
    for(let i = 0; i < freqLen; i++) {
        if(amplitudes[i] > max_val) {
            max_val = amplitudes[i];
            max_ind = i;
        }
    }

    return (max_ind);
}



