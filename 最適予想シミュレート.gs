function optimalForecastSimulate(){
  var forecastRates = [[0.4, 0.8, 0.4, 0.6, 0.7, 0.4, 0.1, 0.7]
                      ,[0.2, 0.5, 0.3, 0.7, 0.6, 0.8, 0.3, 0.4]
                      ,[0.4, 0.3, 0.2, 0.6, 0.4, 0.7, 0.3, 0.7]
                      ,[0.4, 0.6, 0.3, 0.4, 0.3, 0.8, 0.3, 0.7]
                      ,[0.3, 0.5, 0.3, 0.7, 0.4, 0.7, 0.2, 0.7]
                      // ,[0.1, 0.9, 0.1, 0.9, 0.9, 0.9, 0.1, 0.9]
                      ];
  var forecastNum = 40
  // var forecastRates = [[0.6, 0.6, 0.6, 0.6]
  //                     ,[0.6, 0.6, 0.6, 0.8]
  //                     ,[0.6, 0.6, 0.9, 0.9]
  //                     ];
  // var forecastNum = 8
  var gameNum = forecastRates[0].length;
  var games = [];
  for(var i = 0; i < gameNum; i++){
    games.push([i+"_0", i+"_1"]);
  }

  var memberNum = forecastRates.length;
  var winRates = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
  // var winRates = new Array(gameNum).fill(0);

  // //勝率の平均値を算出
  // for(var i = 0; i < gameNum; i++){
  //   for(var j = 0; j < memberNum; j++){
  //     // console.log(forecastRates[j][i])
  //     winRates[i] += forecastRates[j][i]
  //   }
  //   winRates[i] /= memberNum;
  // }
  console.log(winRates)

  //最適予想マンを参加させる場合
  // var geniusForecastRate = new Array(gameNum).fill(0);
  // for(var i = 0; i < gameNum; i++){
  //   geniusForecastRate[i] = Math.round(winRates[i] * 10) / 10
  // }
  // forecastRates.push(geniusForecastRate);
  // memberNum ++;
  // console.log(geniusForecastRate)

  // 各メンバーの予想出力
  var forecasts = Array.from({ length: memberNum }, () => Array.from({ length: forecastNum }, () => new Array(gameNum))); //予想データの箱
  for(var h = 0; h < memberNum; h++){
    var rateIndexes = [[], [], [], []]; //0.9⇒0.6の順
    var tenIndex = [];
    var fiveIndex = [];
    var loseFlags = [];
    var binForecasts = [];
    var gamesCopy = JSON.parse(JSON.stringify(games));

    //0.5未満の置換と、チーム入れ替え
    for(var i = 0; i < gameNum; i++){
      if(forecastRates[h][i] < 0.5){
        forecastRates[h][i] = 1 - forecastRates[h][i];
        
        var tempo = gamesCopy[i][0];
        gamesCopy[i][0] = gamesCopy[i][1];
        gamesCopy[i][1] = tempo;
      }
      
      //予想配分格納
      if(forecastRates[h][i] == 1){
        tenIndex.push(i);
      }else if(forecastRates[h][i] == 0.5){
        fiveIndex.push(i);
      }else{
        rateIndexes[9 - (forecastRates[h][i] * 10)].push(i);
      }
    }
    
    //全パターン順位付け
    var ratePatterns = []; //0.9→0.6で負けflagが何個ずつあるか
    var rateCounts = [rateIndexes[0].length, rateIndexes[1].length, rateIndexes[2].length, rateIndexes[3].length];
    var roopCount = 0;
    for(var i = rateCounts[0]; i >= 0; i--){
      for(var j = rateCounts[1]; j >= 0; j--){
        for(var k = rateCounts[2]; k >= 0; k--){
          for(var l = rateCounts[3]; l >= 0; l--){
            var rate = Math.pow(1/9, i) * Math.pow(2/8, j) * Math.pow(3/7, k) * Math.pow(4/6, l);
            
            for(var m = 0; m <= roopCount; m++){
              if(m == roopCount){
                ratePatterns.push([rate, [i, j, k, l]]);
              }else if(rate < ratePatterns[m][0]){
                continue
              }else{
                ratePatterns.splice(m, 0, [rate, [i, j, k, l]]);
                break;
              }
            }
            
            roopCount++;
          }
        }
      }
    }
    
    //パターンの上から順に、予想数の個数分埋めていく
    var forecastCount = 0;
    PARENT:
    for(var i = 0; i < ratePatterns.length; i++){
      //  for(var i = 1; i < 2; i++){
      var ratePattern = ratePatterns[i][1];
      //    var ratePattern = [1, 1, 1, 2];
      
      //それぞれの組み合わせ
      var rateChoises = [generateChoise(rateIndexes[0], ratePattern[0]), generateChoise(rateIndexes[1], ratePattern[1]), generateChoise(rateIndexes[2], ratePattern[2]), generateChoise(rateIndexes[3], ratePattern[3])];
      var fiveChoises = generateAllChoise(fiveIndex)
      
      for(var j = 0; j < rateChoises[0].length; j++){
        for(var k = 0; k < rateChoises[1].length; k++){
          for(var l = 0; l < rateChoises[2].length; l++){
            for(var m = 0; m < rateChoises[3].length; m++){
              for(var n = 0; n < fiveChoises.length; n++){
                var binForecast = ""
                for(var o = 0; o < gameNum; o++){
                  binForecast += "0";
                }
                
                var loseFlags = rateChoises[0][j].concat(rateChoises[1][k]).concat(rateChoises[2][l]).concat(rateChoises[3][m]).concat(fiveChoises[n]);
                for(var o = 0; o < loseFlags.length; o++){
                  binForecast = strReplace(binForecast, loseFlags[o], "1");
                }
                binForecasts.push(binForecast);
                
                forecastCount++;
                if(forecastCount >= forecastNum){
                  break PARENT;
                }
              }
            }
          }
        }
      }
    }
    
    //項予想入力(データに)
    for(var i = 0; i < forecastNum; i++){    
      for(var j = 0; j < gameNum; j++){
        forecasts[h][i][j] = gamesCopy[j][binForecasts[i].substring(j, j + 1)];
      }
    }
  //  console.log(forecasts[h])
  }

  //シミュレート
  var simulateNum = 1000000;
  var hitNums = new Array(memberNum).fill(0); //各人の的中回数
  var profLoss = new Array(memberNum).fill(0); //各人の総収支
  for(var i = 0; i < simulateNum; i++){
    //結果出力
    var result = new Array(gameNum).fill("");
    for(var j = 0; j < gameNum; j++){
      var winRate = winRates[j]
      var rand = Math.random();
      if(winRate >= rand){
        result[j] = games[j][0]
      }else{
        result[j] = games[j][1]
      }
    }
    // console.log(result)

    //各人の的中判定
    var hitMemberNum = 0; //この試行で当たった人の数
    var hitResults = new Array(memberNum).fill(0);
    for(var j = 0; j < memberNum; j++){
      for(var k = 0; k < forecastNum; k++){
        var hitFlag = true;
        for(var l = 0; l < gameNum; l++){
          if(forecasts[j][k][l] !== result[l]){
            hitFlag = false;
            break;
          }
        }
        if(hitFlag){
          hitResults[j] = 1;
          hitNums[j] ++;
          hitMemberNum ++;
          break
        }
      }
    }
    // console.log(hitResults)

    //収支計算
    for(var j = 0; j < memberNum; j++){
      if(hitMemberNum !== 0){
        profLoss[j] += (-1 + (hitResults[j] * memberNum / hitMemberNum));
      }
    }

  }

  console.log(hitNums);
  console.log(profLoss);
}


//配列から要素を選ぶ全パターン
function generateAllChoise(arr){
  var result = [];
  
  for(var i = 0; i < Math.pow(2, arr.length); i++){
    var pattern = [];
    
    for(var j = 0; j < arr.length; j++){
      if((Math.floor(i / Math.pow(2, j)) % 2) == 1){
        pattern.push(arr[j]);
      }
    }
    
    result.push(pattern);
  }
  
  return result;
}

//配列からnこの要素を選ぶ全パターン
function generateChoise(arr, n) {
  var m = arr.length;
  if(m < n){
    return;
  }
  var result = [];
  var resultNum = choiseNum(m, n);
  var index = [];
  var choise = [];
  
  //初期組み合わせ
  for(var i = 1; i <= n; i++){
    index.push(i);
    choise.push(arr[i - 1]);
  }
  result.push(choise.concat());
  
  for(var i = 0; i < resultNum - 1; i++){
    //組み合わせずらし
    for(var j = n - 1; j >= 0; j--){
      //閾値設定
      var threshold;
      if(j == n - 1){
        threshold = m + 1;
      }else{
        threshold = index[j + 1];
      }
      
      if(index[j] + 1 < threshold){
        //ずらせる一番上ずらし
        index[j] = index[j] + 1;
        choise[j] = arr[index[j] - 1];
        
        //ずらしたものより上を隣に
        for(var k = j + 1; k < n; k++){
          index[k] = index[j] + (k - j);
          choise[k] = arr[index[k] - 1];
        }
        
        result.push(choise.concat());
        break;
      }else{
        continue;
      }
    }
  }
  
  return result;
}

//mからnを選ぶパターン数。要はコンビネーション
function choiseNum(m, n){
  if(m < n){
    return;
  }
  var result = 1;
  
  for(var i = 0; i < n; i++){
    result *= (m - i)/(1 + i)
  }
  
  return result;
}

//index指定文字列置換
function strReplace(str, index, val){
  var result = str.slice(0, index) + str.slice(index + 1);
  // console.log(result)
  result = result.slice(0, index) + val + result.slice(index);
  
  return result;
}