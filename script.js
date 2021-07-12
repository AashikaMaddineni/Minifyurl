const cardContainerEl = document.getElementById("card-container");
const inputEl = document.getElementById("urlInput");
const btnEl = document.getElementById("shortenBtn");

btnEl.addEventListener("click", async () => {
  const url = inputEl.value;
  const warnTextEl = document.querySelector('.warning-text');
  if (!url) {
    warnTextEl.classList.add('active');
    inputEl.classList.add('active');
    return;
  }
  warnTextEl.classList.remove('active');
  inputEl.classList.remove('active');
  btnEl.textContent = "Loading...";
  const response = await shortenUrl(url);
  saveDataInLS(url, response.result.full_short_link);
  init();
  btnEl.textContent = "Minify it!";
});

cardContainerEl.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;
  const buttons = cardContainerEl.querySelectorAll(".btn");
  buttons.forEach((btn) => {
    btn.style.backgroundColor = "hsl(180, 66%, 49%)";
    btn.textContent = "Copy";
  });
  const text = e.target.previousElementSibling.textContent;

  copyToClipboard(text);
  const copyBtn = e.target;

  copyBtn.style.backgroundColor = "hsl(255, 11%, 22%)";
  copyBtn.textContent = "Copied!";
});

function init() {
  cardContainerEl.innerHTML = "";
  const urls = getDataFromLS();

  if (!urls) return;
  urls.forEach((url) => renderLink(url.url, url.shortenUrl));
}

function renderLink(url, shortenUrl) {
  const card = `
    <div class="link-card">
        <div>
            <span>${url}</span>
        </div>
        <div>
            <span>${shortenUrl}</span>
            <button class="btn btn-square btn-small">Copy</button>
        </div>
    </div>
    `;

  cardContainerEl.innerHTML += card;
}

init();

async function shortenUrl(url) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.shrtco.de/v2/shorten?url=${url}`)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}

function getDataFromLS() {
  return JSON.parse(localStorage.getItem("urls"));
}

function saveDataInLS(prevUrl, shortenUrl) {
  const storedData = getDataFromLS() ?? [];

  if (storedData.length > 2) {
    storedData.pop();
  }

  const newData = { url: prevUrl, shortenUrl };
  storedData.unshift(newData);
  localStorage.setItem("urls", JSON.stringify(storedData));
}

const copyToClipboard = (str) => {
  const el = document.createElement("textarea");
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};
