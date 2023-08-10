function writeFormAnswer() {
  var forms = ["回答_前半戦", "回答_後半戦"];
  var taegetFormIndex = 0; 
  
  /**
  *勝敗予想の単一フォーム
  */
  // //最適予想
  // optimalForecast(forms[taegetFormIndex]);


  /**
  *指定予想が複数フォーム
  */
  //一番最近に更新されたフォーム判定
  var maxTimeStamp = 0;
  for(var i = 0; i < forms.length; i++){
    var formSheet = SpreadsheetApp.getActive().getSheetByName(forms[i])
    var timeStamp = formSheet.getRange(formSheet.getLastRow(), 1).getValue();
    
    if(timeStamp > maxTimeStamp){
      maxTimeStamp = timeStamp;
      taegetFormIndex = i;
    }
  }

  // 指定予想
  choiseForecast(forms[taegetFormIndex]);
  
}
