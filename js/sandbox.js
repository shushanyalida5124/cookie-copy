import {createApp, reactive} from '../3rd/petite-vue.js';

const store = reactive({
  urls: reactive([]),
  tips: '',
  selectedUrl: '',
  currentUrl: '',
  cookies: [],
  onUrlChange: function() {
    // store.tips = store.selectedUrl;
    window.parent.postMessage({
      url: store.selectedUrl,
      type: 'urlChange'
    }, '*');
  },
  onCopyBtnClick: function() {
    const selectedCookies = store.cookies.filter((cookie) => {
      return cookie.selected;
    });
    // store.tips = selectedCookies;
    window.parent.postMessage({
      type: 'copyBtnClick',
      cookies: JSON.stringify(selectedCookies),
    }, '*');
  },
  handleDelete: function(cookie) {
    window.parent.postMessage({
      type: 'deleteCookie',
      cookie: JSON.stringify(cookie),
    }, '*');
  }
});

createApp({store}).mount('#content');
window.addEventListener('message', function (e){
  const data = e.data;
  const type = data.type;
  switch(type) {
    case 'init':
      store.urls.length = 0;
      store.urls.push(...data.urls);
      // store.tips = data.tips;
      store.selectedUrl = data.url;
      store.currentUrl = data.url;
      store.onUrlChange();
      break;
    case 'sendCookies':
      store.cookies = data.cookies;
    default:
      break;
  }
}, false);
