<script>
import { mapActions, mapGetters } from 'vuex';
import ListHeader from '@/components/list-header.vue';
import CatalogList from './catalog-list.vue';
import getPersonalizer from '../../assets/js/personalizer';

export default {
  name: 'Catalog',
  data() {
    return {
      errorMessage: '',
      message: '',
      routePath: '/catalog',
      title: 'Our Ice Creams',
      recommendedId: 0,
      eventId: '',
    };
  },
  components: {
    ListHeader,
    CatalogList,
  },
  async created() {
    await this.getCatalog();
    const personalizer = await getPersonalizer();
    this.recommendedId = parseInt(personalizer.ranking[0].id, 10);
    this.eventId = personalizer.eventId;
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
  },
};
</script>

<template>
  <div class="content-container">
    <ListHeader :title="title" @refresh="getCatalog" :routePath="routePath">
    </ListHeader>
    <div class="columns is-multiline is-variable">
      <div class="column" v-if="catalog">
        <CatalogList
          :icecreams="catalog"
          :errorMessage="errorMessage"
          :recommendedId=recommendedId
          :eventId="eventId"
        ></CatalogList>
      </div>
    </div>
  </div>
</template>
