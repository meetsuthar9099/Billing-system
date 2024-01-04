<template>
    <div>
        <div class="mb-2">
            <v-row>
                <v-col cols="6">
                    <div><span>Page {{ pagination.currentPage }} of {{ pagination.totalPage }}</span></div>
                </v-col>
                <v-col cols="6" class="d-flex justify-end">
                    <v-btn class="me-2" variant="outlined" @click="isFilterVisible = !isFilterVisible">
                        <span>filter</span>
                        <v-icon>{{ isFilterVisible ? 'mdi-close' : 'mdi-filter' }}</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        <v-card height="100" elevation="0" v-if="isFilterVisible" class="my-3 pa-5 d-flex align-center">
            <v-row>
                <v-col cols="12" class="pa-0 text-right">
                    <a href="javascript:void(0)" @click="resetFilter" class="me-4">Clear All</a>
                </v-col>
                <v-col cols="12">
                    <v-row>
                        <v-col cols="3">
                            <VSelect :item-title="user => `${user.firstname} ${user.last_name}`" item-value="_id"
                                :hide-selected="true" label="Select User" density="compact" name="display_name"
                                :items="users" v-model="filter.user_id" prepend-inner-icon="bx-user" />
                        </v-col>
                        <v-col cols="3">
                            <VSelect item-title="name" item-value="value" :hide-selected="true" label="Select Type"
                                density="compact" name="display_name" :items="logTypes" v-model="filter.type"
                                prepend-inner-icon="bx-user" />
                        </v-col>
                        <v-col cols="3">
                            <VTextField label="Date From" v-model="filter.date_from" type="date" density="compact">
                            </VTextField>
                        </v-col>
                        <v-col cols="3">
                            <VTextField label="Date To" v-model="filter.date_to" type="date" density="compact"></VTextField>
                        </v-col>

                    </v-row>
                </v-col>
            </v-row>

        </v-card>
        <v-table class="rounded">
            <thead slot="head">
                <tr>
                    <th>Date & Time</th>
                    <th>Type</th>
                    <th>User</th>
                    <th>Message</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in logs" :key="'customer' + index">
                    <td>{{ item.timestamp ? moment(item.timestamp).format('DD-MM-YYYY hh:mm:ss a') : '-' }}</td>
                    <td>{{ item.meta.type ? item.meta.type : '-' }}</td>
                    <td>{{ item.meta.user_id ? userName(item.meta.user_id) : '-' }}</td>
                    <td v-html="item.message"/>

                </tr>
                <tr v-if="!logs.length > 0">
                    <td colspan="99" class="text-center"><v-icon class="me-2">mdi-alert</v-icon>No data available</td>
                </tr>
            </tbody>
        </v-table>
        <div class="mt-2">
            <v-pagination :length="pagination.totalPage" v-model="filter.currentPage" next-aria-label="Next">
            </v-pagination>
        </div>
    </div>
</template>
<script setup>
import { inject, onMounted } from 'vue';
import moment from 'moment'

import { checkPermission } from '@/mixins/permissionMixin'
import auditlog from '@/api/auditlog';
const defaultFilter = Object.freeze({
    payment_mode: null,
    user_id: null,
    type: null,
    date_from: null,
    date_to: null,
    limit: 5
})
const store = inject('store');
const isFilterVisible = ref(false)
const bulkDeleteModel = ref(false)
const filter = ref({})
const selectCustomer = ref([])
// const myCheckbox = ref(null);

//computed
const logs = computed(() => { return store.state.auditLog.items })
const logTypes = computed(() => { return store.state.auditLog.logTypes })
const users = computed(() => { return store.state.auditLog.users })

const pagination = computed(() => {
    return {
        totalPage: store.state.auditLog.totalPage,
        limit: store.state.auditLog.limit,
        currentPage: store.state.auditLog.currentPage
    }
})
const doSearch = async () => {
    const query = {
        page: filter.value.currentPage,
        user_id: filter.value.user_id ? filter.value.user_id : '',
        type: filter.value.type ? filter.value.type : '',
        date_from: filter.value.date_from ? filter.value.date_from : '',
        date_to: filter.value.date_to ? filter.value.date_to : '',
    }
    store.dispatch('auditLog/fetch', {query});
}
const userName = (user_id) => {
    // filter.value = { ...defaultFilter }
    const user = users &&users.value.find(user => user._id.toString() == user_id)
    return user?.firstname+' '+user?.last_name  
}

const resetFilter = () => {
    filter.value = { ...defaultFilter }
}

//watcher
watch(filter, async () => {
    doSearch()
}, { deep: true })

//mounted
onMounted(async () => {
    store.dispatch('auditLog/users');
    store.dispatch('auditLog/logTypes');
    resetFilter()
    doSearch()
});

</script>