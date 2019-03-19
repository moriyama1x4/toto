var round = 16;
var sheet = SpreadsheetApp.getActive().getSheetByName('ベスト' + round);
var watchSheet = SpreadsheetApp.getActive().getSheetByName('フォームの回答');

function randomForecast16() {
  var forcastNum = Math.floor(getData(3, 2));
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
    ['熊本西', '智弁和歌山']
  ];
  var winRates = [];
  var patternsNum = Math.pow(2, games.length);
  var forcasts = [];
  
  //フォームの入力を転記
  var formForcasts = watchSheet.getRange(watchSheet.getLastRow(), 2, 1, round).getValues();
  sheet.getRange(3, 3, 1, 16).setValues(formForcasts);
  
  
  if(!(forcastNum >= 1 && forcastNum <= patternsNum)){
    Browser.msgBox('予想数に正しい値を入力してください(半角数字1~' + patternsNum + ')',Browser.Buttons.OK);
    return;
  }
  
  var lastRow = sheet.getLastRow()
  if(lastRow > 4){
    sheet.getRange(5, 2, sheet.getLastRow() - 4, sheet.getLastColumn() - 1).setValue('');
  }
  
  for(var i = 0; i < games.length; i ++){
    var winRate = getData(3, 3 + i);

    if(winRate >= 0 && winRate <= 1 && winRate !== ''){   
      winRates.push(winRate);
    }else{
      Browser.msgBox('予想勝率に正しい値を入力してください(半角数字0~1)',Browser.Buttons.OK);
      return;
    }
  }
  
  games.forEach(function(game, index){
    setData(4, 3 + index, game[0] + ' - ' + game[1]);
  });
  
  for(var i = 0; i < forcastNum; i++){
    setData(5 + i, 2, i + 1);
    var binForcast = '';
    
    while(true){
      binForcast = '';
      var contFlag = false;
      var decForcast;
      
      for(var j = 0; j < games.length; j++){
        var rnd = Math.random();
        if(rnd <= winRates[j]){
          binForcast += '0';
        }else{
          binForcast += '1';
        }
      }
      
      decForcast = parseInt(binForcast, 2);
      for(var j = 0; j < i; j++){
        if(forcasts[j] == decForcast){
          contFlag = true;
          break;
        }
      }
      
      if(contFlag){
        continue;
      }else{
        forcasts.push(decForcast);
        break;
      }
      
    }
    
    for(var j = 0; j < games.length; j++){
      setData(5 + i, 3 + j, games[j][binForcast.substr(j, 1)]);
    }
  }
  

  
}

function getData(y,x){
  var range = sheet.getRange(y, x);
  return range.getValue();
}


function setData(y,x,data){
  var range = sheet.getRange(y, x);
  range.setValue(data);
}