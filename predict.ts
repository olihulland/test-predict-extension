
/* --- enums --- */

enum Classification {
    Shaking = 0,
    Circle = 1,
    Still = 2
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
  
  const featureVector = (recording: Recording): number[] => {
    const data = recording.getData();
    let fv = [];
    
    let x_arr: number[] = [];
    let y_arr: number[] = [];
    let z_arr: number[] = [];
    let s_arr: number[] = [];

    for (let i = 0; i < data.length; i++) {
        x_arr.push(data[i]["x"]);
        y_arr.push(data[i]["y"]);
        z_arr.push(data[i]["z"]);
        s_arr.push(data[i]["s"]);
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
        // Custom feature calculator
      
        function xPeaks_fn (dataIn: DataPoint[]): number {         
          
const mult = 3;
let xPeaks = 0;
const xValues = dataIn
  .map((dataPoint) => dataPoint["x"])
  .filter((val) => val !== undefined);
const xMean = xValues.reduce((a, b) => a + b, 0) / xValues.length;
const xStd = Math.sqrt(
  xValues.map((x) => Math.pow(x - xMean, 2)).reduce((a, b) => a + b, 0) /
    xValues.length
);
for (let i = 0; i < xValues.length; i++) {
  const x = xValues[i];
  if (x > xMean + mult * xStd) {
    xPeaks++;
  }
}
return xPeaks;
    
        };
        fv.push(xPeaks_fn(data));
        
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
        // Custom feature calculator
      
        function yPeaks_fn (dataIn: DataPoint[]): number {         
          
const mult = 3;
let yPeaks = 0;
const yValues = dataIn
  .map((dataPoint) => dataPoint["y"])
  .filter((val) => val !== undefined);
const yMean = yValues.reduce((a, b) => a + b, 0) / yValues.length;
const yStd = Math.sqrt(
  yValues.map((y) => Math.pow(y - yMean, 2)).reduce((a, b) => a + b, 0) /
    yValues.length
);
for (let i = 0; i < yValues.length; i++) {
  const y = yValues[i];
  if (y > yMean + mult * yStd) {
    yPeaks++;
  }
}
return yPeaks;

        };
        fv.push(yPeaks_fn(data));
        
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
        // Custom feature calculator
      
        const z_mult = 3;
        let z_zPeaks = 0;
        const z_zValues = z_arr;
        const z_zMean = z_zValues.reduce((a, b) => a + b, 0) / z_zValues.length;
        const z_zStd = Math.sqrt(
        z_zValues.map((z) => Math.pow(z - z_zMean, 2)).reduce((a, b) => a + b, 0) /
            z_zValues.length
        );
        for (let i = 0; i < z_zValues.length; i++) {
            const z = z_zValues[i];
            if (z > z_zMean + z_mult * z_zStd) {
                z_zPeaks++;
            }
        }
        fv.push(z_zPeaks);
        
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
  
  //% block="predict based on feature vector $featureVector"
  //% featureVector.shadow="generateFeatureVector"
  export function predict(featureVector: number[]): Classification {
    // TODO IMPLEMENT THE PREDICTION HERE!
    return Classification.Circle;
  }

}
