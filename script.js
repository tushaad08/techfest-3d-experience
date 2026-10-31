import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pointer = new THREE.Vector2(0, 0);
window.addEventListener('pointermove', e => { pointer.x = (e.clientX / innerWidth) * 2 - 1; pointer.y = -(e.clientY / innerHeight) * 2 + 1; });

function makeScene(canvas, mode='hero') {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, canvas.clientWidth / canvas.clientHeight, .1, 100);
  camera.position.set(0, 0, mode === 'hero' ? 8.5 : 7.5);
  scene.add(new THREE.AmbientLight(0x8294ff, 1.25));
  const key = new THREE.PointLight(mode === 'hero' ? 0x64e4ff : 0xff784e, 45, 30); key.position.set(3, 3, 5); scene.add(key);
  const fill = new THREE.PointLight(0x8866ff, 30, 30); fill.position.set(-4, -2, 3); scene.add(fill);
  const group = new THREE.Group(); scene.add(group);

  if (mode === 'hero') {
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.38, 2), new THREE.MeshPhysicalMaterial({ color: 0x182e48, metalness: .82, roughness: .19, clearcoat: 1, emissive: 0x123e62, emissiveIntensity: .45, wireframe: false })); group.add(core);
    const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.48, 1), new THREE.MeshBasicMaterial({ color: 0x64e4ff, wireframe: true, transparent: true, opacity: .48 })); group.add(wire);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x9c7aff, transparent: true, opacity: .75 });
    for (let i=0;i<3;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(2.05+i*.24,.008,8,180),ringMat);ring.rotation.set(.7+i*.45,.25+i*.5,.2);group.add(ring)}
    const inner = new THREE.Mesh(new THREE.TorusGeometry(1.1,.018,8,120),new THREE.MeshBasicMaterial({color:0xff784e}));inner.rotation.x=1.1;group.add(inner);
    const count=1700, positions=new Float32Array(count*3); for(let i=0;i<count;i++){const r=3+Math.random()*7,a=Math.random()*Math.PI*2,b=Math.acos(2*Math.random()-1);positions[i*3]=r*Math.sin(b)*Math.cos(a);positions[i*3+1]=r*Math.cos(b);positions[i*3+2]=r*Math.sin(b)*Math.sin(a)}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(positions,3));const stars=new THREE.Points(geo,new THREE.PointsMaterial({color:0xb8d9ff,size:.018,transparent:true,opacity:.75}));scene.add(stars);group.userData.stars=stars;
    group.position.set(innerWidth<700?1.3:2.25,.05,0);group.scale.setScalar(innerWidth<700?.78:1);
    group.userData.core=core;group.userData.wire=wire;group.userData.rings=group.children.filter(o=>o.geometry?.type==='TorusGeometry');
  } else {
    const orb=new THREE.Mesh(new THREE.SphereGeometry(1.7,64,64),new THREE.MeshPhysicalMaterial({color:0x161d39,metalness:.72,roughness:.16,clearcoat:1,emissive:0x28165a,emissiveIntensity:.65}));group.add(orb);
    const shell=new THREE.Mesh(new THREE.IcosahedronGeometry(2.1,1),new THREE.MeshBasicMaterial({color:0x9473ff,wireframe:true,transparent:true,opacity:.3}));group.add(shell);
    for(let i=0;i<5;i++){let ring=new THREE.Mesh(new THREE.TorusGeometry(2.35+i*.13,.012,8,160),new THREE.MeshBasicMaterial({color:i%2?0xff784e:0x64e4ff,transparent:true,opacity:.7}));ring.rotation.set(i*.65,.4+i*.4,i*.3);group.add(ring)}
    group.position.set(innerWidth<700?1.8:2.7,0,0);group.scale.setScalar(innerWidth<700?.7:1);
  }
  const resize=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};
  new ResizeObserver(resize).observe(canvas);
  const clock=new THREE.Clock();
  function render(){const t=clock.getElapsedTime();if(!reduced){group.rotation.y=t*.13+pointer.x*.16;group.rotation.x=Math.sin(t*.22)*.12+pointer.y*.1;if(group.userData.core){group.userData.core.rotation.y=t*.25;group.userData.wire.rotation.y=-t*.18;group.userData.rings.forEach((r,i)=>r.rotation.z+=.001*(i%2?1:-1));if(group.userData.stars)group.userData.stars.rotation.y=-t*.012}else{group.children.forEach((o,i)=>{if(o.geometry?.type==='TorusGeometry')o.rotation.z+=.0015*(i%2?1:-1)})}}renderer.render(scene,camera);requestAnimationFrame(render)}render();
  return {group,camera,renderer};
}

const hero=makeScene(document.querySelector('#hero-canvas'),'hero');
const manifesto=makeScene(document.querySelector('#manifesto-canvas'),'manifesto');
if(!reduced){
  gsap.to(hero.group.rotation,{y:Math.PI*.9,x:.5,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
  gsap.to(hero.group.position,{y:-1.1,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
  gsap.from('.intro-layout > *',{y:70,opacity:0,duration:1,stagger:.18,ease:'power3.out',scrollTrigger:{trigger:'.intro-layout',start:'top 78%'}});
  gsap.from('.domain-card',{y:90,opacity:0,rotateX:8,stagger:.12,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'.domain-grid',start:'top 78%'}});
  gsap.from('.manifesto-copy > *',{y:55,opacity:0,stagger:.12,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'.manifesto-copy',start:'top 78%'}});
  gsap.from('.final h2',{scale:.8,opacity:0,duration:1.2,ease:'power3.out',scrollTrigger:{trigger:'.final',start:'top 70%'}});
}

const progress=document.querySelector('#progress-bar');
window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%';},{passive:true});

document.querySelectorAll('[data-card]').forEach(card=>{
  card.addEventListener('pointermove',e=>{if(reduced||innerWidth<700)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateY(${x*9}deg) rotateX(${-y*9}deg) translateY(-5px)`});
  card.addEventListener('pointerleave',()=>card.style.transform='');
});
const menu=document.querySelector('.menu-toggle');menu.addEventListener('click',()=>document.querySelector('.nav').classList.toggle('mobile-open'));
document.querySelectorAll('.nav nav a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.nav').classList.remove('mobile-open')));
