var watchSheet = SpreadsheetApp.getActive().getSheetByName('フォームの回答');
var name = watchSheet.getRange(watchSheet.getLastRow(), 2).getValue();
var sheet = SpreadsheetApp.getActive().getSheetByName(name);
var sheet_data;

function forecast() {
  var teamNum = 4; //チーム数
  var forcastNum = 4; //カテゴリごとの予想数
  var GroupNum = 3; //予想グループ数
  var rowGap = 8; //グループごとの列差
  
  for(var h = 0; h < 3; h++){
    var forcasts = [];
    sheet_data = sheet.getRange(6 + (h * rowGap), 2, forcastNum, teamNum + 1).getValues()
    
    //フォームの入力を転記(直接)
    var formForcasts = watchSheet.getRange(watchSheet.getLastRow(), 3 + h).getValue().replace(/ /g, "");
    
    for(var i = 0; i < forcastNum; i++){
      forcasts.push([]);
      for(j = 0; j < teamNum; j++){
        forcasts[i].push(formForcasts.split(",")[i].split("⇒")[j]);
      }
    }
    
    //シートクリア(直接)
    var lastRow = sheet.getLastRow()
    if(lastRow > 5){
      sheet.getRange(6 + (h * rowGap), 2, forcastNum, sheet.getLastColumn() - 1).setValue('');
    }
    
    //項番と予想入力(データに)
    for(var i = 0; i < forcastNum; i++){
      setData(1 + i, 1, i + 1);
      for(var j = 0; j < teamNum; j++){
        setData(1 + i, 2 + j, forcasts[i][j]);
      }
    }
    
    sheet.getRange(6 + (h * rowGap), 2, forcastNum, teamNum + 1).setValues(sheet_data);
  }
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