(() => {
  const data = window.JIYUE_LIBRARY_DATA;
  const dialog = document.querySelector('#library-dialog');
  const shelf = document.querySelector('#library-shelf');
  const index = document.querySelector('#library-index');
  const content = document.querySelector('#library-page-content');
  const reader = document.querySelector('.library-reader');
  const tabs = {
    people: document.querySelector('#library-tab-people'),
    chronicle: document.querySelector('#library-tab-chronicle'),
  };
  let volumeKey = 'people';
  let pageIndex = 0;

  function renderIndex() {
    index.replaceChildren();
    let lastGroup = '';
    data[volumeKey].pages.forEach((page, number) => {
      if (page.group && page.group !== lastGroup) {
        const heading = document.createElement('p');
        heading.className = 'library-index-group';
        heading.textContent = page.group;
        index.append(heading);
        lastGroup = page.group;
      }
      const button = document.createElement('button');
      button.className = 'library-index-item';
      button.type = 'button';
      button.textContent = page.title;
      button.dataset.page = String(number);
      button.addEventListener('click', () => showPage(number));
      index.append(button);
    });
  }

  function renderTable(table) {
    const element = document.createElement('table');
    element.className = 'library-table';
    const head = document.createElement('thead');
    const headingRow = document.createElement('tr');
    table.headers.forEach(value => {
      const cell = document.createElement('th');
      cell.textContent = value;
      headingRow.append(cell);
    });
    head.append(headingRow);
    const body = document.createElement('tbody');
    table.rows.forEach(row => {
      const line = document.createElement('tr');
      row.forEach(value => {
        const cell = document.createElement('td');
        cell.textContent = value;
        line.append(cell);
      });
      body.append(line);
    });
    element.append(head, body);
    return element;
  }

  function showPage(number) {
    const volume = data[volumeKey];
    pageIndex = Math.max(0, Math.min(number, volume.pages.length - 1));
    const page = volume.pages[pageIndex];
    document.querySelector('#library-group').textContent = page.group || volume.title;
    document.querySelector('#library-page-title').textContent = page.title;
    content.replaceChildren();
    page.paragraphs.forEach(value => {
      const paragraph = document.createElement('p');
      paragraph.textContent = value;
      content.append(paragraph);
    });
    if (page.table) content.append(renderTable(page.table));
    document.querySelector('#library-count').textContent = `${String(pageIndex + 1).padStart(2, '0')} / ${String(volume.pages.length).padStart(2, '0')}`;
    document.querySelector('#library-prev').disabled = pageIndex === 0;
    document.querySelector('#library-next').disabled = pageIndex === volume.pages.length - 1;
    index.querySelectorAll('.library-index-item').forEach(button => {
      const current = Number(button.dataset.page) === pageIndex;
      button.classList.toggle('is-current', current);
      if (current) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    reader.scrollTop = 0;
  }

  function showVolume(key) {
    volumeKey = key;
    document.querySelector('#library-volume-title').textContent = data[key].title;
    Object.entries(tabs).forEach(([name, tab]) => tab.setAttribute('aria-selected', String(name === key)));
    renderIndex();
    showPage(0);
    index.parentElement.scrollTop = 0;
  }

  shelf.addEventListener('click', () => {
    showVolume('people');
    dialog.showModal();
  });
  tabs.people.addEventListener('click', () => showVolume('people'));
  tabs.chronicle.addEventListener('click', () => showVolume('chronicle'));
  document.querySelector('#library-prev').addEventListener('click', () => showPage(pageIndex - 1));
  document.querySelector('#library-next').addEventListener('click', () => showPage(pageIndex + 1));
  document.querySelector('#library-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  window.addEventListener('hashchange', () => { if (dialog.open) dialog.close(); });
})();
