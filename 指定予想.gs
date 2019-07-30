function choiseForecast(string) {
  var formSheet = SpreadsheetApp.getActive().getSheetByName(string);
  var name = formSheet.getRange(formSheet.getLastRow(), 2).getValue();
  var sheet = SpreadsheetApp.getActive().getSheetByName(string.replace("回答_", ""));
  var topMargin = 2;
  var leftMargin = 1;
  var nameCol = leftMargin + 1;
  var forecastCol = nameCol + 1;
  var memberNum = 6;
  var forecastNum; //一人当たりの予想数
  var forecasts = [];
  
  //フォームの入力を転記(直接)
  forecasts = formSheet.getRange(formSheet.getLastRow(), 3).getValue().replace(/ /g, "").split(",");
  forecastNum = forecasts.length
  
  for(var i = 0; i < forecastNum; i++){
    forecasts[i] = forecasts[i].split("/");
  }
  
  var gameNum = forecasts[0].length;
  
  //シートの大きさがわかったところで取得
  var sheetData = sheet.getRange(topMargin + 1, leftMargin + 1, forecastNum * memberNum, gameNum + 1).getValues();
  
  
  //予想をデータに取り込み
  var inputNum = 0; //書き込んだ数
  for(var i = 1; i <= forecastNum * memberNum; i++){
    if(getData(i, 1) == name){
      for(var j = 0; j < gameNum; j++){
        setData(i, (forecastCol - leftMargin) + j, forecasts[inputNum][j]);
      }
      
      inputNum++;
      if(inputNum >= forecastNum){
        break;
      }
    }
  }
  
  //予想だけ抽出
//  for(var i = 0; i < forecastNum * memberNum; i++){
//    sheetData[i].splice(0, forecastCol - 1)
//  }
  
  //書き込み
  sheet.getRange(topMargin + 1, leftMargin + 1, forecastNum * memberNum, gameNum + 1).setValues(sheetData);
  
  
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
