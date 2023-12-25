<script setup>
import AccountSettingsAccount from '@/views/pages/account-settings/AccountSettingsAccount.vue';
import { useRoute } from 'vue-router';
const store = inject('store');
const imageUrl = inject('imageUrl');

const route = useRoute()
const activeTab = ref(route.params.tab)

// tabs
// const tabs = [
//   {
//     title: 'Account',
//     icon: 'bx-user',
//     tab: 'account',
//   }
// ]
</script>

<template>
  <div>
    <!-- <VTabs v-model="activeTab" show-arrows>
      <VTab v-for="item in tabs" :key="item.icon" :value="item.tab">
        <VIcon size="20" start :icon="item.icon" />
        {{ item.title }}
      </VTab>
    </VTabs>
    <VDivider />

    <VWindow v-model="activeTab" class="mt-5 disable-tab-transition">
      <VWindowItem value="account">
      -->
    <AccountSettingsAccount :imageUrl="imageUrl" />
    <!--
      </VWindowItem>

      <VWindowItem value="security"> 
    <AccountSettingsSecurity />
    </VWindowItem>

      <VWindowItem value="notification">
        <AccountSettingsNotification />
      </VWindowItem>
    </VWindow> -->
  </div>
</template>
