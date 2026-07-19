(() => {
  'use strict';

  const config = window.__COUPLE_FINANCE_CONFIG__ || {};
  const cloudEnabled = /^https:\/\/.+\.supabase\.co$/.test(config.supabaseUrl || '')
    && String(config.supabasePublishableKey || '').length > 20
    && window.supabase?.createClient;
  const db = cloudEnabled
    ? window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      })
    : null;

  const LOCAL_KEY = 'couple-finance-v4';
  const pad = value => String(value).padStart(2, '0');
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${pad(today.getMonth() + 1)}`;
  const clone = value => JSON.parse(JSON.stringify(value));
  const uid = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const num = value => Number(String(value ?? '').replace(/,/g, '')) || 0;
  const won = value => `${Math.round(num(value)).toLocaleString('ko-KR')}원`;
  const shortWon = value => {
    const amount = num(value);
    if (Math.abs(amount) >= 100000000) return `${(amount / 100000000).toFixed(1).replace('.0', '')}억`;
    if (Math.abs(amount) >= 10000) return `${Math.round(amount / 10000).toLocaleString('ko-KR')}만`;
    return Math.round(amount).toLocaleString('ko-KR');
  };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const monthLabel = month => {
    const [year, mon] = month.split('-');
    return `${year}년 ${Number(mon)}월`;
  };
  const shiftMonth = (month, delta) => {
    const [year, mon] = month.split('-').map(Number);
    const date = new Date(year, mon - 1 + delta, 1);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
  };

  function defaultState(effective = '2026-01') {
    return {
      schemaVersion: 4,
      profile: { partnerA: '현조', partnerB: '신영' },
      rules: {
        salaryA: [{ from: effective, amount: 5000000 }],
        salaryB: [{ from: effective, amount: 2830000 }],
        otherIncome: [{ from: effective, amount: 130000 }],
        budgetA: [{ from: effective, amount: 1400000 }],
        budgetB: [{ from: effective, amount: 877255 }],
        budgetJoint: [{ from: effective, amount: 750000 }],
        housing: [{ from: effective, amount: 533100 }]
      },
      savingBuckets: [
        { id: uid(), name: '청년적금', history: [{ from: effective, amount: 1000000 }] },
        { id: uid(), name: '주택청약', history: [{ from: effective, amount: 200000 }] },
        { id: uid(), name: '비대면적금', history: [{ from: effective, amount: 2060000 }] },
        { id: uid(), name: '여행적금', history: [{ from: effective, amount: 100000 }] },
        { id: uid(), name: '부모님적금', history: [{ from: effective, amount: 500000 }] },
        { id: uid(), name: '조카적금', history: [{ from: effective, amount: 30000 }] },
        { id: uid(), name: '비상금적금', history: [{ from: effective, amount: 120000 }] },
        { id: uid(), name: '옷적금', history: [{ from: effective, amount: 100000 }] }
      ],
      variableTemplates: [
        { id: uid(), name: '관리비', estimate: 48000 },
        { id: uid(), name: '도시가스', estimate: 31030 },
        { id: uid(), name: '전기세', estimate: 74263 },
        { id: uid(), name: '수도세', estimate: 12480 }
      ],
      monthly: {},
      assets: { savingAsset: 0, cashAsset: 0, investmentAsset: 0, debt: 0, annualReturn: 3 },
      goals: [
        { id: uid(), name: '1억 만들기', target: 100000000 },
        { id: uid(), name: '집 마련 종잣돈', target: 150000000 },
        { id: uid(), name: '비상자금', target: 20000000 }
      ]
    };
  }

  function migrate(raw) {
    const fallback = defaultState();
    const state = raw && typeof raw === 'object' ? clone(raw) : fallback;
    state.schemaVersion = 4;
    state.profile ||= fallback.profile;
    state.rules ||= fallback.rules;
    for (const [key, history] of Object.entries(fallback.rules)) state.rules[key] ||= history;
    state.savingBuckets ||= fallback.savingBuckets;
    state.variableTemplates ||= fallback.variableTemplates;
    state.monthly ||= {};
    state.assets ||= fallback.assets;
    state.goals ||= fallback.goals;
    state.savingBuckets.forEach(bucket => {
      bucket.id ||= uid();
      bucket.history ||= [{ from: currentMonth, amount: 0 }];
    });
    state.variableTemplates.forEach(item => { item.id ||= uid(); });
    state.goals.forEach(goal => { goal.id ||= uid(); });
    return state;
  }

  function valueAt(history, month) {
    return [...(history || [])]
      .filter(entry => entry.from <= month)
      .sort((a, b) => a.from.localeCompare(b.from))
      .at(-1)?.amount || 0;
  }

  function setHistory(history, month, amount) {
    const index = history.findIndex(entry => entry.from === month);
    if (index >= 0) history[index].amount = num(amount);
    else history.push({ from: month, amount: num(amount) });
    history.sort((a, b) => a.from.localeCompare(b.from));
  }

  class FinanceStore {
    constructor() {
      this.mode = cloudEnabled ? 'cloud' : 'local';
      this.user = null;
      this.membership = null;
      this.household = null;
      this.members = [];
      this.state = defaultState();
      this.version = 0;
      this.channel = null;
      this.memberChannel = null;
      this.listeners = new Set();
      this.pending = [];
      this.saving = false;
      this.flushPromise = null;
    }

    onChange(listener) {
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    }

    emit(reason = 'change') {
      this.listeners.forEach(listener => listener(reason));
    }

    async init() {
      if (this.mode === 'local') {
        const saved = localStorage.getItem(LOCAL_KEY);
        this.state = saved ? migrate(JSON.parse(saved)) : defaultState();
        this.user = { id: 'local-user', email: 'local@device' };
        this.household = { id: 'local-house', name: '우리집', invite_code: 'LOCAL' };
        this.membership = { household_id: 'local-house', role: 'owner', display_name: '로컬 사용자' };
        this.members = [{ user_id: 'local-user', role: 'owner', display_name: '로컬 사용자' }];
        this.emit('ready');
        return;
      }

      const { data, error } = await db.auth.getSession();
      if (error) throw error;
      this.user = data.session?.user || null;
      db.auth.onAuthStateChange((_event, session) => {
        queueMicrotask(async () => {
          this.user = session?.user || null;
          if (this.user) await this.loadMembership();
          else this.clearCloud();
          this.emit('auth');
        });
      });
      if (this.user) await this.loadMembership();
      this.emit('ready');
    }

    clearCloud() {
      if (this.channel) db.removeChannel(this.channel);
      if (this.memberChannel) db.removeChannel(this.memberChannel);
      this.channel = null;
      this.memberChannel = null;
      this.membership = null;
      this.household = null;
      this.members = [];
      this.state = defaultState();
      this.version = 0;
    }

    async signIn(email, password) {
      const { error } = await db.auth.signInWithPassword({ email, password });
      if (error) throw error;
    }

    async signUp(email, password, displayName) {
      const { data, error } = await db.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } }
      });
      if (error) throw error;
      return data;
    }

    async signOut() {
      if (this.mode === 'local') return;
      const { error } = await db.auth.signOut();
      if (error) throw error;
    }

    async loadMembership() {
      if (!this.user) return;
      const { data, error } = await db
        .from('household_members')
        .select('household_id,role,display_name,households(id,name,invite_code)')
        .eq('user_id', this.user.id)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      this.membership = data || null;
      this.household = data?.households || null;
      if (this.membership) {
        await Promise.all([this.loadMembers(), this.loadState()]);
        this.subscribe();
      } else {
        this.members = [];
      }
    }

    async createHousehold(name, displayName) {
      const { error } = await db.rpc('create_household', {
        p_name: name,
        p_display_name: displayName
      });
      if (error) throw error;
      await this.loadMembership();
    }

    async joinHousehold(code, displayName) {
      const { error } = await db.rpc('join_household', {
        p_invite_code: code.trim().toUpperCase(),
        p_display_name: displayName
      });
      if (error) throw error;
      await this.loadMembership();
    }

    async loadMembers() {
      if (!this.membership) return;
      const { data, error } = await db
        .from('household_members')
        .select('user_id,role,display_name,joined_at')
        .eq('household_id', this.membership.household_id)
        .order('joined_at', { ascending: true });
      if (error) throw error;
      this.members = data || [];
    }

    async fetchStateRow() {
      const { data, error } = await db
        .from('finance_states')
        .select('state,version,updated_by,updated_at')
        .eq('household_id', this.membership.household_id)
        .single();
      if (error) throw error;
      return data;
    }

    async loadState() {
      const row = await this.fetchStateRow();
      const empty = !row.state || Object.keys(row.state).length === 0;
      this.state = empty ? defaultState() : migrate(row.state);
      this.version = num(row.version);
      if (empty) {
        this.pending.push(() => {});
        await this.persist();
      }
    }

    subscribe() {
      if (this.channel) db.removeChannel(this.channel);
      if (this.memberChannel) db.removeChannel(this.memberChannel);
      const householdId = this.membership.household_id;
      this.channel = db
        .channel(`finance-${householdId}`)
        .on('postgres_changes', {
          event: 'UPDATE', schema: 'public', table: 'finance_states', filter: `household_id=eq.${householdId}`
        }, payload => {
          const row = payload.new;
          if (!row || num(row.version) <= this.version || this.saving || this.pending.length) return;
          this.version = num(row.version);
          this.state = migrate(row.state);
          this.emit(row.updated_by === this.user?.id ? 'saved' : 'remote');
        })
        .subscribe();
      this.memberChannel = db
        .channel(`members-${householdId}`)
        .on('postgres_changes', {
          event: '*', schema: 'public', table: 'household_members', filter: `household_id=eq.${householdId}`
        }, async () => {
          await this.loadMembers();
          this.emit('members');
        })
        .subscribe();
    }

    async mutate(mutator) {
      mutator(this.state);
      this.state = migrate(this.state);
      this.pending.push(mutator);
      this.emit('local');
      await this.persist();
    }

    async persist() {
      if (this.mode === 'local') {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(this.state));
        this.pending = [];
        this.emit('saved');
        return;
      }
      if (this.flushPromise) return this.flushPromise;
      this.flushPromise = this.flush();
      try {
        await this.flushPromise;
      } finally {
        this.flushPromise = null;
      }
    }

    async flush() {
      this.saving = true;
      this.emit('saving');
      try {
        while (this.pending.length) {
          const mutations = this.pending.splice(0);
          const snapshot = clone(this.state);
          const expected = this.version;
          const { data, error } = await db.rpc('save_finance_state', {
            p_household_id: this.membership.household_id,
            p_state: snapshot,
            p_expected_version: expected
          });
          if (error) {
            this.pending = [...mutations, ...this.pending];
            throw error;
          }
          const result = Array.isArray(data) ? data[0] : data;
          if (result?.conflict) {
            const remote = await this.fetchStateRow();
            this.version = num(remote.version);
            this.state = migrate(remote.state);
            const replay = [...mutations, ...this.pending];
            replay.forEach(fn => fn(this.state));
            this.state = migrate(this.state);
            this.pending = replay;
            this.emit('conflict');
            continue;
          }
          if (result?.version !== undefined) this.version = num(result.version);
          this.emit('saved');
        }
      } finally {
        this.saving = false;
      }
    }
  }

  const store = new FinanceStore();
  const ui = {
    ready: false,
    authMode: 'login',
    tab: 'home',
    month: currentMonth,
    ownerFilter: '전체',
    forecastMonths: 12,
    syncText: cloudEnabled ? '연결 중' : '이 기기에 저장'
  };

  function monthly(month = ui.month) {
    store.state.monthly[month] ||= { variables: {}, transactions: [] };
    store.state.monthly[month].variables ||= {};
    store.state.monthly[month].transactions ||= [];
    return store.state.monthly[month];
  }

  function rule(key, month = ui.month) {
    return valueAt(store.state.rules[key], month);
  }

  function savings(month = ui.month) {
    return store.state.savingBuckets.reduce((sum, bucket) => sum + valueAt(bucket.history, month), 0);
  }

  function variables(month = ui.month) {
    const values = monthly(month).variables;
    return store.state.variableTemplates.reduce((sum, item) => sum + num(values[item.id] ?? item.estimate), 0);
  }

  function transactionTotal(month = ui.month, owner = '전체') {
    return monthly(month).transactions
      .filter(tx => owner === '전체' || tx.owner === owner)
      .reduce((sum, tx) => sum + num(tx.amount), 0);
  }

  function summary(month = ui.month) {
    const income = rule('salaryA', month) + rule('salaryB', month) + rule('otherIncome', month);
    const saving = savings(month);
    const housing = rule('housing', month);
    const utility = variables(month);
    const spending = transactionTotal(month);
    const expenses = housing + utility + spending;
    return {
      income, saving, housing, utility, spending, expenses,
      remaining: income - saving - expenses,
      budgetA: rule('budgetA', month),
      budgetB: rule('budgetB', month),
      budgetJoint: rule('budgetJoint', month),
      usedA: transactionTotal(month, store.state.profile.partnerA),
      usedB: transactionTotal(month, store.state.profile.partnerB),
      usedJoint: transactionTotal(month, '공동')
    };
  }

  function currentNet() {
    const assets = store.state.assets;
    return num(assets.savingAsset) + num(assets.cashAsset) + num(assets.investmentAsset) - num(assets.debt);
  }

  function forecast(baseMonth, months) {
    const assets = store.state.assets;
    const rate = num(assets.annualReturn) / 100 / 12;
    let invested = num(assets.savingAsset) + num(assets.investmentAsset);
    let contributions = 0;
    for (let index = 0; index < months; index += 1) {
      const contribution = savings(shiftMonth(baseMonth, index));
      invested = invested * (1 + rate) + contribution;
      contributions += contribution;
    }
    const futureNet = num(assets.cashAsset) + invested - num(assets.debt);
    return {
      futureNet,
      contributions,
      returnAmount: futureNet - currentNet() - contributions
    };
  }

  function icon(name) {
    const paths = {
      home: '<path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5Z"/>',
      list: '<path d="M7 6h14M7 12h14M7 18h14M3 6h.01M3 12h.01M3 18h.01"/>',
      chart: '<path d="M4 19V9m6 10V5m6 14v-7m5 7H2"/>',
      settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1.4 1.7v.1h-4v-.1A1.7 1.7 0 0 0 8 19.4a1.7 1.7 0 0 0-1.9.3l-.1.1L3.2 17l.1-.1A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.7-1.4h-.1v-4h.1A1.7 1.7 0 0 0 4.6 8a1.7 1.7 0 0 0-.3-1.9L4.2 6 7 3.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1.4-1.7v-.1h4v.1A1.7 1.7 0 0 0 16 4.6a1.7 1.7 0 0 0 1.9-.3l.1-.1L20.8 7l-.1.1A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.7 1.4h.1v4h-.1A1.7 1.7 0 0 0 19.4 15Z"/>'
    };
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
  }

  function toast(message) {
    const node = document.querySelector('#toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove('show'), 2200);
  }

  function loadingView() {
    return '<main class="center"><div class="spinner"></div><p>자산 흐름을 불러오는 중입니다.</p></main>';
  }

  function authView() {
    if (!cloudEnabled) return '';
    return `<main class="auth-shell">
      <section class="auth-card">
        <div class="brand-mark">₩</div>
        <h1>우리집 자산흐름</h1>
        <p>부부가 같은 데이터를 실시간으로 관리합니다.</p>
        <div class="segmented">
          <button data-auth-mode="login" class="${ui.authMode === 'login' ? 'active' : ''}">로그인</button>
          <button data-auth-mode="signup" class="${ui.authMode === 'signup' ? 'active' : ''}">회원가입</button>
        </div>
        <form id="authForm" class="stack">
          ${ui.authMode === 'signup' ? '<label>표시 이름<input name="displayName" placeholder="예: 현조" required></label>' : ''}
          <label>이메일<input name="email" type="email" autocomplete="email" required></label>
          <label>비밀번호<input name="password" type="password" autocomplete="current-password" minlength="6" required></label>
          <button class="primary" type="submit">${ui.authMode === 'login' ? '로그인' : '회원가입'}</button>
        </form>
      </section>
    </main>`;
  }

  function setupView() {
    return `<main class="auth-shell">
      <section class="auth-card wide">
        <div class="brand-mark">⌂</div>
        <h1>부부 공간 연결</h1>
        <p>한 사람이 가구를 만들고, 배우자는 초대코드로 참여합니다.</p>
        <div class="setup-grid">
          <form id="createHouseholdForm" class="panel stack">
            <h2>새 가구 만들기</h2>
            <label>가구 이름<input name="householdName" value="우리집" required></label>
            <label>내 표시 이름<input name="displayName" value="${esc(store.user?.user_metadata?.display_name || '')}" required></label>
            <button class="primary">가구 만들기</button>
          </form>
          <form id="joinHouseholdForm" class="panel stack">
            <h2>초대코드로 참여</h2>
            <label>초대코드<input name="inviteCode" autocapitalize="characters" required></label>
            <label>내 표시 이름<input name="displayName" value="${esc(store.user?.user_metadata?.display_name || '')}" required></label>
            <button class="secondary">가구 참여</button>
          </form>
        </div>
        <button class="text-button" data-action="signout">다른 계정으로 로그인</button>
      </section>
    </main>`;
  }

  function monthControl() {
    return `<div class="month-control">
      <button data-month-shift="-1" aria-label="이전 달">‹</button>
      <input id="monthPicker" type="month" value="${ui.month}">
      <button data-month-shift="1" aria-label="다음 달">›</button>
    </div>`;
  }

  function homeView() {
    const data = summary();
    const savingRate = data.income ? Math.round(data.saving / data.income * 100) : 0;
    const net = currentNet();
    const forecast12 = forecast(ui.month, 12).futureNet;
    const budgetRows = [
      [store.state.profile.partnerA, data.usedA, data.budgetA],
      [store.state.profile.partnerB, data.usedB, data.budgetB],
      ['공동', data.usedJoint, data.budgetJoint]
    ];
    return `<section class="page">
      <div class="page-head"><div><span class="eyebrow">HOME</span><h2>${monthLabel(ui.month)}</h2></div>${monthControl()}</div>
      <div class="hero-card">
        <div><span>이번 달 저축</span><strong>${won(data.saving)}</strong><small>저축률 ${savingRate}%</small></div>
        <div class="hero-side"><span>12개월 뒤 예상 순자산</span><b>${won(forecast12)}</b><small>현재 ${won(net)}</small></div>
      </div>
      <div class="metric-grid">
        <article><span>총수입</span><strong>${shortWon(data.income)}</strong><small>${won(data.income)}</small></article>
        <article><span>총지출</span><strong>${shortWon(data.expenses)}</strong><small>${won(data.expenses)}</small></article>
        <article class="${data.remaining < 0 ? 'danger' : ''}"><span>남는 금액</span><strong>${shortWon(data.remaining)}</strong><small>${won(data.remaining)}</small></article>
      </div>
      <div class="two-col">
        <article class="card">
          <div class="card-title"><h3>이번 달 돈의 흐름</h3><button data-tab="details">내역 보기</button></div>
          <div class="flow-list">
            <div><span>월급·기타수입</span><b>${won(data.income)}</b></div>
            <div><span>적금·저축</span><b>${won(data.saving)}</b></div>
            <div><span>주거 고정비</span><b>${won(data.housing)}</b></div>
            <div><span>공과금</span><b>${won(data.utility)}</b></div>
            <div><span>생활비 사용</span><b>${won(data.spending)}</b></div>
          </div>
        </article>
        <article class="card">
          <div class="card-title"><h3>생활비 사용률</h3><span>${monthly().transactions.length}건</span></div>
          <div class="budget-list">
            ${budgetRows.map(([name, used, budget]) => {
              const percent = budget ? Math.min(100, Math.round(used / budget * 100)) : 0;
              return `<div class="budget-row"><div><b>${esc(name)}</b><span>${won(used)} / ${won(budget)}</span></div><div class="progress"><i style="width:${percent}%"></i></div></div>`;
            }).join('')}
          </div>
        </article>
      </div>
      <article class="card member-card">
        <div><span class="eyebrow">COUPLE</span><h3>${esc(store.household?.name || '우리집')}</h3><p>초대코드 <button class="code" data-copy-code>${esc(store.household?.invite_code || '')}</button></p></div>
        <div class="members">${store.members.map(member => `<span>${esc(member.display_name)}${member.role === 'owner' ? ' · 관리자' : ''}</span>`).join('')}</div>
      </article>
    </section>`;
  }

  function detailsView() {
    const data = summary();
    const owners = ['전체', store.state.profile.partnerA, store.state.profile.partnerB, '공동'];
    const transactions = monthly().transactions
      .filter(tx => ui.ownerFilter === '전체' || tx.owner === ui.ownerFilter)
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
    return `<section class="page">
      <div class="page-head"><div><span class="eyebrow">MONTHLY</span><h2>월별 사용내역</h2></div>${monthControl()}</div>
      <div class="two-col details-grid">
        <article class="card">
          <div class="card-title"><h3>변동 공과금</h3><span>미입력 시 예상금액</span></div>
          <div class="utility-list">
            ${store.state.variableTemplates.map(item => `<label><span>${esc(item.name)}<small>예상 ${won(item.estimate)}</small></span><input class="money-input" data-variable-id="${item.id}" inputmode="numeric" value="${monthly().variables[item.id] ?? ''}" placeholder="${item.estimate}"></label>`).join('')}
          </div>
          <button class="secondary full" data-action="save-utilities">공과금 저장</button>
        </article>
        <article class="card">
          <div class="card-title"><h3>이번 달 요약</h3><span>${monthLabel(ui.month)}</span></div>
          <div class="summary-big"><strong>${won(data.remaining)}</strong><span>저축·지출 후 남는 금액</span></div>
          <div class="flow-list compact">
            <div><span>공과금</span><b>${won(data.utility)}</b></div>
            <div><span>생활비 사용</span><b>${won(data.spending)}</b></div>
            <div><span>저축</span><b>${won(data.saving)}</b></div>
          </div>
        </article>
      </div>
      <article class="card">
        <div class="card-title transaction-head"><h3>생활비 내역</h3><div class="chips">${owners.map(owner => `<button data-owner-filter="${esc(owner)}" class="${ui.ownerFilter === owner ? 'active' : ''}">${esc(owner)}</button>`).join('')}</div></div>
        <form id="transactionForm" class="transaction-form">
          <input name="date" type="date" value="${ui.month}-${pad(Math.min(today.getDate(), 28))}" required>
          <select name="owner">${[store.state.profile.partnerA, store.state.profile.partnerB, '공동'].map(owner => `<option>${esc(owner)}</option>`).join('')}</select>
          <input name="category" placeholder="분류 (식비·교통 등)" required>
          <input name="memo" placeholder="사용처·메모">
          <input name="amount" inputmode="numeric" placeholder="금액" required>
          <button class="primary">추가</button>
        </form>
        <div class="transaction-list">
          ${transactions.length ? transactions.map(tx => `<div class="transaction-row"><div class="tx-date">${esc(String(tx.date || '').slice(5))}</div><div><b>${esc(tx.memo || tx.category)}</b><span>${esc(tx.owner)} · ${esc(tx.category)}</span></div><strong>${won(tx.amount)}</strong><button data-delete-tx="${tx.id}" aria-label="삭제">×</button></div>`).join('') : '<div class="empty">등록된 사용내역이 없습니다.</div>'}
        </div>
      </article>
    </section>`;
  }

  function forecastView() {
    const result = forecast(ui.month, ui.forecastMonths);
    const rows = [6, 12, 24, 36].map(months => ({ months, ...forecast(ui.month, months) }));
    return `<section class="page">
      <div class="page-head"><div><span class="eyebrow">FORECAST</span><h2>자산 포캐스팅</h2></div>${monthControl()}</div>
      <div class="forecast-hero">
        <span>${ui.forecastMonths}개월 뒤 예상 순자산</span>
        <strong>${won(result.futureNet)}</strong>
        <p>납입 원금 ${won(result.contributions)} · 예상 운용수익 ${won(result.returnAmount)}</p>
        <div class="horizon">${[6, 12, 24, 36].map(months => `<button data-forecast-months="${months}" class="${ui.forecastMonths === months ? 'active' : ''}">${months < 12 ? `${months}개월` : `${months / 12}년`}</button>`).join('')}</div>
      </div>
      <div class="metric-grid">
        <article><span>현재 순자산</span><strong>${shortWon(currentNet())}</strong><small>${won(currentNet())}</small></article>
        <article><span>월 적금</span><strong>${shortWon(savings())}</strong><small>${won(savings())}</small></article>
        <article><span>연 기대수익률</span><strong>${num(store.state.assets.annualReturn).toFixed(1)}%</strong><small>복리 가정</small></article>
      </div>
      <article class="card">
        <div class="card-title"><h3>기간별 예상</h3><span>${monthLabel(ui.month)} 기준</span></div>
        <div class="forecast-table">
          ${rows.map(row => `<div><span>${row.months < 12 ? `${row.months}개월` : `${row.months / 12}년`} 뒤</span><b>${won(row.futureNet)}</b><small>수익 ${won(row.returnAmount)}</small></div>`).join('')}
        </div>
      </article>
      <article class="card notice"><b>계산 기준</b><p>현재 자산에 매월 설정된 적금액을 납입하고, 설정한 연 기대수익률을 월 복리로 적용한 단순 예측입니다. 실제 수익률·세금·중도해지는 반영하지 않습니다.</p></article>
    </section>`;
  }

  function settingsView() {
    const effective = ui.month;
    const fixedFields = [
      ['salaryA', `${store.state.profile.partnerA} 월급`],
      ['salaryB', `${store.state.profile.partnerB} 월급`],
      ['otherIncome', '기타소득'],
      ['budgetA', `${store.state.profile.partnerA} 생활비`],
      ['budgetB', `${store.state.profile.partnerB} 생활비`],
      ['budgetJoint', '공동 생활비'],
      ['housing', '주거 고정비']
    ];
    return `<section class="page">
      <div class="page-head"><div><span class="eyebrow">SETTINGS</span><h2>고정금·자산 설정</h2></div><div class="effective"><span>적용 시작월</span><input id="settingsMonth" type="month" value="${effective}"></div></div>
      <form id="settingsForm" class="settings-layout">
        <article class="card">
          <div class="card-title"><h3>부부 이름</h3><span>화면 표시 기준</span></div>
          <div class="form-grid two">
            <label>첫 번째 사용자<input name="partnerA" value="${esc(store.state.profile.partnerA)}"></label>
            <label>두 번째 사용자<input name="partnerB" value="${esc(store.state.profile.partnerB)}"></label>
          </div>
        </article>
        <article class="card">
          <div class="card-title"><h3>월 고정금</h3><span>${monthLabel(effective)}부터 자동 반영</span></div>
          <div class="form-grid two">${fixedFields.map(([key, label]) => `<label>${esc(label)}<input name="${key}" inputmode="numeric" value="${valueAt(store.state.rules[key], effective)}"></label>`).join('')}</div>
        </article>
        <article class="card">
          <div class="card-title"><h3>적금·저축</h3><button type="button" data-action="add-saving">항목 추가</button></div>
          <div id="savingSettings" class="editable-list">${store.state.savingBuckets.map(bucket => `<div data-saving-row="${bucket.id}"><input data-saving-name value="${esc(bucket.name)}"><input data-saving-amount inputmode="numeric" value="${valueAt(bucket.history, effective)}"><button type="button" data-remove-saving="${bucket.id}">×</button></div>`).join('')}</div>
        </article>
        <article class="card">
          <div class="card-title"><h3>공과금 예상값</h3><button type="button" data-action="add-variable">항목 추가</button></div>
          <div id="variableSettings" class="editable-list">${store.state.variableTemplates.map(item => `<div data-variable-row="${item.id}"><input data-variable-name value="${esc(item.name)}"><input data-variable-estimate inputmode="numeric" value="${item.estimate}"><button type="button" data-remove-variable="${item.id}">×</button></div>`).join('')}</div>
        </article>
        <article class="card">
          <div class="card-title"><h3>현재 자산·부채</h3><span>포캐스팅 시작값</span></div>
          <div class="form-grid two">
            <label>적금·예금<input name="savingAsset" inputmode="numeric" value="${num(store.state.assets.savingAsset)}"></label>
            <label>현금성 자산<input name="cashAsset" inputmode="numeric" value="${num(store.state.assets.cashAsset)}"></label>
            <label>투자자산<input name="investmentAsset" inputmode="numeric" value="${num(store.state.assets.investmentAsset)}"></label>
            <label>부채<input name="debt" inputmode="numeric" value="${num(store.state.assets.debt)}"></label>
            <label>연 기대수익률 (%)<input name="annualReturn" inputmode="decimal" value="${num(store.state.assets.annualReturn)}"></label>
          </div>
        </article>
        <button class="primary save-settings" type="submit">설정 저장</button>
      </form>
    </section>`;
  }

  function appView() {
    const content = ui.tab === 'home' ? homeView()
      : ui.tab === 'details' ? detailsView()
      : ui.tab === 'forecast' ? forecastView()
      : settingsView();
    const tabs = [
      ['home', '홈', 'home'], ['details', '월별', 'list'], ['forecast', '포캐스팅', 'chart'], ['settings', '설정', 'settings']
    ];
    return `<div class="app-shell">
      <header class="topbar"><div><span class="logo">₩</span><div><b>${esc(store.household?.name || '우리집')}</b><small>${esc(ui.syncText)}</small></div></div><button class="avatar" data-action="signout">${esc((store.membership?.display_name || store.user?.email || 'U').slice(0, 1))}</button></header>
      ${content}
      <nav class="bottom-nav">${tabs.map(([key, label, iconName]) => `<button data-tab="${key}" class="${ui.tab === key ? 'active' : ''}">${icon(iconName)}<span>${label}</span></button>`).join('')}</nav>
      <div id="toast" class="toast"></div>
    </div>`;
  }

  function render() {
    const root = document.querySelector('#app');
    if (!ui.ready) root.innerHTML = loadingView();
    else if (cloudEnabled && !store.user) root.innerHTML = authView();
    else if (cloudEnabled && store.user && !store.membership) root.innerHTML = setupView();
    else root.innerHTML = appView();
  }

  async function run(action, successMessage) {
    try {
      await action();
      if (successMessage) toast(successMessage);
    } catch (error) {
      console.error(error);
      toast(error.message || '처리 중 오류가 발생했습니다.');
    }
  }

  document.addEventListener('click', event => {
    const authMode = event.target.closest('[data-auth-mode]');
    if (authMode) {
      ui.authMode = authMode.dataset.authMode;
      render();
      return;
    }
    const tab = event.target.closest('[data-tab]');
    if (tab) {
      ui.tab = tab.dataset.tab;
      render();
      return;
    }
    const shift = event.target.closest('[data-month-shift]');
    if (shift) {
      ui.month = shiftMonth(ui.month, num(shift.dataset.monthShift));
      render();
      return;
    }
    const owner = event.target.closest('[data-owner-filter]');
    if (owner) {
      ui.ownerFilter = owner.dataset.ownerFilter;
      render();
      return;
    }
    const horizon = event.target.closest('[data-forecast-months]');
    if (horizon) {
      ui.forecastMonths = num(horizon.dataset.forecastMonths);
      render();
      return;
    }
    const deleteTx = event.target.closest('[data-delete-tx]');
    if (deleteTx) {
      run(() => store.mutate(state => {
        const list = state.monthly[ui.month]?.transactions || [];
        state.monthly[ui.month].transactions = list.filter(tx => tx.id !== deleteTx.dataset.deleteTx);
      }), '내역을 삭제했습니다.');
      return;
    }
    const copyCode = event.target.closest('[data-copy-code]');
    if (copyCode) {
      navigator.clipboard?.writeText(store.household?.invite_code || '');
      toast('초대코드를 복사했습니다.');
      return;
    }
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'signout') run(() => store.signOut());
    if (action === 'save-utilities') {
      const values = [...document.querySelectorAll('[data-variable-id]')].map(input => [input.dataset.variableId, input.value]);
      run(() => store.mutate(state => {
        state.monthly[ui.month] ||= { variables: {}, transactions: [] };
        state.monthly[ui.month].variables ||= {};
        values.forEach(([id, value]) => {
          if (String(value).trim() === '') delete state.monthly[ui.month].variables[id];
          else state.monthly[ui.month].variables[id] = num(value);
        });
      }), '공과금을 저장했습니다.');
    }
    if (action === 'add-saving') {
      store.state.savingBuckets.push({ id: uid(), name: '새 적금', history: [{ from: ui.month, amount: 0 }] });
      render();
    }
    if (action === 'add-variable') {
      store.state.variableTemplates.push({ id: uid(), name: '새 공과금', estimate: 0 });
      render();
    }
    const removeSaving = event.target.closest('[data-remove-saving]');
    if (removeSaving) {
      store.state.savingBuckets = store.state.savingBuckets.filter(item => item.id !== removeSaving.dataset.removeSaving);
      render();
    }
    const removeVariable = event.target.closest('[data-remove-variable]');
    if (removeVariable) {
      store.state.variableTemplates = store.state.variableTemplates.filter(item => item.id !== removeVariable.dataset.removeVariable);
      render();
    }
  });

  document.addEventListener('change', event => {
    if (event.target.id === 'monthPicker') {
      ui.month = event.target.value || currentMonth;
      render();
    }
    if (event.target.id === 'settingsMonth') {
      ui.month = event.target.value || currentMonth;
      render();
    }
  });

  document.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    if (form.id === 'authForm') {
      if (ui.authMode === 'login') {
        run(() => store.signIn(data.get('email'), data.get('password')), '로그인했습니다.');
      } else {
        run(async () => {
          const result = await store.signUp(data.get('email'), data.get('password'), data.get('displayName'));
          if (!result.session) toast('인증 메일을 확인한 뒤 로그인하세요.');
        });
      }
    }
    if (form.id === 'createHouseholdForm') {
      run(() => store.createHousehold(data.get('householdName'), data.get('displayName')), '가구를 만들었습니다.');
    }
    if (form.id === 'joinHouseholdForm') {
      run(() => store.joinHousehold(data.get('inviteCode'), data.get('displayName')), '가구에 참여했습니다.');
    }
    if (form.id === 'transactionForm') {
      const transaction = {
        id: uid(),
        date: data.get('date'),
        owner: data.get('owner'),
        category: data.get('category'),
        memo: data.get('memo'),
        amount: num(data.get('amount'))
      };
      run(() => store.mutate(state => {
        state.monthly[ui.month] ||= { variables: {}, transactions: [] };
        state.monthly[ui.month].transactions ||= [];
        state.monthly[ui.month].transactions.push(transaction);
      }), '사용내역을 추가했습니다.');
      form.reset();
    }
    if (form.id === 'settingsForm') {
      const effective = ui.month;
      const savingsRows = [...form.querySelectorAll('[data-saving-row]')].map(row => ({
        id: row.dataset.savingRow,
        name: row.querySelector('[data-saving-name]').value.trim() || '적금',
        amount: num(row.querySelector('[data-saving-amount]').value)
      }));
      const variableRows = [...form.querySelectorAll('[data-variable-row]')].map(row => ({
        id: row.dataset.variableRow,
        name: row.querySelector('[data-variable-name]').value.trim() || '공과금',
        estimate: num(row.querySelector('[data-variable-estimate]').value)
      }));
      run(() => store.mutate(state => {
        const oldA = state.profile.partnerA;
        const oldB = state.profile.partnerB;
        state.profile.partnerA = data.get('partnerA').trim() || '현조';
        state.profile.partnerB = data.get('partnerB').trim() || '신영';
        ['salaryA', 'salaryB', 'otherIncome', 'budgetA', 'budgetB', 'budgetJoint', 'housing'].forEach(key => {
          state.rules[key] ||= [];
          setHistory(state.rules[key], effective, data.get(key));
        });
        state.savingBuckets = savingsRows.map(row => {
          const existing = state.savingBuckets.find(item => item.id === row.id) || { id: row.id, history: [] };
          existing.name = row.name;
          setHistory(existing.history, effective, row.amount);
          return existing;
        });
        state.variableTemplates = variableRows;
        state.assets = {
          savingAsset: num(data.get('savingAsset')),
          cashAsset: num(data.get('cashAsset')),
          investmentAsset: num(data.get('investmentAsset')),
          debt: num(data.get('debt')),
          annualReturn: num(data.get('annualReturn'))
        };
        Object.values(state.monthly).forEach(month => {
          (month.transactions || []).forEach(tx => {
            if (tx.owner === oldA) tx.owner = state.profile.partnerA;
            if (tx.owner === oldB) tx.owner = state.profile.partnerB;
          });
        });
      }), '설정을 저장했습니다.');
    }
  });

  store.onChange(reason => {
    if (reason === 'saving') ui.syncText = '저장 중';
    else if (reason === 'remote') ui.syncText = '배우자 변경 반영';
    else if (reason === 'conflict') ui.syncText = '동시 변경 병합';
    else if (reason === 'saved') ui.syncText = cloudEnabled ? '실시간 동기화' : '이 기기에 저장';
    else if (reason === 'members') ui.syncText = '구성원 갱신';
    render();
  });

  render();
  store.init()
    .then(() => {
      ui.ready = true;
      ui.syncText = cloudEnabled ? '실시간 동기화' : '이 기기에 저장';
      render();
    })
    .catch(error => {
      console.error(error);
      ui.ready = true;
      document.querySelector('#app').innerHTML = `<main class="center error"><h1>앱 연결 오류</h1><p>${esc(error.message || error)}</p><button onclick="location.reload()">다시 시도</button></main>`;
    });
})();
