<template>
    <div>
        <div class="mb-2 d-flex justify-space-between align-center">
            <span>Page 1 of 10</span>
            <router-link
                class="v-btn v-btn--elevated v-theme--light bg-primary v-btn--density-default v-btn--size-default v-btn--variant-elevated"
                :to="{ path: 'customer/0' }">
                <v-icon>mdi-plus</v-icon>
                <span>Add Customer</span>
            </router-link>
        </div>
        <v-table>
            <thead slot="head">
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>number</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in testData" :key="'customer' + index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.moNumber }}</td>
                </tr>
            </tbody>
        </v-table>
        <div class="mt-2">
            <v-pagination :length="2" next-aria-label="Next">
            </v-pagination>
        </div>
    </div>
</template>
<script setup lang="ts">
const testData = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", moNumber: "123-456-7890" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", moNumber: "987-654-3210" },
    { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com", moNumber: "555-123-4567" },
    { id: 4, name: "Alice Brown", email: "alice.brown@example.com", moNumber: "333-789-0123" },
    { id: 5, name: "Chris Davis", email: "chris.davis@example.com", moNumber: "888-555-6789" },
    { id: 6, name: "Emily White", email: "emily.white@example.com", moNumber: "444-222-7890" },
    { id: 7, name: "Alex Green", email: "alex.green@example.com", moNumber: "111-777-8888" },
    { id: 8, name: "Grace Miller", email: "grace.miller@example.com", moNumber: "666-444-5555" },
    { id: 9, name: "Tom Wilson", email: "tom.wilson@example.com", moNumber: "222-666-9999" },
    { id: 10, name: "Sophia Turner", email: "sophia.turner@example.com", moNumber: "999-333-1111" },
]

</script>
<style lang="css">
.v-table>.v-table__wrapper>table>tbody>tr>th,
.v-table>.v-table__wrapper>table>tbody>tr>td,
.v-table>.v-table__wrapper>table>thead>tr>th,
.v-table>.v-table__wrapper>table>tfoot>tr>th {
    text-align: center !important;
}
</style>
