
/* --- enums --- */

enum Classification {
    Circle = 0,
    Still = 1,
    Shaking = 2
  }  

namespace ML_Movement {
  
  /* --- state --- */
  
  let onShouldAddDataPoint: (recording:Recording)=>void = (recording: Recording)=>null;
  
  /* --- interfaces/classes/functions --- */
  
  interface DataPoint {
    x: number;
    y: number;
    z: number;
    s: number;
  }
  

  class Recording {
    private data: DataPoint[];
  
    constructor() {
      this.data = [];
    }
    
    addDataPoint(dataPoint: DataPoint) {
      this.data.push(dataPoint);
    }
    
    getData() {
      return this.data;
    }
  }


  const max = (data: number[]) => {
    let max = data[0];
    for (let i = 1; i < data.length; i++) {
      if (data[i] > max) max = data[i];
    }
    return max;
  };
  
  const min = (data: number[]) => {
    let min = data[0];
    for (let i = 1; i < data.length; i++) {
      if (data[i] < min) min = data[i];
    }
    return min;
  };
  
  const mean = (data: number[]) => {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
    return sum / data.length;
  };
  
  const std = (data: number[]) => {
    let m = mean(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += (data[i] - m) ** 2;
    }
    return Math.sqrt(sum / data.length);
  };
  
  function highPassFilter(
    data: number[],
    cutoffFrequency: number,
    samplingRate: number
  ): number[] {
    const RC = 1.0 / (2.0 * Math.PI * cutoffFrequency);
    const dt = 1.0 / samplingRate;
    const alpha = RC / (RC + dt);
  
    const filteredData: number[] = [];
    let prevFilteredValue = data[0];
  
    for (let i = 1; i < data.length; i++) {
      const filteredValue = alpha * (prevFilteredValue + data[i] - data[i - 1]);
      filteredData.push(filteredValue);
      prevFilteredValue = filteredValue;
    }
  
    return filteredData;
  }

  const countSignificantPeaks = (
    data: number[],
    thresholdPercentage: number
  ): number => {
    const threshold = (thresholdPercentage / 100) * (max(data) - min(data));
    let numPeaks = 0;
  
    for (let i = 1; i < data.length - 1; i++) {
      if (
        data[i] > data[i - 1] &&
        data[i] > data[i + 1] &&
        Math.abs(data[i]) > threshold
      ) {
        numPeaks++;
      }
    }
  
    return numPeaks;
  };
  
  const featureVector = (recording: Recording): number[] => {
    const data = recording.getData();
    let fv = [];
    
    let x_arr: number[] = [];
  let y_arr: number[] = [];
  let z_arr: number[] = [];
  let s_arr: number[] = [];
      
    for (let i = 0; i < data.length; i++) {
      x_arr.push(data[i].x);
      y_arr.push(data[i].y);
      z_arr.push(data[i].z);
      s_arr.push(data[i].s);
    }
    
    // xMax
        // Common feature calculator
              const xMax_max = max(x_arr);
              fv.push(xMax_max);
        
    // xMin
        // Common feature calculator
              const xMin_min = min(x_arr);
              fv.push(xMin_min);
        
    // xStd
        // Common feature calculator
              const xStd_std = std(x_arr);
              fv.push(xStd_std);
        
    // xPeaks
        // Common feature calculator
              const xPeaks_filteredData = highPassFilter(x_arr, 10.0, max(x_arr) * 2);
              fv.push(countSignificantPeaks(xPeaks_filteredData, 10));
        
    // yMax
        // Common feature calculator
              const yMax_max = max(y_arr);
              fv.push(yMax_max);
        
    // yMin
        // Common feature calculator
              const yMin_min = min(y_arr);
              fv.push(yMin_min);
        
    // yStd
        // Common feature calculator
              const yStd_std = std(y_arr);
              fv.push(yStd_std);
        
    // yPeaks
        // Common feature calculator
              const yPeaks_filteredData = highPassFilter(y_arr, 10.0, max(y_arr) * 2);
              fv.push(countSignificantPeaks(yPeaks_filteredData, 10));
        
    // zMax
        // Common feature calculator
              const zMax_max = max(z_arr);
              fv.push(zMax_max);
        
    // zMin
        // Common feature calculator
              const zMin_min = min(z_arr);
              fv.push(zMin_min);
        
    // zStd
        // Common feature calculator
              const zStd_std = std(z_arr);
              fv.push(zStd_std);
        
    // zPeaks
        // Common feature calculator
              const zPeaks_filteredData = highPassFilter(z_arr, 10.0, max(z_arr) * 2);
              fv.push(countSignificantPeaks(zPeaks_filteredData, 10));
        
    // sMean
        // Common feature calculator
              const sMean_mean = mean(s_arr);
              fv.push(sMean_mean);
        
      
      return fv;
  };

  
  /* --- blocks --- */
  

  //% block="on need to add data point to $recording"
  //% advanced=true
  //% draggableParameters="reporter"
  //% group="For using custom data points"
  export function getInstantDataPoint(handler: (recording: Recording) => void) {
    onShouldAddDataPoint = handler;
  }
  
  //% block="add $dataPoint to $recording"
  //% advanced=true
  //% group="For using custom data points"
  export function addDataPoint(dataPoint: DataPoint, recording: Recording) {
    recording.addDataPoint(dataPoint);
  }
  
  //% block="data point from x $x y $y z $z s $s"
  //% advanced=true
  //% group="For using custom data points"
  export function createDataPoint(x: number, y: number, z: number, s: number): DataPoint {
    return {
      x: x,
      y: y,
      z: z,
      s: s
    };
  }



  //% weight=100
  
    //% block="initialise for movement"
    export function setUpForMovement() {
      onShouldAddDataPoint = (recording: Recording) => {
        const dataPoint = {
          x: input.acceleration(Dimension.X),
          y: input.acceleration(Dimension.Y),
          z: input.acceleration(Dimension.Z),
          s: input.acceleration(Dimension.Strength),
        }
        recording.addDataPoint(dataPoint);
      }
    }


  
  //% block="generate feature vector from $recording"
  //% blockId=generateFeatureVector
  //% recording.shadow="record"
  export function generateFeatureVector(recording: Recording): number[] {
    return featureVector(recording);
  }

  //% block="record for $dur seconds"
  //% dur.defl=2
  //% blockId=record
  export function record(dur: number) {
    const rec = new Recording();
    const startTime = input.runningTime();
    while ((input.runningTime() - startTime) < (dur*1000)) {
        onShouldAddDataPoint(rec);
        pause(5);
    }
    return rec;
  }

  //% shim=predict::predict
  export function _predict(featureVector: number[]): Classification {
    return 0;
  }
  
  //% block="predict based on feature vector $featureVector"
  //% featureVector.shadow="generateFeatureVector"
  export function predict(featureVector: number[]): Classification {
    serial.writeLine(_predict(featureVector).toString());
    return Classification.Circle;
  }

}
