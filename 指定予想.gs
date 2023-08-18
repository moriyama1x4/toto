function choiseForecast(string) {
  // string = "回答_前半戦" //テスト用
  const numMembers = 6;
  
  //フォームシートデータ周り
  const formSheet = SpreadsheetApp.getActive().getSheetByName(string);
  const formNameCol = 2;
  const formDataCol = 3;
  const name = formSheet.getRange(formSheet.getLastRow(), formNameCol).getValue();
  const forecasts = formSheet.getRange(formSheet.getLastRow(), formDataCol).getValue().replace(/ /g, "").split(",");
  const numForecasts = forecasts.length //一人当たりの予想数
  const numGames = forecasts[0].match(new RegExp("/", "g")).length + 1;
  const numChoices = 2**numGames; //選択肢の数

  //予想シートデータ周り
  const sheet = SpreadsheetApp.getActive().getSheetByName(string.replace("回答_", ""));
  const choiceDataRow = 4;
  const choiceDataCol = 2;
  const forecastDataRow = choiceDataRow - 1;
  const forecastDataCol = choiceDataCol + (numGames * 2) + 1; //名前のセルから取る
  const choiceData = sheet.getRange(choiceDataRow, choiceDataCol, numChoices, 1).getValues();
  let forecastData = sheet.getRange(forecastDataRow, forecastDataCol, numChoices + 1, numMembers).getValues();

  //入力列特定
  let inputterCol;
  for(let i = 0; i < numMembers; i++){
    if(forecastData[0][i] == name){
      inputterCol = i;
    }
  }

  //入力とクリア
  for(let i = 0; i < numChoices; i++){
    let selectFlag = false;
    const choise = choiceData[i];
    for(let j = 0; j < numForecasts; j++){
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
  sheet.getRange(forecastDataRow, forecastDataCol, numChoices + 1, numMembers).setValues(forecastData);

}
