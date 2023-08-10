function optimalForecast(string){
  var formSheet = SpreadsheetApp.getActive().getSheetByName(string);
  var name = string.replace("回答", formSheet.getRange(formSheet.getLastRow(), 2).getValue());
  var sheet = SpreadsheetApp.getActive().getSheetByName(name);
  var topMargin = 3;
  var leftMargin = 2;
  var forecastNumCol = topMargin - 2;
  var forecastNumRow = leftMargin - 1;
  var winRatesCol = topMargin - 2;
  var games = formSheet.getRange(1, 3, 1, formSheet.getLastColumn() - 2).getValues()[0];
  var gameNum = games.length;
  for(var i = 0; i < gameNum; i++){
    games[i] = games[i].match(/\(.*\)/)[0].replace(/\(|\)/g, "").split(" - ");
  }
  
  var patternNum = Math.pow(2, gameNum);
  var forecastNum = Math.floor(getDirect(forecastNumCol, forecastNumRow))
  var forecasts = [];
  var sheet_data = sheet.getRange(topMargin + 1, leftMargin + 1, forecastNum, gameNum).getValues();
  
  var rateIndexes = [[], [], [], []]; //0.9⇒0.6の順
  var tenIndex = [];
  var fiveIndex = [];
  var loseFlags = [];
  var binForecasts = [];
  
  
  //予想数がレンジ内かチェック(0or1の数は未考慮)
  if(!(forecastNum >= 1 && forecastNum <= patternNum)){
    Browser.msgBox('予想数に正しい値を入力してください(半角数字1~' + patternNum + ')',Browser.Buttons.OK);
    return;
  }
  
  //シートクリア(直接)
  var lastRow = sheet.getLastRow()
  if(sheet.getLastRow() > topMargin){
    sheet.getRange(topMargin + 1, leftMargin + 1, lastRow - topMargin, gameNum).setValue('');
  }
  
  //フォームの入力を転記(直接)
  var forecastRates = formSheet.getRange(formSheet.getLastRow(), 3, 1, gameNum).getValues()[0];
  sheet.getRange(topMargin - 2, leftMargin + 1, 1, gameNum).setValues([forecastRates]);
  
  
  //対戦高入力(直接)
  games.forEach(function(game, index){
    setDirect(topMargin - 1, (leftMargin + 1) + index, game[0] + '\nvs\n' + game[1]);
  });
  
  
  //0.5未満の置換と、チーム入れ替え
  for(var i = 0; i < gameNum; i++){
    if(forecastRates[i] < 0.5){
      forecastRates[i] = 1 - forecastRates[i];
      
      var tempo = games[i][0];
      games[i][0] = games[i][1];
      games[i][1] = tempo;
    }
    
    //予想配分格納
    if(forecastRates[i] == 1){
      tenIndex.push(i);
    }else if(forecastRates[i] == 0.5){
      fiveIndex.push(i);
    }else{
      rateIndexes[9 - (forecastRates[i] * 10)].push(i);
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
      setData(1 + i, 1 + j, games[j][binForecasts[i].substr(j, 1)]);
    }
  }
  
  sheet.getRange(topMargin + 1, leftMargin + 1, forecastNum, gameNum).setValues(sheet_data);
  
  
  
  function getData(y,x){
    return sheet_data[y-1][x-1];
  }
  
  function getDirect(y,x){
    var range = sheet.getRange(y, x);
    return range.getValue();
  }
  
  function setData(y,x,data){
    sheet_data[y - 1][x - 1] = data;
  }
  
  function setDirect(y,x,data){
    var range = sheet.getRange(y, x);
    range.setValue(data);
  }
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
  console.log(result)
  result = result.slice(0, index) + val + result.slice(index);
  
  return result;
}