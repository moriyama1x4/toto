function getChoises() {
  var  games = [
    ["ブラジル", "パラグアイ"], 
    ["ベネズエラ", "アルゼンチン"], 
    ["コロンビア", "チリ"],
    ["沖縄", "北海道"]
  ];
  
  var gameNum = games.length;
  
  for(i = 0; i < gameNum; i++){
    var question = games[i][0] + "の勝率(" + games[i][0] + " - " + games[i][1] + ")";
    Logger.log(question);
  }
  
  Logger.log("====ここから指定予想====")
  
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
