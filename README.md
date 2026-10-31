# TECHFEST 2026 — Enter the Future

A responsive, 3D interactive concept website for Techfest, IIT Bombay.

## Features
- Real-time Three.js 3D hero core with metallic material, orbital rings, wireframe shell and particle field.
- Second 3D scene in the manifesto section.
- GSAP + ScrollTrigger scroll-linked 3D movement and section reveals.
- Pointer-reactive 3D scene and tilt-interactive domain cards.
- Responsive navigation, mobile layout, reading-motion preference support and scroll progress indicator.
- Official Techfest links point to https://techfest.org/.

## Run locally
Because the project uses JavaScript modules, run it through a local web server (not by opening `index.html` directly).

```bash
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Publish on GitHub Pages
1. Create a new public repository on GitHub (for example `techfest-3d-experience`).
2. Upload `index.html`, `style.css`, `script.js`, and this README to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Wait for GitHub Pages to publish. Your public website URL will appear in the Pages settings.

## Tech stack
- HTML5 / CSS3
- JavaScript ES modules
- Three.js 0.160.0 (CDN)
- GSAP 3.12.5 + ScrollTrigger (CDN)

## Notes
This is an original, unofficial concept experience and is not affiliated with or endorsed by IIT Bombay. Event categories and official links are illustrative; verify current details on techfest.org before publishing. Internet access is required to load the CDN libraries and Google Fonts.
