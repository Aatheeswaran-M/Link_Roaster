async function test() {
  try {
    const res = await fetch('https://link-roaster-d0j5.onrender.com/api/roast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://google.com', language: 'English' })
    });
    if (!res.ok) {
      console.error("Error Status:", res.status);
      console.error("Error Data:", await res.text());
    } else {
      console.log("Success:", await res.json());
    }
  } catch (err) {
    console.error("Network Error:", err);
  }
}
test();
