<script>
export default {
  name: 'CartList',
  props: {
    cart: {
      type: Object,
      default: () => {},
    },
    catalog: {
      type: Array,
      default: () => [],
    },
    errorMessage: {
      type: String,
      default: () => '',
    },
  },
  components: {},
  data() {
    return {};
  },
  computed: {
    detailedCart() {
      const newCart = [];
      Object.keys(this.cart).forEach((key) => {
        newCart.push({
          id: key,
          name: this.catalog.find((x) => x.Id === parseInt(key, 10)).Name,
          quantity: this.cart[key],
        });
      });

      return newCart;
    },
  },
  methods: {},
};
</script>

<template>
  <div>
    <div v-if="errorMessage">{{ errorMessage }}</div>
    <div v-if="!detailedCart && !errorMessage">Loading data ...</div>
    <div class="container">
      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th><abbr title="Number">No</abbr></th>
            <th>Item</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in detailedCart"
            :key="item.id"
            role="presentation"
          >
            <th>{{ index + 1 }}</th>
            <td>
              {{ item.name }}
            </td>
            <td>{{ item.quantity }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
