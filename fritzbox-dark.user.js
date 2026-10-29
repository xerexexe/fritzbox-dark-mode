// ==UserScript==
// @name         FRITZ!Box Dark Mode – Shadow DOM
// @namespace    local.fritzbox.darkmode
// @version      1.0.0
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
    let timer = 0;
    let serial = 0;
    let button;
    const roots = new Map();
    const ids = new WeakMap();
    const owned = new WeakSet();
    const pendingElements = new Set();

    const baseCSS = `
        :root, :host {
            color-scheme: dark !important;
            --white-100: #fff !important;
            --charcoal-gray-100: #dce5ef !important;
            --charcoal-gray-73: rgba(205,218,231,.78) !important;
            --charcoal-gray-45: rgba(180,199,219,.48) !important;
            --charcoal-gray-30: rgba(180,199,219,.38) !important;
            --charcoal-gray-20: rgba(180,199,219,.2) !important;
            --charcoal-gray-8: rgba(180,199,219,.08) !important;
            --charcoal-gray-5: rgba(180,199,219,.05) !important;
            --charcoal-gray-3: rgba(180,199,219,.03) !important;
            --charcoal-gray-tints-3-tint: #18212b !important;
            --charcoal-gray-tints-5-tint: #1b2632 !important;
            --charcoal-gray-tints-8-tint: #202d3c !important;
            --charcoal-gray-tints-20-tint: #304154 !important;
            --charcoal-gray-tints-30-tint: #3c5065 !important;
            --charcoal-gray-tints-45-tint: #566c83 !important;
            --charcoal-gray-tints-73-tint: #a9b9ca !important;
            --rice-gray-100: #111720 !important;
            --blue-tints-10-tint: #1d3044 !important;
            --blue-tints-20-tint: #28435d !important;
            --blue-tints-30-tint: #315471 !important;
            --blue-dark-tints-10-tint: #1c2b3d !important;
            --blue-dark-tints-20-tint: #253d54 !important;
            --interactive-base-default: #1b2632 !important;
            --interactive-base-checked: #253d54 !important;
            --interactive-base-disabled: #202833 !important;
            --color-text: #dce5ef !important;
            --color-text-bright: #f4f7fb !important;
            --color-bg-base: #111720 !important;
            --color-bg-surface: #1b2531 !important;
            --color-bg-subtle: #263343 !important;
            --color-text-base: #dce5ef !important;
            --color-text-subtle: #a6b5c6 !important;
            --color-border: #39495b !important;
        }
        html, body { background-color: #111720 !important; color: #dce5ef !important; }
        main#js3ContentBox, .js3-view, .js3-view__container {
            background-color:#151d27!important; color:#dce5ef!important;
        }
        :focus-visible { outline: 2px solid #85c7ff !important; outline-offset: 2px; }
        ::selection { background-color: #32618a !important; color: #fff !important; }
        input, select, textarea { color-scheme: dark !important; }
        input[type="checkbox"], input[type="radio"], progress { accent-color: #66b5ff; }
        input[type="checkbox"], input[type="radio"] {
            appearance:auto!important; background-image:none!important; background-color:transparent!important;
        }
        input::placeholder, textarea::placeholder { color: #99a8ba !important; opacity: 1; }
        a[href]:not([role="button"]) { color: #8ccaff; }
    `;

    const finishCSS = `
        #blueBarBox { background-color:#182536!important;
            background-image:linear-gradient(110deg,#23364e,#141e2b)!important; border-color:#314257!important; }
        #navigationMenu, .menuArea { background-image:none!important; background-color:#151f2b!important; }
        #menuBox { border-color:#2d3d50!important; }
        .blueBarLnk { color:#e2edfa!important; border-color:#526a85!important; }
        .menu_item.show, .menu_item.with_sub.selected { color:#dce5ef!important; }
        .menu_item.show:hover { background-color:#223247!important; }
        .menu_item.selected:not(.with_sub) { background-color:#294866!important; color:#f3f8ff!important; }
        a:not([role="button"]):not(.js3-button__link) { color:#8ccaff!important; }
        .home-list { background-color:#192430!important; border:1px solid #304155!important;
            border-radius:8px; padding:12px; }
        .home-list__header { border-bottom:1px solid #344960!important; margin-bottom:8px; }
        .home-list__header::after { background-color:#344960!important; }
        .home-list__header-box { background-color:#263c53!important; color:#edf5ff!important; border-radius:4px 4px 0 0; }
        .home-list__header-box * { color:#edf5ff!important; }
        .home-list__body { background-color:transparent!important; }
        .home-list__table { border-color:transparent!important; }
        .home-list__table tr:hover { background-color:#223348!important; }
        .js3-tabs::after { background:#151f2b!important; border-color:#344960!important; }
        .js3-tabs__tab { background:#202e3f!important; color:#bdcfe2!important; }
        .js3-tabs__tab.js3-tabs__tab--active { background:#192b3f!important; color:#edf5ff!important; border-color:#344960!important; }
        .js3-tabs__scroll-button, .js3-button-group__scroll-button { background-color:#1d2c3f!important; color:#8ccaff!important; }
        .js3-page-header, .page-tabs, .page-tabs__tab--active { background-color:#18222f!important; border-color:#344960!important; }
        .js3-button:not(.js3-button--primary):not(.js3-button--back):not(.js3-button--critical):not(.js3-button--disabled) {
            --button-text-color:#8ccaff!important; }
        .secondary-button, .tertiary-button { color:#8ccaff!important; }
        input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="image"]),
        select, textarea { background-color:#172333!important; color:#edf5ff!important; border-color:#465c74!important; }
        input:disabled, textarea:disabled, select:disabled { color:#91a2b7!important; background-color:#202833!important; }
        input::placeholder, textarea::placeholder { color:#99a8ba!important; }
        .network-topology__ip-address, .network-topology__mesh-master { color:#afc1d5!important; }
        .js3-input__container { background-color:#172333!important; }
        .js3-input__small-label {
            background-image:none!important; background-color:#172333!important; color:#b3c7dd!important;
        }
        .wctbl .wctbl__footer::after {
            background:linear-gradient(transparent,rgba(21,29,39,.98) 10%)!important;
        }
        .heatNoData {
            background-image:repeating-linear-gradient(45deg,#263445,#263445 3px,#344558 0,#344558 6px)!important;
        }
        .page-blocks__block--chart canvas { filter:brightness(1.35); }
        [data-fbdm-pending], [data-fbdm-pending] * { visibility:hidden!important; }
    `;

    function isOurs(node) {
        return owned.has(node) || node.nodeType === 1 && node.id === UI_ID;
    }

    function schedule() {
        if (!enabled || timer) return;
        timer = window.setTimeout(() => { timer = 0; refresh(); }, 32);
    }

    function makeStyle(root, text) {
        const style = document.createElement('style');
        owned.add(style);
        style.textContent = text;
        (root === document ? document.head || document.documentElement : root)?.appendChild(style);
        style.disabled = !enabled;
        return style;
    }

    function register(root) {
        if (roots.has(root)) return;
        const state = { base: null, patches: null, finish: null, guard: null,
            observer: null, connected: false, ready: false };
        roots.set(root, state);
        state.observer = new MutationObserver(records => {
            // Noch im selben Microtask dunkle Basis und Ladeschutz herstellen,
            // bevor der Browser neu eingebaute Oberflächen zeichnen kann.
            ensureStyles(root, state);
            for (const record of records) {
                if (isOurs(record.target)) continue;
                for (const node of record.addedNodes) {
                    if (node.nodeType !== 1 || isOurs(node)) continue;
                    if (node.shadowRoot) register(node.shadowRoot);
                    discover(node);
                    if (enabled && state.ready && /^(DIV|SECTION|ARTICLE|TABLE|MAIN|DIALOG|JS3-VIEW)$/.test(node.tagName)) {
                        const rect = node.getBoundingClientRect();
                        if (rect.width >= 160 && rect.height >= 40) {
                            node.setAttribute(PENDING, '');
                            pendingElements.add(node);
                        }
                    }
                }
            }
            if (records.some(record => {
                if (isOurs(record.target)) return false;
                if (record.type === 'attributes') return true;
                return [...record.addedNodes, ...record.removedNodes].some(node => !isOurs(node));
            })) schedule();
        });
        state.observer.observe(root, {
            childList: true, subtree: true, attributes: true,
            attributeFilter: ['class', 'style', 'hidden', 'open', 'disabled', 'selected',
                'aria-expanded', 'aria-selected', 'aria-checked', 'aria-disabled', 'value'],
        });
        ensureStyles(root, state);
        root.addEventListener('load', schedule, true);
        window.setTimeout(schedule, 350);
        window.setTimeout(schedule, 1400);
        schedule();
    }

    function ensureStyles(root, state) {
        if (root === document && !document.documentElement) return;
        const replaced = !state.base || state.base.getRootNode() !== root;
        if (replaced) state.ready = false;
        if (!state.base || state.base.getRootNode() !== root) state.base = makeStyle(root, baseCSS);
        if (!state.patches || state.patches.getRootNode() !== root) state.patches = makeStyle(root, '');
        if (!state.finish || state.finish.getRootNode() !== root) state.finish = makeStyle(root, finishCSS);
        if (!state.guard || state.guard.getRootNode() !== root) {
            state.guard = makeStyle(root, root === document
                ? 'body{visibility:hidden!important}' : ':host,:host *{visibility:hidden!important}');
        }
        state.guard.disabled = !enabled || state.ready;
    }

    // Den ursprünglichen Aufruf unverändert weiterreichen. Auch geschlossene,
    // NACH Script-Start erzeugte Roots können so gestaltet werden.
    const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'attachShadow');
    if (descriptor && typeof descriptor.value === 'function') {
        const original = descriptor.value;
        try {
            Object.defineProperty(Element.prototype, 'attachShadow', {
                ...descriptor,
                value: function (...args) {
                    const root = Reflect.apply(original, this, args);
                    if (this.id !== UI_ID) {
                        // Erst nach der Initialisierung der Komponente Styles einsetzen.
                        queueMicrotask(() => register(root));
                    }
                    return root;
                },
            });
        } catch (_) { /* Bereits vorhandene offene Roots werden trotzdem gefunden. */ }
    }

    function discover(root) {
        for (const el of root.querySelectorAll('*')) {
            if (el.id !== UI_ID && el.shadowRoot && !roots.has(el.shadowRoot)) {
                register(el.shadowRoot);
                discover(el.shadowRoot);
            }
        }
    }

    function parseColor(value) {
        // getComputedStyle normalisiert normale CSS-Farben zu rgb()/rgba().
        const match = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/.exec(value);
        if (!match) return null;
        const [r, g, b] = match.slice(1, 4).map(Number);
        return { r, g, b, a: match[4] === undefined ? 1 : Number(match[4]),
            light: (r + g + b) / 3, chroma: Math.max(r, g, b) - Math.min(r, g, b) };
    }

    function neutral(color) { return color && color.a > 0.15 && color.chroma < 42; }
    function surface(color) {
        if (!neutral(color) || color.light < 105) return null;
        const hex = color.light > 242 ? '#151d27' : color.light > 205 ? '#1d2835' : '#2b394a';
        if (color.a > 0.98) return hex;
        const rgb = hex.slice(1).match(/../g).map(v => parseInt(v, 16));
        return `rgba(${rgb.join(',')},${color.a})`;
    }

    function refresh() {
        if (!enabled || !document.documentElement) return;
        discover(document);
        for (const [root, state] of roots) {
            if (root !== document) {
                if (root.host.isConnected) state.connected = true;
                else if (state.connected) {
                    state.observer.disconnect();
                    state.base?.remove();
                    state.patches?.remove();
                    state.finish?.remove();
                    state.guard?.remove();
                    root.removeEventListener('load', schedule, true);
                    roots.delete(root);
                    continue;
                }
                discover(root);
            }
            ensureStyles(root, state);
        }

        // Die dunklen Styles niemals zur Messung abschalten: neue Ansichten
        // dürfen auch während einer Layout-Aktualisierung nicht weiß werden.
        // Nur die eigene Farbmarkierung des jeweils gemessenen Elements lösen.
        const cache = new WeakMap();
        const backgroundCache = new WeakMap();
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
            if (backgroundCache.has(el)) return backgroundCache.get(el);
            const data = snapshot(el);
            const parent = el.parentElement || el.getRootNode().host;
            const result = data.image !== 'none' || (data.bg && data.bg.a > 0.9
                ? data.bg.chroma >= 42 && data.bg.light > 100 : coloredSurface(parent));
            backgroundCache.set(el, result);
            return result;
        }
        try {
            const pending = [];
            for (const [root, state] of roots) {
                const rules = [];
                for (const el of root.querySelectorAll('*')) {
                    if (isOurs(el) || /^(SCRIPT|STYLE|LINK|META|HEAD|TEMPLATE|NOSCRIPT)$/.test(el.tagName)) continue;
                    const svgText = el.namespaceURI !== HTML_NS && el.localName === 'text';
                    // Keine Linien, Gerätebilder, Diagrammflächen oder Statussymbole umfärben.
                    if (el.namespaceURI !== HTML_NS && !svgText) continue;
                    const oldMark = el.getAttribute(MARK);
                    const wasPending = el.hasAttribute(PENDING);
                    if (oldMark !== null) {
                        el.setAttribute(PENDING, '');
                        el.removeAttribute(MARK);
                    }
                    cache.delete(el);
                    let props;
                    try {
                    const s = snapshot(el);
                    props = [];
                    const bg = surface(s.bg);
                    if (!svgText && bg && !/^(HTML|BODY)$/.test(el.tagName)) {
                        props.push(`background-color:${bg}!important`);
                    }
                    const preserveText = coloredSurface(el);
                    if (!preserveText && neutral(s.color) && s.color.light < 195) {
                        props.push(`color:${s.color.light < 100 ? '#dce5ef' : '#a6b5c6'}!important`);
                    }
                    if (svgText && neutral(s.fill) && s.fill.light < 195) props.push('fill:#b8c8d9!important');
                    if (!svgText) s.borders.forEach((color, i) => {
                        if (neutral(color) && color.light > 95) props.push(`border-${['top', 'right', 'bottom', 'left'][i]}-color:#39495b!important`);
                    });
                    } finally {
                        if (oldMark !== null) el.setAttribute(MARK, oldMark);
                        if (!wasPending) el.removeAttribute(PENDING);
                    }
                    if (!props.length) continue;
                    if (!ids.has(el)) ids.set(el, String(++serial));
                    const id = ids.get(el);
                    if (el.getAttribute(MARK) !== id) el.setAttribute(MARK, id);
                    rules.push(`[${MARK}="${id}"]{${props.join(';')}}`);
                }
                const css = rules.join('\n');
                pending.push([state, css]);
            }
            for (const [state, css] of pending) {
                if (state.patches.textContent !== css) {
                    // Erst die neue Regelmenge hinzufügen, dann die alte entfernen.
                    // So gibt es auch beim Austausch keinen ungestalteten Zwischenstand.
                    const replacement = document.createElement('style');
                    owned.add(replacement);
                    replacement.textContent = css;
                    state.patches.before(replacement);
                    state.patches.remove();
                    state.patches = replacement;
                }
            }
        } finally {
            for (const state of roots.values()) {
                if (state.base) state.base.disabled = !enabled;
                if (state.patches) state.patches.disabled = !enabled;
                if (state.finish) state.finish.disabled = !enabled;
                state.ready = true;
                if (state.guard) state.guard.disabled = true;
            }
            for (const el of pendingElements) el.removeAttribute(PENDING);
            pendingElements.clear();
        }
        mountButton();
    }

    function updateButton() {
        if (!button) return;
        button.textContent = enabled ? '☾ Dunkel' : '☀ Hell';
        button.setAttribute('aria-pressed', String(enabled));
        button.title = enabled ? 'Dark Mode ausschalten' : 'Dark Mode einschalten';
    }

    function setEnabled(value, persist = true) {
        enabled = value;
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
        if (enabled) refresh();
    }

    function mountButton() {
        if (window.top !== window.self || !document.body) return;
        if (document.getElementById(UI_ID)) return;
        const host = document.createElement('div');
        host.id = UI_ID;
        owned.add(host);
        host.style.cssText = 'all:initial!important;position:fixed!important;right:14px!important;bottom:14px!important;z-index:2147483647!important;display:block!important;';
        const ui = host.attachShadow({ mode: 'closed' });
        const style = document.createElement('style');
        style.textContent = `
            :host { color-scheme: dark; }
            button { box-sizing: border-box; font: 600 12px/1.3 system-ui,sans-serif;
                background:#1c2938; color:#e5efff; border:1px solid #51657c; border-radius:24px;
                padding:9px 13px; cursor:pointer; box-shadow:0 3px 14px #0005; }
            button:hover { background:#2b4058; }
            button:focus-visible { outline:2px solid #8ccaff; outline-offset:3px; }
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
    document.addEventListener('DOMContentLoaded', () => { mountButton(); schedule(); }, { once: true });
    window.addEventListener('load', schedule, true);
    window.addEventListener('resize', schedule, { passive: true });
    document.addEventListener('click', schedule, true);
    document.addEventListener('input', schedule, true);
    document.addEventListener('change', schedule, true);
    document.addEventListener('pointerover', schedule, true);
    document.addEventListener('pointerout', schedule, true);
    window.addEventListener('storage', event => {
        if (event.key === KEY) setEnabled(event.newValue !== 'off', false);
    });
    mountButton();
    schedule();
})();
