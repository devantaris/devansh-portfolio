(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,66674,e=>{"use strict";var t=e.i(22716),o=e.i(46102),i=e.i(70113),n=e.i(9353);function r(){let e=(0,o.useRef)(null);return(0,o.useEffect)(()=>{let t,o=e.current;if(!o)return;let r=new i.Scene,s=new i.PerspectiveCamera(60,o.clientWidth/o.clientHeight,.1,1e3);s.position.set(0,0,95);let l=new n.WebGLRenderer({canvas:o,antialias:!0,alpha:!0,powerPreference:"high-performance"});l.setSize(o.clientWidth,o.clientHeight),l.setPixelRatio(Math.min(window.devicePixelRatio,1.5));let a=8/3,c=28,d=28,u=new Float32Array(42e3),v=new Float32Array(42e3),m=Array.from({length:14e3},()=>({x:(Math.random()-.5)*40,y:(Math.random()-.5)*40,z:50*Math.random()})),h=[new i.Color("#00e5ff"),new i.Color("#b500fa"),new i.Color("#ff5500")];for(let e=0;e<14e3;e++){u[3*e]=m[e].x,u[3*e+1]=m[e].y,u[3*e+2]=m[e].z;let t=e/14e3,o=new i.Color;t<.5?o.copy(h[0]).lerp(h[1],2*t):o.copy(h[1]).lerp(h[2],(t-.5)*2),v[3*e]=o.r,v[3*e+1]=o.g,v[3*e+2]=o.b}let p=new i.BufferGeometry;p.setAttribute("position",new i.BufferAttribute(u,3)),p.setAttribute("color",new i.BufferAttribute(v,3));let w=new i.ShaderMaterial({uniforms:{uTime:{value:0},uMouse:{value:new i.Vector2(0,0)}},vertexShader:`
                uniform float uTime;
                uniform vec2 uMouse;
                
                varying vec3 vColor;
                varying float vDist;

                void main() {
                    vColor = color;
                    vec3 pos = position;

                    // Continuous wave
                    pos.x += sin(pos.z * 0.05 + uTime) * 0.4;
                    pos.y += cos(pos.x * 0.05 + uTime) * 0.4;

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    vec4 projectedPos = projectionMatrix * mvPosition;

                    vec2 ndcPos = projectedPos.xy / projectedPos.w;
                    float dist = length(ndcPos - uMouse);
                    vDist = dist;

                    float sizeMultiplier = 1.0;
                    if (dist < 0.4) {
                        sizeMultiplier = 1.0 + (0.4 - dist) * 2.5;
                        projectedPos.xy += normalize(ndcPos - uMouse) * (0.4 - dist) * 0.08 * projectedPos.w;
                    }

                    gl_PointSize = sizeMultiplier * 1.1 * (300.0 / -mvPosition.z);
                    gl_Position = projectedPos;
                }
            `,fragmentShader:`
                varying vec3 vColor;
                varying float vDist;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    float alpha = (1.0 - smoothstep(0.0, 0.5, dist));
                    
                    float glow = 1.0;
                    if (vDist < 0.4) {
                        glow = 1.0 + (0.4 - vDist) * 1.2;
                    }

                    gl_FragColor = vec4(vColor * glow, alpha * 0.85);
                }
            `,transparent:!0,blending:i.AdditiveBlending,depthWrite:!1}),f=new i.Points(p,w);r.add(f);let y=0,g=0,x=!1,P={x:0,y:0},M=0,b=0,z=e=>{let t=o.getBoundingClientRect();if(y=(e.clientX-t.left)/o.clientWidth*2-1,g=-(2*((e.clientY-t.top)/o.clientHeight))+1,x){let t={x:e.clientX-P.x,y:e.clientY-P.y};b=.006*t.x,M=.006*t.y}P={x:e.clientX,y:e.clientY}},E=e=>{x=!0,P={x:e.clientX,y:e.clientY}},C=()=>{x=!1},L=()=>{d=28+40*(window.scrollY/(document.documentElement.scrollHeight-window.innerHeight))};o.addEventListener("mousedown",E),window.addEventListener("mousemove",z,{passive:!0}),window.addEventListener("mouseup",C),window.addEventListener("scroll",L,{passive:!0});let A=e=>{e.touches.length>0&&(x=!0,P={x:e.touches[0].clientX,y:e.touches[0].clientY})},j=e=>{if(x&&e.touches.length>0){let t={x:e.touches[0].clientX-P.x,y:e.touches[0].clientY-P.y};b=.01*t.x,M=.01*t.y,P={x:e.touches[0].clientX,y:e.touches[0].clientY}}};o.addEventListener("touchstart",A,{passive:!0}),o.addEventListener("touchmove",j,{passive:!0}),o.addEventListener("touchend",C);let T=new i.Clock,R=()=>{t=requestAnimationFrame(R);let e=T.getElapsedTime();c+=(d-c)*.05;let o=p.attributes.position,i=o.array;for(let e=0;e<14e3;e++){let t=m[e],o=10*(t.y-t.x)*.007,n=(t.x*(c-t.z)-t.y)*.007,r=(t.x*t.y-a*t.z)*.007;t.x+=o,t.y+=n,t.z+=r,(Math.abs(t.x)>150||Math.abs(t.y)>150||t.z>200)&&(t.x=(Math.random()-.5)*20,t.y=(Math.random()-.5)*20,t.z=40*Math.random()),i[3*e]=t.x,i[3*e+1]=t.y,i[3*e+2]=t.z-25}o.needsUpdate=!0,f.rotation.y+=b,f.rotation.x+=M,b*=.94,M*=.94,x||(f.rotation.y+=.0035),w.uniforms.uTime.value=e,w.uniforms.uMouse.value.set(y,g),l.render(r,s)};R();let S=new ResizeObserver(()=>{let e,t;return e=o.clientWidth,void(s.aspect=e/(t=o.clientHeight),s.updateProjectionMatrix(),l.setSize(e,t,!1))});return S.observe(o),()=>{cancelAnimationFrame(t),o.removeEventListener("mousedown",E),window.removeEventListener("mousemove",z),window.removeEventListener("mouseup",C),window.removeEventListener("scroll",L),o.removeEventListener("touchstart",A),o.removeEventListener("touchmove",j),o.removeEventListener("touchend",C),S.disconnect(),p.dispose(),w.dispose(),l.dispose()}},[]),(0,t.jsx)("canvas",{ref:e,style:{width:"100%",height:"100%",display:"block",cursor:"grab"}})}e.s(["default",()=>r])},76915,e=>{e.n(e.i(66674))}]);