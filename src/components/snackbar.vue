<template>
    {{ showSnackbar }}
    <v-snackbar v-model="showSnackbar" :timeout="timeout" :color="color" :multi-line="multiLine">
        {{ message }}
        <template v-if="showBtn">
            <v-btn color="primary" text @click="closeSnackbar">Close</v-btn>
        </template>
    </v-snackbar>
</template>
  
<script setup>
import { defineProps } from 'vue';

let props = defineProps({
    message: {
        type: String,
        default: 'Default Message',
    },
    timeout: {
        type: Number,
        default: 6000,
    },
    color: {
        type: String,
        default: 'success',
    },
    multiLine: {
        type: Boolean,
        default: false,
    },
    showBtn: {
        type: Boolean,
        default: false,
    },
    showSnackbar: {
        type: Boolean,
        default: false,
    }
});
const showSnackbar = ref(false)
watchEffect(() => {
    showSnackbar.value = props.showSnackbar
})
const closeSnackbar = () => {
    showSnackbar.value = false;
};
</script>
  