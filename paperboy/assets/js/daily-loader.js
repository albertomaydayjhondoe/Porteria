// assets/js/daily-loader.js
document.addEventListener('DOMContentLoaded', () => {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const today = window.TODAY;
  const currentTag = window.CURRENT_TAG;

  function setButtons(nextExists, prevExists) {
    if (!prevBtn || !nextBtn) return;
    prevBtn.disabled = !prevExists;
    nextBtn.disabled = !nextExists;
  }

  function buildApiUrl(action, params) {
    let url = `/api/api-tiras.php?action=${action}`;
    for (const key in params) {
      if (params[key] !== null && params[key] !== undefined) {
        url += `&${key}=${encodeURIComponent(params[key])}`;
      }
    }
    if (currentTag) {
      url += `&tag=${encodeURIComponent(currentTag)}`;
    }
    return url;
  }

  async function loadAdj(date, dir) {
    const url = buildApiUrl('nextprev', { date });
    const resp = await fetch(url);
    const json = await resp.json();
    const sel = json[dir];
    if (!sel) return null;
    return sel;
  }

  async function navigateTo(item) {
    if (!item) return;
    document.querySelector('.tira-meta h2').textContent = item.title || ('Tira ' + item.date);
    document.querySelector('.tira-meta time').textContent = item.date;
    const img = document.querySelector('.tira-image-vertical img');
    img.src = item.filename;
    img.alt = item.title || ('Tira ' + item.date);
    
    const url = buildApiUrl('nextprev', { date: item.date });
    const np = await (await fetch(url)).json();
    setButtons(!!np.next, !!np.prev);

    const newUrl = new URL(window.location);
    newUrl.searchParams.set('date', item.date);
    if (currentTag) {
      newUrl.searchParams.set('tag', currentTag);
    } else {
      newUrl.searchParams.delete('tag');
    }
    history.replaceState(null, '', newUrl.toString());
  }

  if (today) {
    (async () => {
      const url = buildApiUrl('nextprev', { date: today.date });
      const np = await (await fetch(url)).json();
      setButtons(!!np.next, !!np.prev);
    })();
  } else {
    setButtons(false, false);
  }

  prevBtn && prevBtn.addEventListener('click', async () => {
    const baseDate = (window.TODAY && window.TODAY.date) || document.querySelector('.tira-meta time').textContent;
    const item = await loadAdj(baseDate, 'prev');
    if (item) {
      window.TODAY = item;
      await navigateTo(item);
    }
  });

  nextBtn && nextBtn.addEventListener('click', async () => {
    const baseDate = (window.TODAY && window.TODAY.date) || document.querySelector('.tira-meta time').textContent;
    const item = await loadAdj(baseDate, 'next');
    if (item) {
      window.TODAY = item;
      await navigateTo(item);
    }
  });

  const tags = ['Periódico', 'Tiras diarias', 'Minimal', 'Paperboy'];
  const container = document.getElementById('tags');
  if (container) {
    tags.forEach(t => {
      const s = document.createElement('span');
      s.textContent = t;
      container.appendChild(s);
    });
  }
});
