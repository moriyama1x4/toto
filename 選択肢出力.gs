function getChoises() {
  var  games = [
    ["ブラジル", "パラグアイ"], 
    ["ベネズエラ", "アルゼンチン"], 
    ["コロンビア", "チリ"]
  ];
  
  var gameNum = games.length;
  
  for(i = 0; i < Math.pow(2, gameNum); i++){
    var choises = "";
    for(j = 0; j < gameNum; j++){
      if(j > 0){
        choises += "/"
      }
      choises += games[j][Math.floor(i % Math.pow(2, gameNum - j) / Math.pow(2, gameNum - (j + 1)))];
    }
    Logger.log(choises);
  }
  
}
