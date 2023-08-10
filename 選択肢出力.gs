function getChoises1() {//試合組み合わせから
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

function getChoises2() {//複数グループから何チームか
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
  const patterns = permutation(["マンチェスターC", "アーセナル", "マンチェスターＵ", "ニューカッスル", "リヴァプール", "ブライトン", "トッテナム", "チェルシー"], 3)
  patterns.forEach(function(pattern){
    var text = "";
    pattern.forEach(function(team, index){
      if(index !== 0){
        text += "/";
      }
      text += team;
    })
    Logger.log(text);
  })
}

const permutation = (nums, k) => { //順列出力
    let ans = []
    if (nums.length < k) {
        return []
    }
    if (k === 1) {
        for (let i = 0; i < nums.length; i++) {
            ans[i] = [nums[i]]
        }
    } else {
        for (let i = 0; i < nums.length; i++) {
            let parts = nums.slice(0)
            parts.splice(i, 1)[0]
            let row = permutation(parts, k - 1)
            for (let j = 0; j < row.length; j++) {
                ans.push([nums[i]].concat(row[j]))
            }
        }
    }
    return ans;
}



//組み合わせ出力？
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