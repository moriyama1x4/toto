function carryOver() {
  var sheet = SpreadsheetApp.getActive().getSheetByName('単試合');
  var sheetData = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
  
  var memberNum = 6; //人数
  var gameNum = 48; //全試合数
  var topMargin = 2;
  var team1Col = 3;
  var team2Col = 4;
  var resultCol = 5;
  var hitCol = resultCol + memberNum + 1;
  var rateCol = resultCol + (memberNum * 2) + 2;
  var nettoCol = rateCol + 1;
  
  //倍率を全部1に
  for(var i = (topMargin + 1); i <= (topMargin + gameNum); i++){
    setData(i, rateCol, 1);
  }
  
  //倍率更新
  for(var i = (topMargin + 1); i <= (topMargin + gameNum); i++){
    var hitSum = 0; //的中フラグの総和
    var hitMulti = 1; //的中フラグの総乗
    
    for(var j = 0; j < memberNum; j++){
      hitSum += getData(i, hitCol + j);
      hitMulti *= getData(i, hitCol + j);
    }
    
    if(getData(i, resultCol) !== "" && (hitSum == 0 || hitMulti == 1)){
      var carryTeam = [];
      
      if(getData(i, resultCol) == 1){ //勝ち負けの表現により値変わる
        carryTeam.push(getData(i, team1Col));
      }else if(getData(i, resultCol) == 2){
        carryTeam.push(getData(i, team2Col));
      }else if(getData(i, resultCol) === 0){//引き分けがある時
        carryTeam.push(getData(i, team1Col));
        carryTeam.push(getData(i, team2Col));
      }
      
      for(var j = 0; j < carryTeam.length; j++){
        for(var k = i + 1; k <= (topMargin + gameNum); k++){
          if(getData(k, team1Col) == carryTeam[j] || getData(k, team2Col) == carryTeam[j]){
            setData(k, rateCol, getData(k, rateCol) + (getData(i, rateCol) / carryTeam.length));
            break;
          }
        }
      }
      
      setData(i, rateCol, 0);
    }
  }
  
  //熱闘倍率
  for(var i = topMargin + 1; i <= (topMargin + gameNum); i++){
    if(getData(i, nettoCol) == "〇"){
      setData(i, rateCol, getData(i, rateCol) * 2);
    }
  }
  
  //倍率列のみ抽出
  var rateData = [];
  for(var i = 1; i <= gameNum; i++){
    rateData.push([getData(topMargin + i, rateCol)]);
  }

  //倍率のみ書き込み
  sheet.getRange(topMargin + 1, rateCol, gameNum, 1).setValues(rateData);
  
  
  
  
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

