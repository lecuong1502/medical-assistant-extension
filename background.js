const HUGGING_FACE_API_KEY = "YOUR_HUGGING_FACE_API_KEY";

const MODEL_API_URL = "https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment";

chrome.omnibox.onInputEntered.addListener(async (text) => {
    const diagnosisResult = await getDiagnosisFromAI(text);
  
    const resultString = `Result: ${diagnosisResult.label}. Accuracy: ${Math.round(diagnosisResult.score * 100)}%`;

    chrome.tabs.create({ url: `data:text/html,<h1>Search result:</h1><p>${resultString}</p>` });
});

async function getDiagnosisFromAI(symptomsText) {
    try {
        const response = await fetch(MODEL_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`
            },
            body: JSON.stringify({
                "inputs": `Symptoms: ${symptomsText}.`
            })
        });

        if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("Data from API:", data);

    return data[0][0];

    } catch (error) {
        console.error("Failed to call API:", error);
        return {
            label: "Cannot analyze!!!",
            score: 0
        };
    }
}