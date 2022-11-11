// function optimalForecast2(string){
function optimalForecast2(){
  // var formSheet = SpreadsheetApp.getActive().getSheetByName(string);
  // var name = string.replace("回答", formSheet.getRange(formSheet.getLastRow(), 2).getValue());
  // var sheet = SpreadsheetApp.getActive().getSheetByName(name);
  // var topMargin = 3;
  // var leftMargin = 2;
  // var forecastNumCol = topMargin - 2;
  // var forecastNumRow = leftMargin - 1;
  // var winRatesCol = topMargin - 2;
  // var games = formSheet.getRange(1, 3, 1, formSheet.getLastColumn() - 2).getValues()[0];
  // var gameNum = games.length;
  // for(var i = 0; i < gameNum; i++){
  //   games[i] = games[i].match(/\(.*\)/)[0].replace(/\(|\)/g, "").split(" - ");
  // }
  var gameNum = 4
  
  var patternNum = Math.pow(4, gameNum);
  // var forecastNum = Math.floor(getDirect(forecastNumCol, forecastNumRow))
  var forecastNum = 16;
  var forecasts = [];
  // var sheet_data = sheet.getRange(topMargin + 1, leftMargin + 1, forecastNum, gameNum).getValues();
  
 
  var quaForecasts = [];
  
  
  //予想数がレンジ内かチェック(0or1の数は未考慮)
  // if(!(forecastNum >= 1 && forecastNum <= patternNum)){
  //   Browser.msgBox('予想数に正しい値を入力してください(半角数字1~' + patternNum + ')',Browser.Buttons.OK);
  //   return;
  // }
  
  //シートクリア(直接)
  // var lastRow = sheet.getLastRow()
  // if(sheet.getLastRow() > topMargin){
  //   sheet.getRange(topMargin + 1, leftMargin + 1, lastRow - topMargin, gameNum).setValue('');
  // }
  
  //フォームの入力を転記(直接)
  // var forecastRates = formSheet.getRange(formSheet.getLastRow(), 3, 1, gameNum).getValues()[0];
  // sheet.getRange(topMargin - 2, leftMargin + 1, 1, gameNum).setValues([forecastRates]);
  
  
  //対戦高入力(直接)
  //games.forEach(function(game, index){
  //  setDirect(topMargin - 1, (leftMargin + 1) + index, game[0] + '\nvs\n' + game[1]);
  //});
  
  
  
  //全パターン順位付け
  for(var i = 0; i < patternNum; i++){
    //ループ毎の進出リスト出力
    var zeropad = "";
    for(var j = 0; j < gameNum; j++){
      zeropad += "0";
    }
    var results = (zeropad + i.toString(4)).slice(-gameNum); //hを6進数にして、桁数をゲーム数に揃え
    console.log(results)
  }


  
 

  
  //項予想入力(データに)
  // for(var i = 0; i < forecastNum; i++){    
  //   for(var j = 0; j < gameNum; j++){
  //     setData(1 + i, 1 + j, games[j][binForecasts[i].substring(j, j + 1)]);
  //   }
  // }
  
  // sheet.getRange(topMargin + 1, leftMargin + 1, forecastNum, gameNum).setValues(sheet_data);
  
  
  
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

//配列からn個の要素を選ぶ全パターン
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