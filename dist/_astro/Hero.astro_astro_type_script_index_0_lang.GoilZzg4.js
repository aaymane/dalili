import{W as E,S as b,O as L,j as S,n as M,V as f,M as k,e as I}from"./three.module.DBbI7mzw.js";const r=document.getElementById("hero-canvas");if(!r)throw new Error("Hero canvas missing");const a=()=>r.clientWidth,s=()=>r.clientHeight,l=new E({canvas:r,alpha:!1,antialias:!1});l.setPixelRatio(Math.min(window.devicePixelRatio,1.5));l.setSize(a(),s());const g=new b,R=new L(-1,1,1,-1,0,1),T=`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,A=`
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
  `,B=new S(2,2),m=new M({vertexShader:T,fragmentShader:A,uniforms:{uTime:{value:0},uResolution:{value:new f(a(),s())},uMouse:{value:new f(.5,.5)}},depthWrite:!1});g.add(new k(B,m));document.addEventListener("mousemove",e=>{m.uniforms.uMouse.value.set(e.clientX/window.innerWidth,1-e.clientY/window.innerHeight)},{passive:!0});const C=new I,y=()=>{requestAnimationFrame(y),m.uniforms.uTime.value=C.getElapsedTime(),l.render(g,R)};y();window.addEventListener("resize",()=>{l.setSize(a(),s()),m.uniforms.uResolution.value.set(a(),s())},{passive:!0});const n=Array.from(document.querySelectorAll(".dl-hero-rotate"));let o=0;setInterval(()=>{n[o].classList.remove("active"),n[o].classList.add("exit");const e=o;setTimeout(()=>n[e].classList.remove("exit"),460),o=(o+1)%n.length,n[o].classList.add("active")},2400);window.matchMedia("(hover: hover)").matches&&document.querySelectorAll("[data-magnetic]").forEach(e=>{let t=0;e.addEventListener("mousemove",u=>{const i=e.getBoundingClientRect(),w=(u.clientX-(i.left+i.width/2))*.28,x=(u.clientY-(i.top+i.height/2))*.28;cancelAnimationFrame(t),t=requestAnimationFrame(()=>{e.style.transform=`translate(${w}px,${x}px)`})}),e.addEventListener("mouseleave",()=>{cancelAnimationFrame(t),e.style.transition="transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",e.style.transform="",setTimeout(()=>{e.style.transition=""},500)})});const F=document.getElementById("hero-form"),d=document.getElementById("hero-email"),v=document.getElementById("hero-submit"),c=document.getElementById("hero-form-error"),h=document.getElementById("hero-success"),p=document.getElementById("hero-form-track");d?.addEventListener("input",()=>{c&&(c.textContent="")});F?.addEventListener("submit",async e=>{e.preventDefault();const t=d?.value.trim()??"";if(!t||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)){c&&(c.textContent="Entre un email valide pour continuer."),d?.focus();return}if(v){v.classList.add("loading"),v.disabled=!0;try{await fetch("https://formspree.io/f/YOUR_FORM_ID",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({email:t,source:"dalili-hero"})})}catch{}p&&(p.style.display="none"),h&&(h.hidden=!1)}});
