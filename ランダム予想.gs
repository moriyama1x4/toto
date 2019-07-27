function randomForecast(string) {
  var formSheet = SpreadsheetApp.getActive().getSheetByName(string);
  var name = string.replace("回答", formSheet.getRange(formSheet.getLastRow(), 2).getValue());
  var sheet = SpreadsheetApp.getActive().getSheetByName(name);
  var topMargin = 4;
  var leftMargin = 3;
  var forecastNumCol = topMargin - 2;
  var forecastNumRow = leftMargin - 1;
  var winRatesCol = topMargin - 2;
  var form
  var games = formSheet.getRange(1, 3, 1, formSheet.getLastColumn() - 2).getValues()[0];
  var gameNum = games.length;
  for(var i = 0; i < gameNum; i++){
    games[i] = games[i].match(/\(.*\)/)[0].replace(/\(|\)/g, "").split(" - ");
  }
  
  var winRates = [];
  var patternNum = Math.pow(2, gameNum);
  var forecastNum = Math.floor(getDirect(forecastNumCol, forecastNumRow))
  var forecasts = [];
  var sheet_data = sheet.getRange(topMargin + 1, leftMargin + 1, forecastNum, gameNum).getValues();
  
  //フォームの入力を転記(直接)
  var formForcasts = formSheet.getRange(formSheet.getLastRow(), 3, 1, gameNum).getValues();
  sheet.getRange(topMargin - 2, leftMargin + 1, 1, gameNum).setValues(formForcasts);
  
  //予想数がレンジ内かチェック(0or1の数は未考慮)
  if(!(forecastNum >= 1 && forecastNum <= patternNum)){
    Browser.msgBox('予想数に正しい値を入力してください(半角数字1~' + patternNum + ')',Browser.Buttons.OK);
    return;
  }
  
  //勝率取得
  for(var i = 1; i <= gameNum; i ++){
    var winRate = getDirect(winRatesCol, leftMargin + i);
    
    if(winRate >= 0 && winRate <= 1 && winRate !== ''){
      winRates.push(winRate);
    }else{
      Browser.msgBox('予想勝率に正しい値を入力してください(半角数字0~1)',Browser.Buttons.OK);
      return;
    }
  }
  
  //項番と予想入力(データに)
  for(var i = 0; i < forecastNum; i++){
    var binforecast = '';
    
    while(true){
      binforecast = '';
      var contFlag = false;
      var decforecast;
      
      for(var j = 0; j < gameNum; j++){
        var rnd = Math.random();
        if(rnd <= winRates[j]){
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
    
  }
  
  //シートクリア(直接)
  var lastRow = sheet.getLastRow()
  if(sheet.getLastRow() > topMargin){
    sheet.getRange(topMargin + 1, leftMargin + 1, lastRow - topMargin, gameNum).setValue('');
  }
  
  //対戦高入力(直接)
  games.forEach(function(game, index){
    setDirect(topMargin - 1, (leftMargin + 1) + index, game[0] + ' - ' + game[1]);
  });
  
  //項予想入力(データに)
  for(var i = 0; i < forecastNum; i++){
    var binForcast = ( Array(gameNum + 1).join("0") + parseInt(forecasts[i], 10).toString(2)).slice(-gameNum);
    
    for(var j = 0; j < gameNum; j++){
      setData(1 + i, 1 + j, games[j][binForcast.substr(j, 1)]);
    }
  }
  
  sheet.getRange(topMargin + 1, leftMargin + 1, forecastNum, gameNum).setValues(sheet_data);
  return;
  
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
  
  function trans(data){
    var _ = Underscore.load();
    return _.zip.apply(_, data);
  }
  
  function deleteTriggers(name){
    var triggers = ScriptApp.getProjectTriggers();
    for( var i = 0; i < triggers.length; ++i ){
      if(triggers[i].getHandlerFunction() == name)
        ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}
