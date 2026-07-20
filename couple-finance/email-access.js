(() => {
  'use strict';

  const ACCOUNTS = {
    'mintgus@naver.com': {
      displayName: '현조',
      authEmail: 'mintgus+couplefinance20260720@naver.com',
      passwordSalt: 'HJ26'
    },
    'dnltlsdud@naver.com': {
      displayName: '신영',
      authEmail: 'dnltlsdud+couplefinance20260720@naver.com',
      passwordSalt: 'SY26'
    }
  };
  const STYLE_ID = 'couple-finance-email-access-style';
  const COOLDOWN_MS = 65_000;
  let mode = 'login';

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .email-auth-card{max-width:430px}
      .email-auth-copy{margin:0 0 18px;color:#64748b;font-size:14px;line-height:1.55}
      .email-auth-tabs{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:5px;margin-bottom:18px;border-radius:13px;background:#eef2f8}
      .email-auth-tabs button{min-height:40px;border:0;border-radius:9px;background:transparent;color:#68758c;font-weight:800}
      .email-auth-tabs button.active{background:white;color:#17233f;box-shadow:0 4px 14px rgba(35,52,93,.08)}
      .email-auth-form{display:grid;gap:13px}
      .email-auth-form label{display:grid;gap:7px;color:#344158;font-size:13px;font-weight:700}
      .email-auth-form select,.email-auth-form input{width:100%;min-height:48px;border:1px solid #d4deeb;border-radius:11px;padding:0 13px;background:white;color:#17233f;font-size:16px;box-sizing:border-box}
      .email-auth-submit{min-height:49px;border:0;border-radius:12px;background:#17233f;color:white;font-size:15px;font-weight:900}
      .email-auth-submit[disabled]{opacity:.58;cursor:wait}
      .email-auth-status{display:none;margin-top:14px;padding:12px 14px;border-radius:12px;font-size:13px;line-height:1.5;white-space:pre-line}
      .email-auth-status.show{display:block}
      .email-auth-status.info{background:#eef3ff;color:#25375d}
      .email-auth-status.success{background:#eefbf4;color:#17663e}
      .email-auth-status.error{background:#fff0f0;color:#9b2727}
      .email-auth-note{margin-top:14px;color:#7a879a;font-size:11px;line-height:1.5;text-align:center}
    `;
    document.head.appendChild(style);
  }

  function status(message, type = 'info') {
    const node = document.querySelector('#emailAuthStatus');
    if (!node) return;
    node.textContent = message;
    node.className = `email-auth-status show ${type}`;
  }

  function internalPassword(account, visiblePassword) {
    return `CF!${visiblePassword}#${account.passwordSalt}`;
  }

  function cooldownKey(email) {
    return `couple-finance-signup-at:${email}`;
  }

  function remainingCooldown(email) {
    const startedAt = Number(localStorage.getItem(cooldownKey(email)) || 0);
    return Math.max(0, COOLDOWN_MS - (Date.now() - startedAt));
  }

  function friendlyError(error, action = mode) {
    const raw = String(error?.message || error || '').trim();
    const lower = raw.toLowerCase();
    const code = String(error?.code || '').toLowerCase();

    if (code.includes('signup_requires_confirmation') || lower.includes('email not confirmed')) {
      return 'Supabase의 Confirm email 설정이 켜져 있습니다. 이 설정을 끄기 전에는 메일 인증 없이 회원가입할 수 없습니다.';
    }
    if (code.includes('over_request_rate_limit') || lower.includes('rate limit') || lower.includes('too many requests')) {
      return 'Supabase 인증 요청 제한에 걸렸습니다. 버튼을 더 누르지 말고 최소 60초 후 다시 시도해주세요. 이메일 발송 제한까지 걸린 경우 최대 1시간이 필요할 수 있습니다.';
    }
    if (lower.includes('invalid login credentials')) {
      return action === 'signup'
        ? '회원가입 계정을 만들지 못했습니다. 요청 제한이 풀린 뒤 회원가입을 한 번만 다시 눌러주세요.'
        : '아직 회원가입하지 않은 계정이거나 비밀번호가 다릅니다.';
    }
    if (lower.includes('user already registered')) {
      return '이미 가입된 계정입니다. 로그인 탭에서 로그인해주세요.';
    }
    if (lower.includes('signup is disabled')) {
      return 'Supabase에서 이메일 회원가입이 비활성화되어 있습니다.';
    }
    return raw || '인증 처리 중 오류가 발생했습니다.';
  }

  function renderCard() {
    addStyles();
    const card = document.querySelector('.auth-card');
    if (!card || card.dataset.emailAccessReady === 'true') return;
    card.dataset.emailAccessReady = 'true';
    card.classList.add('email-auth-card');
    card.innerHTML = `
      <div class="brand-mark">₩</div>
      <h1>우리집 자산흐름</h1>
      <p class="email-auth-copy">두 사람의 네이버 이메일과 비밀번호로 로그인합니다. 회원가입 후 별도의 이메일 인증 단계는 없습니다.</p>
      <div class="email-auth-tabs">
        <button type="button" data-email-mode="login" class="${mode === 'login' ? 'active' : ''}">로그인</button>
        <button type="button" data-email-mode="signup" class="${mode === 'signup' ? 'active' : ''}">회원가입</button>
      </div>
      <form id="emailAccessForm" class="email-auth-form">
        <label>이메일
          <select name="email" required>
            <option value="mintgus@naver.com">mintgus@naver.com · 현조</option>
            <option value="dnltlsdud@naver.com">dnltlsdud@naver.com · 신영</option>
          </select>
        </label>
        <label>비밀번호
          <input name="password" type="password" inputmode="numeric" pattern="[0-9]{6}" minlength="6" maxlength="6" autocomplete="${mode === 'login' ? 'current-password' : 'new-password'}" placeholder="6자리 숫자" required>
        </label>
        <button class="email-auth-submit" type="submit">${mode === 'login' ? '로그인' : '회원가입'}</button>
      </form>
      <div id="emailAuthStatus" class="email-auth-status info" role="status" aria-live="polite"></div>
      <div class="email-auth-note">등록 가능한 계정은 위 두 개뿐입니다.</div>
    `;
  }

  async function signIn(client, visibleEmail, visiblePassword) {
    const account = ACCOUNTS[visibleEmail];
    const { data, error } = await client.auth.signInWithPassword({
      email: account.authEmail,
      password: internalPassword(account, visiblePassword)
    });
    if (error) throw error;
    if (!data?.session) throw new Error('로그인 세션을 만들지 못했습니다.');
    return data.session;
  }

  async function signUp(client, visibleEmail, visiblePassword) {
    const account = ACCOUNTS[visibleEmail];
    const { data, error } = await client.auth.signUp({
      email: account.authEmail,
      password: internalPassword(account, visiblePassword),
      options: {
        data: {
          display_name: account.displayName,
          login_email: visibleEmail
        }
      }
    });
    if (error) throw error;
    if (data?.session) return data.session;

    const confirmationError = new Error('회원가입 후 로그인 세션이 생성되지 않았습니다.');
    confirmationError.code = 'signup_requires_confirmation';
    throw confirmationError;
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-email-mode]');
    if (!button) return;
    mode = button.dataset.emailMode === 'signup' ? 'signup' : 'login';
    const card = document.querySelector('.auth-card');
    if (card) {
      card.dataset.emailAccessReady = 'false';
      renderCard();
    }
  }, true);

  document.addEventListener('submit', async event => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || form.id !== 'emailAccessForm') return;
    event.preventDefault();
    event.stopImmediatePropagation();

    const client = window.__COUPLE_FINANCE_SUPABASE_CLIENT__;
    if (!client) {
      status('Supabase 연결을 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.', 'error');
      return;
    }

    const formData = new FormData(form);
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '');
    const submit = form.querySelector('button[type="submit"]');

    if (!ACCOUNTS[email]) {
      status('등록되지 않은 이메일입니다.', 'error');
      return;
    }
    if (!/^\d{6}$/.test(password)) {
      status('비밀번호는 6자리 숫자로 입력해주세요.', 'error');
      return;
    }

    if (mode === 'signup') {
      const remaining = remainingCooldown(email);
      if (remaining > 0) {
        status(`중복 요청을 막기 위해 ${Math.ceil(remaining / 1000)}초 후 회원가입할 수 있습니다.`, 'error');
        return;
      }
      localStorage.setItem(cooldownKey(email), String(Date.now()));
    }

    submit.disabled = true;
    submit.textContent = mode === 'login' ? '로그인 중…' : '회원가입 중…';
    status(mode === 'login' ? '로그인을 확인하고 있습니다.' : '회원가입 요청을 한 번만 전송하고 있습니다.', 'info');

    try {
      if (mode === 'login') await signIn(client, email, password);
      else await signUp(client, email, password);
      localStorage.setItem('couple-finance-login-email', email);
      status(mode === 'login' ? '로그인되었습니다.' : '회원가입과 로그인이 완료되었습니다.', 'success');
      setTimeout(() => location.reload(), 350);
    } catch (error) {
      console.error('Email authentication error:', error);
      status(friendlyError(error, mode), 'error');
      submit.disabled = false;
      submit.textContent = mode === 'login' ? '로그인' : '회원가입';
    }
  }, true);

  const observer = new MutationObserver(renderCard);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  renderCard();
})();