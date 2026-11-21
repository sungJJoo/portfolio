// 파란 사선 면 안에 픽셀 디더 무늬를 그려 천천히 움직이는 모듈 (Paper Shaders 0.0.82, Apache-2.0, assets/vendor/paper-shaders-0.0.82)
import { ShaderMount } from '../vendor/paper-shaders-0.0.82/shader-mount.mjs';
import { ditheringFragmentShader } from '../vendor/paper-shaders-0.0.82/dithering.mjs';
import { getShaderColorFromString as color } from '../vendor/paper-shaders-0.0.82/get-shader-color-from-string.mjs';

const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FPS = 30; // 천천히 흐르는 무늬라 30번이면 충분하다. 144Hz 화면에서도 그래픽카드 일을 줄인다

// el 에 캔버스를 붙인다. WebGL 이 없거나 실패하면 아무것도 하지 않아 CSS 단색 면이 그대로 보인다
export function mountDither(el, { back, front, shape = 2, speed = 0.6, frame = 0 }) {
  let mount;
  try {
    mount = new ShaderMount(el, ditheringFragmentShader, {
      u_colorBack: color(back), u_colorFront: color(front), u_shape: shape, u_type: 4, u_pxSize: 3,
      u_fit: 0, u_scale: 1, u_rotation: 0, u_originX: 0.5, u_originY: 0.5, u_offsetX: 0, u_offsetY: 0, u_worldWidth: 0, u_worldHeight: 0,
    }, { antialias: false, powerPreference: 'low-power' }, 0, frame, 1, 1920 * 1080);
  } catch (e) {
    return null;
  }
  el.classList.add('on');
  if (still) return mount; // 움직임 줄이기: 첫 장면 한 장만

  // 화면에 보이고 탭이 열려 있을 때만 30fps 로 시간을 진행한다
  let visible = false, t = frame, last = 0, raf = 0;
  const tick = (now) => {
    raf = requestAnimationFrame(tick);
    if (now - last < 1000 / FPS - 1) return;
    t += Math.min(now - last, 100) * speed;
    last = now;
    mount.setFrame(t);
  };
  const sync = () => {
    const run = visible && !document.hidden;
    if (run && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    if (!run && raf) { cancelAnimationFrame(raf); raf = 0; }
  };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }).observe(el);
  document.addEventListener('visibilitychange', sync);
  return mount;
}
