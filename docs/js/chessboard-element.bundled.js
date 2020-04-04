/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const e=new WeakMap,t=t=>(...s)=>{const i=t(...s);return e.set(i,!0),i},s=t=>"function"==typeof t&&e.has(t),i=void 0!==window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,r=(e,t,s=null,i=null)=>{for(;t!==s;){const s=t.nextSibling;e.insertBefore(t,i),t=s}},o=(e,t,s=null)=>{for(;t!==s;){const s=t.nextSibling;e.removeChild(t),t=s}},n={},a={},l=`{{lit-${String(Math.random()).slice(2)}}}`,c=`\x3c!--${l}--\x3e`,p=new RegExp(`${l}|${c}`),d="$lit$";class h{constructor(e,t){this.parts=[],this.element=t;const s=[],i=[],r=document.createTreeWalker(t.content,133,null,!1);let o=0,n=-1,a=0;const{strings:c,values:{length:h}}=e;for(;a<h;){const e=r.nextNode();if(null!==e){if(n++,1===e.nodeType){if(e.hasAttributes()){const t=e.attributes,{length:s}=t;let i=0;for(let e=0;e<s;e++)u(t[e].name,d)&&i++;for(;i-- >0;){const t=c[a],s=m.exec(t)[2],i=s.toLowerCase()+d,r=e.getAttribute(i);e.removeAttribute(i);const o=r.split(p);this.parts.push({type:"attribute",index:n,name:s,strings:o}),a+=o.length-1}}"TEMPLATE"===e.tagName&&(i.push(e),r.currentNode=e.content)}else if(3===e.nodeType){const t=e.data;if(t.indexOf(l)>=0){const i=e.parentNode,r=t.split(p),o=r.length-1;for(let t=0;t<o;t++){let s,o=r[t];if(""===o)s=g();else{const e=m.exec(o);null!==e&&u(e[2],d)&&(o=o.slice(0,e.index)+e[1]+e[2].slice(0,-d.length)+e[3]),s=document.createTextNode(o)}i.insertBefore(s,e),this.parts.push({type:"node",index:++n})}""===r[o]?(i.insertBefore(g(),e),s.push(e)):e.data=r[o],a+=o}}else if(8===e.nodeType)if(e.data===l){const t=e.parentNode;null!==e.previousSibling&&n!==o||(n++,t.insertBefore(g(),e)),o=n,this.parts.push({type:"node",index:n}),null===e.nextSibling?e.data="":(s.push(e),n--),a++}else{let t=-1;for(;-1!==(t=e.data.indexOf(l,t+1));)this.parts.push({type:"node",index:-1}),a++}}else r.currentNode=i.pop()}for(const e of s)e.parentNode.removeChild(e)}}const u=(e,t)=>{const s=e.length-t.length;return s>=0&&e.slice(s)===t},f=e=>-1!==e.index,g=()=>document.createComment(""),m=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class y{constructor(e,t,s){this.__parts=[],this.template=e,this.processor=t,this.options=s}update(e){let t=0;for(const s of this.__parts)void 0!==s&&s.setValue(e[t]),t++;for(const e of this.__parts)void 0!==e&&e.commit()}_clone(){const e=i?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),t=[],s=this.template.parts,r=document.createTreeWalker(e,133,null,!1);let o,n=0,a=0,l=r.nextNode();for(;n<s.length;)if(o=s[n],f(o)){for(;a<o.index;)a++,"TEMPLATE"===l.nodeName&&(t.push(l),r.currentNode=l.content),null===(l=r.nextNode())&&(r.currentNode=t.pop(),l=r.nextNode());if("node"===o.type){const e=this.processor.handleTextExpression(this.options);e.insertAfterNode(l.previousSibling),this.__parts.push(e)}else this.__parts.push(...this.processor.handleAttributeExpressions(l,o.name,o.strings,this.options));n++}else this.__parts.push(void 0),n++;return i&&(document.adoptNode(e),customElements.upgrade(e)),e}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const _=` ${l} `;class v{constructor(e,t,s,i){this.strings=e,this.values=t,this.type=s,this.processor=i}getHTML(){const e=this.strings.length-1;let t="",s=!1;for(let i=0;i<e;i++){const e=this.strings[i],r=e.lastIndexOf("\x3c!--");s=(r>-1||s)&&-1===e.indexOf("--\x3e",r+1);const o=m.exec(e);t+=null===o?e+(s?_:c):e.substr(0,o.index)+o[1]+o[2]+d+o[3]+l}return t+=this.strings[e],t}getTemplateElement(){const e=document.createElement("template");return e.innerHTML=this.getHTML(),e}}class P extends v{getHTML(){return`<svg>${super.getHTML()}</svg>`}getTemplateElement(){const e=super.getTemplateElement(),t=e.content,s=t.firstChild;return t.removeChild(s),r(t,s.firstChild),e}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const b=e=>null===e||!("object"==typeof e||"function"==typeof e),w=e=>Array.isArray(e)||!(!e||!e[Symbol.iterator]);class S{constructor(e,t,s){this.dirty=!0,this.element=e,this.name=t,this.strings=s,this.parts=[];for(let e=0;e<s.length-1;e++)this.parts[e]=this._createPart()}_createPart(){return new k(this)}_getValue(){const e=this.strings,t=e.length-1;let s="";for(let i=0;i<t;i++){s+=e[i];const t=this.parts[i];if(void 0!==t){const e=t.value;if(b(e)||!w(e))s+="string"==typeof e?e:String(e);else for(const t of e)s+="string"==typeof t?t:String(t)}}return s+=e[t],s}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class k{constructor(e){this.value=void 0,this.committer=e}setValue(e){e===n||b(e)&&e===this.value||(this.value=e,s(e)||(this.committer.dirty=!0))}commit(){for(;s(this.value);){const e=this.value;this.value=n,e(this)}this.value!==n&&this.committer.commit()}}class C{constructor(e){this.value=void 0,this.__pendingValue=void 0,this.options=e}appendInto(e){this.startNode=e.appendChild(g()),this.endNode=e.appendChild(g())}insertAfterNode(e){this.startNode=e,this.endNode=e.nextSibling}appendIntoPart(e){e.__insert(this.startNode=g()),e.__insert(this.endNode=g())}insertAfterPart(e){e.__insert(this.startNode=g()),this.endNode=e.endNode,e.endNode=this.startNode}setValue(e){this.__pendingValue=e}commit(){for(;s(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=n,e(this)}const e=this.__pendingValue;e!==n&&(b(e)?e!==this.value&&this.__commitText(e):e instanceof v?this.__commitTemplateResult(e):e instanceof Node?this.__commitNode(e):w(e)?this.__commitIterable(e):e===a?(this.value=a,this.clear()):this.__commitText(e))}__insert(e){this.endNode.parentNode.insertBefore(e,this.endNode)}__commitNode(e){this.value!==e&&(this.clear(),this.__insert(e),this.value=e)}__commitText(e){const t=this.startNode.nextSibling,s="string"==typeof(e=null==e?"":e)?e:String(e);t===this.endNode.previousSibling&&3===t.nodeType?t.data=s:this.__commitNode(document.createTextNode(s)),this.value=e}__commitTemplateResult(e){const t=this.options.templateFactory(e);if(this.value instanceof y&&this.value.template===t)this.value.update(e.values);else{const s=new y(t,e.processor,this.options),i=s._clone();s.update(e.values),this.__commitNode(i),this.value=s}}__commitIterable(e){Array.isArray(this.value)||(this.value=[],this.clear());const t=this.value;let s,i=0;for(const r of e)s=t[i],void 0===s&&(s=new C(this.options),t.push(s),0===i?s.appendIntoPart(this):s.insertAfterPart(t[i-1])),s.setValue(r),s.commit(),i++;i<t.length&&(t.length=i,this.clear(s&&s.endNode))}clear(e=this.startNode){o(this.startNode.parentNode,e.nextSibling,this.endNode)}}class L{constructor(e,t,s){if(this.value=void 0,this.__pendingValue=void 0,2!==s.length||""!==s[0]||""!==s[1])throw new Error("Boolean attributes can only contain a single expression");this.element=e,this.name=t,this.strings=s}setValue(e){this.__pendingValue=e}commit(){for(;s(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=n,e(this)}if(this.__pendingValue===n)return;const e=!!this.__pendingValue;this.value!==e&&(e?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=e),this.__pendingValue=n}}class x extends S{constructor(e,t,s){super(e,t,s),this.single=2===s.length&&""===s[0]&&""===s[1]}_createPart(){return new E(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class E extends k{}let q=!1;try{const e={get capture(){return q=!0,!1}};window.addEventListener("test",e,e),window.removeEventListener("test",e,e)}catch(e){}class M{constructor(e,t,s){this.value=void 0,this.__pendingValue=void 0,this.element=e,this.eventName=t,this.eventContext=s,this.__boundHandleEvent=e=>this.handleEvent(e)}setValue(e){this.__pendingValue=e}commit(){for(;s(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=n,e(this)}if(this.__pendingValue===n)return;const e=this.__pendingValue,t=this.value,i=null==e||null!=t&&(e.capture!==t.capture||e.once!==t.once||e.passive!==t.passive),r=null!=e&&(null==t||i);i&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),r&&(this.__options=N(e),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=e,this.__pendingValue=n}handleEvent(e){"function"==typeof this.value?this.value.call(this.eventContext||this.element,e):this.value.handleEvent(e)}}const N=e=>e&&(q?{capture:e.capture,passive:e.passive,once:e.once}:e.capture);
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const A=new class{handleAttributeExpressions(e,t,s,i){const r=t[0];if("."===r){return new x(e,t.slice(1),s).parts}return"@"===r?[new M(e,t.slice(1),i.eventContext)]:"?"===r?[new L(e,t.slice(1),s)]:new S(e,t,s).parts}handleTextExpression(e){return new C(e)}};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */function $(e){let t=T.get(e.type);void 0===t&&(t={stringsArray:new WeakMap,keyString:new Map},T.set(e.type,t));let s=t.stringsArray.get(e.strings);if(void 0!==s)return s;const i=e.strings.join(l);return s=t.keyString.get(i),void 0===s&&(s=new h(e,e.getTemplateElement()),t.keyString.set(i,s)),t.stringsArray.set(e.strings,s),s}const T=new Map,O=new WeakMap,z=(e,t,s)=>{let i=O.get(t);void 0===i&&(o(t,t.firstChild),O.set(t,i=new C(Object.assign({templateFactory:$},s))),i.appendInto(t)),i.setValue(e),i.commit()};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.1.2");const j=(e,...t)=>new v(e,t,"html",A),R=(e,...t)=>new P(e,t,"svg",A),B=133;function V(e,t){const{element:{content:s},parts:i}=e,r=document.createTreeWalker(s,B,null,!1);let o=D(i),n=i[o],a=-1,l=0;const c=[];let p=null;for(;r.nextNode();){a++;const e=r.currentNode;for(e.previousSibling===p&&(p=null),t.has(e)&&(c.push(e),null===p&&(p=e)),null!==p&&l++;void 0!==n&&n.index===a;)n.index=null!==p?-1:n.index-l,o=D(i,o),n=i[o]}c.forEach(e=>e.parentNode.removeChild(e))}const U=e=>{let t=11===e.nodeType?0:1;const s=document.createTreeWalker(e,B,null,!1);for(;s.nextNode();)t++;return t},D=(e,t=-1)=>{for(let s=t+1;s<e.length;s++){const t=e[s];if(f(t))return s}return-1};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const W=(e,t)=>`${e}--${t}`;let I=!0;void 0===window.ShadyCSS?I=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),I=!1);const H=e=>t=>{const s=W(t.type,e);let i=T.get(s);void 0===i&&(i={stringsArray:new WeakMap,keyString:new Map},T.set(s,i));let r=i.stringsArray.get(t.strings);if(void 0!==r)return r;const o=t.strings.join(l);if(r=i.keyString.get(o),void 0===r){const s=t.getTemplateElement();I&&window.ShadyCSS.prepareTemplateDom(s,e),r=new h(t,s),i.keyString.set(o,r)}return i.stringsArray.set(t.strings,r),r},K=["html","svg"],F=new Set,X=(e,t,s)=>{F.add(e);const i=s?s.element:document.createElement("template"),r=t.querySelectorAll("style"),{length:o}=r;if(0===o)return void window.ShadyCSS.prepareTemplateStyles(i,e);const n=document.createElement("style");for(let e=0;e<o;e++){const t=r[e];t.parentNode.removeChild(t),n.textContent+=t.textContent}(e=>{K.forEach(t=>{const s=T.get(W(t,e));void 0!==s&&s.keyString.forEach(e=>{const{element:{content:t}}=e,s=new Set;Array.from(t.querySelectorAll("style")).forEach(e=>{s.add(e)}),V(e,s)})})})(e);const a=i.content;s?function(e,t,s=null){const{element:{content:i},parts:r}=e;if(null==s)return void i.appendChild(t);const o=document.createTreeWalker(i,B,null,!1);let n=D(r),a=0,l=-1;for(;o.nextNode();){for(l++,o.currentNode===s&&(a=U(t),s.parentNode.insertBefore(t,s));-1!==n&&r[n].index===l;){if(a>0){for(;-1!==n;)r[n].index+=a,n=D(r,n);return}n=D(r,n)}}}(s,n,a.firstChild):a.insertBefore(n,a.firstChild),window.ShadyCSS.prepareTemplateStyles(i,e);const l=a.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==l)t.insertBefore(l.cloneNode(!0),t.firstChild);else if(s){a.insertBefore(n,a.firstChild);const e=new Set;e.add(n),V(s,e)}};window.JSCompiler_renameProperty=(e,t)=>e;const Y={toAttribute(e,t){switch(t){case Boolean:return e?"":null;case Object:case Array:return null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){switch(t){case Boolean:return null!==e;case Number:return null===e?null:Number(e);case Object:case Array:return JSON.parse(e)}return e}},Q=(e,t)=>t!==e&&(t==t||e==e),J={attribute:!0,type:String,converter:Y,reflect:!1,hasChanged:Q},G=Promise.resolve(!0),Z=1,ee=4,te=8,se=16,ie=32,re="finalized";class oe extends HTMLElement{constructor(){super(),this._updateState=0,this._instanceProperties=void 0,this._updatePromise=G,this._hasConnectedResolver=void 0,this._changedProperties=new Map,this._reflectingProperties=void 0,this.initialize()}static get observedAttributes(){this.finalize();const e=[];return this._classProperties.forEach((t,s)=>{const i=this._attributeNameForProperty(s,t);void 0!==i&&(this._attributeToPropertyMap.set(i,s),e.push(i))}),e}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const e=Object.getPrototypeOf(this)._classProperties;void 0!==e&&e.forEach((e,t)=>this._classProperties.set(t,e))}}static createProperty(e,t=J){if(this._ensureClassProperties(),this._classProperties.set(e,t),t.noAccessor||this.prototype.hasOwnProperty(e))return;const s="symbol"==typeof e?Symbol():`__${e}`;Object.defineProperty(this.prototype,e,{get(){return this[s]},set(t){const i=this[e];this[s]=t,this._requestUpdate(e,i)},configurable:!0,enumerable:!0})}static finalize(){const e=Object.getPrototypeOf(this);if(e.hasOwnProperty(re)||e.finalize(),this[re]=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const e=this.properties,t=[...Object.getOwnPropertyNames(e),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e):[]];for(const s of t)this.createProperty(s,e[s])}}static _attributeNameForProperty(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}static _valueHasChanged(e,t,s=Q){return s(e,t)}static _propertyValueFromAttribute(e,t){const s=t.type,i=t.converter||Y,r="function"==typeof i?i:i.fromAttribute;return r?r(e,s):e}static _propertyValueToAttribute(e,t){if(void 0===t.reflect)return;const s=t.type,i=t.converter;return(i&&i.toAttribute||Y.toAttribute)(e,s)}initialize(){this._saveInstanceProperties(),this._requestUpdate()}_saveInstanceProperties(){this.constructor._classProperties.forEach((e,t)=>{if(this.hasOwnProperty(t)){const e=this[t];delete this[t],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(t,e)}})}_applyInstanceProperties(){this._instanceProperties.forEach((e,t)=>this[t]=e),this._instanceProperties=void 0}connectedCallback(){this._updateState=this._updateState|ie,this._hasConnectedResolver&&(this._hasConnectedResolver(),this._hasConnectedResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(e,t,s){t!==s&&this._attributeToProperty(e,s)}_propertyToAttribute(e,t,s=J){const i=this.constructor,r=i._attributeNameForProperty(e,s);if(void 0!==r){const e=i._propertyValueToAttribute(t,s);if(void 0===e)return;this._updateState=this._updateState|te,null==e?this.removeAttribute(r):this.setAttribute(r,e),this._updateState=this._updateState&~te}}_attributeToProperty(e,t){if(this._updateState&te)return;const s=this.constructor,i=s._attributeToPropertyMap.get(e);if(void 0!==i){const e=s._classProperties.get(i)||J;this._updateState=this._updateState|se,this[i]=s._propertyValueFromAttribute(t,e),this._updateState=this._updateState&~se}}_requestUpdate(e,t){let s=!0;if(void 0!==e){const i=this.constructor,r=i._classProperties.get(e)||J;i._valueHasChanged(this[e],t,r.hasChanged)?(this._changedProperties.has(e)||this._changedProperties.set(e,t),!0!==r.reflect||this._updateState&se||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(e,r))):s=!1}!this._hasRequestedUpdate&&s&&this._enqueueUpdate()}requestUpdate(e,t){return this._requestUpdate(e,t),this.updateComplete}async _enqueueUpdate(){let e,t;this._updateState=this._updateState|ee;const s=this._updatePromise;this._updatePromise=new Promise((s,i)=>{e=s,t=i});try{await s}catch(e){}this._hasConnected||await new Promise(e=>this._hasConnectedResolver=e);try{const e=this.performUpdate();null!=e&&await e}catch(e){t(e)}e(!this._hasRequestedUpdate)}get _hasConnected(){return this._updateState&ie}get _hasRequestedUpdate(){return this._updateState&ee}get hasUpdated(){return this._updateState&Z}performUpdate(){this._instanceProperties&&this._applyInstanceProperties();let e=!1;const t=this._changedProperties;try{e=this.shouldUpdate(t),e&&this.update(t)}catch(t){throw e=!1,t}finally{this._markUpdated()}e&&(this._updateState&Z||(this._updateState=this._updateState|Z,this.firstUpdated(t)),this.updated(t))}_markUpdated(){this._changedProperties=new Map,this._updateState=this._updateState&~ee}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this._updatePromise}shouldUpdate(e){return!0}update(e){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((e,t)=>this._propertyToAttribute(t,this[t],e)),this._reflectingProperties=void 0)}updated(e){}firstUpdated(e){}}oe[re]=!0;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const ne=(e,t)=>"method"!==t.kind||!t.descriptor||"value"in t.descriptor?{kind:"field",key:Symbol(),placement:"own",descriptor:{},initializer(){"function"==typeof t.initializer&&(this[t.key]=t.initializer.call(this))},finisher(s){s.createProperty(t.key,e)}}:Object.assign({},t,{finisher(s){s.createProperty(t.key,e)}}),ae=(e,t,s)=>{t.constructor.createProperty(s,e)};function le(e){return(t,s)=>void 0!==s?ae(e,t,s):ne(e,t)}const ce=(e,t,s)=>{Object.defineProperty(t,s,e)},pe=(e,t)=>({kind:"method",placement:"prototype",key:t.key,descriptor:e}),de="adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,he=Symbol();class ue{constructor(e,t){if(t!==he)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e}get styleSheet(){return void 0===this._styleSheet&&(de?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
(window.litElementVersions||(window.litElementVersions=[])).push("2.2.1");const fe=e=>e.flat?e.flat(1/0):function e(t,s=[]){for(let i=0,r=t.length;i<r;i++){const r=t[i];Array.isArray(r)?e(r,s):s.push(r)}return s}(e);class ge extends oe{static finalize(){super.finalize.call(this),this._styles=this.hasOwnProperty(JSCompiler_renameProperty("styles",this))?this._getUniqueStyles():this._styles||[]}static _getUniqueStyles(){const e=this.styles,t=[];if(Array.isArray(e)){fe(e).reduceRight((e,t)=>(e.add(t),e),new Set).forEach(e=>t.unshift(e))}else e&&t.push(e);return t}initialize(){super.initialize(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const e=this.constructor._styles;0!==e.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?de?this.renderRoot.adoptedStyleSheets=e.map(e=>e.styleSheet):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(e.map(e=>e.cssText),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(e){super.update(e);const t=this.render();t instanceof v&&this.constructor.render(t,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(e=>{const t=document.createElement("style");t.textContent=e.cssText,this.renderRoot.appendChild(t)}))}render(){}}ge.finalized=!0,ge.render=(e,t,s)=>{if(!s||"object"!=typeof s||!s.scopeName)throw new Error("The `scopeName` option is required.");const i=s.scopeName,r=O.has(t),n=I&&11===t.nodeType&&!!t.host,a=n&&!F.has(i),l=a?document.createDocumentFragment():t;if(z(e,l,Object.assign({templateFactory:H(i)},s)),a){const e=O.get(l);O.delete(l);const s=e.value instanceof y?e.value.template:void 0;X(i,l,s),o(t,t.firstChild),t.appendChild(l),O.set(t,e)}!r&&n&&window.ShadyCSS.styleElement(t.host)};
/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const me=new WeakMap,ye=t(e=>t=>{if(!(t instanceof k)||t instanceof E||"style"!==t.committer.name||t.committer.parts.length>1)throw new Error("The `styleMap` directive must be used in the style attribute and must be the only part in the attribute.");const{committer:s}=t,{style:i}=s.element;me.has(t)||(i.cssText=s.strings.join(" "));const r=me.get(t);for(const t in r)t in e||(-1===t.indexOf("-")?i[t]=null:i.removeProperty(t));for(const t in e)-1===t.indexOf("-")?i[t]=e[t]:i.setProperty(t,e[t]);me.set(t,e)}),_e=t(e=>t=>{if(void 0===e&&t instanceof k){if(e!==t.value){const e=t.committer.name;t.committer.element.removeAttribute(e)}}else t.setValue(e)}),ve=e=>"string"==typeof e,Pe=e=>"function"==typeof e,be=e=>JSON.parse(JSON.stringify(e)),we=(e,t)=>{for(const[s,i]of Object.entries(t)){const t="{"+s+"}";for(;e.includes(t);)e=e.replace(t,i)}return e};console.assert("abc"===we("abc",{a:"x"})),console.assert("{a}bc"===we("{a}bc",{})),console.assert("{a}bc"===we("{a}bc",{p:"q"})),console.assert("xbc"===we("{a}bc",{a:"x"})),console.assert("xbcxbc"===we("{a}bc{a}bc",{a:"x"})),console.assert("xxy"===we("{a}{a}{b}",{a:"x",b:"y"}));const Se=((e,...t)=>{const s=t.reduce((t,s,i)=>t+(e=>{if(e instanceof ue)return e.cssText;if("number"==typeof e)return e;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${e}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(s)+e[i+1],e[0]);return new ue(s,he)})`:host{display:block;--light-color:#f0d9b5;--dark-color:#b58863;--highlight-color:yellow}[part~=board]{border:2px solid #404040;box-sizing:border-box;display:grid;grid-template-columns:repeat(8,12.5%);grid-template-rows:repeat(8,12.5%)}[part~=square]{position:relative;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.piece-image,[part~=piece]{width:100%;height:100%;z-index:10}[part~=spare-pieces]{display:grid;position:relative;padding:0 2px;grid-template-columns:repeat(8,12.5%)}[part~=dragged-piece]{display:none;position:absolute}[part~=white]{background-color:var(--light-color);color:var(--dark-color)}[part~=black]{background-color:var(--dark-color);color:var(--light-color)}[part~=highlight]{box-shadow:inset 0 0 3px 3px var(--highlight-color)}[part~=notation]{cursor:default;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;position:absolute}[part~=alpha]{bottom:1px;right:3px}[part~=numeric]{top:2px;left:2px}`,ke="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",Ce="abcdefgh".split(""),Le=["wK","wQ","wR","wB","wN","wP"],xe=["bK","bQ","bR","bB","bN","bP"],Ee=e=>e.charCodeAt(0)%2^e.charCodeAt(1)%2?"white":"black",qe=e=>ve(e)&&-1!==e.search(/^[a-h][1-8]$/),Me=e=>{if(!ve(e))return!1;const t=e.split("-");return 2===t.length&&(qe(t[0])&&qe(t[1]))};console.assert(qe("a1")),console.assert(qe("e2")),console.assert(!qe("D2")),console.assert(!qe("g9")),console.assert(!qe("a")),console.assert(!qe(!0)),console.assert(!qe(null)),console.assert(!qe({}));const Ne=e=>ve(e)&&-1!==e.search(/^[bw][KQRNBP]$/);console.assert(Ne("bP")),console.assert(Ne("bK")),console.assert(Ne("wK")),console.assert(Ne("wR")),console.assert(!Ne("WR")),console.assert(!Ne("Wr")),console.assert(!Ne("a")),console.assert(!Ne(!0)),console.assert(!Ne(null)),console.assert(!Ne({}));const Ae=e=>{if(!ve(e))return!1;const t=(e=(e=>e.replace(/8/g,"11111111").replace(/7/g,"1111111").replace(/6/g,"111111").replace(/5/g,"11111").replace(/4/g,"1111").replace(/3/g,"111").replace(/2/g,"11"))(e=e.replace(/ .+$/,""))).split("/");if(8!==t.length)return!1;for(let e=0;e<8;e++)if(8!==t[e].length||-1!==t[e].search(/[^kqrnbpKQRNBP1]/))return!1;return!0};console.assert(Ae(ke)),console.assert(Ae("8/8/8/8/8/8/8/8")),console.assert(Ae("r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R")),console.assert(Ae("3r3r/1p4pp/2nb1k2/pP3p2/8/PB2PN2/p4PPP/R4RK1 b - - 0 1")),console.assert(!Ae("3r3z/1p4pp/2nb1k2/pP3p2/8/PB2PN2/p4PPP/R4RK1 b - - 0 1")),console.assert(!Ae("anbqkbnr/8/8/8/8/8/PPPPPPPP/8")),console.assert(!Ae("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/")),console.assert(!Ae("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBN")),console.assert(!Ae("888888/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")),console.assert(!Ae("888888/pppppppp/74/8/8/8/PPPPPPPP/RNBQKBNR")),console.assert(!Ae({}));const $e=e=>{if("object"!=typeof e||null===e)return!1;for(const[t,s]of Object.entries(e))if(!qe(t)||!Ne(s))return!1;return!0};console.assert($e({})),console.assert($e({e2:"wP"})),console.assert($e({e2:"wP",d2:"wP"})),console.assert(!$e({e2:"BP"})),console.assert(!$e({y2:"wP"})),console.assert(!$e(null)),console.assert(!$e(void 0)),console.assert(!$e(1)),console.assert(!$e("start")),console.assert(!$e(ke));const Te=e=>e.toLowerCase()===e?"b"+e.toUpperCase():"w"+e.toUpperCase(),Oe=e=>{const t=e.split("");return"w"===t[0]?t[1].toUpperCase():t[1].toLowerCase()},ze=e=>{if(!Ae(e))return!1;const t=(e=e.replace(/ .+$/,"")).split("/"),s={};let i=8;for(let e=0;e<8;e++){const r=t[e].split("");let o=0;for(let e=0;e<r.length;e++)if(-1!==r[e].search(/[1-8]/)){o+=parseInt(r[e],10)}else{s[Ce[o]+i]=Te(r[e]),o+=1}i-=1}return s},je=ze(ke),Re=e=>{if(!$e(e))return!1;let t="",s=8;for(let i=0;i<8;i++){for(let i=0;i<8;i++){const r=Ce[i]+s;e.hasOwnProperty(r)?t+=Oe(e[r]):t+="1"}7!==i&&(t+="/"),s-=1}return t=(e=>e.replace(/11111111/g,"8").replace(/1111111/g,"7").replace(/111111/g,"6").replace(/11111/g,"5").replace(/1111/g,"4").replace(/111/g,"3").replace(/11/g,"2"))(t),t};console.assert(Re(je)===ke),console.assert("8/8/8/8/8/8/8/8"===Re({})),console.assert("8/8/8/8/8/8/Pp6/8"===Re({a2:"wP",b2:"bP"}));const Be=e=>(ve(e)&&"start"===e.toLowerCase()&&(e=be(je)),Ae(e)&&(e=ze(e)),e),Ve=(e,t)=>{const s=e.split(""),i=Ce.indexOf(s[0])+1,r=parseInt(s[1],10),o=t.split(""),n=Ce.indexOf(o[0])+1,a=parseInt(o[1],10),l=Math.abs(i-n),c=Math.abs(r-a);return l>=c?l:c},Ue=(e,t,s)=>{const i=(e=>{const t=[];for(let s=0;s<8;s++)for(let i=0;i<8;i++){const r=Ce[s]+(i+1);e!==r&&t.push({square:r,distance:Ve(e,r)})}t.sort((function(e,t){return e.distance-t.distance}));const s=[];for(let e=0;e<t.length;e++)s.push(t[e].square);return s})(s);for(let s=0;s<i.length;s++){const r=i[s];if(e.hasOwnProperty(r)&&e[r]===t)return r}return!1},De=(e,t)=>{const s=be(e);for(const e in t){if(!t.hasOwnProperty(e))continue;if(!s.hasOwnProperty(e))continue;const i=s[e];delete s[e],s[t[e]]=i}return s},We={bB:R`
    <g style="opacity:1; fill:none; fill-rule:evenodd; fill-opacity:1; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;">
      <g style="fill:#000000; stroke:#000000; stroke-linecap:butt;"> 
        <path
          d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.06 9,36 9,36 z" />
        <path
          d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z" />
        <path
          d="M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z" />
      </g>
      <path
        d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18"
        style="fill:none; stroke:#ffffff; stroke-linejoin:miter;" />
    </g>
  `,wB:R`
    <g style="opacity:1; fill:none; fill-rule:evenodd; fill-opacity:1; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;">
      <g style="fill:#ffffff; stroke:#000000; stroke-linecap:butt;"> 
        <path
          d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.06 9,36 9,36 z" />
        <path
          d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z" />
        <path
          d="M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z" />
      </g>
      <path
        d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18"
        style="fill:none; stroke:#000000; stroke-linejoin:miter;" />
    </g>
  `,bK:R`
    <g style="fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;">
      <path
        d="M 22.5,11.63 L 22.5,6"
        style="fill:none; stroke:#000000; stroke-linejoin:miter;"
        id="path6570" />
      <path
        d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25"
        style="fill:#000000;fill-opacity:1; stroke-linecap:butt; stroke-linejoin:miter;" />
      <path
        d="M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 19,16 9.5,13 6.5,19.5 C 3.5,25.5 11.5,29.5 11.5,29.5 L 11.5,37 z "
        style="fill:#000000; stroke:#000000;" />
      <path
        d="M 20,8 L 25,8"
        style="fill:none; stroke:#000000; stroke-linejoin:miter;" />
      <path
        d="M 32,29.5 C 32,29.5 40.5,25.5 38.03,19.85 C 34.15,14 25,18 22.5,24.5 L 22.51,26.6 L 22.5,24.5 C 20,18 9.906,14 6.997,19.85 C 4.5,25.5 11.85,28.85 11.85,28.85"
        style="fill:none; stroke:#ffffff;" />
      <path
        d="M 11.5,30 C 17,27 27,27 32.5,30 M 11.5,33.5 C 17,30.5 27,30.5 32.5,33.5 M 11.5,37 C 17,34 27,34 32.5,37"
        style="fill:none; stroke:#ffffff;" />
    </g>
  `,wK:R`
    <g style="fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;">
      <path
        d="M 22.5,11.63 L 22.5,6"
        style="fill:none; stroke:#000000; stroke-linejoin:miter;" />
      <path
        d="M 20,8 L 25,8"
        style="fill:none; stroke:#000000; stroke-linejoin:miter;" />
      <path
        d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25"
        style="fill:#ffffff; stroke:#000000; stroke-linecap:butt; stroke-linejoin:miter;" />
      <path
        d="M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 19,16 9.5,13 6.5,19.5 C 3.5,25.5 11.5,29.5 11.5,29.5 L 11.5,37 z "
        style="fill:#ffffff; stroke:#000000;" />
      <path
        d="M 11.5,30 C 17,27 27,27 32.5,30"
        style="fill:none; stroke:#000000;" />
      <path
        d="M 11.5,33.5 C 17,30.5 27,30.5 32.5,33.5"
        style="fill:none; stroke:#000000;" />
      <path
        d="M 11.5,37 C 17,34 27,34 32.5,37"
        style="fill:none; stroke:#000000;" />
    </g>
  `,bN:R`
    <g style="opacity:1; fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;">
      <path
        d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18"
        style="fill:#000000; stroke:#000000;" />
      <path
        d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10"
        style="fill:#000000; stroke:#000000;" />
      <path
        d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z"
        style="fill:#ffffff; stroke:#ffffff;" />
      <path
        d="M 15 15.5 A 0.5 1.5 0 1 1  14,15.5 A 0.5 1.5 0 1 1  15 15.5 z"
        transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)"
        style="fill:#ffffff; stroke:#ffffff;" />
      <path
        d="M 24.55,10.4 L 24.1,11.85 L 24.6,12 C 27.75,13 30.25,14.49 32.5,18.75 C 34.75,23.01 35.75,29.06 35.25,39 L 35.2,39.5 L 37.45,39.5 L 37.5,39 C 38,28.94 36.62,22.15 34.25,17.66 C 31.88,13.17 28.46,11.02 25.06,10.5 L 24.55,10.4 z "
        style="fill:#ffffff; stroke:none;" />
    </g>
  `,wN:R`
    <g style="opacity:1; fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;">
      <path
        d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18"
        style="fill:#ffffff; stroke:#000000;" />
      <path
        d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10"
        style="fill:#ffffff; stroke:#000000;" />
      <path
        d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z"
        style="fill:#000000; stroke:#000000;" />
      <path
        d="M 15 15.5 A 0.5 1.5 0 1 1  14,15.5 A 0.5 1.5 0 1 1  15 15.5 z"
        transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)"
        style="fill:#000000; stroke:#000000;" />
    </g>
  `,bP:R`
    <path
      d="M 22,9 C 19.79,9 18,10.79 18,13 C 18,13.89 18.29,14.71 18.78,15.38 C 16.83,16.5 15.5,18.59 15.5,21 C 15.5,23.03 16.44,24.84 17.91,26.03 C 14.91,27.09 10.5,31.58 10.5,39.5 L 33.5,39.5 C 33.5,31.58 29.09,27.09 26.09,26.03 C 27.56,24.84 28.5,23.03 28.5,21 C 28.5,18.59 27.17,16.5 25.22,15.38 C 25.71,14.71 26,13.89 26,13 C 26,10.79 24.21,9 22,9 z "
      style="opacity:1; fill:#000000; fill-opacity:1; fill-rule:nonzero; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:miter; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;" />
  `,wP:R`
    <path
      d="M 22,9 C 19.79,9 18,10.79 18,13 C 18,13.89 18.29,14.71 18.78,15.38 C 16.83,16.5 15.5,18.59 15.5,21 C 15.5,23.03 16.44,24.84 17.91,26.03 C 14.91,27.09 10.5,31.58 10.5,39.5 L 33.5,39.5 C 33.5,31.58 29.09,27.09 26.09,26.03 C 27.56,24.84 28.5,23.03 28.5,21 C 28.5,18.59 27.17,16.5 25.22,15.38 C 25.71,14.71 26,13.89 26,13 C 26,10.79 24.21,9 22,9 z "
      style="opacity:1; fill:#ffffff; fill-opacity:1; fill-rule:nonzero; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:miter; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;" />
  `,bQ:R`
    <g style="opacity:1; fill:000000; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;">
      <g style="fill:#000000; stroke:none;">
        <circle cx="6"    cy="12" r="2.75" />
        <circle cx="14"   cy="9"  r="2.75" />
        <circle cx="22.5" cy="8"  r="2.75" />
        <circle cx="31"   cy="9"  r="2.75" />
        <circle cx="39"   cy="12" r="2.75" />
      </g>
      <path
        d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z"
        style="stroke-linecap:butt; stroke:#000000;" />
      <path
        d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 10.5,36 10.5,36 C 9,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z"
        style="stroke-linecap:butt;" />
      <path
        d="M 11,38.5 A 35,35 1 0 0 34,38.5"
        style="fill:none; stroke:#000000; stroke-linecap:butt;" />
      <path
        d="M 11,29 A 35,35 1 0 1 34,29"
        style="fill:none; stroke:#ffffff;" />
      <path
        d="M 12.5,31.5 L 32.5,31.5"
        style="fill:none; stroke:#ffffff;" />
      <path
        d="M 11.5,34.5 A 35,35 1 0 0 33.5,34.5"
        style="fill:none; stroke:#ffffff;" />
      <path
        d="M 10.5,37.5 A 35,35 1 0 0 34.5,37.5"
        style="fill:none; stroke:#ffffff;" />
    </g>
  `,wQ:R`
    <g style="opacity:1; fill:#ffffff; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;">
      <path
        d="M 9 13 A 2 2 0 1 1  5,13 A 2 2 0 1 1  9 13 z"
        transform="translate(-1,-1)" />
      <path
        d="M 9 13 A 2 2 0 1 1  5,13 A 2 2 0 1 1  9 13 z"
        transform="translate(15.5,-5.5)" />
      <path
        d="M 9 13 A 2 2 0 1 1  5,13 A 2 2 0 1 1  9 13 z"
        transform="translate(32,-1)" />
      <path
        d="M 9 13 A 2 2 0 1 1  5,13 A 2 2 0 1 1  9 13 z"
        transform="translate(7,-4.5)" />
      <path
        d="M 9 13 A 2 2 0 1 1  5,13 A 2 2 0 1 1  9 13 z"
        transform="translate(24,-4)" />
      <path
        d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38,14 L 31,25 L 31,11 L 25.5,24.5 L 22.5,9.5 L 19.5,24.5 L 14,10.5 L 14,25 L 7,14 L 9,26 z "
        style="stroke-linecap:butt;" />
      <path
        d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 10.5,36 10.5,36 C 9,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z "
        style="stroke-linecap:butt;" />
      <path
        d="M 11.5,30 C 15,29 30,29 33.5,30"
        style="fill:none;" />
      <path
        d="M 12,33.5 C 18,32.5 27,32.5 33,33.5"
        style="fill:none;" />
    </g>
  `,bR:R`
    <g style="opacity:1; fill:000000; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;">
      <path
        d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z "
        style="stroke-linecap:butt;" />
      <path
        d="M 12.5,32 L 14,29.5 L 31,29.5 L 32.5,32 L 12.5,32 z "
        style="stroke-linecap:butt;" />
      <path
        d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z "
        style="stroke-linecap:butt;" />
      <path
        d="M 14,29.5 L 14,16.5 L 31,16.5 L 31,29.5 L 14,29.5 z "
        style="stroke-linecap:butt;stroke-linejoin:miter;" />
      <path
        d="M 14,16.5 L 11,14 L 34,14 L 31,16.5 L 14,16.5 z "
        style="stroke-linecap:butt;" />
      <path
        d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 L 11,14 z "
        style="stroke-linecap:butt;" />
      <path
        d="M 12,35.5 L 33,35.5 L 33,35.5"
        style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;" />
      <path
        d="M 13,31.5 L 32,31.5"
        style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;" />
      <path
        d="M 14,29.5 L 31,29.5"
        style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;" />
      <path
        d="M 14,16.5 L 31,16.5"
        style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;" />
      <path
        d="M 11,14 L 34,14"
        style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;" />
    </g>
  `,wR:R`
    <g style="opacity:1; fill:#ffffff; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;">
      <path
        d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z "
        style="stroke-linecap:butt;" />
      <path
        d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z "
        style="stroke-linecap:butt;" />
      <path
        d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14"
        style="stroke-linecap:butt;" />
      <path
        d="M 34,14 L 31,17 L 14,17 L 11,14" />
      <path
        d="M 31,17 L 31,29.5 L 14,29.5 L 14,17"
        style="stroke-linecap:butt; stroke-linejoin:miter;" />
      <path
        d="M 31,29.5 L 32.5,32 L 12.5,32 L 14,29.5" />
      <path
        d="M 11,14 L 34,14"
        style="fill:none; stroke:#000000; stroke-linejoin:miter;" />
    </g>
  `};var Ie=function(e,t,s,i){var r,o=arguments.length,n=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,s,i);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,s,n):r(t,s))||n);return o>3&&n&&Object.defineProperty(t,s,n),n};function He(e){var t;if("dragging"!==(null===(t=e)||void 0===t?void 0:t.state))throw new Error(`unexpected drag state ${JSON.stringify(e)}`)}const Ke=e=>"number"==typeof e?e:"fast"===e?200:"slow"===e?600:parseInt(e,10),Fe=e=>`square-${e}`,Xe=e=>`spare-piece-${e}`,Ye=t((e,t)=>s=>{Pe(t)?t(e,s.committer.element):o(s.committer.element,s.committer.element.firstChild)});let Qe=class extends ge{constructor(){super(...arguments),this.hideNotation=!1,this.orientation="white",this.draggablePieces=!1,this.dropOffBoard="snapback",this.renderPiece=(e,t)=>{let s=void 0;ve(this.pieceTheme)?s=we(this.pieceTheme,{piece:e}):Pe(this.pieceTheme)&&(s=this.pieceTheme(e)),void 0===s?((e,t)=>{z(j`<svg class=piece-image viewBox="0 0 45 45">${We[e]}</svg>`,t)})(e,t):z(j`<img class=piece-image src=${s}>`,t)},this.moveSpeed=200,this.snapbackSpeed=60,this.snapSpeed=30,this.trashSpeed=100,this.appearSpeed=200,this.sparePieces=!1,this._highlightedSquares=new Set,this._animations=new Map,this._currentPosition={},this._mousemoveWindow=e=>{var t;"dragging"===(null===(t=this._dragState)||void 0===t?void 0:t.state)&&this._updateDraggedPiece(e.clientX,e.clientY,e.pageX,e.pageY)},this._mouseupWindow=e=>{var t;if("dragging"!==(null===(t=this._dragState)||void 0===t?void 0:t.state))return;const s=this._isXYOnSquare(e.clientX,e.clientY);this._stopDraggedPiece(s)},this._touchmoveWindow=e=>{var t;if("dragging"!==(null===(t=this._dragState)||void 0===t?void 0:t.state))return;e.preventDefault();const s=e.changedTouches[0];this._updateDraggedPiece(s.clientX,s.clientY,s.pageX,s.pageY)},this._touchendWindow=e=>{var t;if("dragging"!==(null===(t=this._dragState)||void 0===t?void 0:t.state))return;const s=this._isXYOnSquare(e.changedTouches[0].clientX,e.changedTouches[0].clientY);this._stopDraggedPiece(s)}}get position(){return this._currentPosition}set position(e){const t=this._currentPosition;this._setCurrentPosition(e),this.requestUpdate("position",t)}get showNotation(){return!this.hideNotation}set showNotation(e){this.hideNotation=!e}get _squareSize(){return this.offsetWidth/8}_getSquareElement(e){return this.shadowRoot.getElementById(Fe(e))}_getSparePieceElement(e){return this.shadowRoot.getElementById(Xe(e))}render(){return j`<div part=spare-pieces>${this._renderSparePieces("white"===this.orientation?"black":"white")}</div>${this._renderBoard()}<div part=spare-pieces>${this._renderSparePieces("white"===this.orientation?"white":"black")}</div><div id=dragged-pieces style=${ye({width:`${this._squareSize}px`,height:`${this._squareSize}px`})}>${this._renderDraggedPiece()}</div>`}_renderSparePieces(e){if(!this.sparePieces)return a;return j`<div></div>${("black"===e?xe:Le).map(e=>j`<div id=spare-${e} @mousedown=${this._mousedownSparePiece} @touchstart=${this._touchstartSparePiece}>${this._renderPiece(e,{},!1,Xe(e))}</div>`)}<div></div>`}_renderDraggedPiece(){var e,t;const s={height:`${this._squareSize}px`,width:`${this._squareSize}px`},i=this._dragState;if(void 0!==i)if(s.display="block","dragging"===i.state){const{x:e,y:t}=i;Object.assign(s,{top:`${t-this._squareSize/2}px`,left:`${e-this._squareSize/2}px`})}else if("snapback"===i.state){const{source:e}=i,t=this._getSquareElement(e).getBoundingClientRect();Object.assign(s,{transitionProperty:"top, left",transitionDuration:`${Ke(this.snapbackSpeed)}ms`,top:`${t.top}px`,left:`${t.left}px`})}else if("trash"===i.state){const{x:e,y:t}=i;Object.assign(s,{transitionProperty:"opacity",transitionDuration:`${Ke(this.trashSpeed)}ms`,opacity:"0",top:`${t-this._squareSize/2}px`,left:`${e-this._squareSize/2}px`})}else if("snap"===i.state){const e=this._getSquareElement(i.location).getBoundingClientRect();Object.assign(s,{transitionProperty:"top, left",transitionDuration:`${Ke(this.snapSpeed)}ms`,top:`${e.top}px`,left:`${e.left}px`})}return this._renderPiece(null!=(t=null===(e=this._dragState)||void 0===e?void 0:e.piece)?t:"",s,!1,void 0,"dragged-piece")}_renderBoard(){var e,t;const s=[],i="black"===this.orientation;for(let r=0;r<8;r++)for(let o=0;o<8;o++){const n=Ce[i?7-o:o],l=i?r+1:8-r,c=`${n}${l}`,p=Ee(c);let d=this._currentPosition[c];const h=c===(null===(e=this._dragState)||void 0===e?void 0:e.source),u=this._animations.get(c),f=h||this._highlightedSquares.has(c)?"highlight":"",g=this._getAnimationStyles(d,u);d||"clear"!==(null===(t=u)||void 0===t?void 0:t.type)||(d=u.piece),s.push(j`<div class=square id=${Fe(c)} data-square=${c} part="square ${c} ${p} ${f}" @mousedown=${this._mousedownSquare} @mouseenter=${this._mouseenterSquare} @mouseleave=${this._mouseleaveSquare} @touchstart=${this._touchstartSquare}>${this.showNotation&&7===r?j`<div part="notation alpha">${n}</div>`:a} ${this.showNotation&&0===o?j`<div part="notation numeric">${l}</div>`:a} ${this._renderPiece(d,g,h)}</div>`)}const r={width:8*this._squareSize+"px",height:8*this._squareSize+"px"};return j`<div part=board style=${ye(r)}>${s}</div>`}_renderPiece(e,t,s,i,r){if(void 0===e)return a;const o=Object.assign({opacity:"1",transitionProperty:"",transitionDuration:"0ms"},t);return(s||""===e)&&(o.display="none"),""===e?a:(Pe(this.renderPiece)||this._error(8272,"invalid renderPiece."),j`<div id=${_e(i)} part="piece ${null!=r?r:""}" piece=${e} style=${ye(o)} ...=${Ye(e,this.renderPiece)}></div>`)}_getAnimationStyles(e,t){if(t){if(e&&("move-start"===t.type||"add-start"===t.type&&this.draggablePieces)){const s="move-start"===t.type?this._getSquareElement(t.source):this._getSparePieceElement(e),i="move-start"===t.type?this._getSquareElement(t.destination):this._getSquareElement(t.square),r=s.getBoundingClientRect(),o=i.getBoundingClientRect();return{position:"absolute",left:`${r.left-o.left}px`,top:`${r.top-o.top}px`,width:`${this._squareSize}px`,height:`${this._squareSize}px`}}if(e&&("move"===t.type||"add"===t.type&&this.draggablePieces))return{position:"absolute",transitionProperty:"top, left",transitionDuration:`${Ke(this.moveSpeed)}ms`,top:"0",left:"0",width:`${this._squareSize}px`,height:`${this._squareSize}px`};if(!e&&"clear"===t.type)return e=t.piece,{transitionProperty:"opacity",transitionDuration:`${Ke(this.trashSpeed)}ms`,opacity:"0"};if(e&&"add-start"===t.type)return{opacity:"0"};if(e&&"add"===t.type)return{transitionProperty:"opacity",transitionDuration:`${Ke(this.appearSpeed)}ms`}}return{}}_mousedownSquare(e){if(e.preventDefault(),!this.draggablePieces&&!this.sparePieces)return;const t=e.currentTarget.getAttribute("data-square");null!==t&&this._currentPosition.hasOwnProperty(t)&&this._beginDraggingPiece(t,this._currentPosition[t],e.pageX,e.pageY)}_mousedownSparePiece(e){if(e.preventDefault(),!this.sparePieces)return;const t=e.currentTarget.querySelector("[part~=piece]").getAttribute("piece");this._beginDraggingPiece("spare",t,e.pageX,e.pageY)}_mouseenterSquare(e){if(void 0!==this._dragState)return;const t=e.currentTarget.getAttribute("data-square");if(!qe(t))return;let s=!1;this._currentPosition.hasOwnProperty(t)&&(s=this._currentPosition[t]),this.dispatchEvent(new CustomEvent("mouseover-square",{bubbles:!0,detail:{square:t,piece:s,position:be(this._currentPosition),orientation:this.orientation}}))}_mouseleaveSquare(e){if(void 0!==this._dragState)return;const t=e.currentTarget.getAttribute("data-square");if(!qe(t))return;let s=!1;this._currentPosition.hasOwnProperty(t)&&(s=this._currentPosition[t]),this.dispatchEvent(new CustomEvent("mouseout-square",{bubbles:!0,detail:{square:t,piece:s,position:be(this._currentPosition),orientation:this.orientation}}))}_touchstartSquare(e){if(!this.draggablePieces&&!this.sparePieces)return;const t=e.target.closest("[data-square]").getAttribute("data-square");qe(t)&&this._currentPosition.hasOwnProperty(t)&&(e.preventDefault(),this._beginDraggingPiece(t,this._currentPosition[t],e.changedTouches[0].pageX,e.changedTouches[0].pageY))}_touchstartSparePiece(e){if(!this.sparePieces)return;const t=e.target.closest("[piece]").getAttribute("piece");e.preventDefault(),this._beginDraggingPiece("spare",t,e.changedTouches[0].pageX,e.changedTouches[0].pageY)}setPosition(e,t=!0){if(e=Be(e),!$e(e))throw this._error(6482,"Invalid value passed to the position method.",e);if(t){const t=this._calculateAnimations(this._currentPosition,e);this._doAnimations(t,this._currentPosition,e)}this._setCurrentPosition(e),this.requestUpdate()}fen(){return Re(this._currentPosition)}start(e){this.setPosition("start",e)}clear(e){this.setPosition({},e)}move(...e){let t=!0;const s={};for(const i of e){if(!1===i){t=!1;continue}if(!Me(i)){this._error(2826,"Invalid move passed to the move method.",i);continue}const[e,r]=i.split("-");s[e]=r}const i=De(this._currentPosition,s);return this.setPosition(i,t),i}flip(){this.orientation="white"===this.orientation?"black":"white"}resize(){this.requestUpdate()}firstUpdated(){this.requestUpdate()}connectedCallback(){super.connectedCallback(),window.addEventListener("mousemove",this._mousemoveWindow),window.addEventListener("mouseup",this._mouseupWindow),window.addEventListener("touchmove",this._touchmoveWindow,{passive:!1}),window.addEventListener("touchend",this._touchendWindow,{passive:!1})}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("mousemove",this._mousemoveWindow),window.removeEventListener("mouseup",this._mouseupWindow),window.removeEventListener("touchmove",this._touchmoveWindow),window.removeEventListener("touchend",this._touchendWindow)}_setCurrentPosition(e){const t=be(this._currentPosition),s=be(e);Re(t)!==Re(s)&&(this.dispatchEvent(new CustomEvent("change",{bubbles:!0,detail:{value:s,oldValue:t}})),this._currentPosition=e)}_isXYOnSquare(e,t){const s=this.shadowRoot.elementsFromPoint(e,t).find(e=>e.classList.contains("square"));return void 0===s?"offboard":s.getAttribute("data-square")}_highlightSquare(e,t=!0){t?this._highlightedSquares.add(e):this._highlightedSquares.delete(e),this.requestUpdate("_highlightedSquares")}async _snapbackDraggedPiece(){He(this._dragState);const{source:e,piece:t}=this._dragState;return"spare"===e?this._trashDraggedPiece():(this._dragState={state:"snapback",piece:t,source:e},this.requestUpdate(),await new Promise(e=>setTimeout(e,0)),new Promise(s=>{const i=()=>{this._draggedPieceElement.removeEventListener("transitionend",i),s(),this.dispatchEvent(new CustomEvent("snapback-end",{bubbles:!0,detail:{piece:t,square:e,position:be(this._currentPosition),orientation:this.orientation}}))};this._draggedPieceElement.addEventListener("transitionend",i)}))}async _trashDraggedPiece(){He(this._dragState);const{source:e,piece:t}=this._dragState,s=be(this._currentPosition);return delete s[e],this._setCurrentPosition(s),this._dragState={state:"trash",piece:t,x:this._dragState.x,y:this._dragState.y,source:this._dragState.source},this.requestUpdate(),await new Promise(e=>setTimeout(e,0)),new Promise(e=>{const t=()=>{this._draggedPieceElement.removeEventListener("transitionend",t),e()};this._draggedPieceElement.addEventListener("transitionend",t)})}async _dropDraggedPieceOnSquare(e){He(this._dragState);const{source:t,piece:s}=this._dragState,i=be(this._currentPosition);return delete i[t],i[e]=s,this._setCurrentPosition(i),this._dragState={state:"snap",piece:s,location:e,source:e},this.requestUpdate(),await new Promise(e=>setTimeout(e,0)),new Promise(i=>{const r=()=>{this._draggedPieceElement.removeEventListener("transitionend",r),i(),this.dispatchEvent(new CustomEvent("snap-end",{bubbles:!0,detail:{source:t,square:e,piece:s}}))};this._draggedPieceElement.addEventListener("transitionend",r)})}_beginDraggingPiece(e,t,s,i){const r=new CustomEvent("drag-start",{bubbles:!0,cancelable:!0,detail:{source:e,piece:t,position:be(this._currentPosition),orientation:this.orientation}});this.dispatchEvent(r),r.defaultPrevented||(this._dragState={state:"dragging",x:s,y:i,piece:t,location:"spare"===e?"offboard":e,source:e},this.requestUpdate())}_updateDraggedPiece(e,t,s,i){He(this._dragState),this._dragState.x=s,this._dragState.y=i,this.requestUpdate();const r=this._isXYOnSquare(e,t);r!==this._dragState.location&&(qe(this._dragState.location)&&this._highlightSquare(this._dragState.location,!1),qe(r)&&this._highlightSquare(r),this.dispatchEvent(new CustomEvent("drag-move",{bubbles:!0,detail:{newLocation:r,oldLocation:this._dragState.location,source:this._dragState.source,piece:this._dragState.piece,position:be(this._currentPosition),orientation:this.orientation}})),this._dragState.location=r)}async _stopDraggedPiece(e){He(this._dragState);const{source:t,piece:s}=this._dragState;let i="drop";"offboard"===e&&(i="trash"===this.dropOffBoard?"trash":"snapback");const r=be(this._currentPosition),o=be(this._currentPosition);"spare"===t&&qe(e)&&(r[e]=s),qe(t)&&(delete r[t],qe(e)&&(r[e]=s));const n=new CustomEvent("drop",{bubbles:!0,detail:{source:t,target:e,piece:s,newPosition:r,oldPosition:o,orientation:this.orientation,setAction(e){i=e}}});this.dispatchEvent(n),this._highlightedSquares.clear(),"snapback"===i?await this._snapbackDraggedPiece():"trash"===i?await this._trashDraggedPiece():"drop"===i&&await this._dropDraggedPieceOnSquare(e),this._dragState=void 0,this.requestUpdate()}_calculateAnimations(e,t){e=be(e),t=be(t);const s=[],i={};for(const s in t)t.hasOwnProperty(s)&&e.hasOwnProperty(s)&&e[s]===t[s]&&(delete e[s],delete t[s]);for(const r in t){if(!t.hasOwnProperty(r))continue;const o=Ue(e,t[r],r);o&&(s.push({type:"move",source:o,destination:r,piece:t[r]}),delete e[o],delete t[r],i[r]=!0)}for(const e in t)t.hasOwnProperty(e)&&(s.push({type:"add",square:e,piece:t[e]}),delete t[e]);for(const t in e)e.hasOwnProperty(t)&&(i.hasOwnProperty(t)||(s.push({type:"clear",square:t,piece:e[t]}),delete e[t]));return s}async _doAnimations(e,t,s){if(0===e.length)return;let i=0;const r=()=>{i++,i===e.length&&(this.shadowRoot.removeEventListener("transitionend",r),this._animations.clear(),this.requestUpdate(),this.dispatchEvent(new CustomEvent("move-end",{bubbles:!0,detail:{oldPosition:be(t),newPosition:be(s)}})))};this.shadowRoot.addEventListener("transitionend",r),this._animations.clear();for(const t of e)"add"===t.type||"add-start"===t.type?this._animations.set(t.square,Object.assign(Object.assign({},t),{type:"add-start"})):"move"===t.type||"move-start"===t.type?this._animations.set(t.destination,Object.assign(Object.assign({},t),{type:"move-start"})):this._animations.set(t.square,t);this.requestUpdate(),await new Promise(e=>setTimeout(e,0)),this._animations.clear();for(const t of e)"move"===t.type||"move-start"===t.type?this._animations.set(t.destination,t):this._animations.set(t.square,t);this.requestUpdate()}_error(e,t,s){const i=`Chessboard Error ${e} : ${t}`;return this.dispatchEvent(new ErrorEvent("error",{message:i})),new Error(i)}};var Je;Qe.styles=Se,Ie([le({converter:e=>Be(e)})],Qe.prototype,"position",null),Ie([le({attribute:"hide-notation",type:Boolean})],Qe.prototype,"hideNotation",void 0),Ie([le()],Qe.prototype,"orientation",void 0),Ie([le({attribute:"draggable-pieces",type:Boolean})],Qe.prototype,"draggablePieces",void 0),Ie([le({attribute:"drop-off-board"})],Qe.prototype,"dropOffBoard",void 0),Ie([le({attribute:"piece-theme"})],Qe.prototype,"pieceTheme",void 0),Ie([le({attribute:!1})],Qe.prototype,"renderPiece",void 0),Ie([le({attribute:"move-speed"})],Qe.prototype,"moveSpeed",void 0),Ie([le({attribute:"snapback-speed"})],Qe.prototype,"snapbackSpeed",void 0),Ie([le({attribute:"snap-speed"})],Qe.prototype,"snapSpeed",void 0),Ie([le({attribute:"trash-speed"})],Qe.prototype,"trashSpeed",void 0),Ie([le({attribute:"appear-speed"})],Qe.prototype,"appearSpeed",void 0),Ie([le({attribute:"spare-pieces",type:Boolean})],Qe.prototype,"sparePieces",void 0),Ie([(Je='[part~="dragged-piece"]',(e,t)=>{const s={get(){return this.renderRoot.querySelector(Je)},enumerable:!0,configurable:!0};return void 0!==t?ce(s,e,t):pe(s,e)})],Qe.prototype,"_draggedPieceElement",void 0),Qe=Ie([(e=>t=>"function"==typeof t?((e,t)=>(window.customElements.define(e,t),t))(e,t):((e,t)=>{const{kind:s,elements:i}=t;return{kind:s,elements:i,finisher(t){window.customElements.define(e,t)}}})(e,t))("chess-board")],Qe);export{Ce as COLUMNS,Qe as ChessBoardElement,ke as START_FEN,je as START_POSITION,xe as blackPieces,De as calculatePositionFromMoves,ze as fenToObj,Ue as findClosestPiece,Ee as getSquareColor,Be as normalizePozition,Re as objToFen,Ae as validFen,Me as validMove,Ne as validPieceCode,$e as validPositionObject,qe as validSquare,Le as whitePieces};
