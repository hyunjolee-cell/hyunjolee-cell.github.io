(() => {
  'use strict';

  const ACCOUNTS = [
    { email: 'mintgus@naver.com', displayName: '현조', label: '현조 계정 만들기' },
    { email: 'dnltlsdud@naver.com', displayName: '신영', label: '신영 계정 만들기' }
  ];
  const PASSWORD = '231201';
  const STYLE_ID = 'couple-finance-quick-account-style';

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .quick-account-box{margin:14px 0 16px;padding:15px;border:1px solid #dce5f4;border-radius:15px;background:#f7f9fd}
      .quick-account-box h2{margin:0 0 5px;font-size:16px;color:#17233f}
      .quick-account-box p{margin:0 0 12px;font-size:12px;line-height:1.45;color:#68758c}
      .quick-account-grid{display:grid;grid-template-columns:1fr;gap:8px}
      .quick-account-button{min-height:46px;border:1px solid #cdd8e9;border-radius:11px;background:white;color:#1d2a45;font-weight:800;font-size:14px}
      .quick-account-button:active{transform:scale(.99)}
      .quick-account-password{margin-top:10px;font-size:11px;color:#7a879b;text-align:center}
    `;
    document.head.appendChild(style);
  }

  function waitFor(selector, timeout = 2500) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(selector);
      if (existing) {
        resolve(existing);
        return;
      }
      const started = Date.now();
      const timer = setInterval(() => {
        const node = document.querySelector(selector);
        if (node) {
          clearInterval(timer);
          resolve(node);
        } else if (Date.now() - started > timeout) {
          clearInterval(timer);
          reject(new Error(`${selector}를 찾지 못했습니다.`));
        }
      }, 50);
    });
  }

  async function createAccount(account, button) {
    const original = button.textContent;
    button.disabled = true;
    button.textContent = '계정 생성 준비 중…';
    try {
      const signupTab = document.querySelector('[data-auth-mode="signup"]');
      signupTab?.click();

      const form = await waitFor('#authForm');
      const emailInput = form.querySelector('[name="email"]');
      const passwordInput = form.querySelector('[name="password"]');
      const nameInput = form.querySelector('[name="displayName"]');

      if (!emailInput || !passwordInput || !nameInput) {
        throw new Error('회원가입 입력 화면을 준비하지 못했습니다.');
      }

      emailInput.value = account.email;
      passwordInput.value = PASSWORD;
      nameInput.value = account.displayName;
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));

      button.textContent = '계정 생성 요청 중…';
      form.requestSubmit();
    } catch (error) {
      console.error('Quick account creation error:', error);
      alert(error.message || '계정 생성 화면을 준비하지 못했습니다.');
      button.disabled = false;
      button.textContent = original;
    }
  }

  function inject() {
    addStyles();
    const card = document.querySelector('.auth-card');
    const segmented = card?.querySelector('.segmented');
    if (!card || !segmented || card.querySelector('#quickAccountBox')) return;

    const box = document.createElement('section');
    box.id = 'quickAccountBox';
    box.className = 'quick-account-box';
    box.innerHTML = `
      <h2>부부 계정 만들기</h2>
      <p>아래 계정을 선택하면 이메일과 비밀번호가 자동 입력되고 회원가입이 바로 진행됩니다.</p>
      <div class="quick-account-grid">
        ${ACCOUNTS.map((account, index) => `<button type="button" class="quick-account-button" data-quick-account="${index}">${account.label}<br><small>${account.email}</small></button>`).join('')}
      </div>
      <div class="quick-account-password">초기 비밀번호: ${PASSWORD}</div>
    `;
    segmented.insertAdjacentElement('beforebegin', box);
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-quick-account]');
    if (!button) return;
    const account = ACCOUNTS[Number(button.dataset.quickAccount)];
    if (!account) return;
    createAccount(account, button);
  }, true);

  const observer = new MutationObserver(inject);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  inject();
})();
