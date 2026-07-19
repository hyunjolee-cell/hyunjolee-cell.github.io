(() => {
  'use strict';

  const api = window.supabase;
  if (!api?.createClient || api.__coupleFinanceWrapped) return;

  const originalCreateClient = api.createClient.bind(api);
  api.createClient = (...args) => {
    const client = originalCreateClient(...args);
    window.__COUPLE_FINANCE_SUPABASE_CLIENT__ = client;
    return client;
  };
  api.__coupleFinanceWrapped = true;
})();
