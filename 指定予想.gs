function choiseForecast(string) {
  // var string = "回答_前半戦"; //テスト用
  var formSheet = SpreadsheetApp.getActive().getSheetByName(string);
  var name = formSheet.getRange(formSheet.getLastRow(), 2).getValue();
  var sheet = SpreadsheetApp.getActive().getSheetByName(string.replace("回答_", ""));
  var topMargin = 1;
  var leftMargin = 1;
  var forecastRow = topMargin + 2;
  var forecastPatternCol = leftMargin + 1
  var memberNum = 5;
  var forecastPatternNum = 336; //選択肢の数
  var forecastNum; //一人当たりの予想数
  var forecasts = [];
  
  //フォーム入力取得
  forecasts = formSheet.getRange(formSheet.getLastRow(), 3).getValue().replace(/ /g, "").split(",");
  forecastNum = forecasts.length
  
  var gameNum = forecasts[0].split("/").length;
  var forecastCol = forecastPatternCol + gameNum * 2; //予想入力の開始列

  
  //シートの大きさがわかったところで取得
  var sheetData = sheet.getRange(1, 1, topMargin + 1 + forecastPatternNum, leftMargin + gameNum * 2 + memberNum).getValues();
  
  //予想をデータに取り込み
  //まず名前から列特定
  var targetCol;
  for(var i = 0; i < memberNum; i++){
    if(sheetData[1][forecastCol + i - 1] == name){
      targetCol = forecastCol + i;
      break;
    }
  }


  //予想一致とデータ更新
  for(var i = 0; i < forecastPatternNum; i++){
    var brankFlag = true;
    var forecastPattern = sheetData[forecastRow + i -1].slice(forecastPatternCol - 1, forecastPatternCol + gameNum - 1).join("/")

    for(var j = 0; j < forecastNum; j++){
      if(forecasts[j] == forecastPattern){
        sheetData[forecastRow + i - 1][targetCol - 1] = "〇";
        brankFlag = false
        // console.log(forecastPattern);
      }
    }
    if(brankFlag){
      sheetData[forecastRow + i - 1][targetCol - 1] = "";
    }
  }
  
  //書き込み
  var forecastSheetData = sheetData.slice(forecastRow - 1, forecastRow + forecastPatternNum).map(row => row.slice(forecastCol - 1, forecastCol + memberNum));
  sheet.getRange(forecastRow, forecastCol, forecastPatternNum, memberNum).setValues(forecastSheetData);
  
  
  function getData(y,x){
    return sheetData[y-1][x-1];
  }
  
  function getDirect(y,x){
    var range = sheet.getRange(y, x);
    return range.getValue();
  }
  
  function setData(y,x,data){
    sheetData[y - 1][x - 1] = data;
  }
  
  function setDirect(y,x,data){
    var range = sheet.getRange(y, x);
    range.setValue(data);
  }
}
