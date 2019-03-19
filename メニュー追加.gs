function onOpen() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [
    {
      name : "ランダム予想",
      functionName : "randomForecast16"
    }
  ];
  sheet.addMenu("プログラム", entries);
};
