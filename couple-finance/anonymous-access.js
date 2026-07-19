(() => {
  'use strict';

  const STYLE_ID = 'couple-finance-anonymous-access-style';
  const ACCOUNTS = [
    { key: 'hyunjo', name: '현조', description: '현조 계정 생성 후 우리집 공간을 만듭니다.' },
    { key: 'shinyoung', name: '신영', description: '신영 계정 생성 후 초대코드로 참여합니다.' }
  ];

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .simple-auth-card{max-width:430px}
      .simple-auth-card .simple-copy{margin:0 0 18px;color:#64748b;font-size:14px;line-height:1.55}
      .simple-account-list{display:grid;gap:10px;margin-top:18px}
      .simple-account-button{width:100%;display:flex;align-items:center;gap:13px;text-align:left;padding:15px;border:1px solid #d7e0ee;border-radius:15px;background:white;color:#17233f;box-shadow:0 7px 22px rgba(35,52,93,.06)}
      .simple-account-button:active{transform:scale(.99)}
      .simple-account-button[disabled]{opacity:.58;cursor:wait}
      .simple-account-avatar{width:43px;height:43px;border-radius:14px;display:grid;place-items:center;background:#17233f;color:white;font-size:17px;font-weight:900;flex:0 0 auto}
      .simple-account-text{display:grid;gap:3px}
      .simple-account-text b{font-size:16px}
      .simple-account-text span{font-size:12px;line-height:1.4;color:#718096}
      .simple-auth-status{display:none;margin-top:15px;padding:12px 14px;border-radius:12px;font-size:13px;line-height:1.5;white-space:pre-line}
      .simple-auth-status.show{display:block}
      .simple-auth-status.info{background:#eef3ff;color:#25375d}
      .simple-auth-status.error{background:#fff0f0;color:#9b2727}
      .simple-security-note{margin-top:16px;color:#7a879a;font-size:11px;line-height:1.5;text-align:center}
    `;
    document.head.appendChild(style);
  }

  function status(message, type = 'info') {
    const node = document.querySelector('#simpleAuthStatus');
    if (!node) return;
    node.textContent = message;
    node.className = `simple-auth-status show ${type}`;
  }

  async function createAnonymousAccount(account, button) {
    const client = window.__COUPLE_FINANCE_SUPABASE_CLIENT__;
    if (!client) {
      status('Supabase 연결을 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.', 'error');
      return;
    }

    const original = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<span class="simple-account-avatar">${account.name.slice(0, 1)}</span><span class="simple-account-text"><b>${account.name} 계정 생성 중…</b><span>잠시만 기다려주세요.</span></span>`;
    status(`${account.name} 계정을 생성하고 있습니다.`, 'info');

    try {
      const { data, error } = await client.auth.signInAnonymously({
        options: {
          data: {
            display_name: account.name,
            couple_account: account.key
          }
        }
      });
      if (error) throw error;
      if (!data?.session) throw new Error('계정 세션을 만들지 못했습니다.');

      localStorage.setItem('couple-finance-account-name', account.name);
      status(`${account.name} 계정이 생성되었습니다. 부부 공간 설정으로 이동합니다.`, 'info');
      setTimeout(() => location.reload(), 450);
    } catch (error) {
      console.error('Anonymous account error:', error);
      const raw = String(error?.message || error || '');
      if (/anonymous.*disabled|anonymous sign-ins are disabled|signup is disabled/i.test(raw)) {
        status('Supabase에서 익명 로그인이 비활성화되어 있습니다. 관리자 설정에서 “Allow anonymous sign-ins”를 켜야 합니다.', 'error');
      } else if (/rate limit/i.test(raw)) {
        status('계정 생성 요청이 많습니다. 잠시 후 다시 시도해주세요.', 'error');
      } else {
        status(raw || '계정 생성 중 오류가 발생했습니다.', 'error');
      }
      button.disabled = false;
      button.innerHTML = original;
    }
  }

  function replaceAuthView() {
    addStyles();
    const card = document.querySelector('.auth-card');
    if (!card || card.dataset.simpleAuthReady === 'true') return;
    card.dataset.simpleAuthReady = 'true';
    card.classList.add('simple-auth-card');
    card.innerHTML = `
      <div class="brand-mark">₩</div>
      <h1>우리집 자산흐름</h1>
      <p class="simple-copy">이메일 인증 없이 사용할 사람을 선택하면 계정이 바로 생성됩니다. 각 휴대폰에서 한 번씩 진행하세요.</p>
      <div class="simple-account-list">
        ${ACCOUNTS.map((account, index) => `
          <button type="button" class="simple-account-button" data-anonymous-account="${index}">
            <span class="simple-account-avatar">${account.name.slice(0, 1)}</span>
            <span class="simple-account-text"><b>${account.name} 계정 생성</b><span>${account.description}</span></span>
          </button>
        `).join('')}
      </div>
      <div id="simpleAuthStatus" class="simple-auth-status info" role="status" aria-live="polite"></div>
      <div class="simple-security-note">계정은 현재 휴대폰에 안전하게 유지됩니다. 앱 데이터 삭제 또는 브라우저 초기화 시 다시 생성해야 합니다.</div>
    `;
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-anonymous-account]');
    if (!button) return;
    const account = ACCOUNTS[Number(button.dataset.anonymousAccount)];
    if (!account) return;
    createAnonymousAccount(account, button);
  }, true);

  const observer = new MutationObserver(replaceAuthView);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  replaceAuthView();
})();
