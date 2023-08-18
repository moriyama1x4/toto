function choiseForecast(string) {
  // string = "回答_ベスト4" //テスト用
  const memberNum = 6;
  
  //フォームシートデータ周り
  const formSheet = SpreadsheetApp.getActive().getSheetByName(string);
  const formNameCol = 2;
  const formDataCol = 3;
  const name = formSheet.getRange(formSheet.getLastRow(), formNameCol).getValue();
  const forecasts = formSheet.getRange(formSheet.getLastRow(), formDataCol).getValue().replace(/ /g, "").split(",");
  const forecastNum = forecasts.length //一人当たりの予想数
  const gameNum = forecasts[0].match(new RegExp("/", "g")).length + 1;
  const choisesNum = 2**gameNum; //選択肢の数

  //予想シートデータ周り
  const sheet = SpreadsheetApp.getActive().getSheetByName(string.replace("回答_", ""));
  const choisesDataRow = 4;
  const choisesDataCol = 2;
  const forecastDataRow = choisesDataRow - 1;
  const forecastDataCol = choisesDataCol + (gameNum * 2) + 1; //名前のセルから取る
  const choisesData = sheet.getRange(choisesDataRow, choisesDataCol, choisesNum, 1).getValues();
  let forecastData = sheet.getRange(forecastDataRow, forecastDataCol, choisesNum + 1, memberNum).getValues();

  //入力列特定
  let inputterCol;
  for(let i = 0; i < memberNum; i++){
    if(forecastData[0][i] == name){
      inputterCol = i;
    }
  }

  //入力とクリア
  for(let i = 0; i < choisesNum; i++){
    let selectFlag = false;
    const choise = choisesData[i];
    for(let j = 0; j < forecastNum; j++){
      if(forecasts[j] == choise){
        selectFlag = true;
      }
      if(selectFlag){
        forecastData[i + 1][inputterCol] = "〇" //名前セル分行に+1
      }else{
        forecastData[i + 1][inputterCol] = ""
      }
    }
  }
  
  //書き込み
  sheet.getRange(forecastDataRow, forecastDataCol, choisesNum + 1, memberNum).setValues(forecastData);

}
