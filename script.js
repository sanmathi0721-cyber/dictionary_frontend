async function searchWord() {
  const word = document.getElementById("wordInput").value.trim();
  const resultDiv = document.getElementById("result");

  if (!word) {
    resultDiv.innerHTML = `<span style="color:red;">⚠️ Please enter a word to search.</span>`;
    return;
  }

  resultDiv.innerHTML = `<em>🔎 Searching for "${word}"...</em>`;

  try {
    const response = await fetch(`https://dictionary-backend-4.onrender.com/define/${word}`);
    const data = await response.json();

    if (data.error) {
      resultDiv.innerHTML = `<span style="color:red;">❌ ${data.error}</span>`;
    } else {
      resultDiv.innerHTML = `<strong>${word}</strong>: ${data.definition}`;
    }
  } catch (error) {
    resultDiv.innerHTML = `<span style="color:red;">❌ Failed to fetch data. Please try again later.</span>`;
  }
}

