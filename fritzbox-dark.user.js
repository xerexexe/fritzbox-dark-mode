// ==UserScript==
// @name         FRITZ!Box Dark Mode – Shadow DOM
// @namespace    local.fritzbox.darkmode
// @version      1.1.2
// @description  Dunkle Oberflächen, auch in Web-Komponenten. Mit Schalter und ohne externe Bibliotheken.
// @match        *://fritz.box/*
// @match        *://*.fritz.box/*
// @match        *://192.168.178.1/*
// @author       xerexexe
// @license      MIT
// @homepageURL  https://github.com/xerexexe/fritzbox-dark-mode
// @supportURL   https://github.com/xerexexe/fritzbox-dark-mode/issues
// @updateURL    https://raw.githubusercontent.com/xerexexe/fritzbox-dark-mode/main/fritzbox-dark.meta.js
// @downloadURL  https://raw.githubusercontent.com/xerexexe/fritzbox-dark-mode/main/fritzbox-dark.user.js
// @description:en Dark surfaces for the FRITZ!Box interface, including Shadow DOM components, with a persistent light/dark toggle.
// @run-at       document-start
// @sandbox      raw
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    // Bei einer anderen Router-Adresse oben eine passende @match-Zeile ergänzen.
    // Das alte Dark-Mode-Script bitte deaktivieren.
    const KEY = 'fritzbox-dark-mode-v3';
    const MARK = 'data-fbdm-v3';
    const UI_ID = 'fbdm-v3-switch';
    const PENDING = 'data-fbdm-pending';
    const HTML_NS = 'http://www.w3.org/1999/xhtml';
    if (window.__fbdmV3Installed) return;
    window.__fbdmV3Installed = true;

    let enabled = true;
    try { enabled = localStorage.getItem(KEY) !== 'off'; } catch (_) { /* Storage kann gesperrt sein. */ }
    let serial = 0;
    let button;
    const roots = new Map();
    const owned = new WeakSet();
    const pendingElements = new Set();
    // A constructed sheet also exists before <html> is parsed and survives head replacement.
    let startupSheet;
    try {
        startupSheet = new CSSStyleSheet();
        startupSheet.replaceSync('html,body{background:#141517!important;color:#e4e7ec!important;color-scheme:dark!important}');
        startupSheet.disabled = !enabled;
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, startupSheet];
    } catch (_) { startupSheet = null; /* The regular style nodes provide the fallback. */ }

    const baseCSS = `
        :root, :host {
            color-scheme: dark !important;
            --white-100: #fff !important;
            --charcoal-gray-100: #e4e7ec !important;
            --charcoal-gray-73: rgba(216,221,229,.78) !important;
            --charcoal-gray-45: rgba(185,193,205,.48) !important;
            --charcoal-gray-30: rgba(185,193,205,.38) !important;
            --charcoal-gray-20: rgba(185,193,205,.2) !important;
            --charcoal-gray-8: rgba(185,193,205,.08) !important;
            --charcoal-gray-5: rgba(185,193,205,.05) !important;
            --charcoal-gray-3: rgba(185,193,205,.03) !important;
            --charcoal-gray-tints-3-tint: #1b1d20 !important;
            --charcoal-gray-tints-5-tint: #23262a !important;
            --charcoal-gray-tints-8-tint: #2a2d32 !important;
            --charcoal-gray-tints-20-tint: #363b42 !important;
            --charcoal-gray-tints-30-tint: #474d56 !important;
            --charcoal-gray-tints-45-tint: #747c88 !important;
            --charcoal-gray-tints-73-tint: #acb3bd !important;
            --rice-gray-100: #141517 !important;
            --blue-tints-10-tint: #263242 !important;
            --blue-tints-20-tint: #2d4057 !important;
            --blue-tints-30-tint: #38536f !important;
            --blue-dark-tints-10-tint: #263242 !important;
            --blue-dark-tints-20-tint: #2d4057 !important;
            --interactive-base-default: #23262a !important;
            --interactive-base-checked: #2d4057 !important;
            --interactive-base-disabled: #25282d !important;
            --color-text: #e4e7ec !important;
            --color-text-bright: #f4f5f7 !important;
            --color-bg-base: #141517 !important;
            --color-bg-surface: #222529 !important;
            --color-bg-subtle: #2b2f35 !important;
            --color-text-base: #e4e7ec !important;
            --color-text-subtle: #a8afb9 !important;
            --color-border: #3b4048 !important;
            --content-shadow: 0 -.25rem .5rem 1rem #1b1d20 !important;
        }
        html, body { background-color: #141517 !important; color: #e4e7ec !important; }
        main#js3ContentBox, .js3-view, .js3-view__container {
            background-color:#1b1d20!important; color:#e4e7ec!important;
        }
        :focus-visible { outline: 2px solid #91bfff !important; outline-offset: 2px; }
        ::selection { background-color: #335478 !important; color: #fff !important; }
        input, select, textarea { color-scheme: dark !important; }
        input[type="checkbox"], input[type="radio"], progress { accent-color: #8bbcff; }
        input[type="checkbox"], input[type="radio"] {
            appearance:auto!important; background-image:none!important; background-color:transparent!important;
        }
        input::placeholder, textarea::placeholder { color: #9ca4b0 !important; opacity: 1; }
        a[href]:not([role="button"]) { color: #91bfff; }
    `;

    const finishCSS = `
        .dialog { --content-shadow:0 -.25rem .5rem 1rem #1b1d20!important; }
        .dialog__header, .dialog .button-block.button-block--popover {
            background-color:#1b1d20!important;
            box-shadow:var(--content-shadow)!important;
        }
        .v-modal-view, .v-modal-view__header, .v-modal-view__footer {
            background-color:#1b1d20!important; color:#e4e7ec!important;
        }
        #blueBarBox { background-color:#1d1f23!important;
            background-image:none!important; border-color:#34383f!important; }
        #navigationMenu, .menuArea { background-image:none!important; background-color:#191b1e!important; }
        #menuBox { border-color:#34383f!important; }
        .blueBarLnk { color:#e4e7ec!important; border-color:#4a515d!important; }
        .menu_item.show, .menu_item.with_sub.selected { color:#e4e7ec!important; }
        .menu_item.show:hover { background-color:#282c32!important; }
        .menu_item.selected:not(.with_sub) { background-color:#293b54!important; color:#f4f5f7!important; }
        a:not([role="button"]):not(.js3-button__link) { color:#91bfff!important; }
        .home-list { background-color:#222529!important; border:1px solid #363b42!important;
            border-radius:8px; padding:12px; }
        .home-list__header { border-bottom:1px solid #363b42!important; margin-bottom:8px; }
        .home-list__header::after { background-color:#363b42!important; }
        .home-list__header-box { background-color:#292d33!important; color:#e4e7ec!important; border-radius:4px 4px 0 0; }
        .home-list__header-box * { color:#e4e7ec!important; }
        .home-list__body { background-color:transparent!important; }
        .home-list__table { border-color:transparent!important; }
        .home-list__table tr:hover { background-color:#2b3037!important; }
        .js3-tabs::after { background:#191b1e!important; border-color:#363b42!important; }
        .js3-tabs__tab { background:#222529!important; color:#a8afb9!important; }
        .js3-tabs__tab.js3-tabs__tab--active { background:#293b54!important; color:#e4e7ec!important; border-color:#363b42!important; }
        .js3-tabs__scroll-button, .js3-button-group__scroll-button { background-color:#25292f!important; color:#91bfff!important; }
        .js3-page-header, .page-tabs, .page-tabs__tab--active { background-color:#1d1f23!important; border-color:#363b42!important; }
        .js3-button:not(.js3-button--primary):not(.js3-button--back):not(.js3-button--critical):not(.js3-button--disabled) {
            --button-text-color:#91bfff!important; }
        .secondary-button, .tertiary-button { color:#91bfff!important; }
        input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="image"]),
        select, textarea { background-color:#1b1d20!important; color:#e4e7ec!important; border-color:#4a515d!important; }
        input:disabled, textarea:disabled, select:disabled { color:#89929f!important; background-color:#25282d!important; }
        input::placeholder, textarea::placeholder { color:#9ca4b0!important; }
        .network-topology__ip-address, .network-topology__mesh-master { color:#a8afb9!important; }
        .js3-input__container { background-color:#1b1d20!important; }
        .js3-input__small-label {
            background-image:none!important; background-color:#1b1d20!important; color:#b4bbc5!important;
        }
        .wctbl .wctbl__footer::after {
            background:linear-gradient(transparent,rgba(27,29,32,.98) 10%)!important;
        }
        .heatNoData {
            background-image:repeating-linear-gradient(45deg,#2b2f35,#2b2f35 3px,#3b4048 0,#3b4048 6px)!important;
        }
        .page-blocks__block--chart canvas { filter:brightness(1.35); }
        [data-fbdm-pending], [data-fbdm-pending] * { visibility:hidden!important; }
    `;

    function isOurs(node) {
        return owned.has(node) || owned.has(node.parentNode) || node.nodeType === 1 && node.id === UI_ID;
    }

    let frame = 0;
    function schedule() {
        if (enabled && !frame) frame = requestAnimationFrame(flush);
    }

    function makeStyle(root, text) {
        const style = document.createElement('style');
        owned.add(style);
        style.textContent = text;
        (root === document ? document.head || document.documentElement : root)?.appendChild(style);
        style.disabled = !enabled;
        return style;
    }

    function ensureStyles(root, state) {
        if (root === document && !document.documentElement) return;
        if (!state.base || state.base.getRootNode() !== root) {
            state.base = makeStyle(root, baseCSS);
            state.ready = false;
            state.full = true;
        }
        if (!state.patches || state.patches.getRootNode() !== root) {
            state.patches = makeStyle(root, '');
            state.entries.clear();
            state.recipes.clear();
            state.full = true;
        }
        if (!state.finish || state.finish.getRootNode() !== root) state.finish = makeStyle(root, finishCSS);
        if (!state.guard || state.guard.getRootNode() !== root) {
            state.guard = makeStyle(root, root === document
                ? 'body{visibility:hidden!important}' : ':host,:host *{visibility:hidden!important}');
        }
        state.guard.disabled = !enabled || state.ready;
    }

    function dirty(root, node) {
        const state = roots.get(root);
        if (!state || isOurs(node)) return;
        state.targets.add(node);
        if (enabled && node.nodeType === 1) {
            node.setAttribute(PENDING, '');
            pendingElements.add(node);
        }
        schedule();
    }

    function full(root) {
        const state = roots.get(root);
        if (!state) return;
        state.full = true;
        state.ready = false;
        if (enabled && state.guard) state.guard.disabled = false;
        schedule();
    }

    function invalidateAll() {
        for (const root of roots.keys()) full(root);
    }

    function register(root) {
        if (roots.has(root)) return;
        const state = { base: null, patches: null, finish: null, guard: null,
            observer: null, connected: false, ready: false, full: true,
            targets: new Set(), queue: new Set(), entries: new Map(), recipes: new Map(), prune: false };
        roots.set(root, state);
        state.onLoad = event => {
            if (event.target?.tagName === 'LINK' || event.target?.tagName === 'STYLE') full(root);
        };
        state.observer = new MutationObserver(records => {
            ensureStyles(root, state);
            for (const record of records) {
                if (isOurs(record.target)) continue;
                if (record.type === 'characterData') {
                    // Live counters and ordinary text updates cannot change a surface's color.
                    if (record.target.parentElement?.tagName === 'STYLE') full(root);
                    continue;
                }
                if (record.type === 'attributes') {
                    dirty(root, record.target);
                    continue;
                }
                if (record.target.nodeName === 'STYLE') {
                    full(root);
                    continue;
                }
                for (const node of record.addedNodes) {
                    if (node.nodeType !== 1 || isOurs(node)) continue;
                    discover(node);
                    if (node.matches('style,link[rel="stylesheet"]')) full(root);
                    else dirty(root, node);
                }
                for (const node of record.removedNodes) {
                    if (node.nodeType !== 1 || isOurs(node)) continue;
                    state.prune = true;
                    if (node.matches('style,link[rel="stylesheet"]')) full(root);
                    schedule();
                }
            }
            if (state.full) schedule();
        });
        state.observer.observe(root, {
            childList: true, subtree: true, attributes: true, characterData: true,
            attributeFilter: ['class', 'style', 'hidden', 'open', 'disabled', 'selected',
                'aria-expanded', 'aria-selected', 'aria-checked', 'aria-disabled'],
        });
        ensureStyles(root, state);
        root.addEventListener('load', state.onLoad, true);
        discover(root);
        schedule();
    }

    const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'attachShadow');
    if (descriptor && typeof descriptor.value === 'function') {
        const original = descriptor.value;
        try {
            Object.defineProperty(Element.prototype, 'attachShadow', {
                ...descriptor,
                value: function (...args) {
                    const root = Reflect.apply(original, this, args);
                    if (this.id !== UI_ID) queueMicrotask(() => register(root));
                    return root;
                },
            });
        } catch (_) { /* Bereits vorhandene offene Roots werden trotzdem gefunden. */ }
    }

    function discover(root) {
        if (root.nodeType === 1 && root.id !== UI_ID && root.shadowRoot) register(root.shadowRoot);
        for (const el of root.querySelectorAll('*')) {
            if (el.id !== UI_ID && el.shadowRoot && !roots.has(el.shadowRoot)) register(el.shadowRoot);
        }
    }

    function parseColor(value) {
        const match = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/.exec(value);
        if (!match) return null;
        const [r, g, b] = match.slice(1, 4).map(Number);
        return { r, g, b, a: match[4] === undefined ? 1 : Number(match[4]),
            light: (r + g + b) / 3, chroma: Math.max(r, g, b) - Math.min(r, g, b) };
    }

    function neutral(color) { return color && color.a > 0.15 && color.chroma < 42; }
    function surface(color) {
        if (!neutral(color) || color.light < 105) return null;
        const hex = color.light > 242 ? '#1b1d20' : color.light > 205 ? '#25282d' : '#30353c';
        if (color.a > 0.98) return hex;
        const rgb = hex.slice(1).match(/../g).map(v => parseInt(v, 16));
        return `rgba(${rgb.join(',')},${color.a})`;
    }

    function eligible(el) {
        return el.nodeType === 1 && !isOurs(el)
            && !/^(SCRIPT|STYLE|LINK|META|HEAD|TEMPLATE|NOSCRIPT)$/.test(el.tagName)
            && (el.namespaceURI === HTML_NS || el.localName === 'text');
    }

    function collect(state, node, root) {
        if (node !== root && node.getRootNode() !== root) return;
        if (eligible(node)) state.queue.add(node);
        for (const el of node.querySelectorAll('*')) if (eligible(el)) state.queue.add(el);
    }

    function measure(state, elements) {
        const cache = new WeakMap();
        const backgrounds = new WeakMap();
        const previous = elements.map(el => el.getAttribute(MARK));
        // Remove only this batch's color tokens, then read the whole batch.
        // Share color rules instead of creating thousands of unique selectors.
        for (const el of elements) if (el.hasAttribute(MARK)) el.removeAttribute(MARK);
        function snapshot(el) {
            if (cache.has(el)) return cache.get(el);
            const s = getComputedStyle(el);
            const data = { bg: parseColor(s.backgroundColor), color: parseColor(s.color),
                image: s.backgroundImage, fill: parseColor(s.fill),
                borders: ['Top', 'Right', 'Bottom', 'Left'].map(side => parseColor(s[`border${side}Color`])) };
            cache.set(el, data);
            return data;
        }
        function coloredSurface(el) {
            if (!el) return false;
            if (backgrounds.has(el)) return backgrounds.get(el);
            const s = snapshot(el);
            const result = s.image !== 'none' || (s.bg && s.bg.a > .9
                ? s.bg.chroma >= 42 && s.bg.light > 100 : coloredSurface(el.parentElement || el.getRootNode().host));
            backgrounds.set(el, result);
            return result;
        }
        let values;
        try {
            values = elements.map(el => {
                const s = snapshot(el), props = [], svgText = el.namespaceURI !== HTML_NS;
                const bg = surface(s.bg);
                if (!svgText && bg && !/^(HTML|BODY)$/.test(el.tagName)) props.push(`background-color:${bg}!important`);
                if (!coloredSurface(el) && neutral(s.color) && s.color.light < 195) {
                    props.push(`color:${s.color.light < 100 ? '#e4e7ec' : '#a8afb9'}!important`);
                }
                if (svgText && neutral(s.fill) && s.fill.light < 195) props.push('fill:#b4bbc5!important');
                if (!svgText) s.borders.forEach((color, i) => {
                    if (neutral(color) && color.light > 95) props.push(`border-${['top','right','bottom','left'][i]}-color:#3b4048!important`);
                });
                return props.join(';');
            });
        } finally {
            // Also restore the previous dark rules if a component throws during measurement.
            if (!values) elements.forEach((el, i) => {
                if (previous[i] !== null) el.setAttribute(MARK, previous[i]);
            });
        }
        elements.forEach((el, i) => {
            if (!values[i]) {
                state.entries.delete(el);
                return;
            }
            let entry = state.recipes.get(values[i]);
            if (!entry) {
                const id = String(++serial);
                const sheet = state.patches.sheet;
                const index = sheet.insertRule(`[${MARK}="${id}"]{${values[i]}}`, sheet.cssRules.length);
                entry = { id, rule: sheet.cssRules[index] };
                state.recipes.set(values[i], entry);
            }
            el.setAttribute(MARK, entry.id);
            state.entries.set(el, entry);
        });
    }

    function releasePending(root) {
        for (const el of pendingElements) {
            if (!el.isConnected || el.getRootNode() === root) {
                el.removeAttribute(PENDING);
                pendingElements.delete(el);
            }
        }
    }

    function flush() {
        frame = 0;
        if (!enabled) return;
        const started = performance.now();
        let remaining = 200;
        for (const [root, state] of roots) {
            if (root !== document) {
                if (root.host.isConnected) state.connected = true;
                else if (state.connected) {
                    state.observer.disconnect();
                    root.removeEventListener('load', state.onLoad, true);
                    for (const style of [state.base,state.patches,state.finish,state.guard]) style?.remove();
                    roots.delete(root);
                    continue;
                }
            }
            ensureStyles(root, state);
            if (!state.patches?.sheet) continue;
            if (state.full) {
                state.queue.clear();
                collect(state, root, root);
                state.targets.clear();
                state.full = false;
            } else {
                // Parent targets already cover their descendants.
                for (const node of state.targets) {
                    let parent = node.parentElement;
                    while (parent && !state.targets.has(parent)) parent = parent.parentElement;
                    if (!parent) collect(state, node, root);
                }
                state.targets.clear();
            }
            if (state.prune) {
                for (const [el, entry] of state.entries) if (el.getRootNode() !== root) {
                    state.entries.delete(el);
                }
                state.prune = false;
            }
            const batch = [];
            if (performance.now() - started < 8) for (const el of state.queue) {
                if (!remaining) break;
                state.queue.delete(el);
                if (el.getRootNode() === root) { batch.push(el); remaining--; }
            }
            if (batch.length) {
                try { measure(state, batch); }
                catch (error) {
                    // A failed fallback must never leave a complete view hidden.
                    state.queue.clear();
                    console.warn('FRITZ!Box Dark Mode: Farbfallback übersprungen.', error);
                }
            }
            if (!state.queue.size) {
                state.ready = true;
                state.guard.disabled = true;
                releasePending(root);
            }
        }
        mountButton();
        if ([...roots].some(([root, state]) => (root === document || root.host.isConnected)
            && (state.full || state.targets.size || state.queue.size || state.prune))) schedule();
    }

    function updateButton() {
        if (!button) return;
        button.textContent = enabled ? '☾ Dunkel' : '☀ Hell';
        button.setAttribute('aria-pressed', String(enabled));
        button.title = enabled ? 'Dark Mode ausschalten' : 'Dark Mode einschalten';
    }

    function setEnabled(value, persist = true) {
        enabled = value;
        if (startupSheet) startupSheet.disabled = !enabled;
        if (persist) try { localStorage.setItem(KEY, enabled ? 'on' : 'off'); } catch (_) { /* Optional. */ }
        for (const state of roots.values()) {
            if (state.base) state.base.disabled = !enabled;
            if (state.patches) state.patches.disabled = !enabled;
            if (state.finish) state.finish.disabled = !enabled;
            if (state.guard) state.guard.disabled = true;
        }
        if (!enabled) {
            for (const el of pendingElements) el.removeAttribute(PENDING);
            pendingElements.clear();
        }
        updateButton();
        if (enabled) invalidateAll();
    }

    function mountButton() {
        if (window.top !== window.self || !document.body) return;
        if (document.getElementById(UI_ID)) return;
        const host = document.createElement('div');
        host.id = UI_ID;
        host.setAttribute('data-fbdm-version', '1.1.2');
        owned.add(host);
        host.style.cssText = 'all:initial!important;position:fixed!important;right:14px!important;bottom:14px!important;z-index:2147483647!important;display:block!important;';
        const ui = host.attachShadow({ mode: 'closed' });
        const style = document.createElement('style');
        style.textContent = `
            :host { color-scheme: dark; }
            button { box-sizing: border-box; font: 600 12px/1.3 system-ui,sans-serif;
                background:#24272c; color:#e4e7ec; border:1px solid #4a515d; border-radius:24px;
                padding:9px 13px; cursor:pointer; box-shadow:0 3px 14px #0005; }
            button:hover { background:#303640; }
            button:focus-visible { outline:2px solid #91bfff; outline-offset:3px; }
            @media print { :host { display:none!important; } }
        `;
        button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-label', 'FRITZ!Box Dark Mode');
        button.addEventListener('click', () => setEnabled(!enabled));
        ui.append(style, button);
        document.body.appendChild(host);
        updateButton();
    }

    register(document);
    document.addEventListener('DOMContentLoaded', mountButton, { once: true });
    window.addEventListener('resize', invalidateAll, { passive: true });
    window.addEventListener('storage', event => {
        if (event.key === KEY) setEnabled(event.newValue !== 'off', false);
    });
    mountButton();
    schedule();
})();
