/**
 * 単試合のシミュレーション
 */
function simulateSingleGames() {
  const simulateNum = 10000;
  const gameNum = 48;
  const memberNum = 6;
  var totalPropertyList = [];
  //fillが使えないっぽい。。。
  for(var i = 0; i < memberNum; i++){
    totalPropertyList.push(0);
  }

  
  const maxProbability =25;
  const minProbability = 15;
  const diff = (maxProbability - minProbability) / (memberNum - 1) | 0;
  var probabilityList = [];
  for(var i = 0; i < memberNum; i++){
    probabilityList.push(maxProbability - (diff * i));
  }
  const rate = 450;

  //ここから実際にやってみる
  for(var h = 0; h < simulateNum; h++){
    var propertyList = [];
    //fillが使えないっぽい。。。
    for(var i = 0; i < memberNum; i++){
      propertyList.push(0);
    }

    for(var i = 0; i < gameNum; i++){
      var isHitList = [];
      probabilityList.forEach(function(probability){
        if(probability > Math.random()*100){
          isHitList.push(1);
        }else{
          isHitList.push(-1);
        }
      })

      propertyList = allLevy(propertyList, isHitList, rate);

    }

    propertyList.forEach(function(property, index){
      totalPropertyList[index] += property;
    });
  }

  totalPropertyList.forEach(function(totalProperty, index){
    totalPropertyList[index] /= simulateNum;
  })
  console.log(totalPropertyList);

  //移動金額
  var moneyScale = 0;
  totalPropertyList.forEach(function(totalProperty){
    if(totalProperty > 0){
      moneyScale += totalProperty
    }
  });
  console.log(moneyScale);
}

/**
 * ベスト~~のシミュレーション
 */
function simulateGamePack() {
  const simulateNum = 1;
  const gameNum = 16;
  const memberNum = 6;
  var totalPropertyList = [];
  //fillが使えないっぽい。。。
  for(var i = 0; i < memberNum; i++){
    totalPropertyList.push(0);
  }

  
  const maxProbability = 73;
  const minProbability = 50;
  const diff = (maxProbability - minProbability) / (memberNum - 1) | 0;
  var probabilityList = [];
  for(var i = 0; i < memberNum; i++){
    probabilityList.push(maxProbability - (diff * i));
  }
  const rate = 1500;
  const betNum = 3000;

  //ここから実際にやってみる
  for(var h = 0; h < simulateNum; h++){
    var propertyList = [];
    //fillが使えないっぽい。。。
    for(var i = 0; i < memberNum; i++){
      propertyList.push(0);
    }

    // for(var i = 0; i < gameNum; i++){
    //   var isHitList = [];
    //   probabilityList.forEach(function(probability){
    //     if(probability > Math.random()*100){
    //       isHitList.push(1);
    //     }else{
    //       isHitList.push(-1);
    //     }
    //   })
    //   propertyList = devideLevy(propertyList, isHitList, rate);
    // }
    var isHitList = [];
    probabilityList.forEach(function(probability){
      if(betNum * ((probability/100) ** gameNum) >= 1){
        isHitList.push(1);
      }else{
        isHitList.push(-1);
      }
    });

    propertyList = devideLevy(propertyList, isHitList, rate);
    propertyList.forEach(function(property, index){
      totalPropertyList[index] += property;
    });
  }

  totalPropertyList.forEach(function(totalProperty, index){
    totalPropertyList[index] /= simulateNum;
  })
  console.log(totalPropertyList);
}


/**
 * 徴収した結果のリストを返す 総取り型
 */
function divideLevy(propertyList, isHitList, rate){
  const memberNum = propertyList.length;
  var resultPropertyList = [];
  var hitNum = 0;

  isHitList.forEach(function(isHit){
    if(isHit == 1){
      hitNum ++;
    }
  })

  if(hitNum ==0){
    resultPropertyList = propertyList;
  }else{
    propertyList.forEach(function(property, index){
      var resultProperty = property - rate;

      if(isHitList[index] == 1){
        resultProperty += rate * memberNum / hitNum
      }
      resultPropertyList.push(resultProperty);
    })
  }

  return resultPropertyList;
}

/**
 * 徴収した結果のリストを返す オール型
 */
function allLevy(propertyList, isHitList, rate){
  const memberNum = propertyList.length;
  var resultPropertyList = [];
  var hitNum = 0;

  isHitList.forEach(function(isHit){
    if(isHit == 1){
      hitNum ++;
    }
  })
  if(hitNum ==0){
    resultPropertyList = propertyList;
  }else{
    propertyList.forEach(function(property, index){
      var resultProperty = property;

      if(isHitList[index] == 1){
        resultProperty += rate * (memberNum - hitNum);
      }else{
        resultProperty -= rate * hitNum;
      }
      resultPropertyList.push(resultProperty);
    })
  }

  return resultPropertyList;
}