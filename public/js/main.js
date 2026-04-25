// ============================================================================
// THEME MANAGEMENT (Dark Mode)
// ============================================================================

const STORAGE_KEY = 'theme-preference';
const LIGHT = 'light';
const DARK = 'dark';

function getThemePreference() {
	// Check localStorage
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored) return stored;

	// Check system preference
	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		return DARK;
	}

	return LIGHT;
}

function setTheme(theme) {
	if (theme === DARK) {
		document.documentElement.setAttribute('data-theme', DARK);
	} else {
		document.documentElement.removeAttribute('data-theme');
	}
	localStorage.setItem(STORAGE_KEY, theme);

	if (themeToggle) {
		themeToggle.setAttribute('aria-pressed', String(theme === DARK));
	}
}

function toggleTheme() {
	const current = document.documentElement.getAttribute('data-theme') === DARK ? DARK : LIGHT;
	const newTheme = current === DARK ? LIGHT : DARK;
	setTheme(newTheme);
}

// Initialize theme on page load
const initialTheme = getThemePreference();
const themeToggle = document.querySelector('#theme-toggle');
setTheme(initialTheme);

// Listen for theme toggle button
if (themeToggle) {
	themeToggle.setAttribute('aria-pressed', String(initialTheme === DARK));
	themeToggle.addEventListener('click', toggleTheme);
}

// Listen for system theme changes
if (window.matchMedia) {
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
		const newTheme = e.matches ? DARK : LIGHT;
		setTheme(newTheme);
	});
}

document.documentElement.classList.add('js-enabled');

// ============================================================================
// MOBILE MENU TOGGLE
// ============================================================================

const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

if (menuToggle && siteNav) {
	const openLabel = menuToggle.dataset.labelOpen || 'Open menu';
	const closeLabel = menuToggle.dataset.labelClose || 'Close menu';

	const updateMenuState = (isOpen) => {
		menuToggle.setAttribute('aria-expanded', String(isOpen));
		menuToggle.setAttribute('aria-label', isOpen ? closeLabel : openLabel);
	};

	menuToggle.addEventListener('click', () => {
		const isOpen = siteNav.classList.toggle('is-open');
		updateMenuState(isOpen);
	});

	siteNav.querySelectorAll('a').forEach((link) => {
		link.addEventListener('click', () => {
			if (window.innerWidth <= 899) {
				siteNav.classList.remove('is-open');
				updateMenuState(false);
			}
		});
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && siteNav.classList.contains('is-open')) {
			siteNav.classList.remove('is-open');
			updateMenuState(false);
		}
	});

	updateMenuState(false);
}

// Sticky header polish on scroll
const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
	const syncHeaderState = () => {
		siteHeader.classList.toggle('is-scrolled', window.scrollY > 8);
	};

	syncHeaderState();
	window.addEventListener('scroll', syncHeaderState, { passive: true });
}

// ============================================================================
// POST SEARCH
// ============================================================================

const postSearch = document.querySelector('#post-search');
if (postSearch) {
	postSearch.addEventListener('input', (event) => {
		const query = event.target.value.toLowerCase();
		document.querySelectorAll('[data-post-card]').forEach((card) => {
			const title = card.dataset.title || '';
			const tags = card.dataset.tags || '';
			card.style.display = title.includes(query) || tags.includes(query) ? '' : 'none';
		});
	});
}

// ============================================================================
// EVENT FILTERING
// ============================================================================

document.querySelectorAll('[data-filter]').forEach((button) => {
	button.addEventListener('click', () => {
		const filter = button.dataset.filter;
		document.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('is-active'));
		button.classList.add('is-active');
		document.querySelectorAll('[data-event-card]').forEach((card) => {
			const city = card.dataset.city || '';
			const type = card.dataset.type || '';
			const visible = filter === 'all' || city === filter || type === filter;
			card.style.display = visible ? '' : 'none';
		});
	});
});