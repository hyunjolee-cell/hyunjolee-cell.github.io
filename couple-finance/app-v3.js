(() => {
  'use strict';

  const cfg = window.__COUPLE_FINANCE_CONFIG__ || {};
  const cloudReady = /^https:\/\/.+\.supabase\.co$/.test(cfg.supabaseUrl || '') && String(cfg.supabasePublishableKey || '').length > 20 && window.supabase?.createClient;
  const db = cloudReady ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabasePublishableKey, { auth: { persistSession: false } }) : null;
  const DEVICE_KEY = 'cf-v3-device';
  const SPACE_KEY = 'cf-v3-space';
  const CACHE_PREFIX = 'cf-v3-cache-';
  const ACTORS = ['현조', '신영'];
  const pad = n => String(n).padStart(2, '0');
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
  const clone = v => JSON.parse(JSON.stringify(v));
  const uid = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const num = v => Number(String(v ?? '').replace(/,/g, '')) || 0;
  const won = v => `${Math.round(num(v)).toLocaleString('ko-KR')}원`;
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const monthLabel = m => { const [y, n] = String(m).split('-'); return `${y}년 ${Number(n)}월`; };
  const shiftMonth = (m, d) => { const [y, n] = m.split('-').map(Number); const x = new Date(y, n - 1 + d, 1); return `${x.getFullYear()}-${pad(x.getMonth() + 1)}`; };
  const randomText = len => Array.from(crypto.getRandomValues(new Uint8Array(len))).map(v => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[v % 32]).join('');
  const fmtTime = iso => new Intl.DateTimeFormat('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

  async function sha256(text) {
    const bytes = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function historyValue(history, month) {
    return [...(history || [])].filter(x => x.from <= month).sort((a, b) => a.from.localeCompare(b.from)).at(-1)?.amount || 0;
  }

  function setHistory(history, from, amount) {
    const row = history.find(x => x.from === from);
    if (row) row.amount = num(amount); else history.push({ from, amount: num(amount) });
    history.sort((a, b) => a.from.localeCompare(b.from));
  }

  function baseState() {
    const h = (amount, from = '2026-01') => [{ from, amount }];
    return {
      schemaVersion: 3,
      profile: { partnerA: '현조', partnerB: '신영' },
      recurringIncomes: [
        { id: uid(), name: '현조 월급', owner: '현조', history: h(5000000) },
        { id: uid(), name: '신영 월급', owner: '신영', history: h(2830000) },
        { id: uid(), name: '기타 정기소득', owner: '공동', history: h(130000) }
      ],
      fixedCosts: [
        { id: uid(), name: '월세·주거비', owner: '공동', history: h(533100) },
        { id: uid(), name: '현조 생활비', owner: '현조', history: h(1400000) },
        { id: uid(), name: '신영 생활비', owner: '신영', history: h(877255) },
        { id: uid(), name: '공동 생활비', owner: '공동', history: h(750000) }
      ],
      utilities: [
        { id: uid(), name: '관리비', estimateHistory: h(48000) },
        { id: uid(), name: '도시가스', estimateHistory: h(31030) },
        { id: uid(), name: '전기세', estimateHistory: h(74263) },
        { id: uid(), name: '수도세', estimateHistory: h(12480) }
      ],
      savings: [
        { id: uid(), name: '청년적금', owner: '공동', history: h(1000000) },
        { id: uid(), name: '주택청약', owner: '공동', history: h(200000) },
        { id: uid(), name: '비대면적금', owner: '공동', history: h(2060000) },
        { id: uid(), name: '여행적금', owner: '공동', history: h(100000) }
      ],
      assets: [
        { id: uid(), name: '기존 적금·예금', kind: 'asset', category: '예금', amount: 0 },
        { id: uid(), name: '현금성 자산', kind: 'asset', category: '현금', amount: 0 },
        { id: uid(), name: '투자자산', kind: 'asset', category: '투자', amount: 0 },
        { id: uid(), name: '부채', kind: 'debt', category: '부채', amount: 0 }
      ],
      forecastScenarios: [
        { id: uid(), name: '6개월 계획', startMonth: currentMonth, months: 6, annualReturn: 3, monthlyAdjustment: 0 },
        { id: uid(), name: '1년 계획', startMonth: currentMonth, months: 12, annualReturn: 3, monthlyAdjustment: 0 }
      ],
      goals: [
        { id: uid(), name: '1억 만들기', target: 100000000 },
        { id: uid(), name: '집 마련 종잣돈', target: 150000000 }
      ],
      monthly: {}
    };
  }

  function migrate(raw) {
    const s = raw && typeof raw === 'object' ? clone(raw) : baseState();
    const d = baseState();
    s.schemaVersion = 3;
    s.profile ||= d.profile;
    for (const key of ['recurringIncomes', 'fixedCosts', 'utilities', 'savings', 'assets', 'forecastScenarios', 'goals']) s[key] ||= d[key];
    s.monthly ||= {};
    s.recurringIncomes.forEach(x => { x.id ||= uid(); x.owner ||= '공동'; x.history ||= [{ from: currentMonth, amount: 0 }]; });
    s.fixedCosts.forEach(x => { x.id ||= uid(); x.owner ||= '공동'; x.history ||= [{ from: currentMonth, amount: 0 }]; });
    s.utilities.forEach(x => { x.id ||= uid(); x.estimateHistory ||= [{ from: currentMonth, amount: num(x.estimate) }]; delete x.estimate; });
    s.savings.forEach(x => { x.id ||= uid(); x.owner ||= '공동'; x.history ||= [{ from: currentMonth, amount: 0 }]; });
    s.assets.forEach(x => { x.id ||= uid(); x.kind ||= 'asset'; x.category ||= '기타'; x.amount = num(x.amount); });
    s.forecastScenarios.forEach(x => { x.id ||= uid(); x.startMonth ||= currentMonth; x.months = Math.max(1, num(x.months) || 12); x.annualReturn = num(x.annualReturn); x.monthlyAdjustment = num(x.monthlyAdjustment); });
    s.goals.forEach(x => { x.id ||= uid(); x.target = num(x.target); });
    Object.values(s.monthly).forEach(m => { m.utilityActuals ||= {}; m.bonuses ||= []; m.transactions ||= []; });
    return s;
  }

  const app = {
    device: JSON.parse(localStorage.getItem(DEVICE_KEY) || 'null'),
    space: JSON.parse(localStorage.getItem(SPACE_KEY) || 'null'),
    state: baseState(),
    version: 0,
    tab: 'home',
    month: currentMonth,
    sync: '연결 준비',
    logs: [],
    busy: false,
    pollTimer: null
  };

  function monthly(month = app.month) {
    app.state.monthly[month] ||= { utilityActuals: {}, bonuses: [], transactions: [] };
    const m = app.state.monthly[month];
    m.utilityActuals ||= {}; m.bonuses ||= []; m.transactions ||= [];
    return m;
  }

  function totalByHistory(list, month) { return list.reduce((sum, x) => sum + historyValue(x.history, month), 0); }
  function incomeTotal(month) { return totalByHistory(app.state.recurringIncomes, month) + monthly(month).bonuses.reduce((s, x) => s + num(x.amount), 0); }
  function fixedTotal(month) { return totalByHistory(app.state.fixedCosts, month); }
  function savingTotal(month) { return totalByHistory(app.state.savings, month); }
  function utilityTotal(month) { const a = monthly(month).utilityActuals; return app.state.utilities.reduce((s, x) => s + num(a[x.id] ?? historyValue(x.estimateHistory, month)), 0); }
  function spendTotal(month) { return monthly(month).transactions.reduce((s, x) => s + num(x.amount), 0); }
  function netAssets() { return app.state.assets.reduce((s, x) => s + (x.kind === 'debt' ? -num(x.amount) : num(x.amount)), 0); }
  function summary(month = app.month) {
    const income = incomeTotal(month), saving = savingTotal(month), fixed = fixedTotal(month), utility = utilityTotal(month), spend = spendTotal(month);
    return { income, saving, fixed, utility, spend, remaining: income - saving - fixed - utility - spend };
  }
  function forecast(sc) {
    const start = sc.startMonth || app.month;
    const rate = num(sc.annualReturn) / 100 / 12;
    let value = netAssets(), contributions = 0;
    for (let i = 0; i < Math.max(1, num(sc.months)); i++) {
      const add = savingTotal(shiftMonth(start, i)) + num(sc.monthlyAdjustment);
      value = value * (1 + rate) + add;
      contributions += add;
    }
    return { future: value, contributions, returns: value - netAssets() - contributions };
  }

  async function readRemote(show = false) {
    if (!app.space || !db) return;
    const secretHash = await sha256(app.space.secret);
    const { data, error } = await db.rpc('cf_read_space', { p_space_code: app.space.code, p_secret_hash: secretHash });
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) throw new Error('공유코드 또는 연결키가 올바르지 않습니다.');
    if (num(row.version) > app.version || show) {
      app.state = migrate(row.state);
      app.version = num(row.version);
      localStorage.setItem(`${CACHE_PREFIX}${app.space.code}`, JSON.stringify(app.state));
      app.sync = row.updated_by && row.updated_by !== app.device.actor ? `${row.updated_by} 변경 반영` : '자동 동기화';
      render();
    }
  }

  async function loadLogs() {
    if (!app.space || !db) return;
    const { data, error } = await db.rpc('cf_read_logs', { p_space_code: app.space.code, p_secret_hash: await sha256(app.space.secret), p_limit: 200 });
    if (error) throw error;
    app.logs = data || [];
    if (app.tab === 'logs') render();
  }

  async function mutate(mutator, meta) {
    if (app.busy) return;
    app.busy = true;
    const beforeState = clone(app.state);
    const before = meta.pick ? meta.pick(beforeState) : null;
    mutator(app.state);
    app.state = migrate(app.state);
    let after = meta.pick ? meta.pick(app.state) : null;
    app.sync = '저장 중'; render();
    try {
      if (!app.space || !db) throw new Error('공유공간이 연결되지 않았습니다.');
      const args = {
        p_space_code: app.space.code,
        p_secret_hash: await sha256(app.space.secret),
        p_expected_version: app.version,
        p_state: app.state,
        p_actor: app.device.actor,
        p_device_id: app.device.id,
        p_action: meta.action,
        p_entity_type: meta.type,
        p_entity_id: meta.id || null,
        p_summary: meta.summary,
        p_before_data: before,
        p_after_data: after
      };
      let { data, error } = await db.rpc('cf_write_space', args);
      if (error) throw error;
      let row = Array.isArray(data) ? data[0] : data;
      if (row?.conflict) {
        await readRemote(true);
        const freshBefore = clone(app.state);
        mutator(app.state);
        app.state = migrate(app.state);
        args.p_expected_version = app.version;
        args.p_state = app.state;
        args.p_before_data = meta.pick ? meta.pick(freshBefore) : before;
        args.p_after_data = meta.pick ? meta.pick(app.state) : after;
        ({ data, error } = await db.rpc('cf_write_space', args));
        if (error) throw error;
        row = Array.isArray(data) ? data[0] : data;
        if (row?.conflict) throw new Error('동시에 수정된 항목입니다. 다시 시도해주세요.');
      }
      app.version = num(row.version);
      localStorage.setItem(`${CACHE_PREFIX}${app.space.code}`, JSON.stringify(app.state));
      app.sync = '자동 동기화';
      toast(meta.success || '저장했습니다.');
      if (app.tab === 'logs') await loadLogs();
    } catch (e) {
      app.state = beforeState;
      app.sync = '저장 실패';
      toast(e.message || '저장하지 못했습니다.');
    } finally {
      app.busy = false;
      render();
    }
  }

  function toast(message) {
    let n = document.querySelector('#toast');
    if (!n) return;
    n.textContent = message; n.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(() => n.classList.remove('show'), 2300);
  }

  function monthControl() {
    return `<div class="month"><button data-shift="-1">‹</button><input id="monthPicker" type="month" value="${app.month}"><button data-shift="1">›</button></div>`;
  }

  function deviceView() {
    return `<main class="center"><section class="center-card"><div class="brand">₩</div><h1>이 휴대폰 사용자 등록</h1><p class="muted">로그인은 하지 않습니다. 이 휴대폰에서 발생한 모든 추가·수정·삭제 기록에 선택한 이름과 기기 ID가 남습니다.</p><div class="choice-grid">${ACTORS.map(x => `<button class="choice" data-register-actor="${x}">${x}</button>`).join('')}</div></section></main>`;
  }

  function spaceView(error = '') {
    return `<main class="center"><section class="center-card"><div class="brand">⌂</div><h1>부부 공유공간 연결</h1><p class="muted">첫 휴대폰은 공유공간을 만들고, 두 번째 휴대폰은 생성된 연결코드를 한 번만 입력합니다. 이후 자동 동기화됩니다.</p>${error ? `<p class="danger-text">${esc(error)}</p>` : ''}<div class="grid two"><form id="createSpaceForm" class="card stack"><h3>새 공유공간 만들기</h3><button class="primary">공유공간 생성</button></form><form id="joinSpaceForm" class="card stack"><h3>기존 공간 참여</h3><label class="field">연결코드<input name="token" placeholder="예: ABC123.XYZ..." required></label><button class="secondary">연결하기</button></form></div><p class="muted">DB 초기 설정 오류가 나오면 Supabase SQL Editor에서 <b>schema-v3.sql</b>을 한 번 실행해야 합니다.</p></section></main>`;
  }

  function homeView() {
    const s = summary();
    return `<section class="page"><div class="page-head"><div><span class="eyebrow">HOME</span><h2>${monthLabel(app.month)}</h2></div>${monthControl()}</div><div class="hero"><div><small>이번 달 남는 금액</small><strong>${won(s.remaining)}</strong><small>수입에서 저축·고정비·공과금·사용액 차감</small></div><div><small>현재 순자산</small><strong>${won(netAssets())}</strong><small>등록 자산 - 부채</small></div></div><div class="grid three" style="margin-top:16px"><article class="card metric"><small>총수입</small><strong>${won(s.income)}</strong><small>보너스·상여 포함</small></article><article class="card metric"><small>저축</small><strong>${won(s.saving)}</strong><small>설정된 적금 합계</small></article><article class="card metric"><small>총지출</small><strong>${won(s.fixed+s.utility+s.spend)}</strong><small>고정비·공과금·사용내역</small></article></div><div class="grid two" style="margin-top:16px"><article class="card"><div class="card-head"><h3>돈의 흐름</h3></div><div class="summary-list"><div><span>정기수입+보너스</span><b>${won(s.income)}</b></div><div><span>적금·저축</span><b>${won(s.saving)}</b></div><div><span>월 고정비</span><b>${won(s.fixed)}</b></div><div><span>공과금</span><b>${won(s.utility)}</b></div><div><span>생활비 사용</span><b>${won(s.spend)}</b></div></div></article><article class="card"><div class="card-head"><h3>공유 상태</h3><span class="badge">${esc(app.device.actor)}</span></div><div class="summary-list"><div><span>동기화</span><b class="${app.sync.includes('실패') ? 'sync-warn' : 'sync-ok'}">${esc(app.sync)}</b></div><div><span>공유공간</span><b>${esc(app.space.code)}</b></div><div><span>기기 ID</span><b>${esc(app.device.id.slice(0,8))}</b></div></div></article></div></section>`;
  }

  function bonusRows() {
    const list = monthly().bonuses;
    return list.length ? list.map(x => `<form class="item" data-row="bonus" data-id="${x.id}"><label class="field">항목<input name="name" value="${esc(x.name)}"></label><label class="field">사용자<select name="owner">${['현조','신영','공동'].map(o => `<option ${x.owner===o?'selected':''}>${o}</option>`).join('')}</select></label><label class="field">일자<input name="date" type="date" value="${esc(x.date||`${app.month}-01`)}"></label><label class="field">금액<input name="amount" inputmode="numeric" value="${num(x.amount)}"></label><div class="item-actions"><button class="secondary">수정</button><button type="button" class="danger" data-delete="bonus" data-id="${x.id}">삭제</button></div></form>`).join('') : '<div class="empty">등록된 보너스·상여금이 없습니다.</div>';
  }

  function transactionRows() {
    const list = monthly().transactions;
    return list.length ? [...list].sort((a,b)=>String(b.date).localeCompare(String(a.date))).map(x => `<form class="item" data-row="transaction" data-id="${x.id}"><label class="field">분류<input name="category" value="${esc(x.category)}"></label><label class="field">사용자<select name="owner">${['현조','신영','공동'].map(o => `<option ${x.owner===o?'selected':''}>${o}</option>`).join('')}</select></label><label class="field">일자<input name="date" type="date" value="${esc(x.date)}"></label><label class="field">금액<input name="amount" inputmode="numeric" value="${num(x.amount)}"></label><div class="item-actions"><button class="secondary">수정</button><button type="button" class="danger" data-delete="transaction" data-id="${x.id}">삭제</button></div><label class="field grow" style="grid-column:1/-1">메모<input name="memo" value="${esc(x.memo||'')}"></label></form>`).join('') : '<div class="empty">등록된 사용내역이 없습니다.</div>';
  }

  function monthlyView() {
    return `<section class="page"><div class="page-head"><div><span class="eyebrow">MONTHLY</span><h2>월별 변동 입력</h2></div>${monthControl()}</div><div class="grid two"><article class="card"><div class="card-head"><h3>보너스·상여금</h3><button class="secondary" data-add="bonus">추가</button></div><div class="list">${bonusRows()}</div></article><article class="card"><div class="card-head"><h3>공과금 실제 금액</h3><span>${monthLabel(app.month)}</span></div><div class="list">${app.state.utilities.map(x => `<form class="item compact" data-row="utility-actual" data-id="${x.id}"><label class="field">항목<input value="${esc(x.name)}" disabled></label><label class="field">금액<input name="amount" inputmode="numeric" value="${monthly().utilityActuals[x.id] ?? ''}" placeholder="예상 ${historyValue(x.estimateHistory,app.month)}"></label><div class="item-actions"><button class="secondary">저장</button><button type="button" class="ghost" data-clear-utility="${x.id}">초기화</button></div></form>`).join('')}</div></article></div><article class="card" style="margin-top:16px"><div class="card-head"><h3>생활비 사용내역</h3><button class="secondary" data-add="transaction">추가</button></div><div class="list">${transactionRows()}</div></article></section>`;
  }

  function editableRows(kind, list) {
    const owner = ['income','fixed','saving'].includes(kind);
    const history = ['income','fixed','saving','utility'].includes(kind);
    return list.length ? list.map(x => `<form class="item" data-row="${kind}" data-id="${x.id}"><label class="field">항목명<input name="name" value="${esc(x.name)}"></label>${owner?`<label class="field">사용자<select name="owner">${['현조','신영','공동'].map(o=>`<option ${x.owner===o?'selected':''}>${o}</option>`).join('')}</select></label>`:''}${kind==='asset'?`<label class="field">구분<select name="kind"><option value="asset" ${x.kind==='asset'?'selected':''}>자산</option><option value="debt" ${x.kind==='debt'?'selected':''}>부채</option></select></label><label class="field">분류<input name="category" value="${esc(x.category)}"></label>`:`<label class="field">적용 시작월<input name="from" type="month" value="${app.month}"></label>`}<label class="field">금액<input name="amount" inputmode="numeric" value="${kind==='asset'?num(x.amount):historyValue(kind==='utility'?x.estimateHistory:x.history,app.month)}"></label><div class="item-actions"><button class="secondary">수정</button><button type="button" class="danger" data-delete="${kind}" data-id="${x.id}">삭제</button></div></form>`).join('') : '<div class="empty">등록된 항목이 없습니다.</div>';
  }

  function settingsView() {
    const cards = [
      ['income','정기수입',app.state.recurringIncomes],['fixed','월 고정비',app.state.fixedCosts],['saving','적금·저축',app.state.savings],['utility','공과금 항목·예상값',app.state.utilities],['asset','현재 보유 자산·부채',app.state.assets]
    ];
    return `<section class="page"><div class="page-head"><div><span class="eyebrow">SETTINGS</span><h2>항목 설정</h2></div>${monthControl()}</div>${cards.map(([k,t,l])=>`<article class="card" style="margin-bottom:16px"><div class="card-head"><h3>${t}</h3><button class="secondary" data-add="${k}">항목 추가</button></div><div class="list">${editableRows(k,l)}</div></article>`).join('')}<article class="card"><div class="card-head"><h3>기기·공유 설정</h3></div><div class="grid two"><div><p class="muted">이 휴대폰 사용자</p><div class="choice-grid">${ACTORS.map(x=>`<button class="choice ${app.device.actor===x?'active':''}" data-change-actor="${x}">${x}</button>`).join('')}</div></div><div><p class="muted">배우자 휴대폰 연결코드</p><div class="share-box">${esc(`${app.space.code}.${app.space.secret}`)}</div><div class="row" style="margin-top:10px"><button class="secondary" data-copy-token>연결코드 복사</button><button class="danger" data-disconnect>이 기기 연결 해제</button></div></div></div></article></section>`;
  }

  function scenarioRows() {
    return app.state.forecastScenarios.length ? app.state.forecastScenarios.map(x => { const r=forecast(x); return `<form class="card forecast-card" data-row="scenario" data-id="${x.id}"><div class="row"><label class="field grow">시나리오명<input name="name" value="${esc(x.name)}"></label><button type="button" class="danger" data-delete="scenario" data-id="${x.id}">삭제</button></div><div class="grid two"><label class="field">시작월<input name="startMonth" type="month" value="${x.startMonth}"></label><label class="field">기간(개월)<input name="months" inputmode="numeric" value="${num(x.months)}"></label><label class="field">연 기대수익률(%)<input name="annualReturn" inputmode="decimal" value="${num(x.annualReturn)}"></label><label class="field">월 추가 납입·차감<input name="monthlyAdjustment" inputmode="numeric" value="${num(x.monthlyAdjustment)}"></label></div><strong>${won(r.future)}</strong><small>납입 ${won(r.contributions)} · 예상 수익 ${won(r.returns)}</small><button class="secondary">수정 저장</button></form>`; }).join('') : '<div class="empty">포캐스팅 시나리오가 없습니다.</div>';
  }

  function goalRows() {
    const net=netAssets();
    return app.state.goals.length ? app.state.goals.map(x=>{const pct=x.target?Math.min(100,Math.round(net/x.target*100)):0;return `<form class="item compact" data-row="goal" data-id="${x.id}"><label class="field">목표명<input name="name" value="${esc(x.name)}"></label><label class="field">목표 금액<input name="target" inputmode="numeric" value="${num(x.target)}"></label><div class="item-actions"><button class="secondary">수정</button><button type="button" class="danger" data-delete="goal" data-id="${x.id}">삭제</button></div><div style="grid-column:1/-1"><div class="goal-progress"><i style="width:${pct}%"></i></div><small>${pct}% 달성</small></div></form>`}).join(''):'<div class="empty">등록된 목표가 없습니다.</div>';
  }

  function forecastView() {
    return `<section class="page"><div class="page-head"><div><span class="eyebrow">FORECAST</span><h2>자산 포캐스팅</h2></div><div class="section-actions"><button class="secondary" data-add="scenario">시나리오 추가</button><button class="secondary" data-add="goal">목표 추가</button></div></div><div class="grid two">${scenarioRows()}</div><article class="card" style="margin-top:16px"><div class="card-head"><h3>자산 목표</h3></div><div class="list">${goalRows()}</div></article></section>`;
  }

  function logsView() {
    const actionText={create:'추가',update:'수정',delete:'삭제',connect:'접속',system:'시스템'};
    return `<section class="page"><div class="page-head"><div><span class="eyebrow">AUDIT LOG</span><h2>변경 이력</h2></div><button class="secondary" data-refresh-logs>새로고침</button></div><article class="card">${app.logs.length?app.logs.map(x=>`<div class="log"><div class="log-head"><div><span class="badge">${esc(x.actor)}</span> <b>${esc(actionText[x.action]||x.action)}</b></div><small>${fmtTime(x.created_at)} · ${esc(String(x.device_id||'').slice(0,8))}</small></div><p>${esc(x.summary)}</p></div>`).join(''):'<div class="empty">기록이 없습니다.</div>'}</article></section>`;
  }

  function appView() {
    const tabs=[['home','홈'],['monthly','월별'],['forecast','포캐스팅'],['settings','설정'],['logs','로그']];
    const content=app.tab==='home'?homeView():app.tab==='monthly'?monthlyView():app.tab==='forecast'?forecastView():app.tab==='settings'?settingsView():logsView();
    return `<div class="app"><header class="topbar"><div><b>우리집 자산흐름</b><small>${esc(app.sync)}</small></div><span class="actor">${esc(app.device.actor)}</span></header>${content}<nav class="bottom-nav">${tabs.map(([k,t])=>`<button data-tab="${k}" class="${app.tab===k?'active':''}">${t}</button>`).join('')}</nav><div id="toast" class="toast"></div></div>`;
  }

  function render() {
    const root=document.querySelector('#app');
    if (!app.device) root.innerHTML=deviceView();
    else if (!app.space) root.innerHTML=spaceView();
    else root.innerHTML=appView();
  }

  async function createSpace() {
    if (!db) throw new Error('Supabase 연결 설정이 없습니다.');
    const code=randomText(6), secret=randomText(14), secretHash=await sha256(secret), initial=baseState();
    const { error }=await db.rpc('cf_create_space',{p_space_code:code,p_secret_hash:secretHash,p_actor:app.device.actor,p_device_id:app.device.id,p_initial_state:initial});
    if (error) throw error;
    app.space={code,secret}; app.state=initial; app.version=1;
    localStorage.setItem(SPACE_KEY,JSON.stringify(app.space));
    localStorage.setItem(`${CACHE_PREFIX}${code}`,JSON.stringify(initial));
    app.sync='자동 동기화'; startPolling(); render(); toast('공유공간을 만들었습니다.');
  }

  async function joinSpace(token) {
    const [code,secret]=String(token).trim().toUpperCase().split('.');
    if (!code||!secret) throw new Error('연결코드 형식을 확인해주세요.');
    const hash=await sha256(secret);
    const { data,error }=await db.rpc('cf_connect_device',{p_space_code:code,p_secret_hash:hash,p_actor:app.device.actor,p_device_id:app.device.id});
    if(error)throw error;
    if(data!==true)throw new Error('연결코드가 올바르지 않습니다.');
    app.space={code,secret}; localStorage.setItem(SPACE_KEY,JSON.stringify(app.space));
    await readRemote(true); startPolling(); render(); toast('공유공간에 연결했습니다.');
  }

  function startPolling(){clearInterval(app.pollTimer);app.pollTimer=setInterval(()=>readRemote().catch(()=>{app.sync='동기화 재시도 중';render();}),4000);}

  function listFor(kind,state=app.state){return kind==='income'?state.recurringIncomes:kind==='fixed'?state.fixedCosts:kind==='saving'?state.savings:kind==='utility'?state.utilities:kind==='asset'?state.assets:kind==='scenario'?state.forecastScenarios:kind==='goal'?state.goals:null;}
  function findEntity(kind,id,state=app.state){if(kind==='bonus')return state.monthly[app.month]?.bonuses?.find(x=>x.id===id)||null;if(kind==='transaction')return state.monthly[app.month]?.transactions?.find(x=>x.id===id)||null;return listFor(kind,state)?.find(x=>x.id===id)||null;}

  document.addEventListener('click', async e => {
    const reg=e.target.closest('[data-register-actor]'); if(reg){app.device={actor:reg.dataset.registerActor,id:uid()};localStorage.setItem(DEVICE_KEY,JSON.stringify(app.device));render();return;}
    const tab=e.target.closest('[data-tab]'); if(tab){app.tab=tab.dataset.tab;if(app.tab==='logs')loadLogs().catch(x=>toast(x.message));render();return;}
    const shift=e.target.closest('[data-shift]'); if(shift){app.month=shiftMonth(app.month,num(shift.dataset.shift));render();return;}
    const add=e.target.closest('[data-add]'); if(add){const kind=add.dataset.add;const id=uid();await mutate(state=>{if(kind==='bonus'){state.monthly[app.month]||={utilityActuals:{},bonuses:[],transactions:[]};state.monthly[app.month].bonuses.push({id,name:'새 보너스',owner:app.device.actor,date:`${app.month}-01`,amount:0});}else if(kind==='transaction'){state.monthly[app.month]||={utilityActuals:{},bonuses:[],transactions:[]};state.monthly[app.month].transactions.push({id,date:`${app.month}-01`,owner:app.device.actor,category:'기타',memo:'',amount:0});}else{const list=listFor(kind,state);if(kind==='income'||kind==='fixed'||kind==='saving')list.push({id,name:'새 항목',owner:'공동',history:[{from:app.month,amount:0}]});if(kind==='utility')list.push({id,name:'새 공과금',estimateHistory:[{from:app.month,amount:0}]});if(kind==='asset')list.push({id,name:'새 자산',kind:'asset',category:'기타',amount:0});if(kind==='scenario')list.push({id,name:'새 시나리오',startMonth:app.month,months:12,annualReturn:3,monthlyAdjustment:0});if(kind==='goal')list.push({id,name:'새 목표',target:0});}}, {action:'create',type:kind,id,summary:`${kind} 항목 추가`,pick:s=>findEntity(kind,id,s),success:'항목을 추가했습니다.'});return;}
    const del=e.target.closest('[data-delete]'); if(del){const kind=del.dataset.delete,id=del.dataset.id;if(!confirm('이 항목을 삭제할까요?'))return;await mutate(state=>{if(kind==='bonus')state.monthly[app.month].bonuses=state.monthly[app.month].bonuses.filter(x=>x.id!==id);else if(kind==='transaction')state.monthly[app.month].transactions=state.monthly[app.month].transactions.filter(x=>x.id!==id);else{const key=kind==='income'?'recurringIncomes':kind==='fixed'?'fixedCosts':kind==='saving'?'savings':kind==='utility'?'utilities':kind==='asset'?'assets':kind==='scenario'?'forecastScenarios':'goals';state[key]=state[key].filter(x=>x.id!==id);}}, {action:'delete',type:kind,id,summary:`${kind} 항목 삭제`,pick:s=>findEntity(kind,id,s),success:'항목을 삭제했습니다.'});return;}
    const clear=e.target.closest('[data-clear-utility]'); if(clear){const id=clear.dataset.clearUtility;await mutate(state=>{state.monthly[app.month].utilityActuals ||= {};delete state.monthly[app.month].utilityActuals[id];},{action:'delete',type:'utilityActual',id,summary:`${app.month} 공과금 실제값 초기화`,pick:s=>s.monthly[app.month]?.utilityActuals?.[id]??null,success:'실제 금액을 초기화했습니다.'});return;}
    const actor=e.target.closest('[data-change-actor]'); if(actor){app.device.actor=actor.dataset.changeActor;localStorage.setItem(DEVICE_KEY,JSON.stringify(app.device));render();toast('이 기기 사용자를 변경했습니다.');return;}
    if(e.target.closest('[data-copy-token]')){await navigator.clipboard.writeText(`${app.space.code}.${app.space.secret}`);toast('연결코드를 복사했습니다.');return;}
    if(e.target.closest('[data-disconnect]')){if(confirm('이 휴대폰의 공유 연결을 해제할까요? 데이터는 서버에 남습니다.')){localStorage.removeItem(SPACE_KEY);app.space=null;clearInterval(app.pollTimer);render();}return;}
    if(e.target.closest('[data-refresh-logs]')){loadLogs().catch(x=>toast(x.message));return;}
  });

  document.addEventListener('change',e=>{if(e.target.id==='monthPicker'){app.month=e.target.value||currentMonth;render();}});

  document.addEventListener('submit', async e => {
    e.preventDefault(); const f=e.target, data=new FormData(f);
    try{
      if(f.id==='createSpaceForm'){await createSpace();return;}
      if(f.id==='joinSpaceForm'){await joinSpace(data.get('token'));return;}
      const kind=f.dataset.row,id=f.dataset.id;if(!kind)return;
      if(kind==='utility-actual'){const amount=data.get('amount');await mutate(state=>{state.monthly[app.month]||={utilityActuals:{},bonuses:[],transactions:[]};state.monthly[app.month].utilityActuals[id]=num(amount);},{action:'update',type:'utilityActual',id,summary:`${app.month} 공과금 실제값 수정`,pick:s=>s.monthly[app.month]?.utilityActuals?.[id]??null,success:'공과금을 저장했습니다.'});return;}
      await mutate(state=>{const x=findEntity(kind,id,state);if(!x)return;if(kind==='bonus'){x.name=String(data.get('name')).trim();x.owner=data.get('owner');x.date=data.get('date');x.amount=num(data.get('amount'));}else if(kind==='transaction'){x.category=String(data.get('category')).trim();x.owner=data.get('owner');x.date=data.get('date');x.memo=String(data.get('memo')||'').trim();x.amount=num(data.get('amount'));}else if(kind==='asset'){x.name=String(data.get('name')).trim();x.kind=data.get('kind');x.category=String(data.get('category')).trim();x.amount=num(data.get('amount'));}else if(kind==='scenario'){x.name=String(data.get('name')).trim();x.startMonth=data.get('startMonth');x.months=Math.max(1,num(data.get('months')));x.annualReturn=num(data.get('annualReturn'));x.monthlyAdjustment=num(data.get('monthlyAdjustment'));}else if(kind==='goal'){x.name=String(data.get('name')).trim();x.target=num(data.get('target'));}else{x.name=String(data.get('name')).trim();if(data.has('owner'))x.owner=data.get('owner');const history=kind==='utility'?x.estimateHistory:x.history;setHistory(history,data.get('from')||app.month,data.get('amount'));}}, {action:'update',type:kind,id,summary:`${kind} 항목 수정`,pick:s=>findEntity(kind,id,s),success:'수정했습니다.'});
    }catch(err){toast(err.message||'처리하지 못했습니다.');}
  });

  async function boot(){
    render(); if(!app.device||!app.space)return;
    try{const cached=localStorage.getItem(`${CACHE_PREFIX}${app.space.code}`);if(cached)app.state=migrate(JSON.parse(cached));await readRemote(true);startPolling();app.sync='자동 동기화';render();}catch(e){console.error(e);app.sync='연결 오류';document.querySelector('#app').innerHTML=spaceView(`${e.message} · Supabase SQL Editor에서 schema-v3.sql을 실행했는지 확인하세요.`);}
  }
  boot();
})();
