<script>
import CardContent from '@/components/card-content.vue';

export default {
  name: 'CatalogList',
  props: {
    icecreams: {
      type: Array,
      default: () => [],
    },
    errorMessage: {
      type: String,
      default: () => '',
    },
    eventId: {
      type: String,
      default: () => '',
    },
    recommendedId: {
      type: Number,
      default: () => 0,
    },
  },
  components: {
    CardContent,
  },
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

<template>
  <div>
    <div v-if="errorMessage">{{ errorMessage }}</div>
    <div v-if="!icecreams.length && !errorMessage">
      Loading data ...
    </div>
    <div class="container">
      <div
        v-for="(icecream) in icecreams"
        :key="icecream.Id"
        role="presentation"
      >
        <div class="card">
          <CardContent
            :name="icecream.Name"
            :description="icecream.Description"
            :imageurl="icecream.ImageUrl"
            :id="icecream.Id"
            :recommendedId="recommendedId"
            :eventId="eventId"
          />
        </div>
      </div>
    </div>
  </div>
</template>
