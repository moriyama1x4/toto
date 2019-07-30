function writeFormAnswer() {
  var forms = ["回答_ベスト32", "回答_ベスト16", "回答_ベスト8", "回答_ベスト4", "回答_ベスト2"];
  var taegetFormIndex = 0; 
  var maxTimeStamp = 0;
  
  //一番最近に更新されたフォーム判定
  for(var i = 0; i < forms.length; i++){
    var formSheet = SpreadsheetApp.getActive().getSheetByName(forms[i])
    var timeStamp = formSheet.getRange(formSheet.getLastRow(), 1).getValue();
    
    if(timeStamp > maxTimeStamp){
      maxTimeStamp = timeStamp;
      taegetFormIndex = i;
    }
  }
  
  switch(taegetFormIndex){
    case 0:
    case 1:
      randomForecast(forms[taegetFormIndex]);
      break;
      
    case 2:
    case 3:
    case 4:
      choiseForecast(forms[taegetFormIndex]);
      break;
  }
}
