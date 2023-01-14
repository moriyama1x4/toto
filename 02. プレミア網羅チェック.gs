/**
 * リーグ戦のシミュレーション前半
 */
function checkAllPattern(){
  var teamNum = 6;
  var triplets = [];
  //三連単全パターンの連想配列作成
  for(var i = 0; i < teamNum - 1; i++){
    for(var j = 0; j < teamNum - 1; j++){
      if(i == j){
        continue;
      }
      for(var k = 0; k < teamNum - 1; k++){
        if(i == k || j == k){
          continue
        }
        triplets[JSON.stringify([i,j,k])] = 0;
      }
    }
  }

  var remainGameNum = 15 - excludeGames.length;


  //全パターン
  for(var h = 0; h < (3 ** remainGameNum); h++){
  // for(var h = 0; h < 10; h++){
    //ループ毎の勝敗リスト出力
    var zeropad = "";
    for(var i = 0; i < remainGameNum; i++){
      zeropad += "0";
    }
    var results = (zeropad + h.toString(3)).slice(-remainGameNum); //hを３進数にして、桁数をゲーム数に揃え
    var winPointResults = results.replace(/1/g, "3").replace(/2/g, "1"); //結果を勝ち点に変換

    winPoint1 = calWinPoint3(winPoint, winPointResults, excludeGames) //勝ち点計算
    winPoint1.shift(); //マンC除外

    // 同一勝ち点処理。ランダムに誤差点付与(全部にランダム点でも良いっちゃいい)
    for(var i = 0; i < teamNum; i++){
      for(var j = 0; j < teamNum - 1; j++){
        if(i == j){
          continue;
        }
        if(winPoint1[i] == winPoint1[j]){
          var rand = Math.random();
          if(rand > 0.5){
            winPoint1[i] += Math.random();
          }else{
            winPoint1[j] += Math.random()
          }
        }
      }
    }
    
    var sortedWinPoint1 = winPoint1.concat().sort((a,b) => (a > b ? -1 : 1)); //順位判定用降順配列
    var triplet = [0,0,0];
    for(var i = 0; i < teamNum - 1; i++){
      for(var j = 0; j < 3; j++){
        if(winPoint1[i] == sortedWinPoint1[j]){
          triplet[j] = i
          break;
        }
      }
    }
    triplets[JSON.stringify(triplet)] += 1;

    //指定3連単の勝敗パターン
    // if(JSON.stringify(triplet) == JSON.stringify([1,2,4])){
    //   console.log(winPointResults)
    // }

  }
  //3連単出力 
  console.log(triplets)

}

/**
 * 勝ち点計算 前半戦のみ
 */
function calWinPoint3(winPoint, winPointResults, excludeGames){
  var winPoint1 = winPoint.concat();
  var teamNum = winPoint.length;
  var gameIndex = 0;

  
  for(var i = 0; i < teamNum; i++){
    for(var j = i + 1; j < teamNum; j++){
      //完了済みの試合除外
      var skipFlag = false;
      excludeGames.forEach(function(excludeGame){
        if(i == excludeGame[0] && j == excludeGame[1]){
          skipFlag = true;
        }
      });
      if(skipFlag){
        continue;
      }

      //対戦結果反映
      var result = winPointResults.slice(gameIndex, gameIndex + 1)
      if(result == "3"){
        winPoint1[i] += 3;
      }else if(result == "1"){
        winPoint1[i] += 1;
        winPoint1[j] += 1;
      }else if(result == "0"){
        winPoint1[j] += 3;
      }

      //カウントアップ
      gameIndex ++;
    }
  }
  return winPoint1;
}
