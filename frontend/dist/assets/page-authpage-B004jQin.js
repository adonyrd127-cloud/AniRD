import{d as l}from"./page-homepage-BLqD5dcZ.js";class g{constructor(){this.tokenKey="anird_auth_token",this.userKey="anird_user",this.host=window.location.hostname||"localhost",this.baseUrl=`http://${this.host}:3005/api/v1/auth`,this.userUrl=`http://${this.host}:3005/api/v1/user`}getToken(){return localStorage.getItem(this.tokenKey)}getUser(){const e=localStorage.getItem(this.userKey);return e?JSON.parse(e):null}isLoggedIn(){return!!this.getToken()}async login(e,s){try{const t=await(await fetch(`${this.baseUrl}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:s})})).json();if(!t.success)throw new Error(t.message);return localStorage.setItem(this.tokenKey,t.token),localStorage.setItem(this.userKey,JSON.stringify(t.user)),t}catch(r){throw console.error("Fetch error:",r),new Error(`Error de conexión al servidor (${this.baseUrl}).`)}}async register(e,s){try{const t=await(await fetch(`${this.baseUrl}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:s})})).json();if(!t.success)throw new Error(t.message);return localStorage.setItem(this.tokenKey,t.token),localStorage.setItem(this.userKey,JSON.stringify(t.user)),t}catch(r){throw console.error("Fetch error:",r),new Error(`Error de conexión al servidor (${this.baseUrl}). Asegúrate de que el puerto 3005 esté abierto.`)}}logout(){localStorage.removeItem(this.tokenKey),localStorage.removeItem(this.userKey),window.location.href="/"}async syncWithServer(e){return this.isLoggedIn()?await(await fetch(`${this.userUrl}/sync`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.getToken()}`},body:JSON.stringify(e)})).json():null}async fetchFromServer(){if(!this.isLoggedIn())return null;const s=await(await fetch(`${this.userUrl}/sync`,{headers:{Authorization:`Bearer ${this.getToken()}`}})).json();return s.success?s.syncData:null}}const i=new g;class y{constructor(e){this.params=e,this.mode="login"}async render(){const e=document.createElement("div");return e.className="auth-container",e.innerHTML=`
      <div class="auth-card page-enter">
        <div class="auth-header">
          <img src="/favicon.ico" alt="AniRD Logo" class="auth-logo">
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
          <button type="submit" class="btn-primary auth-submit" style="width: 100%; padding: 12px; background: var(--accent); color: white; border-radius: 8px; font-weight: bold; cursor: pointer;">
            <span id="submit-text">Iniciar Sesión</span>
            <div class="loader-small hidden" id="auth-loader"></div>
          </button>
        </form>

        <div class="auth-footer">
          <p>Al entrar, tus favoritos e historial se guardarán de forma segura en tu Orange Pi.</p>
        </div>
      </div>
    `,e}async afterRender(){const e=document.getElementById("auth-form"),s=document.getElementById("tab-login"),r=document.getElementById("tab-register"),t=document.getElementById("submit-text"),o=document.getElementById("auth-error"),n=document.getElementById("auth-loader");s.addEventListener("click",()=>{this.mode="login",s.classList.add("active"),r.classList.remove("active"),t.textContent="Iniciar Sesión",o.classList.add("hidden")}),r.addEventListener("click",()=>{this.mode="register",r.classList.add("active"),s.classList.remove("active"),t.textContent="Crear Cuenta",o.classList.add("hidden")}),e.addEventListener("submit",async h=>{h.preventDefault();const d=document.getElementById("username").value,c=document.getElementById("password").value;o.classList.add("hidden"),n.classList.remove("hidden"),t.classList.add("hidden");try{let a;if(this.mode==="login"?a=await i.login(d,c):a=await i.register(d,c),a.syncData)await l.syncFromServer(a.syncData);else{const m=await l.getAllData();await i.syncWithServer(m)}window.updateNavbarAuth&&window.updateNavbarAuth(),window.location.href="/profile"}catch(a){o.textContent=a.message,o.classList.remove("hidden")}finally{n.classList.add("hidden"),t.classList.remove("hidden")}})}}const v=Object.freeze(Object.defineProperty({__proto__:null,default:y},Symbol.toStringTag,{value:"Module"}));export{v as A,i as a};
