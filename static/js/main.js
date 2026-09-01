document.documentElement.classList.add('js-enabled');

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

// ============================================================================
// ACCORDION
// ============================================================================

function initializeAccordion() {
	document.querySelectorAll('.accordion-trigger').forEach((trigger) => {
		trigger.addEventListener('click', (e) => {
			e.preventDefault();
			const item = trigger.closest('.accordion-item');
			const isExpanded = item.getAttribute('data-expanded') === 'true';

			// Toggle current item
			item.setAttribute('data-expanded', String(!isExpanded));
			trigger.setAttribute('aria-expanded', String(!isExpanded));
		});
	});
}

initializeAccordion();

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
			if (window.innerWidth <= 920) {
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

// ============================================================================
// DROPDOWN NAVIGATION (Hover only, no click required)
// ============================================================================

function initializeDropdowns() {

	// Use pointerenter/pointerleave on the whole dropdown for robust hover behavior
	document.querySelectorAll('.nav-dropdown').forEach((dropdown) => {
		const toggle = dropdown.querySelector('.nav-dropdown__toggle');
		const menu = dropdown.querySelector('.nav-dropdown__menu');

		if (!toggle || !menu) return;

		let leaveTimer = null;

		const open = () => {
			document.querySelectorAll('.nav-dropdown__toggle').forEach((t) => t.setAttribute('aria-expanded', 'false'));
			toggle.setAttribute('aria-expanded', 'true');
			if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
		};

		const close = () => {
			toggle.setAttribute('aria-expanded', 'false');
			if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
		};

		// Pointer events are more reliable across input types than mouseenter/mouseleave
		dropdown.addEventListener('pointerenter', open);
		dropdown.addEventListener('pointerleave', () => {
			// small delay to avoid flicker when moving between toggle and menu
			leaveTimer = setTimeout(close, 80);
		});

		// Keyboard accessibility: open on focus, close on blur
		toggle.addEventListener('focus', open);
		toggle.addEventListener('blur', () => {
			// ensure we don't close while menu receives focus
			setTimeout(() => {
				if (!dropdown.contains(document.activeElement)) close();
			}, 10);
		});

		// Close when user clicks a link inside the menu
		menu.querySelectorAll('a').forEach((link) => {
			link.addEventListener('click', () => {
				close();
			});
		});
	});

	// Close all dropdowns when clicking outside
	const closeDropdownsOnClickOutside = (e) => {
		if (!e.target.closest('.nav-dropdown')) {
			document.querySelectorAll('.nav-dropdown__toggle').forEach((toggle) => {
				toggle.setAttribute('aria-expanded', 'false');
			});
		}
	};

	document.addEventListener('click', closeDropdownsOnClickOutside);

	// Close on Escape key
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			document.querySelectorAll('.nav-dropdown__toggle').forEach((toggle) => {
				toggle.setAttribute('aria-expanded', 'false');
			});
		}
	});
}

initializeDropdowns();

// ============================================================================
// EVENTS FILTER
// ============================================================================

function initializeEventFilters() {
	const filterBar = document.querySelector('.filter-bar');
	if (!filterBar) return;

	const pills = Array.from(filterBar.querySelectorAll('.filter-pill'));
	const cards = Array.from(document.querySelectorAll('[data-event-card]'));

	const applyFilter = (filter) => {
		const f = (filter || 'all').toString().toLowerCase();
		cards.forEach((card) => {
			const city = (card.dataset.city || '').toString().toLowerCase();
			const type = (card.dataset.type || '').toString().toLowerCase();
			if (f === 'all' || f === city || f === type) {
				card.style.display = '';
			} else {
				card.style.display = 'none';
			}
		});
	};

	pills.forEach((pill) => {
		// accessibility state
		pill.setAttribute('aria-pressed', pill.classList.contains('is-active') ? 'true' : 'false');

		pill.addEventListener('click', (e) => {
			e.preventDefault();
			const filter = pill.dataset.filter;

			// active visual
			pills.forEach((p) => {
				const active = p === pill;
				p.classList.toggle('is-active', active);
				p.setAttribute('aria-pressed', String(active));
			});

			applyFilter(filter);
		});
	});

	// apply initial active pill filter
	const active = pills.find((p) => p.classList.contains('is-active'));
	applyFilter(active ? active.dataset.filter : 'all');
}

initializeEventFilters();

// ============================================================================
// Sticky header polish on scroll
// ============================================================================

const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
	const syncHeaderState = () => {
		siteHeader.classList.toggle('is-scrolled', window.scrollY > 8);
	};

	syncHeaderState();
	window.addEventListener('scroll', syncHeaderState, { passive: true });
}

// ============================================================================
// SCROLL REVEAL — lightweight IntersectionObserver micro-animations
// ============================================================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initializeReveal() {
	const elements = document.querySelectorAll('.reveal');

	if (!('IntersectionObserver' in window) || prefersReducedMotion || elements.length === 0) {
		elements.forEach((el) => el.classList.add('is-visible'));
		return;
	}

	const observer = new IntersectionObserver(
		(entries, obs) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					obs.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
	);

	elements.forEach((el, index) => {
		// Stagger siblings inside the same reveal group
		const siblings = el.parentElement ? el.parentElement.querySelectorAll('.reveal') : [];
		if (siblings.length > 1) {
			const i = Array.prototype.indexOf.call(siblings, el);
			el.style.setProperty('--reveal-delay', `${Math.min(i * 70, 280)}ms`);
		}
		observer.observe(el);
	});
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeReveal);
} else {
	initializeReveal();
}
