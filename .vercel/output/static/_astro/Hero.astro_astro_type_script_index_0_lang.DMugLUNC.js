import{W as E,S as b,O as L,j as S,n as k,V as f,M as C,e as M}from"./three.module.DBbI7mzw.js";const m=document.getElementById("hero-canvas");if(!m)throw new Error("Hero canvas missing");const c=()=>m.clientWidth,l=()=>m.clientHeight,d=new E({canvas:m,alpha:!1,antialias:!1});d.setPixelRatio(Math.min(window.devicePixelRatio,1.5));d.setSize(c(),l());const g=new b,T=new L(-1,1,1,-1,0,1),A=`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,B=`
    precision highp float;
    uniform float uTime;
    uniform vec2  uResolution;
    uniform vec2  uMouse;
    varying vec2  vUv;

    /* ── Hash & noise ── */
    float hash(vec2 p) {
      p = fract(p * vec2(234.34, 435.345));
      p += dot(p, p + 34.23);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), u.x),
        mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
        u.y
      );
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      mat2  rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      for (int i = 0; i < 7; i++) {
        v += a * noise(p);
        p  = rot * p * 2.0 + vec2(1.7, 9.2);
        a *= 0.48;
      }
      return v;
    }

    void main() {
      vec2 uv = vUv;
      float t  = uTime * 0.055;

      /* warp-in-warp domain distortion */
      vec2 p  = uv * 2.8;
      float n1 = fbm(p  + t + vec2(1.7, 9.2));
      float n2 = fbm(p  + n1 * 0.85 + t * 0.55 + vec2(8.3, 2.8));
      float n  = fbm(p  + n2 * 0.75 + t * 0.35);

      /* colour palette */
      vec3 dark  = vec3(0.008, 0.014, 0.055);   /* deep space */
      vec3 mid   = vec3(0.01,  0.22,  0.88);    /* electric blue */
      vec3 lite  = vec3(0.28,  0.52,  1.00);    /* soft blue */
      vec3 vio   = vec3(0.35,  0.10,  0.75);    /* violet accent */

      vec3 col = dark;
      col = mix(col, mid,  smoothstep(0.30, 0.52, n));
      col = mix(col, lite, smoothstep(0.50, 0.66, n) * 0.45);
      col = mix(col, vio,  smoothstep(0.60, 0.75, n) * 0.20);

      /* radial vignette — darker at edges */
      float vig = 1.0 - length(uv - 0.5) * 1.6;
      col *= clamp(vig, 0.0, 1.0);

      /* subtle mouse-reactive glow */
      float md  = length(uv - uMouse);
      col += vec3(0.015, 0.06, 0.22) * smoothstep(0.35, 0.0, md) * 0.8;

      /* overall dimming to stay dark */
      col *= 0.82;

      gl_FragColor = vec4(col, 1.0);
    }
  `,I=new S(2,2),v=new k({vertexShader:A,fragmentShader:B,uniforms:{uTime:{value:0},uResolution:{value:new f(c(),l())},uMouse:{value:new f(.5,.5)}},depthWrite:!1});g.add(new C(I,v));document.addEventListener("mousemove",e=>{v.uniforms.uMouse.value.set(e.clientX/window.innerWidth,1-e.clientY/window.innerHeight)},{passive:!0});const R=new M,w=()=>{requestAnimationFrame(w),v.uniforms.uTime.value=R.getElapsedTime(),d.render(g,T)};w();window.addEventListener("resize",()=>{d.setSize(c(),l()),v.uniforms.uResolution.value.set(c(),l())},{passive:!0});const r=Array.from(document.querySelectorAll(".dl-hero-rotate"));let a=0;setInterval(()=>{r[a].classList.remove("active"),r[a].classList.add("exit");const e=a;setTimeout(()=>r[e].classList.remove("exit"),460),a=(a+1)%r.length,r[a].classList.add("active")},2400);window.matchMedia("(hover: hover)").matches&&document.querySelectorAll("[data-magnetic]").forEach(e=>{let o=0;e.addEventListener("mousemove",s=>{const i=e.getBoundingClientRect(),y=(s.clientX-(i.left+i.width/2))*.28,x=(s.clientY-(i.top+i.height/2))*.28;cancelAnimationFrame(o),o=requestAnimationFrame(()=>{e.style.transform=`translate(${y}px,${x}px)`})}),e.addEventListener("mouseleave",()=>{cancelAnimationFrame(o),e.style.transition="transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",e.style.transform="",setTimeout(()=>{e.style.transition=""},500)})});const W=document.getElementById("hero-form"),u=document.getElementById("hero-email"),n=document.getElementById("hero-submit"),t=document.getElementById("hero-form-error"),h=document.getElementById("hero-success"),p=document.getElementById("hero-form-track");u?.addEventListener("input",()=>{t&&(t.textContent="")});W?.addEventListener("submit",async e=>{e.preventDefault();const o=u?.value.trim()??"";if(!o||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o)){t&&(t.textContent="Entre un email valide pour continuer."),u?.focus();return}if(n){n.classList.add("loading"),n.disabled=!0;try{const s=await fetch("/api/waitlist",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({email:o,source:"dalili-hero"})}),i=await s.json();if(!s.ok){n.classList.remove("loading"),n.disabled=!1,t&&(t.textContent=i.error??"Une erreur est survenue.");return}}catch{n.classList.remove("loading"),n.disabled=!1,t&&(t.textContent="Vérife ta connexion et réessaie.");return}p&&(p.style.display="none"),h&&(h.hidden=!1)}});
