<template>
  <div class="app">
    <header class="header">
      <h1 class="logo">Surma Studio</h1>
      <nav class="nav">
        <router-link to="/" class="nav-link">HOME</router-link>
        <router-link to="/archive" class="nav-link">ARCHIVE</router-link>
        <router-link to="/echo" class="nav-link">THE ECHO</router-link>
        <router-link to="/enquiry" class="nav-link">ENQUIRY</router-link>
      </nav>
    </header>

    <main>
      <router-view />
    </main>

    <footer class="footer">
      <p>© 2026 SURMA STUDIO. ALL RIGHTS RESERVED.</p>
    </footer>
  </div>
</template>

<script setup>
// No additional logic needed for layout
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Font face declarations */
@font-face {
  font-family: 'Helvetica Now Bold';
  src: url('/fonts/helveticanowtext-bold-demo.ttf') format('truetype');
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Helvetica Now';
  src: url('/fonts/helveticanowtext-black-demo.ttf') format('truetype');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

/* Global body styles */
body {
  font-family:
    'Helvetica Now',
    -apple-system,
    BlinkMacSystemFont,
    'Helvetica Neue',
    Helvetica,
    Arial,
    sans-serif;
  font-weight: bold;
  background-color: #ffffff;
  margin: 0;
  padding: 0;
}

.app {
  min-height: 100vh;
  background-color: #ffffff;
}

/* Centered header */
.header {
  text-align: center;
  padding: 3rem 2rem 1.5rem 2rem;
  border-bottom: 1px solid #eaeaea;
}

.logo {
  font-size: 3rem;
  font-weight: bold;
  letter-spacing: 0px;
  color: #000000;
  margin-bottom: 1.5rem;
  text-decoration: none;
  font-family: 'Helvetica Now Bold', sans-serif;
}

.nav {
  display: flex;
  justify-content: center;
  gap: 2.5rem;
}

.nav-link {
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: bold;
  letter-spacing: 0.15em;
  color: #333333;
  transition: color 0.2s ease;
  font-family: 'Helvetica Now', sans-serif;
}

.nav-link:hover {
  color: #000000;
}

.nav-link.router-link-active {
  color: #000000;
  font-weight: bold;
}

.footer {
  text-align: center;
  padding: 2rem;
  font-size: 0.75rem;
  font-weight: bold;
  color: #999999;
  border-top: 1px solid #eaeaea;
  font-family: 'Helvetica Now', sans-serif;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .logo {
    font-size: 2rem;
    letter-spacing: 1px;
  }

  .nav {
    gap: 1.5rem;
  }

  .nav-link {
    font-size: 0.8rem;
  }

  .header {
    padding: 2rem 1rem 1rem 1rem;
  }
}

@media (max-width: 480px) {
  .logo {
    font-size: 1.5rem;
    letter-spacing: 1px;
  }

  .nav {
    gap: 1rem;
  }

  .nav-link {
    font-size: 0.75rem;
    letter-spacing: 1px;
  }
}
</style>
