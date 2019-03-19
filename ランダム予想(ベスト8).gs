//var sheet = SpreadsheetApp.getActive().getSheetByName('ベスト8');
//
//function randomForecast8() {
//  var forcastNum = Math.floor(getData(3, 2));
//  var games = [
//    ['報徳学園', '愛工大名電'], 
//    ['二松学舎', '浦和学院'],
//    ['済美', '高知商'], 
//    ['大阪桐蔭', '高岡商'], 
//    ['近江', '常葉大菊川'], 
//    ['金足農', '横浜'], 
//    ['下関国際', '木更津総合'], 
//    ['日大三高', '龍谷大平安']
//  ];
//  var winRates = [];
//  var patternsNum = Math.pow(2, games.length);
//  var forcasts = [];
//  
//  if(!(forcastNum >= 1 && forcastNum <= patternsNum)){
//    Browser.msgBox('予想数に正しい値を入力してください(半角数字1~' + patternsNum + ')',Browser.Buttons.OK);
//    return;
//  }
//  
//  sheet.getRange(5, 2, sheet.getLastRow() - 4, sheet.getLastColumn() - 1).setValue('');
//  
//  for(var i = 0; i < games.length; i ++){
//    var winRate = getData(3, 3 + i);
//
//    if(winRate >= 0 && winRate <= 1 && winRate !== ''){   
//      winRates.push(winRate);
//    }else{
//      Browser.msgBox('予想勝率に正しい値を入力してください(半角数字0~1)',Browser.Buttons.OK);
//      return;
//    }
//  }
//  
//  games.forEach(function(game, index){
//    setData(4, 3 + index, game[0] + ' - ' + game[1]);
//  });
//  
//  for(var i = 0; i < forcastNum; i++){
//    setData(5 + i, 2, i + 1);
//    var binForcast = '';
//    
//    while(true){
//      binForcast = '';
//      var contFlag = false;
//      var decForcast;
//      
//      for(var j = 0; j < games.length; j++){
//        var rnd = Math.random();
//        if(rnd <= winRates[j]){
//          binForcast += '0';
//        }else{
//          binForcast += '1';
//        }
//      }
//      
//      decForcast = parseInt(binForcast, 2);
//      for(var j = 0; j < i; j++){
//        if(forcasts[j] == decForcast){
//          contFlag = true;
//          break;
//        }
//      }
//      
//      if(contFlag){
//        continue;
//      }else{
//        forcasts.push(decForcast);
//        break;
//      }
//      
//    }
//    
//    for(var j = 0; j < games.length; j++){
//      setData(5 + i, 3 + j, games[j][binForcast.substr(j, 1)]);
//    }
//  }
//}
//
//function getData(y,x){
//  var range = sheet.getRange(y, x);
//  return range.getValue();
//}
//
//
//function setData(y,x,data){
//  var range = sheet.getRange(y, x);
//  range.setValue(data);
//}