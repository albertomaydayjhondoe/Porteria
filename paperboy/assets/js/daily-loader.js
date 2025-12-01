// assets/js/daily-loader.js
document.addEventListener('DOMContentLoaded', () => {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const today = window.TODAY;

  function setButtons(nextExists, prevExists) {
    if (!prevBtn || !nextBtn) return;
    prevBtn.disabled = !prevExists;
    nextBtn.disabled = !nextExists;
  }

  async function loadAdj(date, dir) {
    const resp = await fetch(`/api/api-tiras.php?action=nextprev&date=${encodeURIComponent(date)}`);
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
    const np = await (await fetch(`/api/api-tiras.php?action=nextprev&date=${encodeURIComponent(item.date)}`)).json();
    setButtons(!!np.next, !!np.prev);
    history.replaceState(null, '', '?date=' + item.date);
  }

  if (today) {
    (async () => {
      const np = await (await fetch(`/api/api-tiras.php?action=nextprev&date=${encodeURIComponent(today.date)}`)).json();
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
