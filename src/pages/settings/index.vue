<template>
    <v-card class="h-screen">
        <v-toolbar color="primary">
            <v-toolbar-title><span>Settings</span></v-toolbar-title>
        </v-toolbar>
        <div class="d-flex">
            <v-tabs v-model="tab" direction="vertical" color="primary" width="300">
                <v-tab value="option-1">
                    <v-icon class="me-2">mdi-building</v-icon>
                    Company
                </v-tab>
                <v-tab value="option-2">
                    <v-icon class="me-2">mdi-currency-inr</v-icon>
                    currency
                </v-tab>
                <v-tab value="option-3">
                    <v-icon class="me-2">mdi-payment</v-icon>
                    payment Modes
                </v-tab>
            </v-tabs>
            <v-window v-model="tab" class="w-100">
                <v-window-item value="option-1" class="h-screen overflow-auto pa-3 pb-16">
                    <companySettings />
                </v-window-item>
                <v-window-item value="option-2" class="h-screen overflow-auto pa-3 pb-16">
                    <currencySettings />
                </v-window-item>
                <v-window-item value="option-3" class="h-screen overflow-auto pa-3 pb-16">
                    <countrySettings />
                </v-window-item>
            </v-window>
        </div>
    </v-card>
</template>
<script setup>
import companySettings from './company-settings.vue'
import currencySettings from './currency-settings.vue'
import countrySettings from './payment-mode-settings.vue'
import { ref } from 'vue'
const tab = ref(0)
</script>
<style scoped>
.v-slide-group__content button {
    display:flex;
    padding: 30px;
}
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: none; 
  border-radius: 10px;
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: grey; 
  border-radius: 10px;
}
</style>