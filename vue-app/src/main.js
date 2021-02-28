import Vue from 'vue';
import App from '@/app.vue';
import router from './router';
import store from './store';
import getUserInfo from './assets/js/userInfo';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  data: {
    user: undefined,
    cart: undefined,
  },
  async created() {
    this.user = await getUserInfo();
    this.cart = {};
  },
  render: (h) => h(App),
}).$mount('#app');
