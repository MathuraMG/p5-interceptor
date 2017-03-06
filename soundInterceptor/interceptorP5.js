var baseFreq = 440;
var currLogFreq, currVol, currPan;

// initialise parameters
var movingObjectCount = 0;
var currFrame = 2;
var movingObjects = [];

funcNames = allData['classitems'].map(function(x) {
  if (x['overloads']) {
    tempParam = x['overloads'][0]['params'];
  } else {
    tempParam = x['params'];
  }
  return {
    name: x['name'],
    params: tempParam,
    class: x['class'],
    module: x['module'],
    submodule: x['submodule']
  };
});

// create web audio api context
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

// create Oscillator node
var oscillatorNodes = [];
var gainNodes = [];
var panNodes = [];

funcNames = funcNames.filter(function(x) {
  var className = x['class'];
  return (x['name'] && x['params'] && (className === 'p5'));
});

funcNames.forEach(function(x) {
  var i = 0;
  var originalFunc = p5.prototype[x.name];
  p5.prototype[x.name] = function() {
    orgArg = arguments;

    if (frameCount == 1 && (x.module.localeCompare('Shape') === 0)) {
      i=0;
      x.params.forEach(function(param) {
        if (param.description.indexOf('x-coordinate') > -1) {
          xPosPrev = orgArg[i];
          xPosCurr = orgArg[i];
        }
        if (param.description.indexOf('y-coordinate') > -1) {
          yPosPrev = orgArg[i];
          yPosCurr = orgArg[i];
        }
        i++;
      });
    } else if (frameCount > 1 && (frameCount % 1 == 0) && (x.module.localeCompare('Shape') === 0)) {
      // Pull out only the shapes in draw()
      if (frameCount !== currFrame) {
        currFrame++;
        movingObjectCount = 0;
      }
      movingObjectCount++;

      if(oscillatorNodes[movingObjectCount - 1]){

      } else {
        let index = movingObjectCount - 1;
        oscillatorNodes[index] = audioCtx.createOscillator();
        gainNodes[index] = audioCtx.createGain();
        panNodes[index] = audioCtx.createStereoPanner();
        oscillatorNodes[index].type = 'sine';
        oscillatorNodes[index].frequency.value = baseFreq; // value in hertz
        oscillatorNodes[index].start();
        oscillatorNodes[index].connect(gainNodes[index]);
        gainNodes[index].connect(panNodes[index]);
        panNodes[index].connect(audioCtx.destination);
        gainNodes[index].gain.value = 0.1;
      }

      if (!movingObjects[movingObjectCount - 1]) {
        movingObjects[movingObjectCount - 1] = new Object({
          xPosCurr: 0,
          xPosDiff: 0,
          xPosPrev: 0,
          yPosCurr: 0,
          yPosDiff: 0,
          yPosPrev: 0
        });
      }
      // pull out only the x coord values and compare with prev value
      i = 0;
      x.params.some(function(param) {
        if (param.description.indexOf('y-coordinate') > -1) {
          movingObjects[movingObjectCount - 1].yPosCurr = orgArg[i];
          movingObjects[movingObjectCount - 1].yPosDiff = movingObjects[movingObjectCount - 1].yPosCurr - movingObjects[movingObjectCount - 1].yPosPrev;
          movingObjects[movingObjectCount - 1].yPosPrev = movingObjects[movingObjectCount - 1].yPosCurr;
          return true;
        }
        i++;
      });
      i = 0;
      x.params.some(function(param) {
        if (param.description.indexOf('x-coordinate') > -1) {
          movingObjects[movingObjectCount - 1].xPosCurr = orgArg[i];
          movingObjects[movingObjectCount - 1].xPosDiff = movingObjects[movingObjectCount - 1].xPosCurr - movingObjects[movingObjectCount - 1].xPosPrev;
          movingObjects[movingObjectCount - 1].xPosPrev = movingObjects[movingObjectCount - 1].xPosCurr;
          return true;
        }
        i++;
      });

      if (abs(movingObjects[movingObjectCount - 1].xPosDiff) > 0 || abs(movingObjects[movingObjectCount - 1].yPosDiff) > 0) {
        currNote = (1 - movingObjects[movingObjectCount - 1].yPosCurr / height) * (12); // mapping hieghts to notes from 1-100
        // fn = f0 * (a)n
        currLogFreq = baseFreq * Math.pow(Math.pow(2, (1 / 12)), currNote);
        currVol = 0.4;
        xCoord = frameCount % 16 - 8;
        currVol = 2 * movingObjectCount * Math.exp(-((xCoord + 2 * movingObjectCount) * (xCoord + 2 * movingObjectCount)));
        currPan = (movingObjects[movingObjectCount - 1].xPosCurr / width) * 2 - 1;
        oscillatorNodes[movingObjectCount - 1].frequency.value = currLogFreq;
        gainNodes[movingObjectCount - 1].gain.value = currVol;
        panNodes[movingObjectCount - 1].pan.value = currPan;
      } else {
        gainNodes[movingObjectCount - 1].gain.value = 0;
      }
    }
    return originalFunc.apply(this, arguments);
  };
});
