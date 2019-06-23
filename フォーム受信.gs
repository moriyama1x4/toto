function writeFormAnswer() {
  var forms = ["ベスト4_回答", "ベスト2_回答"];
  var taegetFormIndex = 0; 
  var maxTimeStamp = 0;
  
  //一番最近に更新されたフォーム判定
  for(var i = 0; i < forms.length; i++){
    var watchSheet = SpreadsheetApp.getActive().getSheetByName(forms[i])
    var timeStamp = watchSheet.getRange(watchSheet.getLastRow(), 1).getValue();
    
    if(timeStamp > maxTimeStamp){
      maxTimeStamp = timeStamp;
      taegetFormIndex = i;
    }
  }
  
  switch(taegetFormIndex){
    case 0:
      forecast(4);
      break;
      
    case 1:
      forecast(2);
      break;
  }
}
