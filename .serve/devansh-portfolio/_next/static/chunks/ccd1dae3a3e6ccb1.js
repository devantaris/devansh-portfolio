(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,78186,e=>{"use strict";var t=e.i(22716),r=e.i(46102),i=e.i(70113),s=e.i(9353);let o={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var a=i;class l{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}let n=new a.OrthographicCamera(-1,1,1,-1,0,1);class h extends a.BufferGeometry{constructor(){super(),this.setAttribute("position",new a.Float32BufferAttribute([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new a.Float32BufferAttribute([0,2,0,0,2,0],2))}}let u=new h;class d{constructor(e){this._mesh=new a.Mesh(u,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,n)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class c extends l{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof i.ShaderMaterial?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=i.UniformsUtils.clone(e.uniforms),this.material=new i.ShaderMaterial({name:void 0!==e.name?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new d(this.material)}render(e,t,r){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=r.texture),this._fsQuad.material=this.material,this.renderToScreen?e.setRenderTarget(null):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil)),this._fsQuad.render(e)}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class f extends l{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,r){let i,s,o=e.getContext(),a=e.state;a.buffers.color.setMask(!1),a.buffers.depth.setMask(!1),a.buffers.color.setLocked(!0),a.buffers.depth.setLocked(!0),this.inverse?(i=0,s=1):(i=1,s=0),a.buffers.stencil.setTest(!0),a.buffers.stencil.setOp(o.REPLACE,o.REPLACE,o.REPLACE),a.buffers.stencil.setFunc(o.ALWAYS,i,0xffffffff),a.buffers.stencil.setClear(s),a.buffers.stencil.setLocked(!0),e.setRenderTarget(r),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),a.buffers.color.setLocked(!1),a.buffers.depth.setLocked(!1),a.buffers.color.setMask(!0),a.buffers.depth.setMask(!0),a.buffers.stencil.setLocked(!1),a.buffers.stencil.setFunc(o.EQUAL,1,0xffffffff),a.buffers.stencil.setOp(o.KEEP,o.KEEP,o.KEEP),a.buffers.stencil.setLocked(!0)}}class m extends l{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class p{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),void 0===t){const r=e.getSize(new i.Vector2);this._width=r.width,this._height=r.height,(t=new i.WebGLRenderTarget(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:i.HalfFloatType})).texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new c(o),this.copyPass.material.blending=i.NoBlending,this.clock=new i.Clock}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);-1!==t&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){void 0===e&&(e=this.clock.getDelta());let t=this.renderer.getRenderTarget(),r=!1;for(let t=0,i=this.passes.length;t<i;t++){let i=this.passes[t];if(!1!==i.enabled){if(i.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),i.render(this.renderer,this.writeBuffer,this.readBuffer,e,r),i.needsSwap){if(r){let t=this.renderer.getContext(),r=this.renderer.state.buffers.stencil;r.setFunc(t.NOTEQUAL,1,0xffffffff),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),r.setFunc(t.EQUAL,1,0xffffffff)}this.swapBuffers()}void 0!==f&&(i instanceof f?r=!0:i instanceof m&&(r=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(void 0===e){let t=this.renderer.getSize(new i.Vector2);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,(e=this.renderTarget1.clone()).setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let r=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(r,i),this.renderTarget2.setSize(r,i);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(r,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class v extends l{constructor(e,t,r=null,s=null,o=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=r,this.clearColor=s,this.clearAlpha=o,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new i.Color}render(e,t,r){let i,s,o=e.autoClear;e.autoClear=!1,null!==this.overrideMaterial&&(s=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),null!==this.clearColor&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),null!==this.clearAlpha&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),!0==this.clearDepth&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:r),!0===this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),null!==this.clearColor&&e.setClearColor(this._oldClearColor),null!==this.clearAlpha&&e.setClearAlpha(i),null!==this.overrideMaterial&&(this.scene.overrideMaterial=s),e.autoClear=o}}let g={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new i.Color(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class x extends l{constructor(e,t=1,r,s){super(),this.strength=t,this.radius=r,this.threshold=s,this.resolution=void 0!==e?new i.Vector2(e.x,e.y):new i.Vector2(256,256),this.clearColor=new i.Color(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let a=Math.round(this.resolution.x/2),l=Math.round(this.resolution.y/2);this.renderTargetBright=new i.WebGLRenderTarget(a,l,{type:i.HalfFloatType}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){const t=new i.WebGLRenderTarget(a,l,{type:i.HalfFloatType});t.texture.name="UnrealBloomPass.h"+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);const r=new i.WebGLRenderTarget(a,l,{type:i.HalfFloatType});r.texture.name="UnrealBloomPass.v"+e,r.texture.generateMipmaps=!1,this.renderTargetsVertical.push(r),a=Math.round(a/2),l=Math.round(l/2)}this.highPassUniforms=i.UniformsUtils.clone(g.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new i.ShaderMaterial({uniforms:this.highPassUniforms,vertexShader:g.vertexShader,fragmentShader:g.fragmentShader}),this.separableBlurMaterials=[];const n=[6,10,14,18,22];a=Math.round(this.resolution.x/2),l=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(n[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new i.Vector2(1/a,1/l),a=Math.round(a/2),l=Math.round(l/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1,this.compositeMaterial.uniforms.bloomFactors.value=[1,.8,.6,.4,.2],this.bloomTintColors=[new i.Vector3(1,1,1),new i.Vector3(1,1,1),new i.Vector3(1,1,1),new i.Vector3(1,1,1),new i.Vector3(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=i.UniformsUtils.clone(o.uniforms),this.blendMaterial=new i.ShaderMaterial({uniforms:this.copyUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader,premultipliedAlpha:!0,blending:i.AdditiveBlending,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new i.Color,this._oldClearAlpha=1,this._basic=new i.MeshBasicMaterial,this._fsQuad=new d(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let r=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(r,s);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(r,s),this.renderTargetsVertical[e].setSize(r,s),this.separableBlurMaterials[e].uniforms.invSize.value=new i.Vector2(1/r,1/s),r=Math.round(r/2),s=Math.round(s/2)}render(e,t,r,i,s){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let a=this.renderTargetBright;for(let t=0;t<this.nMips;t++)this._fsQuad.material=this.separableBlurMaterials[t],this.separableBlurMaterials[t].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[t].uniforms.direction.value=x.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[t]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[t].uniforms.colorTexture.value=this.renderTargetsHorizontal[t].texture,this.separableBlurMaterials[t].uniforms.direction.value=x.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[t]),e.clear(),this._fsQuad.render(e),a=this.renderTargetsVertical[t];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?e.setRenderTarget(null):e.setRenderTarget(r),this._fsQuad.render(e),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=o}_getSeparableBlurMaterial(e){let t=[],r=e/3;for(let i=0;i<e;i++)t.push(.39894*Math.exp(-.5*i*i/(r*r))/r);return new i.ShaderMaterial({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new i.Vector2(.5,.5)},direction:{value:new i.Vector2(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new i.ShaderMaterial({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}function w(){let e=(0,r.useRef)(null),o=(0,r.useRef)({x:0,y:30,z:100});return(0,r.useEffect)(()=>{let t,r=e.current;if(!r)return;let a=new i.Scene;a.fog=new i.FogExp2(131589,.001);let l=new i.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,2e3);l.position.set(0,20,100);let n=window.innerWidth<=768,h=n?1:Math.min(window.devicePixelRatio,1.5),u=new s.WebGLRenderer({canvas:r,antialias:!1,alpha:!1,powerPreference:"high-performance"});u.setSize(window.innerWidth,window.innerHeight),u.setPixelRatio(h),u.setClearColor(131589,1),u.toneMapping=i.ACESFilmicToneMapping,u.toneMappingExposure=1.2;let d=new p(u);d.setPixelRatio(h),d.addPass(new v(a,l)),n||d.addPass(new x(new i.Vector2(window.innerWidth,window.innerHeight),.6,.4,.7));let c=new i.SphereGeometry(800,32,32),f=new i.ShaderMaterial({uniforms:{time:{value:0}},vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        varying vec2 vUv;
        uniform float time;

        // Simple 2D noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1; i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m; m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vec2 p = vUv * 3.0;
          float n = snoise(p + time * 0.02) * 0.5 + 0.5;
          float n2 = snoise(p * 2.0 - time * 0.03) * 0.5 + 0.5;
          
          vec3 color1 = vec3(0.0, 0.1, 0.2); // deep cyan/blue
          vec3 color2 = vec3(0.1, 0.0, 0.2); // deep purple
          
          vec3 finalColor = mix(color1, color2, n2) * n * 0.15; // faint
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,side:i.BackSide,depthWrite:!1}),m=new i.Mesh(c,f);a.add(m);let g=[],w=e=>{let t=n?.25:1;return 0===e?Math.floor(4e3*t):1===e?Math.floor(2e3*t):Math.floor(1500*t)};for(let e=0;e<3;e++){let t=w(e),r=new Float32Array(3*t),s=new Float32Array(3*t),o=new Float32Array(t),l=new Float32Array(t);for(let e=0;e<t;e++){let t=100+800*Math.pow(Math.random(),.5),a=Math.random()*Math.PI*2,n=Math.acos(2*Math.random()-1);r[3*e]=t*Math.sin(n)*Math.cos(a),r[3*e+1]=t*Math.sin(n)*Math.sin(a),r[3*e+2]=t*Math.cos(n);let h=new i.Color,u=Math.random();u<.8?h.setHSL(0,0,.85+.15*Math.random()):u<.9?h.setHex(61695):u<.98?h.setHex(0x9d4edd):h.setHex(0xff00ff),s[3*e]=h.r,s[3*e+1]=h.g,s[3*e+2]=h.b,o[e]=3*Math.random()+1,l[e]=Math.random()}let n=new i.BufferGeometry;n.setAttribute("position",new i.BufferAttribute(r,3)),n.setAttribute("color",new i.BufferAttribute(s,3)),n.setAttribute("size",new i.BufferAttribute(o,1)),n.setAttribute("random",new i.BufferAttribute(l,1));let h=new i.ShaderMaterial({precision:"highp",uniforms:{time:{value:0},depth:{value:e},uMouse:{value:new i.Vector2(-1e3,-1e3)},uResolution:{value:new i.Vector2(window.innerWidth,window.innerHeight)}},vertexShader:`
          attribute float size;
          attribute vec3 color;
          attribute float random;
          
          varying vec3 vColor;
          varying float vOpacity;
          
          uniform float time;
          uniform float depth;
          uniform vec2 uMouse;
          uniform vec2 uResolution;

          void main() {
            vColor = color;
            vec3 pos = position;

            // Slow rotation
            float angle = time * 0.05 * (1.0 - depth * 0.3);
            mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
            pos.xy = rot * pos.xy;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            vec4 projectedPos = projectionMatrix * mvPosition;
            
            // Mouse Repulsion (Screen Space)
            vec2 ndcPos = projectedPos.xy / projectedPos.w;
            vec2 screenPos = vec2(
              (ndcPos.x * 0.5 + 0.5) * uResolution.x,
              (1.0 - (ndcPos.y * 0.5 + 0.5)) * uResolution.y
            );
            
            float distToMouse = length(screenPos - uMouse);
            float repulsionRadius = 250.0;
            
            if (distToMouse < repulsionRadius) {
              float force = (repulsionRadius - distToMouse) / repulsionRadius;
              vec2 dir = normalize(screenPos - uMouse);
              
              // Push the projected position away
              // Notice we must invert the Y direction for NDC (where +Y is up)
              vec2 pushNDC = (dir * force * 150.0) / uResolution * 2.0;
              pushNDC.y = -pushNDC.y; 
              projectedPos.xy += pushNDC * projectedPos.w;
            }

            // Chaotic Twinkling
            float twinkle = sin(time * (2.0 + random * 5.0) + random * 10.0) * 0.5 + 0.5;
            float twinkleFactor = mix(1.0, twinkle, random > 0.5 ? 0.8 : 0.2);
            
            vOpacity = twinkleFactor;

            float baseSize = size * (300.0 / -mvPosition.z);
            gl_PointSize = baseSize * twinkleFactor;
            
            gl_Position = projectedPos;
          }
        `,fragmentShader:`
          varying vec3 vColor;
          varying float vOpacity;

          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;

            float alpha = (1.0 - smoothstep(0.0, 0.5, dist)) * vOpacity;
            
            gl_FragColor = vec4(vColor, alpha);
          }
        `,transparent:!0,blending:i.AdditiveBlending,depthWrite:!1,depthTest:!1}),u=new i.Points(n,h);a.add(u),g.push(u)}let b=window.scrollY,T=()=>b=window.scrollY;window.addEventListener("scroll",T,{passive:!0});let M=0,C=0,S=-1e3,y=-1e3,_=e=>{M=(e.clientX/window.innerWidth-.5)*2,C=(e.clientY/window.innerHeight-.5)*2,S=e.clientX,y=e.clientY};window.addEventListener("mousemove",_,{passive:!0});let P=window.matchMedia("(prefers-reduced-motion: reduce)").matches,R=()=>{if(t=requestAnimationFrame(R),document.hidden)return;let e=.001*performance.now();f.uniforms.time.value=e,g.forEach(t=>{t.material instanceof i.ShaderMaterial&&(t.material.uniforms.time.value=e,t.material.uniforms.uMouse.value.set(S,y),t.material.uniforms.uResolution.value.set(window.innerWidth,window.innerHeight))});let r=Math.max(document.documentElement.scrollHeight-window.innerHeight,1),s=Math.min(b/r,1),a=8*M,n=30-20*s+5*C;o.current.x+=(a-o.current.x)*.04,o.current.y+=(n-o.current.y)*.04,o.current.z+=(100-150*s-o.current.z)*.04;let h=2*Math.sin(.1*e),u=+Math.cos(.15*e);l.position.x=o.current.x+h,l.position.y=o.current.y+u,l.position.z=o.current.z,l.lookAt(0,10,-600),d.render()};P?d.render():R();let B=()=>{l.aspect=window.innerWidth/window.innerHeight,l.updateProjectionMatrix(),u.setSize(window.innerWidth,window.innerHeight),d.setSize(window.innerWidth,window.innerHeight)};return window.addEventListener("resize",B),()=>{cancelAnimationFrame(t),window.removeEventListener("resize",B),window.removeEventListener("scroll",T),window.removeEventListener("mousemove",_),c.dispose(),f.dispose(),g.forEach(e=>{e.geometry.dispose(),e.material.dispose()}),u.dispose()}},[]),(0,t.jsx)("canvas",{ref:e,className:"fixed inset-0 -z-20 pointer-events-none",style:{background:"#020205"}})}x.BlurDirectionX=new i.Vector2(1,0),x.BlurDirectionY=new i.Vector2(0,1),e.s(["default",()=>w],78186)},87488,e=>{e.n(e.i(78186))}]);