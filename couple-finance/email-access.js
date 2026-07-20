(() => {
  'use strict';

  const ACCOUNTS = {
    'mintgus@naver.com': { displayName: '현조' },
    'dnltlsdud@naver.com': { displayName: '신영' }
  };
  const STYLE_ID = 'couple-finance-email-access-style';
  let mode = 'login';

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .email-auth-card{max-width:430px}
      .email-auth-copy{margin:0 0 14px;color:#64748b;font-size:14px;line-height:1.55}
      .email-auth-diagnostic{margin:0 0 14px;padding:11px 13px;border-radius:11px;background:#f6f8fc;color:#627089;font-size:12px;line-height:1.5}
      .email-auth-diagnostic.error{background:#fff0f0;color:#9b2727}
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

  function diagnostic(message, type = '') {
    const node = document.querySelector('#emailAuthDiagnostic');
    if (!node) return;
    node.textContent = message;
    node.className = `email-auth-diagnostic ${type}`.trim();
  }

  function codeOf(error) {
    return String(error?.code || error?.name || '').toLowerCase();
  }

  function friendlyError(error, action = mode) {
    const raw = String(error?.message || error || '').trim();
    const lower = raw.toLowerCase();
    const code = codeOf(error);

    if (code.includes('signup_requires_confirmation')) {
      return '회원가입 요청은 접수됐지만 Supabase가 이메일 확인을 요구하고 있어 로그인 세션이 생성되지 않았습니다.\nAuthentication → Providers → Email에서 Confirm email을 꺼야 합니다.';
    }
    if (code.includes('existing_password_mismatch')) {
      return '이미 생성된 계정의 비밀번호가 입력한 값과 다릅니다.\nSupabase Authentication → Users에서 해당 계정을 삭제한 뒤 회원가입을 다시 진행해야 합니다.';
    }
    if (code.includes('weak_password') || lower.includes('password should be at least') || lower.includes('weak password')) {
      return `Supabase 비밀번호 정책이 6자리 숫자 비밀번호를 허용하지 않습니다.\nAuth 비밀번호 최소 길이·문자 조합 설정을 확인해주세요.\n${raw}`;
    }
    if (lower.includes('email not confirmed') || code.includes('email_not_confirmed')) {
      return '이 계정은 생성됐지만 이메일 미인증 상태라 로그인할 수 없습니다. Confirm email을 끈 뒤 기존 계정을 삭제하고 다시 가입해야 합니다.';
    }
    if (lower.includes('invalid login credentials')) {
      return action === 'signup'
        ? '기존 계정이 이미 다른 비밀번호로 생성되어 있습니다. Supabase Users에서 기존 계정을 삭제한 뒤 다시 가입해주세요.'
        : '계정이 아직 생성되지 않았거나 비밀번호가 기존 가입 값과 다릅니다. 회원가입 탭에서 먼저 생성해주세요.';
    }
    if (lower.includes('user already registered') || code.includes('user_already_exists')) {
      return '이미 가입된 계정입니다. 로그인 탭에서 로그인해주세요.';
    }
    if (lower.includes('signup is disabled') || code.includes('signup_disabled')) {
      return 'Supabase에서 이메일 회원가입이 비활성화되어 있습니다.';
    }
    if (lower.includes('rate limit') || code.includes('over_request_rate_limit')) {
      return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
    }
    return raw || '인증 처리 중 오류가 발생했습니다.';
  }

  async function loadAuthSettings() {
    const config = window.__COUPLE_FINANCE_CONFIG__;
    if (!config?.supabaseUrl || !config?.supabasePublishableKey) return;

    try {
      const response = await fetch(`${config.supabaseUrl}/auth/v1/settings`, {
        headers: { apikey: config.supabasePublishableKey }
      });
      if (!response.ok) throw new Error(`설정 조회 실패 (${response.status})`);
      const settings = await response.json();
      const blockers = [];
      const minimumLength = Number(settings.password_min_length || settings.minimum_password_length || 0);
      if (settings.disable_signup === true) blockers.push('이메일 회원가입이 꺼져 있습니다.');
      if (settings.mailer_autoconfirm === false) blockers.push('Confirm email이 켜져 있습니다.');
      if (minimumLength > 6) blockers.push(`비밀번호 최소 길이가 ${minimumLength}자리입니다.`);

      if (blockers.length) {
        diagnostic(`현재 Supabase 설정: ${blockers.join(' ')} 6자리 비밀번호의 즉시 가입·로그인이 제한됩니다.`, 'error');
      } else {
        diagnostic('Supabase 이메일 회원가입 설정을 확인했습니다. 6자리 비밀번호로 즉시 가입 가능한 구성입니다.');
      }
    } catch (error) {
      diagnostic(`Supabase 인증 설정을 자동 확인하지 못했습니다. 실제 가입 오류를 기준으로 안내합니다. (${error.message})`);
    }
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
      <div id="emailAuthDiagnostic" class="email-auth-diagnostic">Supabase 회원가입 설정을 확인하고 있습니다.</div>
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
    loadAuthSettings();
  }

  async function signIn(client, email, password) {
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data?.session) throw new Error('로그인 세션을 만들지 못했습니다.');
    return data.session;
  }

  async function signUp(client, email, password) {
    const profile = ACCOUNTS[email];
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: { data: { display_name: profile.displayName } }
    });

    if (error) {
      const lower = String(error.message || '').toLowerCase();
      const code = codeOf(error);
      if (lower.includes('already registered') || code.includes('user_already_exists')) {
        try {
          return await signIn(client, email, password);
        } catch (loginError) {
          const wrapped = new Error(loginError.message || '기존 계정 비밀번호 불일치');
          wrapped.code = 'existing_password_mismatch';
          throw wrapped;
        }
      }
      throw error;
    }

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

    submit.disabled = true;
    submit.textContent = mode === 'login' ? '로그인 중…' : '회원가입 중…';
    status(mode === 'login' ? '로그인을 확인하고 있습니다.' : '회원가입 후 바로 로그인하고 있습니다.', 'info');

    try {
      if (mode === 'login') await signIn(client, email, password);
      else await signUp(client, email, password);
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