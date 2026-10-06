const grid = document.querySelector('#project-grid');
const dialog = document.querySelector('#project-dialog');
const content = document.querySelector('#dialog-content');
let selectedCategory = 'All';
let lastTrigger;
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const tags = items => `<div class="tags">${items.map(item => `<span>${escapeHTML(item)}</span>`).join('')}</div>`;

function renderProjects() {
  const query = document.querySelector('#project-search').value.trim().toLowerCase();
  const visible = projects.filter(project => (selectedCategory === 'All' || project.category === selectedCategory) && `${project.name} ${project.summary} ${project.tech.join(' ')}`.toLowerCase().includes(query));
  grid.innerHTML = visible.map(project => `<article class="project-card"><div class="project-card-top"><span class="project-card-number">${String(projects.indexOf(project) + 1).padStart(2, '0')}</span><span class="project-status">${escapeHTML(project.status)}</span></div><h3>${escapeHTML(project.name)}</h3><p>${escapeHTML(project.summary)}</p>${tags(project.tech)}<button class="detail-link" data-project="${project.id}" aria-label="View ${escapeHTML(project.name)} project details">Project details</button></article>`).join('');
  document.querySelector('#project-count').textContent = `${visible.length} of ${projects.length} projects`;
  document.querySelector('#empty-state').hidden = visible.length > 0;
}

function showProject(id, trigger) {
  const project = projects.find(item => item.id === id);
  if (!project) return;
  lastTrigger = trigger || document.activeElement;
  document.querySelector('#dialog-category').textContent = project.status;
  content.innerHTML = `<h2 id="dialog-title">${escapeHTML(project.name)}</h2><p>${escapeHTML(project.summary)}</p>${tags(project.tech)}<h3>Project overview</h3><ul>${project.details.map(detail => `<li>${escapeHTML(detail)}</li>`).join('')}</ul>${project.links ? `<div class="project-links">${project.links.map(([label,url]) => `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}</a>`).join('')}</div>` : ''}`;
  if (project.id === 'eateasy') content.insertAdjacentHTML('beforeend', '<div class="project-gallery"><img src="eateasy-screen-1.jpg" alt="EatEasy public App Store screenshot" width="392" height="696"><img src="eateasy-screen-2.jpg" alt="EatEasy restaurant discovery screenshot" width="392" height="696"></div>');
  dialog.showModal();
  dialog.scrollTop = 0;
  document.body.classList.add('modal-open');
  document.querySelector('#dialog-close').focus();
}

document.addEventListener('click', event => {
  const button = event.target.closest('[data-project]');
  if (button) showProject(button.dataset.project, button);
});
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  selectedCategory = button.dataset.filter;
  document.querySelectorAll('.filter').forEach(item => {const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active));});
  renderProjects();
}));
document.querySelector('#project-search').addEventListener('input', renderProjects);
document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {document.body.classList.remove('modal-open'); lastTrigger?.focus();});
document.querySelector('#year').textContent = new Date().getFullYear();
renderProjects();
