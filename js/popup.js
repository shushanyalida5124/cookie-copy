const tabs = await chrome.tabs.query({
  currentWindow: true,
});
const urls = new Set(tabs.map((tab) => tab.url));
const sandbox = document.getElementById('sandbox');
const [{ url }] = await chrome.tabs.query({ active: true, currentWindow: true });

chrome.tabs.onActivated.addListener(init);

setTimeout(() => {
  init();
}, 100);
window.addEventListener('message', async (e) => {
  const data = e.data;
  const type = data.type;
  switch (type) {
    case 'urlChange':
      chrome.cookies.getAll({
        url: data.url,
      }, (cookies) => {
        sandbox.contentWindow.postMessage({
          cookies: cookies.map((cookie) => {
            return {
              name: cookie.name,
              value: cookie.value,
              selected: false,
            }
          }),
          type: 'sendCookies'
        }, '*');
      });
      break;
    case 'copyBtnClick':
      const cookies = JSON.parse(data.cookies);
      cookies.forEach(({ name, value }) => {
        chrome.cookies.set({
          name, url, value, path: '/'
        })
      });
      break;
    case 'deleteCookie':
      const cookie = JSON.parse(data.cookie);
      chrome.cookies.remove({
        name: cookie.name,
        url,
      });
      init();
      break;
    default:
      break;
  }
});

async function init() {
  sandbox.contentWindow.postMessage({
    urls,
    type: 'init',
    url,
  }, '*');
}
