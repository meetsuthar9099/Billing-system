<template>
  <h2 class="mb-3">{{ model._id ?'Edit Invoice':'New Invoice'}}</h2>
  <v-dialog v-model="addCustomerDialog" max-width="1000">
    <v-card>
      <v-card-title primary-title>
        title
      </v-card-title>
      
    </v-card>
  </v-dialog>
  <v-dialog v-model="confirmationDialog" max-width="400">
    <v-card>
      <v-card-title>Confirmation</v-card-title>
      <v-card-text> Are you sure you want copy from Billing? </v-card-text>
      <v-card-actions>
        <v-btn @click="copyBilling(true)">Yes</v-btn>
        <v-btn @click="copyBilling(false)">No</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-snackbar location="top right" v-model="projectError.isError" color="error">
    <v-icon class="me-1">mdi-warning</v-icon><strong>{{ projectError.message }}</strong>
  </v-snackbar>
  <VForm class="d-flex flex-column gap-2" @submit.prevent="onSubmit" ref="form">
    <VRow>
      <VCol cols="12" md="6">
        <VCard class="pa-8">
          <VRow>
            <VCol cols="12">
              <VRow>
                <VCol cols="12">
                  <VSelect item-title="name" item-value="_id" :hide-selected="true" density="comfortable" label="Add Customer"
                    name="display_name" :rules="rules.date" :items="allCustomers" v-model="model.customer_id"
                    prepend-inner-icon="bx-user" >
                    <template #append>
                      <v-btn class="h-100" @click="addCustomerDialog = true"><v-icon>bx-plus</v-icon></v-btn>                        
                    </template>
                    </VSelect>
                  <div v-if="!!customer" class="mt-5">
                    <VRow>
                      <VCol cols="6" md="2">
                        <div>Name:</div>
                      </VCol>
                      <VCol cols="6" md="3"><strong>{{ customer.name }}</strong></VCol>
                      <VCol cols="6" md="2">
                        <div>Email:</div>
                      </VCol>
                      <VCol cols="6" md="5" class="text-right"><strong>{{ customer.email }}</strong></VCol>
                    </VRow>
                  </div>
                </VCol>
              </VRow>
            </VCol>
          </VRow>
        </VCard>
      </VCol>
      <VCol cols="12" md="6">
        <VCard class="pa-8">
          <VRow>
            <VCol cols="12">
              <VRow>
                <VCol cols="6">
                  <VTextField type="date" v-model="model.invoice_date" :rules="rules.date" density="comfortable"
                    label="Invoice Date">
                  </VTextField>
                </VCol>
                <VCol cols="6">
                  <VTextField type="date" v-model="model.due_date" :rules="rules.date" density="comfortable"
                    label="Due Date"></VTextField>
                </VCol>
                <VCol cols="6">
                  <VTextField type="text" readonly v-model="model.invoice_number" density="comfortable"
                    label="Invoice Number">
                  </VTextField>
                </VCol>
              </VRow>
            </VCol>
          </VRow>
        </VCard>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VCard class="pa-8">
          <VTable>
            <thead>
              <th>Particulars</th>
              <!-- <th>tasks</th> -->
              <th>HSN/SAC</th>
              <th>Rate</th>
              <th>UOM</th>
              <th>Quantity</th>
              <th v-if="isLocal">cgst</th>
              <th v-if="isLocal">sgst</th>
              <th v-if="isLocal">igst</th>
              <th>Amount</th>
              <th v-if="isLocal">Tax</th>
              <th>Total</th>
              <th v-if="showDelete">Action</th>
            </thead>
            <tbody>
              <tr v-for="(item, i) in model.projects">
                <td width="300"><v-select :items="filteredProjects(i)" item-value="value" :rules="rules.project"
                    :open-on-clear="true" density="compact" v-model="model.projects[i].id" label="Particulars" /></td>

                <!-- <td width="300"><v-select :items="model.projects[i].tasks" v-model="model.projects[i].assigned_tasks" multiple item-value="_id" :rules="rules.project" :open-on-clear="true"
                    density="compact" label="tasks" /></td> -->

                <td width="150">
                  <VTextField :disabled="!model.projects[i].id" type="text" density="compact"
                    v-model="model.projects[i].hsa"></VTextField>
                </td>
                <td width="150">
                  <VTextField :disabled="!model.projects[i].id" type="number" min="0" :rules="rules.rate"
                    density="compact" v-model="model.projects[i].rate"></VTextField>
                </td>
                <td width="150">
                  <VTextField :disabled="!model.projects[i].id" density="compact" v-model="model.projects[i].uom">
                  </VTextField>
                </td>
                <td width="150">
                  <VTextField :disabled="!model.projects[i].id" type="number" :rules="rules.qty" min="0" density="compact"
                    v-model="model.projects[i].quantity"></VTextField>
                </td>
                <td width="150" v-if="isLocal">
                  <VTextField disabled type="number" density="compact" prepend-inner-icon="mdi-percent"
                    v-model="model.projects[i].cgst" min="0" max="100"></VTextField>
                </td>
                <td width="150" v-if="isLocal">
                  <VTextField disabled type="number" density="compact" prepend-inner-icon="mdi-percent"
                    v-model="model.projects[i].sgst" min="0" max="100"></VTextField>
                </td>
                <td width="150" v-if="isLocal">
                  <VTextField disabled type="number" density="compact" prepend-inner-icon="mdi-percent"
                    v-model="model.projects[i].igst" min="0" max="100">
                  </VTextField>
                </td>
                <td width="150">
                  <VTextField disabled type="number" density="compact" v-model="model.projects[i].amount"></VTextField>
                </td>
                <td width="150" v-if="isLocal">
                  <VTextField disabled type="number" density="compact"
                    v-model="model.projects[i].taxable_value"></VTextField>
                </td>
                <!-- {{ item }} -->
                <td>{{ currencySymbol }}&nbsp;{{ item.total }}</td>
                <td v-if="showDelete" @click="deleteRow(i)"><v-icon>mdi-delete</v-icon></td>
              </tr>
            </tbody>
          </VTable>
          <v-btn class="w-100 mt-4" color="grey-50 pointer-cursor" @click="addProjectField"><v-icon
              class="me-1">mdi-plus-circle</v-icon><span>Add New
              Project</span></v-btn>
        </VCard>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="6">
        <VCard class="pa-8">
          <VRow>
            <VCol cols="6"><span>Bank Account:</span></VCol>
            <VCol cols="6"><strong>{{ user.bank_account_no }}</strong></VCol>
            <VCol cols="6"><span>Bank Name:</span></VCol>
            <VCol cols="6"><strong>{{ user.bank_name }}</strong></VCol>
            <VCol cols="6"><span>Bank IFSC:</span></VCol>
            <VCol cols="6"><strong>{{ user.ifsc_code }}</strong></VCol>
            <VCol cols="6"><span>Pan Number:</span></VCol>
            <VCol cols="6"><strong>{{ user.pan_number }}</strong></VCol>
          </VRow>
        </VCard>
      </VCol>
      <VCol cols="6">
        <VCard class="pa-8">
          <VRow class="align-center">
            <VCol cols="6">
              <span>Amount Total:</span>
            </VCol>
            <VCol cols="6">
              <div class="d-flex">
                <h3>{{ currencySymbol }}&nbsp;{{ model.total_cost }}</h3>
              </div>
            </VCol>
          </VRow>
          <v-row class="align-center">
            <v-col cols="6">
              <span>Discount</span>
            </v-col>
            <v-col cols="6">
              <div class="d-flex">
                <VTextField type="number" density="compact" v-model="model.total_discount" class="rounded-l-none">
                  <template #prepend-inner>
                    <span>{{ model.discount_type == 'Percentage' ? '%' : currencySymbol }}</span>
                  </template>
                </VTextField>
                <v-select v-model="model.discount_type" :items="discount_types" density="compact"></v-select>
              </div>
            </v-col>
          </v-row>
          <VRow class="align-center">
            <VCol cols="6">
              Total Tax
            </VCol>
            <VCol cols="6">
              <div class="d-flex">
                <h3>&percnt; {{ model.total_tax }}</h3>
              </div>
            </VCol>
            <v-divider></v-divider>
            <VCol cols="6">
              Grand Total:
            </VCol>
            <VCol cols="6">
              <h3>{{ currencySymbol }}&nbsp;{{ model.grand_total }}</h3>
            </VCol>
          </VRow>
        </VCard>
      </VCol>
    </VRow>
    <VCard class="pa-6">
      <VRow>
        <VCol class="d-flex justify-end gap-2">
          <VBtn size="large" type="submit" color="success" :disabled="submiting">{{ labelSubmit }} Invoice</VBtn>
          <VBtn size="large" @click="router.back()" color="error">Back</VBtn>
        </VCol>
      </VRow>
    </VCard>
  </VForm>
  <div></div>
</template>
<script setup>
import moment from "moment";
import { ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
const store = inject("store");
const confirmationDialog = ref(false);
const isLocal = ref(true);
const router = useRouter();
const route = useRoute();
const isProject = ref(null);
const submiting = ref(false);
const addCustomerDialog = ref(false);
const showDelete = ref([])
const currencySymbol = ref('₹')
// const discount_type = ref('Fixed')
const discount_types = ref(['Percentage', 'Fixed'])
const projectError = ref({ isError: false, message: '' })
const model = ref({
  customer_id: null,
  invoice_date: moment().format('YYYY-MM-DD'),
  due_date: moment().add(15, 'days').format('YYYY-MM-DD'),
  discount_type: 'Fixed',
  projects: [
    {
      id: null,
      hsa: null,
      amount: null,
      uom: '',
      quantity: 1,
      taxable_value: 0,
      rate: null,
      tasks:[],
      assigned_tasks:[],
      total: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
    }],
  total_discount: 0,
  total_without_discount: 0,
  currency_symbol: "₹",
  total_without_tax: 0,
  total_cost: 0,
  total_tax: 0,
  grand_total: 0
});
const form = ref(null);

const labelSubmit = computed(() => {
  return submiting.value ? (getId == 0 ? 'Adding' : 'Updating') : (getId == 0 ? 'Add' : 'Update');
})
const customerProject = computed(() => {
  let project = store.state.invoices.projects;
  return project
});
const allCustomers = computed(() => {
  return store.state.invoices.allCustomers;
});

const invoice = computed(() => { return store.state.invoices.item })
const customer = computed(() => {
  if (!!model.value.customer_id) {
    return allCustomers.value.find(
      (item) => item._id === model.value.customer_id
    );
  } else {
    return null;
  }
});
const selectedProjects = computed(() => {
  return model.value.projects.map((project) => project.id);
})

// const totalCostWithTax = computed(() => {
//   return model.value.projects.reduce((accumulator, currentProject) => {
//     console.log(":::currentProject", currentProject)
//     accumulator += currentProject.total
//     return accumulator
//   }, 0);
// });
const totalCost = computed(() => {
  return model.value.projects.reduce((accumulator, currentProject) => {
    accumulator += currentProject.rate * currentProject.quantity
    return accumulator
  }, 0);
});

const user = computed(() => {
  return store.state.user
})

const deleteRow = (id) => {
  model.value.projects.splice(id, 1)
}
const filteredProjects = (currentIndex) => {
  const otherSelectedProjects = selectedProjects.value.filter(
    (project, index) => index !== currentIndex
  );
  const selectedProject = customerProject.value.filter(
    (project) => !otherSelectedProjects.includes(project._id)
  );
  const selelectedProjectId = selectedProject.find(project => project._id == model.value.projects[currentIndex].id)
  console.log("selelectedProjectId",selelectedProjectId)
  if (selelectedProjectId?._id) {
    model.value.projects[currentIndex].tasks = selelectedProjectId.tasks
  }
  // console.log("selectedProject0",selectedProject.filter(project=>project._id == model.value.projects[currentIndex].id ))
  //  store.dispatch("invoices/fetch", model.value.customer_id);
  if (selectedProject.length <= 1) {
    isProject.value = false
  } else {
    isProject.value = true
  }
  return selectedProject
}

let getId = route.params.id;
onMounted(async () => {
  console.log("getttt",model)
  await store.dispatch("invoices/fetchAllCustomers");
  await store.dispatch("company/fetch");
  // console.log("store.state.invoices", store.state.invoices)
  if (getId != 0) {
    await store.dispatch("invoices/fetch", { id: getId });
    model.value = { ...invoice.value }
    model.value.invoice_date = moment(invoice.value.invoice_date).format('YYYY-MM-DD')
    model.value.due_date = moment(invoice.value.due_date).format('YYYY-MM-DD')
    currencySymbol.value = customer.value.primary_currency.symbol
    await store.dispatch("invoices/fetchProjects",{customer_id:model.value.customer_id,invoice_id:model.value._id});
  }

});

const company = computed(() => { return store.state.company.settings })

console.log(customer.value, "gstValue");
const gstValue = computed(() => {
  const isIndia = (customer.value.billing.country_id == "IN")
  const isState = (customer.value.billing.state == company.value.state)
  const cgst = company.value.cgst ? parseInt(company.value.cgst) : 9
  const sgst = company.value.sgst ? parseInt(company.value.sgst) : 9
  const igst = company.value.igst ? parseInt(company.value.igst) : 18
  let gst = isIndia
    ? isState
      ? { cgst, sgst, igst: 0 }
      : { cgst: 0, sgst: 0, igst }
    : { cgst: 0, sgst: 0, igst: 0 };
  return gst
})


watchEffect(async () => {
  if (model.value.projects.length > 1) {
    showDelete.value = true
  } else {
    showDelete.value = false
  }
})

watchEffect(async () => {
  let hasValue = model.value.projects.some(item => (!!item.rate))
  if (hasValue) {
    let totalWithoutDiscount = 0;
    let taxFactor = 0;
    model.value.projects.forEach(project => {
      let tax = project.cgst + project.sgst + project.igst
      totalWithoutDiscount = (project.rate * project.quantity);
      taxFactor = (totalWithoutDiscount * tax / 100);
      project.total = totalWithoutDiscount + taxFactor;
      project.amount = totalWithoutDiscount;
      project.taxable_value = taxFactor
      model.value.total_tax = tax
    });
  }
  // console.log(model.value.total_discount,"model.value.total_discount",discount_type.value)
  model.value.total_cost = totalCost.value ? totalCost.value : 0;
  const totalWithDiscount = totalCost.value ?
    (model.value.discount_type == "Fixed" ? totalCost.value - model.value.total_discount : totalCost.value - totalCost.value * model.value.total_discount / 100)
    : 0;
  // model.value.discount_type = discount_type.value
  const totalTax = model.value.total_cost * model.value.total_tax / 100
  model.value.grand_total = totalWithDiscount + totalTax
})
watchEffect(async () => {
  try {
    if (model.value.customer_id) {
      console.log("currency", customer.value.billing)
      await store.dispatch("invoices/fetchProjects", {customer_id:model.value.customer_id,invoice_id:model.value._id});
      getId == 0 && (
        model.value.projects = [
          {
            id: null,
            hsa: null,
            amount: null,
            uom: '',
            tasks:[],
            assigned_tasks:[],
            quantity: 1,
            rate: null,
            total: 0,
            cgst: gstValue.value.cgst,
            sgst: gstValue.value.sgst,
            igst: gstValue.value.igst
          }]
      )
    }
    if (model.value.customer_id && getId == 0) {
      await store.dispatch("invoices/getInvoiceNumber", { is_local: customer.value.is_local });
      currencySymbol.value = customer.value.primary_currency.symbol
      isLocal.value = customer.value.is_local
      model.value.invoice_number = store.state.invoices.invoiceNumber
    }
  } catch (error) {
    console.log("ErrorInLoop", error);
  }
});
const rules = {
  customer: [(v) => !!v || "Customer is Required"],
  project: [(v) => !!v || "Project/Service is Required"],
  amount: [(v) => !!v || "Amount is Required"],
  date: [(v) => !!v || "Date is Required"],
  qty: [(v) => !!v || "Quantity is Required"],
  text: [(v) => !!v || "This Field is Required"],
  email: [
    (v) => !!v || "This Email is Required",
    (v) => /.+@.+\..+/.test(v) || "Enter a valid email address",
  ],
};
const onSubmit = async () => {
  try {
    const { valid } = await form.value.validate();
    if (valid) {
      console.log("model.value",model.value)
      if (route.params.id == 0) {
        await store.dispatch("invoices/addInvoice", model.value);
      } else {
        await store.dispatch("invoices/editInvoice", { id: model.value._id, model: model.value });
      }
      router.push({ path: "/invoice" });
    }
  } catch (error) {
    projectError.value.isError = true
    projectError.value.message = error?.message
    setTimeout(() => {
      projectError.value.isError = false
    }, 4000)
  }
};
const addProjectField = () => {
  try {
    const project = model.value.projects.some(item => item.id == null)
    if (!project) {
      if (!isProject.value) throw new Error('No Project available')
      model.value.projects.push(
        {
          id: null,
          hsa: null,
          amount: null,
          uom: '',
          quantity: null,
          discount: 0,
          rate: null,
          tasks:[],
          total: 0,
          cgst: gstValue.value.cgst,
          sgst: gstValue.value.sgst,
          igst: gstValue.value.igst
        }
      )
    } else {
      throw new Error('Please select a project to add a new project')
    }
  } catch (error) {
    projectError.value.isError = true
    projectError.value.message = error?.message
    setTimeout(() => {
      projectError.value.isError = false
    }, 4000)
  }
}
const openModel = () => {
  confirmationDialog.value = true;
};
// const  getProjectTasks =async (project_id) => {
//   
// };
const copyBilling = (val) => {
  if (val) {
    model.value.shipping = { ...model.value.billing };
  }
  confirmationDialog.value = false;
};
</script>
<style>
.v-table th:first-child {
  text-align: center !important;
}
.v-table > .v-table__wrapper > table > tbody > tr > td{
  padding: 0px 3px !important;
}
</style>