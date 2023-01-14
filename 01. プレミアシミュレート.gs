// var excludeGames = [[0, 3], [0, 4], [0, 5], [1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5], [3, 4], [4, 5]];
// var winPoint = [6, 9, 1, 6, 10, 2]

var excludeGames = [];
var winPoint = [0, 0, 0, 0, 0, 0]


/**
 * リーグ戦のシミュレーション前半
 */
function simulateLeague(){
  var sheet = SpreadsheetApp.getActive().getSheetByName("プレミア");
  var winRates = sheet.getRange(13, 44, 6, 6).getValues();
  var teamNum = winRates.length
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
        triplets[[i,j,k].concat()] = 0;
      }
    }
  }
  var orders = [[0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0]]

  //n回シミュレート
  for(var h = 0; h < 100000; h++){

    //3連単
    var winPoint1 = calWinPoint1(winPoint, winRates, excludeGames) //勝ち点計算
    winPoint1.shift(); //マンC除外

    // 同一勝ち点処理。ランダムに誤差点付与(全部にランダム点でも良いっちゃいい)
    for(var i = 0; i < teamNum - 1; i++){
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
    triplets[triplet.concat()] += 1;

    //順位カウント
    var winPoint2 = calWinPoint2(winPoint, winRates, excludeGames) //勝ち点計算
    winPoint2.shift(); //マンC除外

    // 同一勝ち点処理。ランダムに誤差点付与(全部にランダム点でも良いっちゃいい)
    for(var i = 0; i < teamNum - 1; i++){
      for(var j = 0; j < teamNum - 1; j++){
        if(i == j){
          continue;
        }
        if(winPoint2[i] == winPoint2[j]){
          var rand = Math.random();
          if(rand > 0.5){
            winPoint2[i] += Math.random();
          }else{
            winPoint2[j] += Math.random()
          }
        }
      }
    }
    
    var sortedWinPoint2 = winPoint2.concat().sort((a,b) => (a > b ? -1 : 1)); //順位判定用降順配列
    for(var i = 0; i < teamNum - 1; i++){
      for(var j = 0; j < teamNum - 1; j++){
        if(winPoint2[i] == sortedWinPoint2[j]){
          orders[i][j] += 1;
          break;
        }
      }
    }
  }
  //3連単出力 
  console.log(triplets)

  //順位カウント出力
  var text = orders[0][0]
  for(var i = 1; i < teamNum - 1;i++){
    text += "\n" + orders[i][0];
  }
  console.log(text)
  console.log(orders)
}

/**
 * 勝ち点計算 前半戦のみ
 */
function calWinPoint1(winPoint, winRates, excludeGames){
  var winPoint1 = winPoint.concat();
  var teamNum = winRates.length
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

      var rawWinRate = winRates[i][j]; //引き分けなしの勝率
      var evenRate = 3.5 - (Math.abs(rawWinRate - 5) * 0.5); //引き分け率
      var trueWinRate = rawWinRate - (evenRate / 2); //引き分けありの勝率
      var result = Math.random(); 


      //対戦結果反映
      if(trueWinRate > result * 10){
        winPoint1[i] += 3;
      }else if(trueWinRate + evenRate > result * 10){
        winPoint1[i] += 1;
        winPoint1[j] += 1;
      }else{
        winPoint1[j] += 3;
      }
    }
  }
  return winPoint1;
}

/**
 * 勝ち点計算 前後半
 */
function calWinPoint2(winPoint, winRates, excludeGames){
  var winPoint2 = winPoint.concat();
  var teamNum = winRates.length
  for(var i = 0; i < (2 * teamNum); i++){
      for(var j = i + 1; j < (2 * teamNum); j++){
        var iCopy = i; //ループのindexを処理するため別変数に格納
        var jCopy = j;

        //完了済みの試合除外
        var skipFlag = false;
        excludeGames.forEach(function(excludeGame){
          if(iCopy == excludeGame[0] && jCopy == excludeGame[1]){
            skipFlag = true;
          }
        });
        if(skipFlag){
          continue;
        }

        //後半戦用処理
        if(iCopy < teamNum && jCopy >= teamNum){
          continue;
        }else if(iCopy >= teamNum){
          iCopy -= teamNum;
          jCopy -= teamNum;
        }

        var rawWinRate = winRates[iCopy][jCopy]; //引き分けなしの勝率
        var evenRate = rawWinRate - ((rawWinRate - 4) * 1.5); //引き分け率
        var trueWinRate = rawWinRate - (evenRate / 2); //引き分けありの勝率
        var result = Math.random(); 


        //対戦結果反映
        if(trueWinRate > result * 10){
          winPoint2[iCopy] += 3;
        }else if(trueWinRate + evenRate > result * 10){
          winPoint2[iCopy] += 1;
          winPoint2[jCopy] += 1;
        }else{
          winPoint2[jCopy] += 3;
        }
      }
    }
  return winPoint2;
}

