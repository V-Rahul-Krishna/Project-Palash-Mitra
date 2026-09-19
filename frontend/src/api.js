const API_URL = "http://127.0.0.1:8000";

export async function checkBackend() {
  const response = await fetch(`${API_URL}/`);

  if (!response.ok) {
    throw new Error("Backend connection failed");
  }

  return response.json();
}

export async function getLessons() {
  const response = await fetch(`${API_URL}/lessons/`);

  if (!response.ok) {
    throw new Error("Failed to fetch lessons");
  }

  return response.json();
}
export async function translateText(
  text,
  sourceLanguage,
  targetLanguage
) {
  const response = await fetch(
    "http://127.0.0.1:8000/translation/translate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        source_language: sourceLanguage,
        target_language: targetLanguage,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Translation request failed");
  }

  return response.json();
}