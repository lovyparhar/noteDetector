// It will fill the amplitude array corresponding to the frequecies 
function correlation(frequencies, audioData, samplingRate, amplitudes) {
    const sampleSize = audioData.length;
    for(let f = 1; f < FSIZE+1; f++) {

        // The constant that multiples with the frequency and n is (2*pi*T)
        const c = 2*Math.PI*(1/samplingRate);

        // This gives the real and imaginary part of complex number obtained
        // We are not caring about signs, as at the end, we will take magnitude
        let finalComplex = [0,0];
        for(let n = 0; n < sampleSize; n++) {
            finalComplex[0] += Math.cos(c*f*n);
            finalComplex[1] += Math.sin(c*f*n);
        }

        amplitudes[f] = Math.sqrt(finalComplex[0]**2 + finalComplex[1]**2);
    }
}

export max_freq(frequencies, audioData, samplingRate) {
    let amplitudes = new Array(FSIZE);
    correlation(frequencies, audioData, samplingRate, amplitudes);

    let max_val = amplitudes[0];
    let max_ind = 0;
    for(let i = 0; i < FSIZE; i++) {
        if(amplitudes[i] > max_val) {
            max_val = amplitudes[i];
        }
        max_ind = i;
    }

    return (i+1);
}