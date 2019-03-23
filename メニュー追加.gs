function onOpen() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [
    {
      name : "ランダム予想",
      functionName : "randomForecast"
    }
  ];
  sheet.addMenu("プログラム", entries);
};
