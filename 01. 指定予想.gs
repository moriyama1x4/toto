var watchSheet = SpreadsheetApp.getActive().getSheetByName('フォームの回答');
var name = watchSheet.getRange(watchSheet.getLastRow(), 2).getValue();
var sheet = SpreadsheetApp.getActive().getSheetByName(name);
var sheet_data;

function randomForecast() {
  var games = [
    ['市和歌山', '習志野'],
    ['明豊', '龍谷大平安'],
    ['筑陽学園', '東邦'],
    ['明石商', '智弁和歌山']
  ];
  var patternsNum = Math.pow(2, games.length);
  var forcasts = [];
  var forcastNum = Math.floor(getDirect(3, 2))
  
  sheet_data = sheet.getRange(6, 2, forcastNum, games.length + 1).getValues()
  
  //フォームの入力を転記(直接)
  var formForcasts = watchSheet.getRange(watchSheet.getLastRow(), 3).getValue().replace(/ /g, "");
  
  for(var i = 0; i < forcastNum; i++){
    forcasts.push([]);
    for(j = 0; j < games.length; j++){
      forcasts[i].push(formForcasts.split(",")[i].split("/")[j]);
    }
  }
  
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
    for(var j = 0; j < games.length; j++){
      setData(1 + i, 2 + j, forcasts[i][j]);
    }
  }

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