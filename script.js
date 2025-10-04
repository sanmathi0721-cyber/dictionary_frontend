const backendURL = " https://dictionary-backend-3.onrender.com"; // Replace with your real URL

const resultBox = document.getElementById("result");
const historyList = document.getElementById("historyList");
const wordInput = document.getElementById("wordInput");
const toggleModeBtn = document.getElementById("toggleMode");

function saveHistory(word) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (!history.includes(word)) {
    history.unshift(word);
    history = history.slice(0, 5); // limit to 5
    localStorage.setItem("searchHistory", JSON.stringify(history));
  }
  loadHistory();
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  historyList.innerHTML = "";
  history.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word;
    li.onclick = () => {
      wordInput.value = word;
      searchWord();
    };
    historyList.appendChild(li);
  });
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  toggleModeBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
}

toggleModeBtn.onclick = toggleDarkMode;

async function searchWord() {
  const word = wordInput.value.trim();
  if (!word) {
    resultBox.innerHTML = `<span style="color:red;">⚠️ Please enter a word to search.</span>`;
    return;
  }

  resultBox.innerHTML = `<em>🔎 Searching for "${word}"...</em>`;

  try {
    const response = await fetch(`${backendURL}/define/${word}`);
    const data = await response.json();

    if (data.error) {
      resultBox.innerHTML = `<span style="color:red;">❌ ${data.error}</span>`;
      return;
    }

    const entry = data[0]; // only first entry for now
    const meanings = entry.meanings || [];
    const phonetics = entry.phonetics || [];

    let html = `<h2>${entry.word}</h2>`;

    // Phonetics
    if (phonetics.length > 0) {
      const text = phonetics.find(p => p.text)?.text;
      const audio = phonetics.find(p => p.audio)?.audio;

      if (text) html += `<p><strong>Phonetic:</strong> ${text}</p>`;
      if (audio) html += `<audio controls src="${audio}"></audio>`;
    }

    // Meanings
    meanings.forEach((meaning, idx) => {
      html += `<p><strong>${meaning.partOfSpeech}:</strong></p><ul>`;
      meaning.definitions.slice(0, 3).forEach(def => {
        html += `<li>${def.definition}</li>`;
      });
      html += `</ul>`;
    });

    resultBox.innerHTML = html;

    saveHistory(word);

  } catch (error) {
    resultBox.innerHTML = `<span style="color:red;">❌ Error fetching definition.</span>`;
  }
}

loadHistory();
