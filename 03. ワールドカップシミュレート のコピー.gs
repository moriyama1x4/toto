  // var excludeGamesW = [];
  // var winPointW = [0, 0, 0, 0]

  var excludeGamesW = [[0,1], [0,2], [1,3], [2,3]];
  var winPointW = [4, 3, 1, 3]


/**
 * リーグ戦のシミュレーション前半
 */
function simulateCup(){
  var sheet = SpreadsheetApp.getActive().getSheetByName("W杯分析");
  var winRates = sheet.getRange(4, 79, 4, 4).getValues();
  var teamNum = winRates.length
  var orders = [[0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0]]

  //n回シミュレート
  for(var h = 0; h < 100000; h++){
    //順位カウント
    var winPoint = calWinPointW(winPointW, winRates, excludeGamesW) //勝ち点計算
    // console.log(winPoint2)

    // 同一勝ち点処理。ランダムに誤差点付与(全部にランダム点でも良いっちゃいい)
    for(var i = 0; i < teamNum; i++){
      for(var j = 0; j < teamNum; j++){
        if(i == j){
          continue;
        }
        if(winPoint[i] == winPoint[j]){
          var rand = Math.random();
          if(rand > 0.5){
            winPoint[i] += Math.random();
          }else{
            winPoint[j] += Math.random()
          }
        }
      }
    }
    
    var sortedWinPoint = winPoint.concat().sort((a,b) => (a > b ? -1 : 1)); //順位判定用降順配列
    for(var i = 0; i < teamNum; i++){
      for(var j = 0; j < teamNum; j++){
        if(winPoint[i] == sortedWinPoint[j]){
          orders[i][j] += 1;
          break;
        }
      }
    }
  }

  //順位カウント出力
  var text = orders[0][0]
  for(var i = 1; i < teamNum;i++){
    text += "\n" + orders[i][0];
  }
  console.log(text)
  console.log(orders)
}

/**
 * 勝ち点計算 前後半
 */
function calWinPointW(winPointW, winRates, excludeGamesW){
  var winPoint = winPointW.concat();　//シミュレート毎にリセットするためハードコピー
  var teamNum = winRates.length
  for(var i = 0; i < teamNum; i++){
      for(var j = i + 1; j < teamNum; j++){
        var iCopy = i; //ループのindexを処理するため別変数に格納
        var jCopy = j;

        //完了済みの試合除外
        var skipFlag = false;
        excludeGamesW.forEach(function(excludeGame){
          if(iCopy == excludeGame[0] && jCopy == excludeGame[1]){
            skipFlag = true;
          }
        });
        if(skipFlag){
          continue;
        }

        // //後半戦用処理
        // if(iCopy < teamNum && jCopy >= teamNum){
        //   continue;
        // }else if(iCopy >= teamNum){
        //   iCopy -= teamNum;
        //   jCopy -= teamNum;
        // }

        var rawWinRate = winRates[iCopy][jCopy]; //引き分けなしの勝率
        var evenRate = rawWinRate - ((rawWinRate - 4) * 1.5); //引き分け率
        var trueWinRate = rawWinRate - (evenRate / 2); //引き分けありの勝率
        var result = Math.random(); 


        //対戦結果反映
        if(trueWinRate > result * 10){
          winPoint[iCopy] += 3;
        }else if(trueWinRate + evenRate > result * 10){
          winPoint[iCopy] += 1;
          winPoint[jCopy] += 1;
        }else{
          winPoint[jCopy] += 3;
        }
      }
    }
  return winPoint;
}

