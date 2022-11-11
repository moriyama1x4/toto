function optimalForecast2(string){
  var string = "回答_GL1位";
  const formSheet = SpreadsheetApp.getActive().getSheetByName(string);
  const name = string.replace("回答", formSheet.getRange(formSheet.getLastRow(), 2).getValue());
  const sheet = SpreadsheetApp.getActive().getSheetByName(name);
  const topMargin = 3;
  const leftMargin = 2;
  const forecastNumCol = topMargin - 2;
  const forecastNumRow = leftMargin - 1;
  const teamNum = 4;
  const rawGames = formSheet.getRange(1, 3, 1, formSheet.getLastColumn() - 2).getValues()[0];
  var games = [];
  for(var i = 0; i < rawGames.length; i += teamNum){
    games.push(rawGames[i].replace(/\ \[.*/g, ""))
  }
  const gameNum = games.length;
  for(var i = 0; i < gameNum; i++){
    games[i] = games[i].split("/");
  }
  console.log(games)
  
  const patternNum = Math.pow(4, gameNum);
  const forecastNum = Math.floor(getDirect(forecastNumCol, forecastNumRow))
  // const forecastNum = 16;
  var forecasts = [];
  var sheet_data = sheet.getRange(topMargin + 1, leftMargin + 1, forecastNum, gameNum).getValues();
  
  
  //シートクリア(直接)
  var lastRow = sheet.getLastRow()
  if(lastRow > topMargin){
    sheet.getRange(topMargin + 1, leftMargin + 1, lastRow - topMargin, gameNum).setValue('');
  }
  
  //フォームの入力を転記(直接)
  var rawForecast = formSheet.getRange(formSheet.getLastRow(), 3, 1, gameNum * teamNum).getValues()[0];
  console.log(rawForecast)
  var forecastRates = [];
  for(var i = 0; i < gameNum; i++) {
      forecastRates.push(rawForecast.slice(teamNum * i, teamNum * (i + 1)))
  }
  console.log(forecastRates)

  //100%に正規化
  for(var i = 0; i < gameNum; i ++) {
    //予想勝率の合計
    const totalRate = forecastRates[i].reduce(function(totalRate, forecastRates){
      return totalRate + forecastRates;
    }, 0);

    if(totalRate !== 1){
      for(var j = 0; j < teamNum; j++){
        forecastRates[i][j] /= totalRate
      }
    }
  }
  console.log(forecastRates)

  
  
  //全パターン順位付け
  for(var i = 0; i < patternNum; i++){
    //ループ毎の進出リスト出力
    var zeropad = "";
    for(var j = 0; j < gameNum; j++){
      zeropad += "0";
    }
    var results = (zeropad + i.toString(4)).slice(-gameNum); //hを4進数にして、桁数をゲーム数に揃え
    var resultRate = 1; //このパターンが起こる確率

    for(var j = 0; j < gameNum; j++){
      var result = results.slice(j, j + 1);
      resultRate *= forecastRates[j][result];
    }

    
    if(forecasts.length < forecastNum){//予想数がベット数下回ってたら、とりあえずプッシュ
      forecasts.push([resultRate, results]);
    }else if(forecasts[0][0] < resultRate){//予想数がベット数超えてたら、最低予想と比較して入れ替え
      forecasts[0] = [resultRate, results]
    }
    forecasts.sort()

  }
// console.log(forecasts)

  
  //項予想入力(データに)
  for(var i = 0; i < forecastNum; i++){    
    for(var j = 0; j < gameNum; j++){
      setData(1 + i, 1 + j, games[j][forecasts[i][1].substring(j, j + 1)]);
    }
  }
  // console.log(sheet_data)
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