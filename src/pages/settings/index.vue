<template>
    <v-card class="h-screen">
        <v-toolbar color="primary">
            <v-toolbar-title><span>Settings</span></v-toolbar-title>
        </v-toolbar>
        <div class="d-flex">
            <v-tabs class="" v-model="tab" direction="vertical" color="primary" width="300">
                <v-tab value="option-1">
                    <v-icon class="me-2">mdi-building</v-icon>
                    Company Information
                </v-tab>
                <v-tab value="option-2">
                    <v-icon class="me-2">mdi-user</v-icon>
                    Account Details
                </v-tab>
                <v-tab value="option-3">
                    <v-icon class="me-2">mdi-currency-inr</v-icon>
                    currency
                </v-tab>
                <v-tab value="option-4">
                    <v-icon class="me-2">mdi-flag</v-icon>
                    Country
                </v-tab>
                <v-tab value="option-5">
                    <v-icon class="me-2">mdi-payment</v-icon>
                    payment Modes
                </v-tab>
                <v-tab value="option-6">
                    <v-icon class="me-2">mdi-note-text</v-icon>
                    Expense Category
                </v-tab>
            </v-tabs>
            <v-window v-model="tab" class="w-100">
                <v-window-item value="option-1" class="h-screen overflow-auto pa-3 pb-16">
                    <companySettings />
                </v-window-item>
                <v-window-item value="option-2" class="h-screen overflow-auto pb-16">
                    <accountSettings />
                </v-window-item>
                <v-window-item value="option-3" class="h-screen overflow-auto pa-3 pb-16">
                    <currencySettings />
                </v-window-item>
                <v-window-item value="option-4" class="h-screen overflow-auto pa-3 pb-16">
                    <countrySettings />
                </v-window-item>
                <v-window-item value="option-5" class="h-screen overflow-auto pa-3 pb-16">
                    <paymentMode />
                </v-window-item>
                <v-window-item value="option-6" class="h-screen overflow-auto pa-3 pb-16">
                    <expenseCategory />
                </v-window-item>
            </v-window>
        </div>
    </v-card>
</template>
<script setup>
import accountSettings from './account-settings.vue'
import companySettings from './company-settings.vue'
import currencySettings from './currency-settings.vue'
import countrySettings from './country-settings.vue'
import paymentMode from './payment-mode-settings.vue'
import expenseCategory from './expense-category.vue'
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