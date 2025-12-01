// assets/js/roller.js
document.addEventListener('DOMContentLoaded', async () => {
  const roller = document.getElementById('roller');
  if (!roller) return;

  let page = 1, per = 40, loading = false, end = false;

  async function fetchPage() {
    if (loading || end) return;
    loading = true;
    const resp = await fetch(`/api/api-tiras.php?action=list&page=${page}&per=${per}`);
    const json = await resp.json();
    if (!json.ok) { loading = false; return; }
    const items = json.data;
    if (!items || items.length === 0) { end = true; loading = false; return; }
    items.reverse().forEach(addItemToRoller);
    page++;
    loading = false;
  }

  function addItemToRoller(item) {
    const div = document.createElement('div');
    div.className = 'roller-item';
    div.dataset.date = item.date;
    div.innerHTML = `
      <img data-src="${item.filename}" alt="${escapeHtml(item.title || item.date)}" loading="lazy">
      <div class="meta">${item.date}</div>
    `;
    div.addEventListener('click', () => {
      window.location.href = '/?date=' + item.date;
    });
    roller.appendChild(div);
    lazyObserve(div.querySelector('img'));
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        const img = ent.target;
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
        }
        io.unobserve(img);
      }
    });
  }, {root: roller, rootMargin: '200px'});

  function lazyObserve(img) {
    io.observe(img);
  }

  roller.addEventListener('scroll', () => {
    if (roller.scrollWidth - (roller.scrollLeft + roller.clientWidth) < 500) {
      fetchPage();
    }
  });

  let isDown = false, startX, scrollLeft;
  roller.addEventListener('pointerdown', (e) => {
    isDown = true;
    roller.setPointerCapture(e.pointerId);
    startX = e.clientX;
    scrollLeft = roller.scrollLeft;
    roller.classList.add('dragging');
  });
  roller.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    roller.scrollLeft = scrollLeft - dx;
  });
  ['pointerup','pointercancel','pointerleave'].forEach(ev => {
    roller.addEventListener(ev, (e) => {
      isDown = false;
      roller.classList.remove('dragging');
    });
  });

  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  await fetchPage();

  const params = new URLSearchParams(location.search);
  const qdate = params.get('date');
  if (qdate) {
    setTimeout(() => {
      const el = document.querySelector(`.roller-item[data-date="${qdate}"]`);
      if (el) {
        roller.scrollLeft = el.offsetLeft - (roller.clientWidth/2) + (el.clientWidth/2);
      }
    }, 600);
  }
});
