<script>
import { mapActions, mapGetters } from 'vuex';
import postOrders from '@/assets/js/order';
import ListHeader from '@/components/list-header.vue';
import CartList from './cart-list.vue';

export default {
  name: 'Cart',
  data() {
    return {
      errorMessage: '',
      message: '',
      routePath: '/cart',
      title: 'Your cart',
    };
  },
  components: {
    ListHeader,
    CartList,
  },
  async created() {
    await this.getCatalog();
  },
  computed: {
    ...mapGetters('catalog', { catalog: 'catalog' }),
  },
  methods: {
    ...mapActions('catalog', ['getCatalogAction']),
    async getCatalog() {
      this.errorMessage = undefined;
      try {
        await this.getCatalogAction();
      } catch (error) {
        this.errorMessage = 'Unauthorized';
      }
    },
    async submitOrder() {
      const newOrder = {
        User: this.$root.$data.user.userDetails,
        Date: new Date(),
        Status: 'New',
        DriverId: undefined,
        FullAddress: '1 Microsoft Way, Redmond, WA 98052, USA',
        LastPosition: null,
        Icecreams: [],
      };

      Object.keys(this.$root.$data.cart).forEach((key) => {
        newOrder.Icecreams.push({
          Id: key,
          Quantity: this.$root.$data.cart[key],
        });
      });

      const response = await postOrders(newOrder);
      if (response !== 201) {
        alert('An error occured. Please try again !');
      } else {
        alert('Order submitted. See you soon !');
        this.$root.$data.cart = {};
      }
    },
    async emptyCart() {
      this.$root.$data.cart = {};
    },
  },
};
</script>

<template>
  <div class="content-container">
    <ListHeader :title="title" @refresh="getCatalog" :routePath="routePath">
    </ListHeader>
    <div class="columns is-multiline is-variable">
      <div class="column is-full" v-if="catalog">
        <CartList
          :cart="this.$root.$data.cart"
          :catalog="catalog"
          :errorMessage="errorMessage"
        ></CartList>
      </div>
      <div class="column is-full has-text-centered">
        <div class="field is-grouped is-justify-content-center">
          <p class="control">
            <button v-on:click="submitOrder" class="button is-primary">
              Submit order
            </button>
          </p>
          <p class="control"><button v-on:click="emptyCart" class="button">Empty cart</button></p>
        </div>
      </div>
    </div>
  </div>
</template>
