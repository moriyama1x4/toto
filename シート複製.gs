function copySheet() {
  var bestNum = 16;
  // var suffix = "_ベスト" + bestNum;
  var suffix = "_GL1位";
  var masterMem = "あらい";
  var subMems = ["さとう", "しょーの", "ふじた", "まみづか", "もりやま"];
  var book = SpreadsheetApp.getActive();
  var mastersSheet = book.getSheetByName(masterMem + suffix);
  var masterSheetIndex = mastersSheet.getIndex()
  
  //各memのシートコピー
  subMems.forEach(function(value, index){
    if(book.getSheetByName(value + suffix)){//すでにあったら削除
      book.deleteSheet(book.getSheetByName(value + suffix));
    }
    var copySheet = mastersSheet.copyTo(book);
    copySheet.setName(value + suffix);
    
    //保護
    var protection = copySheet.protect();
    protection.removeEditors(protection.getEditors());
    
    
    //順番
    SpreadsheetApp.setActiveSheet(copySheet)
    SpreadsheetApp.getActive().moveActiveSheet(masterSheetIndex + 1 + index)
  });
  
  
  
  //収支の参照がバグるので、こぴって直す
  // var plSheet = book.getSheetByName("収支")
  // var bestNumRow = 3;
  // var memRow = bestNumRow + 2;
  // var bestNums = plSheet.getRange(bestNumRow, 1, 1, plSheet.getLastColumn()).getValues()[0];
  // var targetCol;
  
  // bestNums.forEach(function(value, index){
  //   if(value == bestNum){
  //     targetCol = index + 1;
  //   }
  // })
  
  var targetRange = plSheet.getRange(memRow, targetCol, subMems.length + 1, 1);
  targetRange.copyTo(targetRange);
}