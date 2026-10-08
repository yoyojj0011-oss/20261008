// 全域狀態與變數宣告
let questions = []; // 儲存所有題目資料的陣列
let currentQuestionIndex = 0; // 目前進行到第幾題（從 0 開始）
let score = 0; // 使用者累計答對題數
let selectedOption = -1; // 使用者點選的選項索引（-1 表示尚未選擇）
let quizState = 'QUESTION'; // 測驗狀態：'QUESTION'(答題中), 'FEEDBACK'(顯示反饋), 'RESULT'(結算畫面)
let nextButton; // 下一題按鈕物件

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 設定文字對齊方式為水平居中、垂直居中
  textAlign(CENTER, CENTER);
  
  // 初始化資訊素養測驗題目（共 5 題）
  questions = [
    {
      question: "1. 關於密碼設定，下列何者是最安全的作法？",
      options: ["A. 使用自己的生日方便記憶", "B. 混合大小寫字母、數字與特殊符號", "C. 所有網站都使用相同的密碼", "D. 寫在貼紙上貼在螢幕旁邊"],
      correctIndex: 1
    },
    {
      question: "2. 收到來自陌生人的郵件附帶「中獎通知」連結，應該如何處理？",
      options: ["A. 立刻點擊連結領取獎品", "B. 轉寄給所有朋友分享喜悅", "C. 不點擊連結並進行查證或舉報", "D. 回覆郵件提供個人身分證字號"],
      correctIndex: 2
    },
    {
      question: "3. 在公共區域使用免費 Wi-Fi 時，最需要注意什麼？",
      options: ["A. 網路速度不夠快", "B. 避免輸入敏感帳號密碼與信用卡號", "C. 不能播放音樂", "D. 手機電池消耗過快"],
      correctIndex: 1
    },
    {
      question: "4. 關於網路智慧財產權，下列敘述何者正確？",
      options: ["A. 只要網路上抓得到的圖片就可以隨意商業使用", "B. 註明出處就不算侵權，不用管創作者授權條件", "C. 使用他人創作應遵循創用 CC 授權或取得許可"],
      correctIndex: 2
    },
    {
      question: "5. 當在社群媒體上看到一則震撼新聞時，第一時間應該？",
      options: ["A. 沒想太多直接分享出去", "B. 核對多方權威新聞來源確認真實性", "C. 留言攻擊新聞中的主角", "D. 複製貼上到自己的塗鴉牆"],
      correctIndex: 1
    }
  ];

  // 建立「下一題」按鈕
  nextButton = createButton('下一題');
  // 設定按鈕大小
  nextButton.size(120, 45);
  // 設定按鈕樣式與字型大小
  nextButton.style('font-size', '18px');
  nextButton.style('cursor', 'pointer');
  // 設定按鈕點擊事件監聽
  nextButton.mousePressed(goToNextQuestion);
  // 初期隱藏按鈕，等回答後才顯示
  nextButton.hide();
}

function draw() {
  // 設定背景顏色為淺灰藍色
  background(240, 244, 248);

  // 根據當前測驗狀態繪製對應畫面
  if (quizState === 'QUESTION' || quizState === 'FEEDBACK') {
    drawQuizScreen(); // 繪製題目與選項畫面
  } else if (quizState === 'RESULT') {
    drawResultScreen(); // 繪製最終結算畫面
  }
}

// 繪製題目與選項畫面的函式
function drawQuizScreen() {
  // 取得當前題目物件
  let q = questions[currentQuestionIndex];

  // 繪製頂部進度文字
  fill(80);
  noStroke();
  textSize(20);
  text(`題目 ${currentQuestionIndex + 1} / ${questions.length}`, width / 2, 40);

  // ------------------ 題目方框與內文繪製 ------------------
  let cardWidth = min(width * 0.85, 650); // 計算題目的最大卡片寬度，避免超過螢幕
  let cardHeight = 100; // 題目方框預設高度
  let cardX = width / 2 - cardWidth / 2; // 方框左上角 X 座標（水平置中）
  let cardY = 80; // 方框左上角 Y 座標

  // 繪製題目背景方框（顏色為 bdb2ff）
  fill('#bdb2ff');
  stroke(180);
  strokeWeight(2);
  rect(cardX, cardY, cardWidth, cardHeight, 15); // 繪製圓角矩形

  // 繪製題目內文（置於方框中央，設定邊界範圍以自動換行）
  fill(20);
  noStroke();
  textSize(22);
  textStyle(BOLD);
  // 使用五個參數的 text() 將文字限定於方框內自動換行與居中
  text(q.question, cardX + 20, cardY + 10, cardWidth - 40, cardHeight - 20);

  // ------------------ 選項繪製 ------------------
  let optionWidth = min(width * 0.85, 650); // 選項寬度保持與題目一致
  let optionHeight = 60; // 選項高度
  let startY = cardY + cardHeight + 30; // 選項起始 Y 座標（銜接在題目方框下方）
  let gap = 15; // 選項間距

  textStyle(NORMAL);
  textSize(18);

  // 逐一繪製每個選項
  for (let i = 0; i < q.options.length; i++) {
    // 基準 X 與 Y 座標
    let x = width / 2 - optionWidth / 2;
    let y = startY + i * (optionHeight + gap);

    // 預設選項背景顏色為純白
    let bgColor = color(255);

    // 若處於反饋狀態，計算顏色與跳動/移動位移
    if (quizState === 'FEEDBACK') {
      let time = frameCount * 0.15; // 時間參數用於觸發動畫正弦波

      // 正確答案選項（設定背景色 #fdffb6，並產生上下跳動）
      if (i === q.correctIndex) {
        bgColor = color('#fdffb6');
        let jumpOffsetY = sin(time) * 12; // 計算上下跳動位移量
        y += jumpOffsetY; // 套用 Y 軸位移
      }
      
      // 使用者答錯的選項（設定背景色 #ff4d6d，並產生左右移動）
      if (selectedOption !== q.correctIndex && i === selectedOption) {
        bgColor = color('#ff4d6d');
        let shakeOffsetX = sin(time * 2) * 10; // 計算左右晃動位移量
        x += shakeOffsetX; // 套用 X 軸位移
      }
    }

    // 繪製選項卡片背景圓角矩形
    fill(bgColor);
    stroke(200);
    strokeWeight(1.5);
    rect(x, y, optionWidth, optionHeight, 10);

    // 繪製選項文字
    fill(30);
    noStroke();
    text(q.options[i], width / 2, y + optionHeight / 2);
  }

  // 若在反饋狀態，定位並顯示「下一題」按鈕
  if (quizState === 'FEEDBACK') {
    let lastOptionY = startY + q.options.length * (optionHeight + gap);
    nextButton.position(width / 2 - 60, lastOptionY + 15);
    nextButton.show();
  } else {
    nextButton.hide();
  }
}

// 繪製最終結算畫面的函式
function drawResultScreen() {
  // 隱藏下一題按鈕
  nextButton.hide();

  // 繪製結算標題
  fill(40);
  noStroke();
  textSize(36);
  textStyle(BOLD);
  text("測驗結束！", width / 2, height / 2 - 80);

  // 繪製答對題數統計
  textSize(28);
  fill(0, 102, 204);
  text(`您總共答對了 ${score} / ${questions.length} 題`, width / 2, height / 2);

  // 繪製評語
  textSize(20);
  textStyle(NORMAL);
  fill(80);
  if (score === questions.length) {
    text("太棒了！您的資訊素養觀念非常完美！", width / 2, height / 2 + 70);
  } else if (score >= 3) {
    text("表現良好！大部分的資訊安全觀念都很紮實。", width / 2, height / 2 + 70);
  } else {
    text("再接再厲！建議多加加強資訊安全的基礎防護知識。", width / 2, height / 2 + 70);
  }
}

// 滑鼠點擊事件處理
function mousePressed() {
  // 僅在答題狀態中才響應選項點擊
  if (quizState !== 'QUESTION') return;

  let q = questions[currentQuestionIndex];
  let optionWidth = min(width * 0.85, 650);
  let optionHeight = 60;
  let cardHeight = 100;
  let startY = 80 + cardHeight + 30;
  let gap = 15;

  // 檢測點擊位置是否落於某個選項區塊之內
  for (let i = 0; i < q.options.length; i++) {
    let x = width / 2 - optionWidth / 2;
    let y = startY + i * (optionHeight + gap);

    // 碰撞檢查：滑鼠位置是否在選項矩形之內
    if (mouseX >= x && mouseX <= x + optionWidth && mouseY >= y && mouseY <= y + optionHeight) {
      selectedOption = i; // 紀錄使用者點選的選項
      
      // 若答對則累加分數
      if (selectedOption === q.correctIndex) {
        score++;
      }
      
      // 切換狀態至反饋動畫狀態
      quizState = 'FEEDBACK';
      break;
    }
  }
}

// 點擊「下一題」按鈕後執行的邏輯
function goToNextQuestion() {
  // 推進至下一題索引
  currentQuestionIndex++;

  // 檢查是否還有下一題
  if (currentQuestionIndex < questions.length) {
    selectedOption = -1; // 重置點選紀錄
    quizState = 'QUESTION'; // 切換回答題狀態
  } else {
    quizState = 'RESULT'; // 無題目則切換至結算畫面
  }
}

// 視窗大小改變時自動重新調整畫布尺寸
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}