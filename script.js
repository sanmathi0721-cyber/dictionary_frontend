async function searchWord() {
  const word = document.getElementById("wordInput").value.trim();
  const resultDiv = document.getElementById("result");

  if (!word) {
    resultDiv.innerHTML = "Please enter a word.";
    return;
  }

  resultDiv.innerHTML = "Searching...";

  try {
    const response = await fetch(`https://your-backend-url.onrender.com/define/${word}`);
    const data = await response.json();

    if (data.error) {
      resultDiv.innerHTML = "Word not found.";
    } else {
      resultDiv.innerHTML = `<strong>${word}</strong>: ${data.definition}`;
    }
  } catch (error) {
    resultDiv.innerHTML = "Error connecting to server.";
  }
}
