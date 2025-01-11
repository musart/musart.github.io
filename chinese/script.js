async function fetchWords() {
  try {
    const response = await fetch('words.json'); // JSON 파일 경로
    const words = await response.json();
    generateQuiz(words);
  } catch (error) {
    console.error("Failed to load words:", error);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
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
    let currentQuestionIndex = Math.floor(Math.random() * words.length);
    const currentWord = words[currentQuestionIndex];

    // 문제 출력
    questionElement.innerHTML = `
      <strong>Word:</strong> 
      <span class="word-large">${currentWord.word}</span><br>
      <strong>Pinyin:</strong> ${currentWord.pinyin}<br>
      <strong>What does it mean?</strong>
      <button id="play-audio">🔊 Listen</button>
    `;

    // 음성 재생 버튼 이벤트
    document.getElementById('play-audio').onclick = () => {
      playText(currentWord.word); // TTS로 단어 발음 재생
    };

    // Generate options
    const options = [currentWord];
    const otherOptions = words.filter((item, index) => index !== currentQuestionIndex);
    shuffle(otherOptions);

    while (options.length < 4) {
      const option = otherOptions.pop();
      if (!options.some(o => o.meaning === option.meaning)) {
        options.push(option);
      }
    }
    shuffle(options);
    
    // 선택지 생성
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    optionButtons.forEach((button, index) => {
      button.textContent = shuffledOptions[index].meaning;
      button.onclick = () => {
        if (shuffledOptions[index].meaning === currentWord.meaning) {
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
