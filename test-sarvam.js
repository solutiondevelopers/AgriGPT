async function test() {
  try {
    const res = await fetch('https://api.sarvam.ai/translate', {
      method: 'POST',
      headers: {
        'api-subscription-key': 'sk_qvpzddv5_uXSlboO3jo7EszUmLSzuiqRj',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: "Hello world",
        source_language_code: "en-IN",
        target_language_code: "hi-IN",
        speaker_gender: "Male",
        mode: "formal",
        model: "sarvam-translate:v1"
      })
    });
    console.log(res.status, await res.text());
  } catch (e) {
    console.log(e);
  }
}
test();
