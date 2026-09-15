<template>
  <div class="app-container">
    <!-- Background Glow Elements -->
    <div class="bg-glow bg-glow-top"></div>
    <div class="bg-glow bg-glow-bottom"></div>

    <!-- Header Navigation -->
    <header class="navbar">
      <div class="nav-content">
        <a href="#" class="logo">
          <div class="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
          </div>
          <span class="logo-text">img<span class="text-green">2</span>url</span>
        </a>

        <nav class="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
        </nav>

        <div class="nav-actions">
          <div class="status-badge">
            <span class="status-dot"></span>
            Edge CDN Active
          </div>
          <a href="#upload-section" class="btn btn-primary btn-sm">
            Upload Image
          </a>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-badge">
          <span class="badge-icon">⚡</span>
          <span>Instant Image Hosting & CDN Deployment</span>
        </div>

        <h1 class="hero-title">
          Deploy Your Images to the Web <span class="text-gradient">in Seconds.</span>
        </h1>

        <p class="hero-subtitle">
          Transform local images into lightning-fast, production-ready global URLs instantly. Free, secure, and developer-friendly.
        </p>

        <!-- Interactive Drag & Drop Sandbox -->
        <div id="upload-section" class="upload-container">
          <div
            class="dropzone"
            :class="{ 'is-dragging': isDragging, 'has-file': previewUrl }"
            @dragover.prevent="onDragOver"
            @dragleave.prevent="onDragLeave"
            @drop.prevent="onDrop"
            @click="triggerFileInput"
          >
            <input
              type="file"
              ref="fileInput"
              class="hidden-input"
              accept="image/*"
              @change="onFileSelected"
            />

            <div v-if="!previewUrl" class="dropzone-content">
              <div class="upload-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" x2="12" y1="3" y2="15"/>
                </svg>
              </div>

              <div class="dropzone-text">
                <p class="primary-text"><span class="highlight">Click to upload</span> or drag and drop</p>
                <p class="secondary-text">PNG, JPG, SVG, WEBP, or GIF (max 10MB)</p>
              </div>

              <!-- Quick Demo Samples -->
              <div class="sample-pills" @click.stop>
                <span class="sample-label">Or try a sample:</span>
                <button class="pill-btn" @click="loadSampleImage('tech')">👾 Avatar</button>
                <button class="pill-btn" @click="loadSampleImage('landscape')">🏔️ Nature</button>
                <button class="pill-btn" @click="loadSampleImage('cyber')">🌆 Neon</button>
              </div>
            </div>

            <!-- Image Uploaded View -->
            <div v-else class="preview-layout" @click.stop>
              <div class="preview-card">
                <div class="preview-image-container">
                  <img :src="previewUrl" :alt="fileName" class="preview-img" />
                </div>

                <div class="preview-meta">
                  <div class="file-info">
                    <span class="file-name">{{ fileName }}</span>
                    <span class="file-specs">{{ fileSpecs }}</span>
                  </div>

                  <div class="meta-badges">
                    <span class="badge badge-green">WebP Auto</span>
                    <span class="badge badge-outline">CDN Cached</span>
                  </div>

                  <button class="btn btn-secondary btn-xs" @click="resetUpload">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    Upload Another
                  </button>
                </div>
              </div>

              <!-- Resulting Direct Links -->
              <div class="url-output-panel">
                <div class="panel-header">
                  <span class="panel-title">Generated Production URL</span>
                  <span class="status-pill"><span class="pulse-dot"></span> Live on Edge</span>
                </div>

                <!-- Direct URL Field -->
                <div class="field-group">
                  <label>Direct Image URL</label>
                  <div class="input-with-button">
                    <input type="text" readonly :value="generatedUrl" class="code-input" />
                    <button class="btn btn-copy" @click="copyToClipboard(generatedUrl, 'url')">
                      <span v-if="copiedType === 'url'">✓ Copied</span>
                      <span v-else>Copy URL</span>
                    </button>
                  </div>
                </div>

                <!-- HTML Tag Field -->
                <div class="field-group">
                  <label>HTML Snippet</label>
                  <div class="input-with-button">
                    <input type="text" readonly :value="`<img src=&quot;${generatedUrl}&quot; alt=&quot;${fileName}&quot; />`" class="code-input" />
                    <button class="btn btn-copy" @click="copyToClipboard(`<img src=&quot;${generatedUrl}&quot; alt=&quot;${fileName}&quot; />`, 'html')">
                      <span v-if="copiedType === 'html'">✓ Copied</span>
                      <span v-else>Copy HTML</span>
                    </button>
                  </div>
                </div>

                <!-- Markdown Field -->
                <div class="field-group">
                  <label>Markdown Snippet</label>
                  <div class="input-with-button">
                    <input type="text" readonly :value="`![${fileName}](${generatedUrl})`" class="code-input" />
                    <button class="btn btn-copy" @click="copyToClipboard(`![${fileName}](${generatedUrl})`, 'markdown')">
                      <span v-if="copiedType === 'markdown'">✓ Copied</span>
                      <span v-else>Copy Markdown</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Key Metrics Banner -->
      <section class="metrics-section">
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">10M+</div>
            <div class="metric-label">Images Deployed</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">&lt; 15ms</div>
            <div class="metric-label">Global Latency</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">99.99%</div>
            <div class="metric-label">Edge Availability</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">100%</div>
            <div class="metric-label">Free Tier Access</div>
          </div>
        </div>
      </section>

      <!-- Feature Cards Section -->
      <section id="features" class="features-section">
        <div class="section-header">
          <div class="section-tag">Powerful Features</div>
          <h2 class="section-title">Everything you need for image hosting</h2>
          <p class="section-subtitle">Designed for speed, scalability, and absolute simplicity.</p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <h3>Lightning CDN</h3>
            <p>Your images are automatically cached and distributed across 300+ edge locations worldwide for instant loading.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            </div>
            <h3>Direct Link Generation</h3>
            <p>Get clean, permanent direct URLs without popups, ads, or redirection. Perfect for embeds and markdown.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3>Secure & Encrypted</h3>
            <p>Built with enterprise-grade SSL encryption and optional tokenized access for private asset distribution.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            </div>
            <h3>Auto-Optimization</h3>
            <p>Smart format conversion to WebP and lossless compression ensures ultra-fast page speeds on all devices.</p>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section id="how-it-works" class="how-section">
        <div class="section-header">
          <div class="section-tag">Simple Workflow</div>
          <h2 class="section-title">How img2url works</h2>
          <p class="section-subtitle">Three steps to convert any image into a web URL.</p>
        </div>

        <div class="steps-grid">
          <div class="step-card">
            <div class="step-number">01</div>
            <h3>Upload or Drag Image</h3>
            <p>Select any PNG, JPG, WEBP, or SVG file from your computer or drag it right onto the canvas.</p>
          </div>

          <div class="step-card">
            <div class="step-number">02</div>
            <h3>Edge Processing</h3>
            <p>Our serverless network processes, optimizes, and distributes your asset to worldwide CDN nodes.</p>
          </div>

          <div class="step-card">
            <div class="step-number">03</div>
            <h3>Copy & Share</h3>
            <p>Grab your instant direct URL, HTML tag, or Markdown link and embed it anywhere on the internet.</p>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-card">
          <h2>Ready to deploy your images?</h2>
          <p>Start generating high-speed direct image URLs for your apps, websites, and documentation today.</p>
          <a href="#upload-section" class="btn btn-primary btn-lg">
            Start Uploading Free
          </a>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-brand">
          <span class="logo-text">img<span class="text-green">2</span>url</span>
          <p>Instant image hosting & high-speed global CDN deployment.</p>
        </div>

        <div class="footer-links">
          <div class="footer-column">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
          </div>

          <div class="footer-column">
            <h4>Resources</h4>
            <a href="#">Documentation</a>
            <a href="#">Status</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} img2url. All rights reserved.</p>
        <div class="system-status">
          <span class="status-dot"></span> All systems operational
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Reactive state
const isDragging = ref(false);
const previewUrl = ref('');
const fileName = ref('');
const fileSpecs = ref('');
const generatedUrl = ref('');
const copiedType = ref('');
const fileInput = ref(null);

// Trigger file picker
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// Drag & drop handlers
const onDragOver = () => {
  isDragging.value = true;
};

const onDragLeave = () => {
  isDragging.value = false;
};

const onDrop = (event) => {
  isDragging.value = false;
  const files = event.dataTransfer.files;
  if (files && files.length > 0) {
    processFile(files[0]);
  }
};

const onFileSelected = (event) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    processFile(files[0]);
  }
};

// File processing helper
const processFile = (file) => {
  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file (PNG, JPG, WEBP, SVG, GIF).');
    return;
  }

  fileName.value = file.name;
  const sizeKb = (file.size / 1024).toFixed(1);
  fileSpecs.value = `${sizeKb} KB • ${file.type.split('/')[1].toUpperCase()}`;

  // Read file locally as Data URL for preview
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target.result;
    // Generate clean mock CDN URL based on random unique hash
    const randomHash = Math.random().toString(36).substring(2, 9);
    const ext = file.name.split('.').pop() || 'webp';
    generatedUrl.value = `https://cdn.img2url.dev/i/${randomHash}.${ext}`;
  };
  reader.readAsDataURL(file);
};

// Sample Images Loader
const sampleImages = {
  tech: {
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    name: 'cyber-avatar.png',
    specs: '142.5 KB • PNG'
  },
  landscape: {
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    name: 'mountain-view.jpg',
    specs: '280.1 KB • JPG'
  },
  cyber: {
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    name: 'neon-city.webp',
    specs: '98.4 KB • WEBP'
  }
};

const loadSampleImage = (type) => {
  const sample = sampleImages[type] || sampleImages.tech;
  previewUrl.value = sample.url;
  fileName.value = sample.name;
  fileSpecs.value = sample.specs;
  const randomHash = Math.random().toString(36).substring(2, 9);
  const ext = sample.name.split('.').pop();
  generatedUrl.value = `https://cdn.img2url.dev/i/${randomHash}.${ext}`;
};

// Reset upload area
const resetUpload = () => {
  previewUrl.value = '';
  fileName.value = '';
  fileSpecs.value = '';
  generatedUrl.value = '';
  copiedType.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Clipboard copying with visual notification
const copyToClipboard = async (text, type) => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    copiedType.value = type;
    setTimeout(() => {
      copiedType.value = '';
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};
</script>

<style>
/* Root Color Variables - Dark Mode (Black, Green, White) */
:root {
  --bg-dark: #09090b;
  --bg-card: #121215;
  --bg-card-hover: #18181c;
  --border-color: rgba(255, 255, 255, 0.08);
  --border-color-hover: rgba(34, 197, 94, 0.3);

  --primary-green: #22c55e;
  --primary-green-glow: rgba(34, 197, 94, 0.25);
  --green-hover: #16a34a;
  --text-white: #ffffff;
  --text-muted: #a1a1aa;
  --text-dim: #71717a;

  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* Reset & Base Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  font-family: var(--font-family);
  background-color: var(--bg-dark);
  color: var(--text-white);
}

body {
  background-color: var(--bg-dark);
  color: var(--text-white);
  min-height: 100vh;
  line-height: 1.6;
  overflow-x: hidden;
}

.app-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Glow Background Effects */
.bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
  z-index: 0;
}

.bg-glow-top {
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 350px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, rgba(9, 9, 11, 0) 70%);
}

.bg-glow-bottom {
  bottom: 0;
  right: 10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, rgba(9, 9, 11, 0) 70%);
}

/* Text Highlights & Utilities */
.text-green {
  color: var(--primary-green);
}

.text-gradient {
  background: linear-gradient(135deg, #ffffff 30%, var(--primary-green) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Navbar */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  background: rgba(9, 9, 11, 0.8);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 1.5rem;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: var(--text-white);
}

.logo-icon {
  width: 34px;
  height: 34px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid var(--primary-green);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-green);
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: var(--text-white);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.03);
  padding: 0.35rem 0.75rem;
  border-radius: 100px;
  border: 1px solid var(--border-color);
}

.status-dot, .pulse-dot {
  width: 8px;
  height: 8px;
  background-color: var(--primary-green);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--primary-green);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  border: none;
  font-size: 0.95rem;
}

.btn-primary {
  background: var(--primary-green);
  color: #000000;
  box-shadow: 0 0 15px var(--primary-green-glow);
}

.btn-primary:hover {
  background: #20b857;
  box-shadow: 0 0 25px rgba(34, 197, 94, 0.4);
  transform: translateY(-1px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-white);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--text-muted);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-xs {
  padding: 0.35rem 0.7rem;
  font-size: 0.8rem;
}

.btn-lg {
  padding: 0.9rem 2rem;
  font-size: 1.05rem;
}

/* Hero Section */
.hero-section {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 4rem auto 2rem;
  padding: 0 1.5rem;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  border-radius: 100px;
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.25);
  color: var(--primary-green);
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: 1.2rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--text-muted);
  max-width: 680px;
  margin: 0 auto 3rem;
}

/* Upload Container & Sandbox */
.upload-container {
  max-width: 800px;
  margin: 0 auto;
}

.dropzone {
  background: var(--bg-card);
  border: 2px dashed rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 2.5rem;
  transition: all 0.25s ease;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.dropzone:hover, .dropzone.is-dragging {
  border-color: var(--primary-green);
  background: rgba(34, 197, 94, 0.03);
  box-shadow: 0 0 30px rgba(34, 197, 94, 0.15);
}

.dropzone.has-file {
  cursor: default;
  border-style: solid;
  border-color: var(--border-color);
  padding: 2rem;
}

.hidden-input {
  display: none;
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

.upload-icon-wrapper {
  width: 64px;
  height: 64px;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-green);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.dropzone-text .primary-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-white);
}

.dropzone-text .highlight {
  color: var(--primary-green);
  text-decoration: underline;
  text-underline-offset: 4px;
}

.dropzone-text .secondary-text {
  font-size: 0.875rem;
  color: var(--text-dim);
  margin-top: 0.3rem;
}

.sample-pills {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.8rem;
  flex-wrap: wrap;
  justify-content: center;
}

.sample-label {
  font-size: 0.8rem;
  color: var(--text-dim);
}

.pill-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 0.3rem 0.75rem;
  border-radius: 100px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pill-btn:hover {
  border-color: var(--primary-green);
  color: var(--text-white);
  background: rgba(34, 197, 94, 0.1);
}

/* Preview Layout */
.preview-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 1.5rem;
  text-align: left;
}

.preview-card {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-image-container {
  width: 100%;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
}

.preview-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.file-name {
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-specs {
  font-size: 0.78rem;
  color: var(--text-dim);
}

.meta-badges {
  display: flex;
  gap: 0.4rem;
  margin: 0.5rem 0;
}

.badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
}

.badge-green {
  background: rgba(34, 197, 94, 0.15);
  color: var(--primary-green);
}

.badge-outline {
  border: 1px solid var(--border-color);
  color: var(--text-muted);
}

/* URL Output Panel */
.url-output-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-white);
}

.status-pill {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: var(--primary-green);
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-group label {
  font-size: 0.78rem;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.input-with-button {
  display: flex;
  gap: 0.5rem;
}

.code-input {
  flex: 1;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid var(--border-color);
  color: var(--primary-green);
  font-family: monospace;
  font-size: 0.85rem;
  padding: 0.55rem 0.75rem;
  border-radius: 6px;
  outline: none;
}

.btn-copy {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: var(--primary-green);
  font-size: 0.8rem;
  padding: 0 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.btn-copy:hover {
  background: var(--primary-green);
  color: #000;
}

/* Metrics Section */
.metrics-section {
  max-width: 1100px;
  margin: 5rem auto;
  padding: 0 1.5rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
}

.metric-value {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--text-white);
}

.metric-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.2rem;
}

/* Features Section */
.features-section, .how-section {
  max-width: 1100px;
  margin: 6rem auto;
  padding: 0 1.5rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.section-tag {
  color: var(--primary-green);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
}

.section-title {
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 0.6rem;
}

.section-subtitle {
  color: var(--text-muted);
  font-size: 1.05rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 1.8rem;
  transition: all 0.3s ease;
}

.feature-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-color-hover);
  transform: translateY(-4px);
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-green);
  margin-bottom: 1.2rem;
}

.feature-card h3 {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
}

.feature-card p {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.5;
}

/* How Section */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.step-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 2rem;
  position: relative;
}

.step-number {
  font-size: 2.5rem;
  font-weight: 900;
  color: rgba(34, 197, 94, 0.3);
  margin-bottom: 0.8rem;
}

.step-card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.step-card p {
  color: var(--text-muted);
  font-size: 0.92rem;
}

/* CTA Section */
.cta-section {
  max-width: 1000px;
  margin: 6rem auto 4rem;
  padding: 0 1.5rem;
}

.cta-card {
  background: linear-gradient(180deg, rgba(34, 197, 94, 0.1) 0%, rgba(18, 18, 21, 0.9) 100%);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 20px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 0 50px rgba(34, 197, 94, 0.1);
}

.cta-card h2 {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 0.8rem;
}

.cta-card p {
  color: var(--text-muted);
  max-width: 500px;
  margin: 0 auto 2rem;
  font-size: 1.05rem;
}

/* Footer */
.footer {
  background: #050507;
  border-top: 1px solid var(--border-color);
  padding: 4rem 1.5rem 2rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1100px;
  margin: 0 auto 3rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 3rem;
}

.footer-brand p {
  color: var(--text-dim);
  font-size: 0.88rem;
  margin-top: 0.6rem;
  max-width: 300px;
}

.footer-links {
  display: flex;
  gap: 4rem;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.footer-column h4 {
  font-size: 0.88rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-white);
  margin-bottom: 0.4rem;
}

.footer-column a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.88rem;
  transition: color 0.2s ease;
}

.footer-column a:hover {
  color: var(--primary-green);
}

.footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
  color: var(--text-dim);
}

.system-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--primary-green);
}

/* Responsive Styles */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .hero-title {
    font-size: 2.3rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .preview-layout {
    grid-template-columns: 1fr;
  }

  .footer-content {
    flex-direction: column;
    gap: 2rem;
  }

  .footer-links {
    gap: 2rem;
  }
}
</style>
