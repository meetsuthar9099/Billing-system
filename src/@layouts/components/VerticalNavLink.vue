<script setup>
import { useRoute } from "vue-router";

const props = defineProps({
  item: {
    type: null,
    required: true,
  },
});
const route = useRoute();
</script>

<template>
  <li class="nav-link" :class="{ disabled: item.disable }">
    <Component
      :is="item.to ? 'RouterLink' : 'a'"
      :to="item.to"
      :href="item.href"
      :class="{
        'router-link-active router-link-exact-active active':
          route.meta.group == item.group,
      }"
    >
      <VIcon :icon="item.icon" class="nav-item-icon" />
      <span class="nav-item-title">{{ item.title }}</span>
    </Component>
  </li>
</template>

<style lang="scss">
.layout-vertical-nav {
  .nav-link a {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}
</style>
