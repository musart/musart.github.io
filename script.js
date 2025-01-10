async function fetchWords() {
  try {
    const response = await fetch('words.json'); // JSON 파일 경로
    const words = await response.json();
    generateQuiz(words);
  } catch (error) {
    console.error("Failed to load words:", error);
  }
}

function playText(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN'; // 중국어 발음 설정
  synth.speak(utterance);
}

function generateQuiz(words) {
  const questionElement = document.getElementById('question');
  const optionButtons = document.querySelectorAll('.option');

  function showQuestion() {
    const currentWord = words[Math.floor(Math.random() * words.length)];
    const options = words.map(word => word.meaning);

    // 문제 출력
    questionElement.innerHTML = `
      <strong>Word:</strong> ${currentWord.word}<br>
      <strong>Pinyin:</strong> ${currentWord.pinyin}<br>
      <strong>What does it mean?</strong>
      <button id="play-audio">🔊 Listen</button>
    `;

    // 음성 재생 버튼 이벤트
    document.getElementById('play-audio').onclick = () => {
      playText(currentWord.word); // TTS로 단어 발음 재생
    };

    // 선택지 생성
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    optionButtons.forEach((button, index) => {
      button.textContent = shuffledOptions[index];
      button.onclick = () => {
        if (shuffledOptions[index] === currentWord.meaning) {
          alert("Correct!");
        } else {
          alert("Wrong, try again!");
        }
        showQuestion();
      };
    });
  }

  showQuestion();
}

// JSON 데이터 불러오기
fetchWords();
