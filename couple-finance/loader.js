(async()=>{
  const paths=Array.from({length:9},(_,i)=>`./chunks/app-${String(i+1).padStart(3,'0')}.txt`);
  try{
    const parts=await Promise.all(paths.map(async path=>{
      const response=await fetch(path,{cache:'no-store'});
      if(!response.ok) throw new Error(`${path} 로드 실패 (${response.status})`);
      return response.text();
    }));
    new Function(parts.join(''))();
  }catch(error){
    document.querySelector('#app').innerHTML=`<div style="padding:32px;font-family:sans-serif"><h2>앱을 불러오지 못했습니다</h2><p>${String(error.message||error)}</p><button onclick="location.reload()">다시 시도</button></div>`;
  }
})();
