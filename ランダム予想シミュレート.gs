function simulateForecast() {
  var simulateNum = 10000;
  var gameNum = 17;
  var winRate = 0.6;
  var winRates = [];
  for(var i = 0; i < gameNum; i++){
    winRates.push(winRate);
  }

  var forecastNum = 1500;
  var correctCount = 0;
  var semiCorrectCount = 0;


  for(var h = 0; h < simulateNum; h++){
    var result = '';
    var forecasts = [];
    var correct = 0;
    var semiCorrect = 0;

    for(var j = 0; j < gameNum; j++){
      var rnd = Math.random();
      if(rnd <= winRate){
        result += '0';
      }else{
        result += '1';
      }
    }

    for(var i = 0; i < forecastNum; i++){
      var binforecast = '';

      while(true){
        binforecast = '';
        var contFlag = false;
        var decforecast;

        for(var j = 0; j < gameNum; j++){
          var rnd = Math.random();
          if(rnd <= winRate){
            binforecast += '0';
          }else{
            binforecast += '1';
          }
        }

        decforecast = parseInt(binforecast, 2);
        for(var j = 0; j <= i; j++){
          if(forecasts[j] < decforecast){
            continue;
          }else if(forecasts[j] == decforecast){
            contFlag = true;
            break;
          }else if(forecasts[j] > decforecast || j ==　i){
            forecasts.splice(j, 0, Number(decforecast));
            break;
          }
        }

        if(contFlag){
          continue;
        }else{
          break;
        }
      }

      // console.log(result);
      // console.log(binforecast);
      var gap = 0;
      for(var j = 0; j < gameNum; j++){
        if(!(result.substr(j, 1) == binforecast.substr(j, 1))){
          gap++;
          if(gap >= 2){
            break;
          }
        }
      }
      if(gap == 0){
        correct++;
      }else if(gap == 1){
        semiCorrect++;
      }
      // console.log(result);
      // console.log(binforecast);
      // console.log(gap);
    }
    correctCount += correct;
    semiCorrectCount += semiCorrect;
  }
  console.log(correctCount);
  console.log(semiCorrectCount);
}