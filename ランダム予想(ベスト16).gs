var watchSheet = SpreadsheetApp.getActive().getSheetByName('フォームの回答');
var name = watchSheet.getRange(watchSheet.getLastRow(), 2).getValue();
var sheet = SpreadsheetApp.getActive().getSheetByName(name);
var sheet_data;

function randomForecast() {
  var round = 4;
  var games = [ //roundと同じ配列数である必要がある 
    ['市和歌山', '高松商'],
    ['星稜', '習志野'],
    ['明石商', '松山星陵'],
    ['桐蔭学園', '(熊本西or智弁和歌山)']
  ];
  var winRates = [];
  var patternsNum = Math.pow(2, games.length);
  var forcasts = [];
  var forcastNum = Math.floor(getDirect(3, 2))
  sheet_data = sheet.getRange(6, 2, forcastNum, round + 1).getValues()

  //フォームの入力を転記(直接)
  var formForcasts = watchSheet.getRange(watchSheet.getLastRow(), 3, 1, round).getValues();
  sheet.getRange(3, 3, 1, round).setValues(formForcasts);

  //予想数がレンジ内かチェック(0or1の数は未考慮)
  if(!(forcastNum >= 1 && forcastNum <= patternsNum)){
    Browser.msgBox('予想数に正しい値を入力してください(半角数字1~' + patternsNum + ')',Browser.Buttons.OK);
    return;
  }

  //シートクリア(直接)
  var lastRow = sheet.getLastRow()
  if(lastRow > 5){
    sheet.getRange(6, 2, lastRow - 5, sheet.getLastColumn() - 1).setValue('');
  }

  //勝率取得
  for(var i = 0; i < games.length; i ++){
    var winRate = getDirect(3, 3 + i);

    if(winRate >= 0 && winRate <= 1 && winRate !== ''){
      winRates.push(winRate);
    }else{
      Browser.msgBox('予想勝率に正しい値を入力してください(半角数字0~1)',Browser.Buttons.OK);
      return;
    }
  }

  //対戦高入力(直接)
  games.forEach(function(game, index){
    setDirect(4, 3 + index, game[0] + ' - ' + game[1]);
  });

  //項番と予想入力(データに)
  for(var i = 0; i < forcastNum; i++){
    setData(1 + i, 1, i + 1);
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
      for(var j = 0; j <= i; j++){
        if(forcasts[j] < decForcast){
          continue;
        }else if(forcasts[j] == decForcast){
          contFlag = true;
          break;
        }else if(forcasts[j] > decForcast || j ==　i){
          forcasts.splice(j, 0, decForcast);
          break;
        }
      }

      if(contFlag){
        continue;
      }else{
        break;
      }
    }

    for(var j = 0; j < games.length; j++){
      setData(1+ i, 2 + j, games[j][binForcast.substr(j, 1)]);
    }
  }
  
  sheet.getRange(6, 2, forcastNum, round + 1).setValues(sheet_data);
}

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