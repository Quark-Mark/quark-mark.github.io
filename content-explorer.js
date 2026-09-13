(() => {
  const topbar = document.querySelector('.home-topbar');

  if (topbar) {
    const updateTopbar = () => {
      topbar.classList.toggle('is-scrolled', window.scrollY > 32);
    };

    updateTopbar();
    window.addEventListener('scroll', updateTopbar, { passive: true });
  }

  const explorerToggle = document.querySelector('[data-explorer-toggle]');
  const explorerPanel = document.querySelector('[data-explorer-panel]');

  if (explorerToggle && explorerPanel) {
    const setExplorerOpen = (open) => {
      explorerToggle.setAttribute('aria-expanded', String(open));
      explorerPanel.hidden = !open;
      explorerToggle.closest('.explorer-section')?.classList.toggle('is-open', open);
    };

    explorerToggle.addEventListener('click', () => {
      setExplorerOpen(explorerToggle.getAttribute('aria-expanded') !== 'true');
    });

    const openFromHash = () => {
      if (window.location.hash === '#pregled') setExplorerOpen(true);
    };

    openFromHash();
    window.addEventListener('hashchange', openFromHash);
  }

  const root = document.querySelector('[data-content-explorer]');
  if (!root) return;

  const cards = [...document.querySelectorAll('[data-content-card]')];
  const buttons = [...root.querySelectorAll('[data-filter]')];
  const search = root.querySelector('input[type="search"]');
  const count = root.querySelector('[data-result-count]');
  const empty = document.querySelector('[data-empty-results]');
  let activeFilter = 'all';

  const fold = (value) => value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('sr-Latn');

  const update = () => {
    const query = fold(search.value.trim());
    let visible = 0;

    cards.forEach((card) => {
      const categoryMatches = activeFilter === 'all' || card.dataset.category === activeFilter;
      const haystack = fold(`${card.dataset.search || ''} ${card.textContent}`);
      const searchMatches = !query || haystack.includes(query);
      const show = categoryMatches && searchMatches;
      card.hidden = !show;
      if (show) visible += 1;
    });

    count.textContent = visible;
    empty.hidden = visible !== 0;
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      update();
    });
  });

  search.addEventListener('input', update);
  update();
})();
