var watchSheet = SpreadsheetApp.getActive().getSheetByName('フォームの回答');
var name = watchSheet.getRange(watchSheet.getLastRow(), 2).getValue();
var sheet = SpreadsheetApp.getActive().getSheetByName(name);
var sheet_data;

function randomForecastPart2() {
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
  var forcasts = SpreadsheetApp.getActive().getSheetByName("シート4").getRange(7, 1).getValue().split(",");
  var forcastNum = Math.floor(getDirect(3, 2))
  sheet_data = sheet.getRange(6, 2, forcastNum, games.length + 1).getValues()

  //シートクリア(直接)
  var lastRow = sheet.getLastRow()
  if(lastRow > 5){
    sheet.getRange(6, 2, lastRow - 5, sheet.getLastColumn() - 1).setValue('');
  }

  //対戦高入力(直接)
  games.forEach(function(game, index){
    setDirect(4, 3 + index, game[0] + ' - ' + game[1]);
  });

  //項番と予想入力(データに)
  for(var i = 0; i < forcastNum; i++){
    setData(1 + i, 1, i + 1);
    
    var binForcast = ( '0000000000000000' + parseInt(forcasts[i], 10).toString(2)).slice( -16 );
    
Logger.log(binForcast);
    for(var j = 0; j < games.length; j++){
      setData(1 + i, 2 + j, games[j][binForcast.substr(j, 1)]);
    }
  }
//  Logger.log(sheet_data);
  sheet.getRange(6, 2, forcastNum, games.length + 1).setValues(sheet_data);
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