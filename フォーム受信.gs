function writeFormAnswer() {
  var forms = ["回答_ベスト2", "回答_ベスト4", "回答_グループA", "回答_グループB", "回答_グループC", "回答_グループD", "回答_グループE", "回答_グループF", "回答_グループG", "回答_グループH"];
  // var forms = ["回答_ベスト2", "回答_ベスト4", "回答_グループE"];
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
