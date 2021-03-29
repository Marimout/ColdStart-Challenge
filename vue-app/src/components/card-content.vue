<script>
import { postReward } from '../assets/js/personalizer';

export default {
  name: 'CardContent',
  props: {
    id: {
      type: Number,
      default: () => '',
    },
    name: {
      type: String,
      default: () => '',
    },
    description: {
      type: String,
      default: () => '',
    },
    imageurl: {
      type: String,
      default: () => '',
    },
    eventId: {
      type: String,
      default: () => '',
    },
    recommendedId: {
      type: Number,
      default: () => undefined,
    },
  },
  methods: {
    addToCart() {
      const { cart } = this.$root.$data;

      if (this.id in cart) {
        cart[this.id] += 1;
      } else {
        cart[this.id] = 1;
      }

      if (this.id === this.recommendedId) {
        postReward(this.eventId, 1);
      }
    },
  },
};
</script>

<template>
  <div class="card-content">
    <header class="card-header">
      <p class="card-header-title">{{ name }}</p>
    </header>

    <div class="content">
      <div class="catalog-image">
        <img v-bind:src="imageurl" />
      </div>
      <p class="description">{{ description }}</p>
      <div v-if="this.recommendedId == this.id">! RECOMMENDED !</div>
      <div>
        <button
          v-if="this.$root.$data.user"
          v-on:click="addToCart"
          class="button"
        >
          Add to cart
        </button>
      </div>
    </div>
  </div>
</template>
