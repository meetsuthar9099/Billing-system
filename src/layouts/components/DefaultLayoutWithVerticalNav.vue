<script setup>
import VerticalNavLayout from "@layouts/components/VerticalNavLayout.vue";
import VerticalNavLink from "@layouts/components/VerticalNavLink.vue";
import snackbar from "@/components/snackbar.vue";

// Components
import Footer from "@/layouts/components/Footer.vue";
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
import UserProfile from "@/layouts/components/UserProfile.vue";
import { useRouter } from "vue-router";
import { checkPermission } from '@/mixins/permissionMixin'
const router = useRouter();

const showSnackbar = ref(false)
const routeItem = computed(() => {
  let routePath = router.currentRoute.value.path
    .split("/")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1));
  routePath.shift();
  if (routePath[1] == 0) {
    routePath[1] = "Add";
  }
  return routePath;
});
</script>

<template>
  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <IconBtn class="ms-n3 d-lg-none" @click="toggleVerticalOverlayNavActive(true)">
          <VIcon icon="bx-menu" />
        </IconBtn>

        <!-- 👉 Search -->
        <div class="d-flex align-center cursor-pointer" style="width: 100%">
          <!-- 👉 Search Trigger button -->
          <!-- <IconBtn>
            <VIcon icon="bx-search" />
          </IconBtn>

          <span class="d-none d-md-flex align-center text-disabled">
            <span class="me-3">Search</span>

          </span> -->
          <v-breadcrumbs class="px-0">
            <v-breadcrumbs-item :to="'/dashboard'"> Home </v-breadcrumbs-item>/
            <template v-for="(item, index) in routeItem" :key="'route' + index">
              <v-breadcrumbs-item :to="item">
                {{ item }}
              </v-breadcrumbs-item>
              <span v-if="index < routeItem.length - 1">/</span>
            </template>
          </v-breadcrumbs>
        </div>

        <VSpacer />

        <IconBtn class="me-2">
          <VIcon icon="bx-bell" />
        </IconBtn>

        <NavbarThemeSwitcher class="me-2" />

        <UserProfile />
      </div>
    </template>

    <template #vertical-nav-content>
      <VerticalNavLink :item="{
        title: 'Dashboard',
        icon: 'bx-home',
        to: '/dashboard',
        group: 'Dashboard',
      }" />
        <VDivider class="my-4"></VDivider>
      <VerticalNavLink v-if="checkPermission('View Customer')" :active="true" :item="{
        title: 'Customer',
        icon: 'mdi-account-cog-outline',
        to: '/customer',
        group: 'Customer',
      }" />
      <VerticalNavLink v-if="checkPermission('View Invoice')" :item="{
        title: 'Invoice',
        icon: 'mdi-invoice',
        to: '/invoice',
        group: 'Invoice',
      }" />
      <VerticalNavLink v-if="checkPermission('View Payment')" :item="{
        title: 'Payment',
        icon: 'mdi-payment',
        to: '/payment',
        group: 'Payment',
      }" />
      <VDivider class="my-4"></VDivider>
      <VerticalNavLink :item="{
        title: 'Setting',
        icon: 'mdi-cog',
        to: '/settings',
        group: 'Setting',
      }" />
      <VerticalNavLink :item="{
        title: 'AuditLogs',
        icon: 'mdi-book',
        to: '/auditLogs',
        group: 'AuditLogs',
      }" />
      <!-- 
      <VerticalNavSectionTitle :item="{
        heading: 'Pages',
      }" />
      <VerticalNavLink :item="{
        title: 'Login',
        icon: 'bx-log-in',
        to: '/login',
      }" />
      <VerticalNavLink :item="{
        title: 'Register',
        icon: 'bx-user-plus',
        to: '/register',
      }" />
      <VerticalNavLink :item="{
        title: 'Error',
        icon: 'bx-info-circle',
        to: '/no-existence',
      }" />

      <VerticalNavSectionTitle :item="{
        heading: 'User Interface',
      }" />
      <VerticalNavLink :item="{
        title: 'Typography',
        icon: 'mdi-alpha-t-box-outline',
        to: '/typography',
      }" />
      <VerticalNavLink :item="{
        title: 'Icons',
        icon: 'bx-show',
        to: '/icons',
      }" />
      <VerticalNavLink :item="{
        title: 'Cards',
        icon: 'bx-credit-card',
        to: '/cards',
      }" />
      <VerticalNavLink :item="{
        title: 'Tables',
        icon: 'bx-table',
        to: '/tables',
      }" />
      <VerticalNavLink :item="{
        title: 'Form Layouts',
        icon: 'mdi-form-select',
        to: '/form-layouts',
      }" /> -->
    </template>
    <slot />

    <template #footer>
      <Footer />
    </template>
  </VerticalNavLayout>
</template>
<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}
</style>
