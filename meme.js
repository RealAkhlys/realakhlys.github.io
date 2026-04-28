
const url = "https://meme-api.com/gimme";

async function getJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (err) {
    console.error('Fetch error:', err);
    throw err;
  }
}

// create or update meme elements when we have data
async function showMeme() {
  try {
    const data = await getJson(url);
    const img = document.getElementById('meme-img');
    const title = document.getElementById('meme-title');
    const sub = document.getElementById('meme-sub');
    if (img) img.src = data.url;
    if (title) title.textContent = data.title || 'Untitled meme';
    if (sub) sub.textContent = "r/" + data.subreddit || 'No subreddit';
  } catch (e) {
    console.error('failed to load meme', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  showMeme();
  const btn = document.getElementById('reload');
  if (btn) btn.addEventListener('click', showMeme);
});


/*const url = "https://meme-api.com/gimme";

async function getJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Fetch error:', err);
    throw err;
  }
}

var data = getJson(url)

data.url*/