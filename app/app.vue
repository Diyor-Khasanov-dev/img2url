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
          <div class="status-badge" :class="{ 'status-offline': !isBackendHealthy }">
            <span class="status-dot" :class="{ 'dot-offline': !isBackendHealthy }"></span>
            {{ isBackendHealthy ? 'Edge CDN Active' : 'Backend Connecting...' }}
          </div>

          <!-- User Auth Navigation Actions -->
          <div v-if="currentUser" class="user-menu-wrapper">
            <button class="btn btn-secondary btn-sm user-menu-btn" @click="openProfileModal">
              <span class="avatar-icon">{{ currentUser.fullName ? currentUser.fullName[0].toUpperCase() : 'U' }}</span>
              <span class="user-name">{{ currentUser.fullName || currentUser.email }}</span>
            </button>
            <button class="btn btn-xs btn-outline-danger" @click="handleLogout" title="Logout">
              Logout
            </button>
          </div>

          <div v-else class="auth-buttons">
            <button class="btn btn-secondary btn-sm" @click="openAuthModal('login')">
              Log In
            </button>
            <button class="btn btn-primary btn-sm" @click="openAuthModal('register')">
              Sign Up
            </button>
          </div>
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

            <!-- Loading Spinner Overlay when Uploading -->
            <div v-if="isUploading" class="upload-loading-state">
              <div class="spinner"></div>
              <p class="loading-text">Uploading and generating edge link...</p>
            </div>

            <div v-else-if="!previewUrl" class="dropzone-content">
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

    <!-- Profile Modal (View / Update Profile) -->
    <div v-if="isProfileModalOpen" class="modal-backdrop" @click.self="closeProfileModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3>User Profile Settings</h3>
          <button class="close-btn" @click="closeProfileModal">&times;</button>
        </div>

        <p class="modal-subtitle">
          Update your personal details or account password below.
        </p>

        <form @submit.prevent="handleProfileSubmit" class="auth-form">
          <div class="form-group">
            <label for="profileFullName">Full Name</label>
            <input
              id="profileFullName"
              v-model="profileForm.fullName"
              type="text"
              placeholder="Full Name"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="profileEmail">Email Address</label>
            <input
              id="profileEmail"
              v-model="profileForm.email"
              type="email"
              placeholder="name@example.com"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="profilePassword">New Password (leave blank to keep current)</label>
            <input
              id="profilePassword"
              v-model="profileForm.password"
              type="password"
              placeholder="New password (min 6 chars)"
              minlength="6"
              class="form-input"
            />
          </div>

          <div v-if="profileMessage" class="auth-success-msg">
            ✓ {{ profileMessage }}
          </div>

          <div v-if="profileError" class="auth-error-msg">
            ⚠️ {{ profileError }}
          </div>

          <div class="modal-actions-row">
            <button type="button" class="btn btn-secondary" @click="closeProfileModal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isProfileSubmitting">
              <span v-if="isProfileSubmitting" class="button-spinner"></span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Auth Modal (Login / Register) -->
    <div v-if="isAuthModalOpen" class="modal-backdrop" @click.self="closeAuthModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3>{{ authMode === 'login' ? 'Welcome Back' : 'Create an Account' }}</h3>
          <button class="close-btn" @click="closeAuthModal">&times;</button>
        </div>

        <p class="modal-subtitle">
          {{ authMode === 'login' ? 'Log in to manage your uploaded images and profile.' : 'Sign up to get permanent image hosting and JWT access.' }}
        </p>

        <form @submit.prevent="handleAuthSubmit" class="auth-form">
          <div v-if="authMode === 'register'" class="form-group">
            <label for="fullName">Full Name</label>
            <input
              id="fullName"
              v-model="authForm.fullName"
              type="text"
              placeholder="Jane Doe"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              id="email"
              v-model="authForm.email"
              type="email"
              placeholder="jane@example.com"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="authForm.password"
              type="password"
              placeholder="••••••••"
              required
              minlength="6"
              class="form-input"
            />
          </div>

          <div v-if="authError" class="auth-error-msg">
            ⚠️ {{ authError }}
          </div>

          <button type="submit" class="btn btn-primary btn-block" :disabled="isAuthSubmitting">
            <span v-if="isAuthSubmitting" class="button-spinner"></span>
            <span v-else>{{ authMode === 'login' ? 'Sign In' : 'Create Account' }}</span>
          </button>
        </form>

        <div class="modal-footer">
          <p v-if="authMode === 'login'">
            Don't have an account?
            <a href="#" @click.prevent="switchAuthMode('register')">Sign Up</a>
          </p>
          <p v-else>
            Already have an account?
            <a href="#" @click.prevent="switchAuthMode('login')">Log In</a>
          </p>
        </div>
      </div>
    </div>

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
        <div class="system-status" :class="{ 'status-offline-text': !isBackendHealthy }">
          <span class="status-dot" :class="{ 'dot-offline': !isBackendHealthy }"></span>
          {{ isBackendHealthy ? 'All systems operational' : 'Reconnecting to backend...' }}
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const API_BASE_URL = 'https://img2url-backend.onrender.com';

// Reactive state
const isDragging = ref(false);
const isUploading = ref(false);
const isBackendHealthy = ref(true);
const previewUrl = ref('');
const fileName = ref('');
const fileSpecs = ref('');
const generatedUrl = ref('');
const copiedType = ref('');
const uploadError = ref('');
const fileInput = ref(null);

// Auth & User State
const currentUser = ref(null);
const accessToken = ref('');
const isAuthModalOpen = ref(false);
const authMode = ref('login'); // 'login' | 'register'
const isAuthSubmitting = ref(false);
const authError = ref('');
const authForm = ref({
  fullName: '',
  email: '',
  password: ''
});

// Profile Modal State & Form
const isProfileModalOpen = ref(false);
const isProfileSubmitting = ref(false);
const profileError = ref('');
const profileMessage = ref('');
const profileForm = ref({
  fullName: '',
  email: '',
  password: ''
});

const openProfileModal = () => {
  if (currentUser.value) {
    profileForm.value = {
      fullName: currentUser.value.fullName || '',
      email: currentUser.value.email || '',
      password: ''
    };
  }
  profileError.value = '';
  profileMessage.value = '';
  isProfileModalOpen.value = true;
};

const closeProfileModal = () => {
  isProfileModalOpen.value = false;
  profileError.value = '';
  profileMessage.value = '';
};

// Update user profile via PATCH /api/auth/me
const handleProfileSubmit = async () => {
  profileError.value = '';
  profileMessage.value = '';
  isProfileSubmitting.value = true;

  try {
    const payload = {};
    if (profileForm.value.fullName) payload.fullName = profileForm.value.fullName;
    if (profileForm.value.email) payload.email = profileForm.value.email;
    if (profileForm.value.password) payload.password = profileForm.value.password;

    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      const errMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message || 'Failed to update profile.';
      throw new Error(errMsg);
    }

    if (data.user) {
      currentUser.value = data.user;
    } else {
      await fetchUserProfile();
    }

    profileMessage.value = data.message || 'Profile updated successfully!';
    setTimeout(() => {
      closeProfileModal();
    }, 1500);
  } catch (err) {
    profileError.value = err.message;
  } finally {
    isProfileSubmitting.value = false;
  }
};

// Format image URL helper (ensures https)
const formatImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  return url;
};

// Check backend health
const checkBackendHealth = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/`);
    if (res.ok) {
      isBackendHealthy.value = true;
    } else {
      isBackendHealthy.value = false;
    }
  } catch (err) {
    isBackendHealthy.value = false;
  }
};

// Load stored JWT token & current user on mounted
onMounted(() => {
  checkBackendHealth();
  if (import.meta.client) {
    const savedToken = localStorage.getItem('img2url_token');
    if (savedToken) {
      accessToken.value = savedToken;
      fetchUserProfile();
    }
  }
});

// Auth Helper Functions
const openAuthModal = (mode = 'login') => {
  authMode.value = mode;
  authError.value = '';
  authForm.value = { fullName: '', email: '', password: '' };
  isAuthModalOpen.value = true;
};

const closeAuthModal = () => {
  isAuthModalOpen.value = false;
  authError.value = '';
};

const switchAuthMode = (mode) => {
  authMode.value = mode;
  authError.value = '';
};

// Fetch current logged in user profile
const fetchUserProfile = async () => {
  if (!accessToken.value) return;
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      currentUser.value = data.user || data;
    } else {
      // Token invalid or expired
      handleLogout();
    }
  } catch (err) {
    console.error('Failed to fetch user profile:', err);
  }
};

// Handle Authentication Form Submit (Login / Register)
const handleAuthSubmit = async () => {
  authError.value = '';
  isAuthSubmitting.value = true;

  try {
    const endpoint = authMode.value === 'register' ? '/api/auth/register' : '/api/auth/login';
    const payload = authMode.value === 'register'
      ? { fullName: authForm.value.fullName, email: authForm.value.email, password: authForm.value.password }
      : { email: authForm.value.email, password: authForm.value.password };

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      const errMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message || 'Authentication failed.';
      throw new Error(errMsg);
    }

    if (data.access_token) {
      accessToken.value = data.access_token;
      if (import.meta.client) {
        localStorage.setItem('img2url_token', data.access_token);
      }
    }

    if (data.user) {
      currentUser.value = data.user;
    } else {
      await fetchUserProfile();
    }

    closeAuthModal();
  } catch (err) {
    authError.value = err.message;
  } finally {
    isAuthSubmitting.value = false;
  }
};

// Handle Logout
const handleLogout = async () => {
  if (accessToken.value) {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
  }
  accessToken.value = '';
  currentUser.value = null;
  if (import.meta.client) {
    localStorage.removeItem('img2url_token');
  }
};

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

// Upload image file to backend
const uploadFileToBackend = async (file) => {
  uploadError.value = '';
  isUploading.value = true;
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/img-deploy`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      const errMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message || 'Failed to upload image.';
      throw new Error(errMsg);
    }

    const finalUrl = formatImageUrl(data.url || data.link || data.imageUrl);
    generatedUrl.value = finalUrl;
    previewUrl.value = finalUrl;
    fileName.value = data.originalname || file.name;
    const sizeKb = ((data.size || file.size) / 1024).toFixed(1);
    const mime = (data.mimetype || file.type || 'image/png').split('/')[1]?.toUpperCase() || 'IMAGE';
    fileSpecs.value = `${sizeKb} KB • ${mime}`;
  } catch (err) {
    alert(`Upload Error: ${err.message}`);
    uploadError.value = err.message;
  } finally {
    isUploading.value = false;
  }
};

// File processing helper
const processFile = async (file) => {
  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file (PNG, JPG, WEBP, SVG, GIF).');
    return;
  }
  await uploadFileToBackend(file);
};

// Sample Images Loader (Fetches sample image, converts to File, and uploads to backend)
const sampleImages = {
  tech: {
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    name: 'cyber-avatar.jpg',
    type: 'image/jpeg'
  },
  landscape: {
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    name: 'mountain-view.jpg',
    type: 'image/jpeg'
  },
  cyber: {
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    name: 'neon-city.jpg',
    type: 'image/jpeg'
  }
};

const loadSampleImage = async (type) => {
  const sample = sampleImages[type] || sampleImages.tech;
  try {
    isUploading.value = true;
    const response = await fetch(sample.url);
    const blob = await response.blob();
    const file = new File([blob], sample.name, { type: sample.type });
    await uploadFileToBackend(file);
  } catch (err) {
    alert(`Failed to load sample image: ${err.message}`);
    isUploading.value = false;
  }
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
  transition: all 0.3s ease;
}

.status-dot.dot-offline {
  background-color: #f59e0b;
  box-shadow: 0 0 8px #f59e0b;
}

.status-badge.status-offline {
  border-color: rgba(245, 158, 11, 0.3);
  color: #f59e0b;
}

.system-status.status-offline-text {
  color: #f59e0b;
}

/* Loading State for Uploading */
.upload-loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 0;
}

.spinner {
  width: 38px;
  height: 38px;
  border: 3px solid rgba(34, 197, 94, 0.2);
  border-top-color: var(--primary-green);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 500;
}

/* User Menu & Navigation Auth Styling */
.user-menu-wrapper {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.user-menu-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--primary-green);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.user-name {
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.btn-outline-danger {
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #ef4444;
}

.btn-outline-danger:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: #ef4444;
}

/* Modals */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-card {
  background: #121215;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  width: 100%;
  max-width: 440px;
  padding: 2rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  animation: modalFadeIn 0.25s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.4rem;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.6rem;
  cursor: pointer;
  line-height: 1;
}

.close-btn:hover {
  color: var(--text-white);
}

.modal-subtitle {
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.4;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
}

.form-input {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.65rem 0.85rem;
  color: var(--text-white);
  font-size: 0.92rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  border-color: var(--primary-green);
}

.auth-error-msg {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 0.6rem;
  border-radius: 8px;
  font-size: 0.82rem;
}

.auth-success-msg {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: var(--primary-green);
  padding: 0.6rem;
  border-radius: 8px;
  font-size: 0.82rem;
}

.modal-actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 0.5rem;
}

.btn-block {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.4rem;
}

.modal-footer {
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-muted);
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

.modal-footer a {
  color: var(--primary-green);
  text-decoration: none;
  font-weight: 600;
}

.modal-footer a:hover {
  text-decoration: underline;
}

.button-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
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
