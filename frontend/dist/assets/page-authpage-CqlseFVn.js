import{c as d,d as c}from"./page-homepage-CrySyT2k.js";import"./vendor-DIPEJTOH.js";class g{constructor(e){this.params=e,this.mode="login"}async render(){const e=document.createElement("div");return e.className="auth-container",e.innerHTML=`
      <div class="login-bg">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
      </div>
      <div class="auth-card glass-card page-enter">
        <div class="auth-header">
          <img src="/favicon.png" alt="AniRD Logo" class="auth-logo" style="width: 80px; height: 80px; margin-bottom: 15px; filter: drop-shadow(0 0 15px rgba(255, 0, 85, 0.5)); animation: pulseLogo 3s infinite ease-in-out;">
          <h1>AniRD Cloud</h1>
          <p>Sincroniza tus animes en todos tus dispositivos</p>
        </div>
        
        <div class="auth-tabs">
          <button class="auth-tab active" id="tab-login">Entrar</button>
          <button class="auth-tab" id="tab-register">Registrarse</button>
        </div>

        <form id="auth-form" class="auth-form">
          <div class="form-group">
            <label for="username">Usuario</label>
            <input type="text" id="username" placeholder="Tu nombre de usuario" required autocomplete="username">
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" placeholder="••••••••" required autocomplete="current-password">
          </div>
          <div id="auth-error" class="auth-error hidden"></div>
          <button type="submit" class="auth-submit-btn">
            <span id="submit-text">Iniciar Sesión</span>
            <div class="loader-small hidden" id="auth-loader"></div>
          </button>
        </form>

        <div class="auth-footer">
          <p>Al entrar, tus favoritos e historial se guardarán de forma segura en tu Orange Pi.</p>
        </div>
      </div>
    `,e}async afterRender(){const e=document.getElementById("auth-form"),i=document.getElementById("tab-login"),r=document.getElementById("tab-register"),s=document.getElementById("submit-text"),a=document.getElementById("auth-error"),o=document.getElementById("auth-loader");i.addEventListener("click",()=>{this.mode="login",i.classList.add("active"),r.classList.remove("active"),s.textContent="Iniciar Sesión",a.classList.add("hidden")}),r.addEventListener("click",()=>{this.mode="register",r.classList.add("active"),i.classList.remove("active"),s.textContent="Crear Cuenta",a.classList.add("hidden")}),e.addEventListener("submit",async u=>{u.preventDefault();const n=document.getElementById("username").value,l=document.getElementById("password").value;a.classList.add("hidden"),o.classList.remove("hidden"),s.classList.add("hidden");try{let t;if(this.mode==="login"?t=await d.login(n,l):t=await d.register(n,l),t.syncData)await c.syncFromServer(t.syncData);else{const m=await c.getAllData();await d.syncWithServer(m)}window.updateNavbarAuth&&window.updateNavbarAuth(),window.location.href="/profile"}catch(t){a.textContent=t.message,a.classList.remove("hidden")}finally{o.classList.add("hidden"),s.classList.remove("hidden")}})}}export{g as default};
