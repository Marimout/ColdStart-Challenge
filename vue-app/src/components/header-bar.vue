<script>
import HeaderBarBrand from '@/components/header-bar-brand.vue';

export default {
  name: 'HeaderBar',
  components: {
    HeaderBarBrand,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<template>
  <header>
    <nav class="navbar is-white" role="navigation" aria-label="main navigation">
      <HeaderBarBrand></HeaderBarBrand>
      <div class="navbar-menu">
        <div class="navbar-start">
          <router-link class="navbar-item nav-home" to="/">Home</router-link>
          <router-link
            v-if="this.$root.$data.user"
            class="navbar-item"
            to="/cart"
            >Cart</router-link
          >
          <a
            v-if="this.$root.$data.user"
            class="navbar-item"
            href="/.auth/logout"
            >Hello {{ this.$root.$data.user.userDetails }} (Logout)</a
          >
          <a v-else class="navbar-item" href="/.auth/login/facebook"
            >Login</a
          >
        </div>
      </div>
    </nav>
  </header>
</template>
