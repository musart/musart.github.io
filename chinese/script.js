/*
let data = [];
let currentQuestionIndex = 0;
let score = 0;

fetch('words.json')
  .then(response => response.json())
  .then(json => {
    data = json;
    generateQuestion();
  })
  .catch(error => console.error('Error loading JSON:', error));

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function generateQuestion() {
  const questionContainer = document.getElementById('question');
  //const optionsContainer = document.getElementById('options');
  const optionsContainer = document.querySelectorAll('.option');

  if (currentQuestionIndex >= data.length) {
    questionContainer.innerHTML = `Quiz completed! Your score: ${score}/${data.length}`;
    optionsContainer.innerHTML = '';
    return;
  }

  const currentWord = data[currentQuestionIndex];
  questionContainer.innerHTML = `
      <strong>Word:</strong> ${currentWord.word}<br>
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
  const otherOptions = data.filter((item, index) => index !== currentQuestionIndex);
  shuffle(otherOptions);

  while (options.length < 4) {
    const option = otherOptions.pop();
    if (!options.some(o => o.meaning === option.meaning)) {
      options.push(option);
    }
  }

  shuffle(options);

  // Render options
  optionsContainer.innerHTML = '';
  options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'option';
    button.textContent = option.meaning;
    button.onclick = () => checkAnswer(option.meaning === currentWord.meaning);
    optionsContainer.appendChild(button);
  });
}

function checkAnswer(isCorrect) {
  if (isCorrect) {
    score++;
    alert('Correct!');
  } else {
    alert('Wrong!');
  }
  currentQuestionIndex++;
  generateQuestion();
}
*/

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
    let currentQuetionIndex = Math.floor(Math.random() * words.length);
    const currentWord = words[currentQuetionIndex];
    //const options = words.map(word => word.meaning);

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
