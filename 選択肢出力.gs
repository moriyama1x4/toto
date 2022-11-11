function getChoises1() {
  var  games =[["仙台育英", "聖光学院"],
["近江", "下関国際"]]
  
  var gameNum = games.length;
  
  // ====最適予想====
  // for(i = 0; i < gameNum; i++){
  //   var question = games[i][0] + "の勝率(" + games[i][0] + " - " + games[i][1] + ")";
  //   Logger.log(question);
  // }

  // ====ここから指定予想====
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

function getChoises2() {
  var  groups = [["ナダル", "メドベージェフ", "チチパス", "ズベレフ"],
                ["ジョコビッチ", "フェデラー", "ティーム", "ベレッティーニ"]];
  
  var groupNum = groups.length;
  var teamNum = groups[0].length;
  var winNum = 2; //各グループの上位進出数
  var patterns = [];
  var text = ""
 
  for(var i = 0; i < groupNum; i++){
    patterns.push(generateChoise(groups[i], winNum));
  }
  
  var patternNum = patterns[0].length; //各グループのパターン数
  
  for(var i = 0; i < patternNum; i++){
    text = ""
    
    for(var j = 0; j < patternNum; j++){
      text = patterns[0][i][0] + "/" + patterns[0][i][1] + "/" + patterns[1][j][0] + "/" + patterns[1][j][1]
       Logger.log(text)
    }
   
  }
}

function getChoises3() {
  const groups = ["ポルトガル", "ガーナ", "ウルグアイ", "韓国"];
  const patterns = [[0, 1, 2, 3], [0, 1, 3, 2], [0, 2, 1, 3], [0, 2, 3, 1], [0, 3, 1, 2], [0, 3, 2, 1], 
                  [1, 0, 2, 3], [1, 0, 3, 2], [1, 2, 0, 3], [1, 2, 3, 0], [1, 3, 0, 2], [1, 3, 2, 0], 
                  [2, 0, 1, 3], [2, 0, 3, 1], [2, 1, 0, 3], [2, 1, 3, 0], [2, 3, 0, 1], [2, 3, 1, 0], 
                  [3, 0, 1, 2], [3, 0, 2, 1], [3, 1, 0, 2], [3, 1, 2, 0], [3, 2, 0, 1], [3, 2, 1, 0]]

  patterns.forEach(function(pattern){
    var ranking = [0, 1, 2, 3];
    pattern.forEach(function(order, index){
      ranking[index] = groups[order];
    })
    Logger.log(ranking[0] + "/" + ranking[1] + "/" + ranking[2] + "/" + ranking[3]);
  })

  

}

//配列からnこの要素を選ぶ全パターン
// function generateChoise(arr, n) {
//   var m = arr.length;
//   if(m < n){
//     return;
//   }
//   var result = [];
//   var resultNum = choiseNum(m, n);
//   var index = [];
//   var choise = [];
  
//   //初期組み合わせ
//   for(var i = 1; i <= n; i++){
//     index.push(i);
//     choise.push(arr[i - 1]);
//   }
//   result.push(choise.concat());
  
//   for(var i = 0; i < resultNum - 1; i++){
//     //組み合わせずらし
//     for(var j = n - 1; j >= 0; j--){
//       //閾値設定
//       var threshold;
//       if(j == n - 1){
//         threshold = m + 1;
//       }else{
//         threshold = index[j + 1];
//       }
      
//       if(index[j] + 1 < threshold){
//         //ずらせる一番上ずらし
//         index[j] = index[j] + 1;
//         choise[j] = arr[index[j] - 1];
        
//         //ずらしたものより上を隣に
//         for(var k = j + 1; k < n; k++){
//           index[k] = index[j] + (k - j);
//           choise[k] = arr[index[k] - 1];
//         }
        
//         result.push(choise.concat());
//         break;
//       }else{
//         continue;
//       }
//     }
//   }
  
//   return result;
// }