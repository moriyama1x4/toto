var watchSheet1 = SpreadsheetApp.getActive().getSheetByName('フォームの回答');
var name = watchSheet1.getRange(watchSheet1.getLastRow(), 2).getValue();
var sheet1 = SpreadsheetApp.getActive().getSheetByName(name);
var sheet_data1;

function randomForecastPart1() {
  var round = 16;
    var games = [ //roundと同じ配列数である必要がある 
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
  var forcasts = SpreadsheetApp.getActive().getSheetByName("シート4").getRange(5, 1).getValue().split(",");
  var defForcastsLength = forcasts.length;
  var forcastNum = Math.floor(getDirect(3, 2))

  //予想数がレンジ内かチェック(0or1の数は未考慮)
  if(!(forcastNum >= 1 && forcastNum <= patternsNum)){
    Browser.msgBox('予想数に正しい値を入力してください(半角数字1~' + patternsNum + ')',Browser.Buttons.OK);
    return;
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

  //項番と予想入力(データに)
  for(var i = defForcastsLength; i < forcastNum; i++){
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
  }

  SpreadsheetApp.getActive().getSheetByName("シート4").getRange(9, 1).setValue(JSON.stringify(forcasts));
}

function getData(y,x){
  return sheet_data1[y-1][x-1];
}

function getDirect(y,x){
  var range = sheet1.getRange(y, x);
  return range.getValue();
}

function setData(y,x,data){
  sheet_data1[y - 1][x - 1] = data;
}

function setDirect(y,x,data){
  var range = sheet1.getRange(y, x);
  range.setValue(data);
}