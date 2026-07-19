(() => {
  'use strict';

  const AUTH_STYLE_ID = 'couple-finance-auth-fix-style';

  function addStyles() {
    if (document.getElementById(AUTH_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = AUTH_STYLE_ID;
    style.textContent = `
      .auth-status{margin:14px 0 0;padding:12px 14px;border-radius:12px;background:#eef3ff;color:#23345d;font-size:14px;line-height:1.45;display:none}
      .auth-status.show{display:block}
      .auth-status.error{background:#fff0f0;color:#9d2424}
      .auth-status.success{background:#eefbf4;color:#17663e}
      .auth-status.info{background:#eef3ff;color:#23345d}
      .auth-card button[disabled]{opacity:.6;cursor:wait}
      .auth-connection{margin-top:12px;font-size:12px;color:#697386;text-align:center}
    `;
    document.head.appendChild(style);
  }

  function ensureAuthFeedback() {
    addStyles();
    const form = document.querySelector('#authForm');
    if (!form) return;

    let status = document.querySelector('#authStatus');
    if (!status) {
      status = document.createElement('div');
      status.id = 'authStatus';
      status.className = 'auth-status info';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      form.insertAdjacentElement('afterend', status);
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
        ? 'Supabase 연결됨'
        : 'Supabase 연결 확인 중';
      document.querySelector('.auth-card')?.appendChild(connection);
    }
  }

  function showStatus(message, type = 'info') {
    ensureAuthFeedback();
    const status = document.querySelector('#authStatus');
    if (!status) return;
    status.textContent = message;
    status.className = `auth-status show ${type}`;
  }

  function translateAuthError(error) {
    const raw = String(error?.message || error || '').trim();
    const lower = raw.toLowerCase();

    if (lower.includes('invalid login credentials')) return '이메일 또는 비밀번호가 맞지 않습니다.';
    if (lower.includes('email not confirmed')) return '이메일 인증이 완료되지 않았습니다. 받은 메일의 인증 링크를 먼저 눌러주세요.';
    if (lower.includes('user already registered')) return '이미 가입된 이메일입니다. 로그인 탭에서 진행해주세요.';
    if (lower.includes('email rate limit')) return '인증 메일 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
    if (lower.includes('signup is disabled') || lower.includes('signups not allowed')) return 'Supabase에서 이메일 회원가입이 비활성화되어 있습니다.';
    if (lower.includes('password')) return `비밀번호를 확인해주세요. ${raw}`;
    if (lower.includes('failed to fetch') || lower.includes('network')) return 'Supabase 서버에 연결하지 못했습니다. 프로젝트 사용량과 네트워크를 확인해주세요.';
    return raw || '인증 처리 중 오류가 발생했습니다.';
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
    const email = String(data.get('email') || '').trim();
    const password = String(data.get('password') || '');
    const displayName = String(data.get('displayName') || '').trim();
    const isSignup = form.querySelector('[name="displayName"]') !== null;
    const button = form.querySelector('button[type="submit"]');

    if (!email || !password) {
      showStatus('이메일과 비밀번호를 입력해주세요.', 'error');
      return;
    }

    if (button) {
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.textContent = isSignup ? '가입 처리 중…' : '로그인 중…';
    }
    showStatus(isSignup ? '회원가입을 처리하고 있습니다.' : '로그인을 확인하고 있습니다.', 'info');

    try {
      if (isSignup) {
        const redirectTo = `${location.origin}${location.pathname}`;
        const { data: result, error } = await client.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName || email.split('@')[0] },
            emailRedirectTo: redirectTo
          }
        });
        if (error) throw error;

        if (result.session) {
          showStatus('회원가입과 로그인이 완료되었습니다. 부부 공간 설정으로 이동합니다.', 'success');
          setTimeout(() => location.reload(), 500);
        } else {
          showStatus('회원가입이 완료되었습니다. 받은 인증 메일의 링크를 누른 뒤 로그인해주세요. 메일이 없으면 스팸함도 확인해주세요.', 'success');
        }
      } else {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showStatus('로그인되었습니다. 부부 공간을 불러옵니다.', 'success');
        setTimeout(() => location.reload(), 350);
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

  document.addEventListener('submit', handleAuthSubmit, true);
  const observer = new MutationObserver(ensureAuthFeedback);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  ensureAuthFeedback();
})();
