(() => {
  'use strict';

  const AUTH_STYLE_ID = 'couple-finance-auth-flow-style';
  const PENDING_KEY = 'couple-finance-pending-verification';
  const CALLBACK_URL = 'https://hyunjolee-cell.github.io/couple-finance/index.html?auth=confirmed';
  const ALLOWED_EMAILS = new Set([
    'mintgus@naver.com',
    'dnltlsdud@naver.com'
  ]);

  function normalizeEmail(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (!raw) return '';
    return raw.includes('@') ? raw : `${raw}@naver.com`;
  }

  function addStyles() {
    if (document.getElementById(AUTH_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = AUTH_STYLE_ID;
    style.textContent = `
      .auth-status{margin:14px 0 0;padding:12px 14px;border-radius:12px;background:#eef3ff;color:#23345d;font-size:14px;line-height:1.5;display:none;white-space:pre-line}
      .auth-status.show{display:block}
      .auth-status.error{background:#fff0f0;color:#9d2424}
      .auth-status.success{background:#eefbf4;color:#17663e}
      .auth-status.info{background:#eef3ff;color:#23345d}
      .auth-card button[disabled]{opacity:.6;cursor:wait}
      .auth-connection{margin-top:12px;font-size:12px;color:#697386;text-align:center}
      .auth-account-help{margin:-4px 0 10px;color:#64748b;font-size:12px;line-height:1.45}
      .verification-panel{margin-top:16px;padding:18px;border:1px solid #dbe5ff;border-radius:16px;background:#f7f9ff;display:none}
      .verification-panel.show{display:block}
      .verification-panel h2{margin:0 0 7px;font-size:18px;color:#15213c}
      .verification-panel p{margin:0 0 14px;font-size:13px;line-height:1.55;color:#52617b}
      .verification-email{display:block;margin:8px 0 14px;padding:10px 12px;border-radius:10px;background:white;border:1px solid #dce3ef;font-weight:700;color:#17233f;word-break:break-all}
      .verification-actions{display:grid;grid-template-columns:1fr;gap:8px}
      .verification-actions button,.verification-actions a{display:flex;align-items:center;justify-content:center;min-height:44px;border-radius:11px;padding:0 12px;font-weight:700;text-decoration:none;box-sizing:border-box}
      .verification-actions a{background:#03c75a;color:white}
      .verification-actions button{border:1px solid #ced8ea;background:white;color:#273550}
      .verification-actions button.primary-check{background:#17233f;color:white;border-color:#17233f}
      .verification-note{margin-top:12px!important;font-size:12px!important;color:#738097!important}
    `;
    document.head.appendChild(style);
  }

  function getPending() {
    try {
      return JSON.parse(localStorage.getItem(PENDING_KEY) || 'null');
    } catch {
      return null;
    }
  }

  function setPending(email, displayName = '') {
    localStorage.setItem(PENDING_KEY, JSON.stringify({
      email,
      displayName,
      createdAt: new Date().toISOString()
    }));
  }

  function clearPending() {
    localStorage.removeItem(PENDING_KEY);
  }

  function ensureEmailOptions(form) {
    const emailInput = form.querySelector('input[name="email"]');
    if (!emailInput) return;
    emailInput.placeholder = 'mintgus 또는 dnltlsdud';
    emailInput.setAttribute('list', 'allowedNaverEmails');
    emailInput.setAttribute('inputmode', 'email');
    if (!document.querySelector('#allowedNaverEmails')) {
      const list = document.createElement('datalist');
      list.id = 'allowedNaverEmails';
      list.innerHTML = '<option value="mintgus@naver.com"></option><option value="dnltlsdud@naver.com"></option>';
      emailInput.insertAdjacentElement('afterend', list);
    }
    if (!form.querySelector('.auth-account-help')) {
      const helper = document.createElement('p');
      helper.className = 'auth-account-help';
      helper.textContent = '등록 가능한 계정: mintgus@naver.com · dnltlsdud@naver.com';
      emailInput.closest('label')?.insertAdjacentElement('afterend', helper);
    }
  }

  function ensureAuthFeedback() {
    addStyles();
    const form = document.querySelector('#authForm');
    if (!form) return;

    ensureEmailOptions(form);

    let status = document.querySelector('#authStatus');
    if (!status) {
      status = document.createElement('div');
      status.id = 'authStatus';
      status.className = 'auth-status info';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      form.insertAdjacentElement('afterend', status);
    }

    if (!document.querySelector('#verificationPanel')) {
      const panel = document.createElement('section');
      panel.id = 'verificationPanel';
      panel.className = 'verification-panel';
      panel.innerHTML = `
        <h2>네이버 메일 인증</h2>
        <p>아래 주소로 보낸 인증메일에서 <b>이메일 확인</b>을 누르면 앱으로 돌아와 가입이 완료됩니다.</p>
        <span class="verification-email" id="verificationEmail"></span>
        <div class="verification-actions">
          <a href="https://mail.naver.com/" target="_blank" rel="noopener">네이버 메일 열기</a>
          <button type="button" id="checkVerification" class="primary-check">인증 완료 확인</button>
          <button type="button" id="resendVerification">인증메일 다시 보내기</button>
          <button type="button" id="cancelVerification">다른 계정으로 진행</button>
        </div>
        <p class="verification-note">메일이 보이지 않으면 스팸메일함을 확인해주세요. 인증 링크는 이 앱 주소로 돌아오도록 설정되어 있습니다.</p>
      `;
      status.insertAdjacentElement('afterend', panel);
    }

    if (!document.querySelector('#toast')) {
      const toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.querySelector('.auth-card')?.appendChild(toast);
    }

    if (!document.querySelector('.auth-connection')) {
      const connection = document.createElement('div');
      connection.className = 'auth-connection';
      connection.textContent = window.__COUPLE_FINANCE_SUPABASE_CLIENT__
        ? 'Supabase 인증 연결됨'
        : 'Supabase 인증 연결 확인 중';
      document.querySelector('.auth-card')?.appendChild(connection);
    }

    const pending = getPending();
    if (pending?.email) showVerificationPanel(pending.email, false);
  }

  function showStatus(message, type = 'info') {
    ensureAuthFeedback();
    const status = document.querySelector('#authStatus');
    if (!status) return;
    status.textContent = message;
    status.className = `auth-status show ${type}`;
  }

  function showVerificationPanel(email, hideForm = true) {
    ensureAuthFeedback();
    const panel = document.querySelector('#verificationPanel');
    const form = document.querySelector('#authForm');
    const tabs = document.querySelector('.segmented');
    if (!panel) return;
    document.querySelector('#verificationEmail').textContent = email;
    panel.classList.add('show');
    if (hideForm) {
      form?.setAttribute('hidden', '');
      tabs?.setAttribute('hidden', '');
    }
  }

  function hideVerificationPanel() {
    document.querySelector('#verificationPanel')?.classList.remove('show');
    document.querySelector('#authForm')?.removeAttribute('hidden');
    document.querySelector('.segmented')?.removeAttribute('hidden');
  }

  function translateAuthError(error) {
    const raw = String(error?.message || error || '').trim();
    const lower = raw.toLowerCase();
    if (lower.includes('invalid login credentials')) return '이메일 또는 비밀번호가 맞지 않습니다.';
    if (lower.includes('email not confirmed')) return '이메일 인증이 완료되지 않았습니다. 네이버 메일의 인증 링크를 먼저 눌러주세요.';
    if (lower.includes('user already registered')) return '이미 가입된 이메일입니다. 로그인 탭에서 진행해주세요.';
    if (lower.includes('email rate limit')) return '인증메일 요청 횟수가 많습니다. 잠시 후 다시 시도해주세요.';
    if (lower.includes('signup is disabled') || lower.includes('signups not allowed')) return 'Supabase에서 이메일 회원가입이 비활성화되어 있습니다.';
    if (lower.includes('redirect') && lower.includes('not')) return '인증 후 돌아올 앱 주소가 Supabase에 허용되지 않았습니다.';
    if (lower.includes('password')) return `비밀번호를 확인해주세요. ${raw}`;
    if (lower.includes('failed to fetch') || lower.includes('network')) return 'Supabase 서버에 연결하지 못했습니다. 프로젝트 사용량과 네트워크를 확인해주세요.';
    return raw || '인증 처리 중 오류가 발생했습니다.';
  }

  async function resendVerification() {
    const client = window.__COUPLE_FINANCE_SUPABASE_CLIENT__;
    const pending = getPending();
    if (!client || !pending?.email) {
      showStatus('재발송할 가입 정보가 없습니다.', 'error');
      return;
    }
    showStatus('인증메일을 다시 보내고 있습니다.', 'info');
    const { error } = await client.auth.resend({
      type: 'signup',
      email: pending.email,
      options: { emailRedirectTo: CALLBACK_URL }
    });
    if (error) throw error;
    showStatus(`${pending.email}\n인증메일을 다시 보냈습니다.`, 'success');
  }

  async function checkVerification() {
    const client = window.__COUPLE_FINANCE_SUPABASE_CLIENT__;
    if (!client) {
      showStatus('Supabase 인증 모듈을 불러오지 못했습니다.', 'error');
      return;
    }
    showStatus('이메일 인증 상태를 확인하고 있습니다.', 'info');
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    if (data.session) {
      clearPending();
      showStatus('이메일 인증과 로그인이 완료되었습니다. 부부 공간으로 이동합니다.', 'success');
      setTimeout(() => location.replace(`${location.origin}${location.pathname}`), 500);
      return;
    }
    showStatus('아직 인증이 확인되지 않았습니다. 네이버 메일의 인증 링크를 누른 뒤 다시 확인해주세요.', 'error');
  }

  async function handleAuthSubmit(event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || form.id !== 'authForm') return;
    event.preventDefault();
    event.stopImmediatePropagation();

    ensureAuthFeedback();
    const client = window.__COUPLE_FINANCE_SUPABASE_CLIENT__;
    if (!client) {
      showStatus('Supabase 인증 모듈을 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.', 'error');
      return;
    }

    const data = new FormData(form);
    const email = normalizeEmail(data.get('email'));
    const password = String(data.get('password') || '');
    const displayName = String(data.get('displayName') || '').trim();
    const isSignup = form.querySelector('[name="displayName"]') !== null;
    const button = form.querySelector('button[type="submit"]');

    const emailInput = form.querySelector('input[name="email"]');
    if (emailInput) emailInput.value = email;

    if (!ALLOWED_EMAILS.has(email)) {
      showStatus('이 앱은 mintgus@naver.com, dnltlsdud@naver.com 두 계정만 가입·로그인할 수 있습니다.', 'error');
      return;
    }
    if (!password) {
      showStatus('비밀번호를 입력해주세요.', 'error');
      return;
    }

    if (button) {
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.textContent = isSignup ? '인증메일 발송 중…' : '로그인 중…';
    }
    showStatus(isSignup ? '네이버 인증메일을 발송하고 있습니다.' : '로그인을 확인하고 있습니다.', 'info');

    try {
      if (isSignup) {
        const { data: result, error } = await client.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName || email.split('@')[0] },
            emailRedirectTo: CALLBACK_URL
          }
        });
        if (error) throw error;

        if (result.session) {
          clearPending();
          showStatus('회원가입과 로그인이 완료되었습니다. 부부 공간으로 이동합니다.', 'success');
          setTimeout(() => location.replace(`${location.origin}${location.pathname}`), 500);
        } else {
          setPending(email, displayName);
          showStatus(`${email}\n인증메일을 보냈습니다. 메일에서 이메일 확인을 눌러주세요.`, 'success');
          showVerificationPanel(email, true);
        }
      } else {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        clearPending();
        showStatus('로그인되었습니다. 부부 공간을 불러옵니다.', 'success');
        setTimeout(() => location.replace(`${location.origin}${location.pathname}`), 350);
      }
    } catch (error) {
      console.error('Couple finance auth error:', error);
      showStatus(translateAuthError(error), 'error');
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = button.dataset.originalText || (isSignup ? '회원가입' : '로그인');
      }
    }
  }

  async function detectAuthReturn() {
    if (!location.search.includes('auth=confirmed') && !location.hash.includes('access_token') && !location.search.includes('code=')) return;
    const client = window.__COUPLE_FINANCE_SUPABASE_CLIENT__;
    if (!client) return;
    showStatus('네이버 이메일 인증 결과를 앱에서 확인하고 있습니다.', 'info');
    for (let index = 0; index < 12; index += 1) {
      const { data } = await client.auth.getSession();
      if (data.session) {
        clearPending();
        showStatus('이메일 인증이 완료되었습니다. 앱을 시작합니다.', 'success');
        setTimeout(() => location.replace(`${location.origin}${location.pathname}`), 500);
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    showStatus('인증 링크는 열렸지만 로그인 세션을 확인하지 못했습니다. 로그인 화면에서 다시 로그인해주세요.', 'error');
  }

  document.addEventListener('submit', handleAuthSubmit, true);
  document.addEventListener('click', event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.id === 'resendVerification') {
      resendVerification().catch(error => showStatus(translateAuthError(error), 'error'));
    }
    if (target.id === 'checkVerification') {
      checkVerification().catch(error => showStatus(translateAuthError(error), 'error'));
    }
    if (target.id === 'cancelVerification') {
      clearPending();
      hideVerificationPanel();
      showStatus('다른 계정으로 다시 진행할 수 있습니다.', 'info');
    }
  }, true);

  const observer = new MutationObserver(ensureAuthFeedback);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  ensureAuthFeedback();
  setTimeout(detectAuthReturn, 300);
})();