function randomForecast() {
  var watchSheet = SpreadsheetApp.getActive().getSheetByName('フォームの回答');
  var name = 'もりやま'//watchSheet.getRange(watchSheet.getLastRow(), 2).getValue();
  var sheet = SpreadsheetApp.getActive().getSheetByName(name);
  var topMargin = 4;
  var leftMargin = 3;
  var forecastNumCol = topMargin - 2;
  var forecastNumRow = leftMargin;
  var winRatesCol = topMargin - 2;
  var startTime = new Date();
  
  var games = [
    ['呉', '市和歌山'],
    ['高松商', '春日部共栄'],
    ['履正社', '星稜'],
    ['日章学園', '習志野'],
    ['明豊', '横浜'],
    ['米子東', '札幌大谷'],
    ['津田学園', '龍谷大平安'],
    ['盛岡大付', '石岡一'],
    ['山梨学院', '札幌第一'],
    ['筑陽学園', '福知山成美'],
    ['広陵', '八戸学院光星'],
    ['富岡西', '東邦'],
    ['明石商', '国士舘'],
    ['松山聖陵', '大分'],
    ['啓新', '桐蔭学園'],
    ['熊本西', '智弁和歌山'],
    ['にやむ', 'むにや']
  ];
  var winRates = [];
  var patternsNum = Math.pow(2, games.length);
  var forecastNum = Math.floor(getDirect(forecastNumCol, forecastNumRow))
  var forecasts = trans(sheet.getRange(1, 1, forecastNum, 1).getValues().filter(String))[0];
  if(!forecasts){
    forecasts = [];
  }
  var initForecastLength = forecasts.length;
  var sheet_data = sheet.getRange(topMargin + 1, leftMargin + 1, forecastNum, games.length).getValues();
  
  //予想数がレンジ内かチェック(0or1の数は未考慮)
  if(!(forecastNum >= 1 && forecastNum <= patternsNum)){
    Browser.msgBox('予想数に正しい値を入力してください(半角数字1~' + patternsNum + ')',Browser.Buttons.OK);
    return;
  }
  
  //勝率取得
  for(var i = 1; i <= games.length; i ++){
    var winRate = getDirect(winRatesCol, leftMargin + i);
    
    if(winRate >= 0 && winRate <= 1 && winRate !== ''){
      winRates.push(winRate);
    }else{
      Browser.msgBox('予想勝率に正しい値を入力してください(半角数字0~1)',Browser.Buttons.OK);
      return;
    }
  }
  
  //項番と予想入力(データに)
  for(var i = initForecastLength; i < forecastNum; i++){
    var currentTime = new Date();
    var pastTime = (currentTime - startTime) / (1000 * 60);
    
    //ある程度越えたら一時書き込みして再起動
    if(pastTime <= 3){
      var binforecast = '';
      
      while(true){
        binforecast = '';
        var contFlag = false;
        var decforecast;
        
        for(var j = 0; j < games.length; j++){
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
    }else{
      //一時保存
      sheet.getRange(1, 1, forecasts.length, 1).setValues(trans([forecasts]))
      
      //再起動の為のトリガー設定
      deleteTriggers("randomForecast"); //多すぎるとトリガー作れなくなるので都度消す
      ScriptApp.newTrigger('randomForecast').timeBased().after(10 * 1000).create();
      return;
    }
  }
  
    //シートクリア(直接)
  var lastRow = sheet.getLastRow()
  if(sheet.getLastRow() > topMargin){
    sheet.getRange(topMargin + 1, leftMargin + 1, lastRow - topMargin, games.length).setValue('');
  }
  
  //対戦高入力(直接)
  games.forEach(function(game, index){
    setDirect(topMargin - 1, (leftMargin + 1) + index, game[0] + ' - ' + game[1]);
  });
  
  //項予想入力(データに)
  for(var i = 0; i < forecastNum; i++){
    var binForcast = ( Array(games.length + 1).join("0") + parseInt(forecasts[i], 10).toString(2)).slice(-games.length);
    
    for(var j = 0; j < games.length; j++){
      Logger.log(binForcast.substr(j, 1));
      setData(1 + i, 1 + j, games[j][binForcast.substr(j, 1)]);
    }
  }
  
//  sheet.getRange(1, 2, forecasts.length, 1).setValues(trans([forecasts]));
  sheet.getRange(1, 1, sheet.getLastRow(), 1).clear();
  sheet.getRange(topMargin + 1, leftMargin + 1, forecastNum, games.length).setValues(sheet_data);
  deleteTriggers("randomForecast");
  
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
