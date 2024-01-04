<template>
  <h2 class="mb-3">{{ model._id ? 'Edit Invoice' : 'New Invoice' }}</h2>
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
  <v-dialog v-model="draftNoteModal" max-width="600" persistent>
    <v-card class="pa-8">
      <VTextarea name="description" label="Description" v-model="model.description" :rules="rules.text" resizable
        id="description">
      </VTextarea>
      <div class="d-flex gap-2 justify-end">
        <v-btn type="submit" class="mt-3" @click="() => !!model.description && (draftNoteModal = false)">Submit</v-btn>
        <v-btn color="error" class="mt-3" @click="router.push({ name: 'invoice' })">Go Back</v-btn>
      </div>
    </v-card>
  </v-dialog>
  <v-snackbar location="top right" v-model="projectError.isError" color="error">
    <v-icon class="me-1">mdi-warning</v-icon><strong>{{ projectError.message }}</strong>
  </v-snackbar>
  <v-card v-if="!company" class="px-8 py-6 mb-6">
    <h3 class="text-error"><v-icon class="me-2 mb-1">mdi-warning</v-icon>Add company detail to create invoice <router-link
        to="/settings" class="text-primary" style="text-decoration: underline;">Company Detail</router-link></h3>
  </v-card>
  <VForm :disabled="!company" class="d-flex flex-column" @submit.prevent="onSubmit" ref="form">
    <VRow>
      <VCol cols="12" md="6">
        <VCard :disabled="!company" class="pa-8 h-100">
          <VRow>
            <VCol cols="12">
              <VRow>
                <VCol cols="12">
                  <VSelect item-title="name" item-value="_id" :hide-selected="true" density="comfortable"
                    label="Add Customer" name="display_name" :rules="rules.date" :items="allCustomers"
                    v-model="model.customer_id" prepend-inner-icon="bx-user" />
                  <VCol v-if="!customer" class="text-right">
                    <RouterLink class="text-primary ms-2" to="/customer/0">
                      <v-icon>mdi-plus</v-icon>
                      <span>Add Customer</span>
                    </RouterLink>
                  </VCol>
                  <div v-else class="mt-5">
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
        <VCard :disabled="!company" class="pa-8">
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
                <VCol :cols="isLocal ? 12 : 6">
                  <VTextField type="text" readonly v-model="model.invoice_number" density="comfortable"
                    label="Invoice Number">
                  </VTextField>
                </VCol>
                <VCol cols="6" v-if="!isLocal">
                  <VTextField type="text" v-model="model.bond_no" :rules="rules.text" density="comfortable"
                    label="LUT/BOND No">
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
        <VCard :disabled="!company" v-if="model.projects.length > 0" class="pa-8">
          <VTable>
            <thead>
              <th style="text-align: center !important;">Particulars</th>
              <th>HSN/SAC</th>
              <th>Rate</th>
              <th>UOM</th>
              <th>Quantity</th>
              <th>Discount</th>
              <th v-if="isLocal">cgst({{ model.projects[0].cgst.rate }}%)</th>
              <th v-if="isLocal">sgst({{ model.projects[0].sgst.rate }}%)</th>
              <th v-if="isLocal">igst({{ model.projects[0].igst.rate }}%)</th>
              <th>Amount</th>
              <th v-if="isLocal">Tax</th>
              <th v-if="isLocal">Total</th>
              <th v-if="showDelete">Action</th>
            </thead>
            <tbody>
              <tr v-for="(item, i) in model.projects">
                <td width="400"><v-select :items="filteredProjects(i)" item-value="value" :rules="rules.project"
                    :open-on-clear="true" density="compact" v-model="model.projects[i].id" label="Particulars" /></td>

                <td width="150">
                  <VTextField :disabled="!model.projects[i].id" type="text" density="compact"
                    v-model="model.projects[i].hsa"></VTextField>
                </td>
                <td width="210">
                  <VTextField :disabled="!model.projects[i].id" type="number" min="0" :rules="rules.rate"
                    density="compact" v-model="model.projects[i].rate"></VTextField>
                </td>
                <td width="210">
                  <v-select density="compact" :disabled="!model.projects[i].id" :items="uom"
                    v-model="model.projects[i].uom"></v-select>
                </td>
                <td width="150">
                  <VTextField :disabled="!model.projects[i].id" type="number" :rules="rules.qty" min="0" density="compact"
                    v-model="model.projects[i].quantity"></VTextField>
                </td>
                <td width="150">
                  <VTextField :disabled="!model.projects[i].id" type="number" min="0" density="compact"
                    prepend-inner-icon="mdi-percent" v-model="model.projects[i].discount"></VTextField>
                </td>
                <td width="100" v-if="isLocal">
                  <VTextField disabled type="number" density="compact" v-model="model.projects[i].cgst.amount" min="0"
                    max="100"></VTextField>
                </td>
                <td width="100" v-if="isLocal">
                  <VTextField disabled type="number" density="compact" v-model="model.projects[i].sgst.amount" min="0"
                    max="100"></VTextField>
                </td>
                <td width="100" v-if="isLocal">
                  <VTextField disabled type="number" density="compact" v-model="model.projects[i].igst.amount" min="0"
                    max="100">
                  </VTextField>
                </td>
                <td width="150">
                  <VTextField disabled type="number" density="compact" v-model="model.projects[i].amount"></VTextField>
                </td>
                <td width="150" v-if="isLocal">
                  <VTextField disabled type="number" density="compact" v-model="model.projects[i].taxable_value">
                  </VTextField>
                </td>
                <!-- {{ item }} -->
                <td v-if="isLocal">{{ currencySymbol }}&nbsp;{{ item.total }}</td>
                <td v-if="showDelete" @click="deleteRow(i)"><v-icon>mdi-delete</v-icon></td>
              </tr>
            </tbody>
          </VTable>
          <v-btn v-if="model.projects.length != 0" class="w-100 mt-4" color="grey-50 pointer-cursor"
            @click="addProjectField"><v-icon class="me-1">mdi-plus-circle</v-icon><span>Add New
              PARTICULARS</span></v-btn>
        </VCard>
      </VCol>
    </VRow>
    <VRow>
      <VCol :cols="isLocal ? 6 : 9">
        <VCard :disabled="!company" class="pa-8 h-100">
          <VRow>
            <VCol :cols="isLocal ? 6 : 3"><span>Bank Account:</span></VCol>
            <VCol :cols="isLocal ? 6 : 3"><strong>{{ company?.ac_no }}</strong></VCol>
            <VCol :cols="isLocal ? 6 : 3"><span>Acount Holder Name:</span></VCol>
            <VCol :cols="isLocal ? 6 : 3"><strong>{{ company?.ac_holder_name }}</strong></VCol>
            <VCol :cols="isLocal ? 6 : 3"><span>Bank Name:</span></VCol>
            <VCol :cols="isLocal ? 6 : 3"><strong>{{ company?.bank_name }}</strong></VCol>
            <VCol :cols="isLocal ? 6 : 3"><span>Swift Number:</span></VCol>
            <VCol :cols="isLocal ? 6 : 3"><strong>{{ company?.swift_code }}</strong></VCol>
            <VCol :cols="isLocal ? 6 : 3"><span>Bank IFSC:</span></VCol>
            <VCol :cols="isLocal ? 6 : 3"><strong>{{ company?.ifsc_code }}</strong></VCol>
            <VCol :cols="isLocal ? 6 : 3"><span>Pan Number:</span></VCol>
            <VCol :cols="isLocal ? 6 : 3"><strong>{{ company?.pan_no }}</strong></VCol>
          </VRow>
        </VCard>
      </VCol>
      <VCol :cols="isLocal ? 6 : 3">
        <VCard :disabled="!company" class="pa-8 h-100">
          <VRow v-if="!isLocal" class="align-center">
            <VCol cols="6">
              <span>Transaction fee:</span>
            </VCol>
            <VCol cols="6">
              <VRow class="d-flex justify-end align-center">
                <VCol cols="4" class="ma-0 pa-0">
                  <VTextField v-model="currencySymbol" density="compact" readonly class="me-2"></VTextField>
                </VCol>
                <VCol cols="8" class="pa-0">
                  <VTextField v-model="model.transaction_fee" type="number" density="compact"></VTextField>
                </VCol>
              </VRow>
            </VCol>
          </VRow>
          <VRow v-if="isLocal" class="align-center">
            <VCol cols="9">
              <span>{{ isLocal ? 'Total Amount Before Tax' : 'Total Amount' }}:</span>
            </VCol>
            <VCol cols="3">
              <div class="d-flex justify-end">
                <h3>{{ currencySymbol }}&nbsp;{{ model.total_cost }}</h3>
              </div>
            </VCol>
          </VRow>
          <VRow v-if="isLocal" class="align-center">
            <VCol cols="6">
              <span>Add CGST:</span>
            </VCol>
            <VCol cols="6">
              <div class="d-flex justify-end">
                <h3>{{ currencySymbol }}&nbsp;{{ addCGST }}</h3>
              </div>
            </VCol>
          </VRow>
          <VRow v-if="isLocal" class="align-center">
            <VCol cols="6">
              <span>Add SGST:</span>
            </VCol>
            <VCol cols="6">
              <div class="d-flex justify-end">
                <h3>{{ currencySymbol }}&nbsp;{{ addSGST }}</h3>
              </div>
            </VCol>
          </VRow>
          <VRow v-if="isLocal" class="align-center">
            <VCol cols="6">
              <span>Add IGST:</span>
            </VCol>
            <VCol cols="6">
              <div class="d-flex justify-end">
                <h3>{{ currencySymbol }}&nbsp;{{ addIGST }}</h3>
              </div>
            </VCol>
          </VRow>
          <VRow v-if="isLocal" class="align-center">
            <VCol cols="6">
              Tax Amount GST
            </VCol>
            <VCol cols="6">
              <div class="d-flex justify-end">
                <h3>{{ currencySymbol }}&nbsp;{{ model.total_tax }}</h3>
              </div>
            </VCol>
            <v-divider></v-divider>
          </VRow>
          <VRow class="align-center">
            <VCol cols="6">
              {{ isLocal ? 'Total Amount After Tax:' : 'Total Amount:' }}
            </VCol>
            <VCol cols="6">
              <div class="d-flex justify-end">
                <h3>{{ currencySymbol }}&nbsp;{{ model.grand_total }}</h3>
              </div>
            </VCol>
          </VRow>
        </VCard>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VCard class="pa-6 w-100 d-flex justify-end gap-2">
          <VBtn size="large" type="submit" color="success" :disabled="submiting">{{ labelSubmit }} Invoice</VBtn>
          <VBtn size="large" @click="router.back()" color="error">Back</VBtn>
        </VCard>
      </VCol>
    </VRow>
  </VForm>
  <div></div>
</template>
<script setup>
import moment from "moment";
import { nextTick, ref, watchEffect, watch } from "vue";
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
  projects: [],
  total_discount: 0,
  total_without_discount: 0,
  currency_symbol: "₹",
  total_without_tax: 0,
  transaction_fee: 0,
  total_cost: 0,
  total_tax: 0,
  grand_total: 0,
  description: ''
});
const form = ref(null);
const draftNoteModal = ref(false)
const draftNote = ref('')
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

const totalCost = computed(() => {
  return model.value.projects.reduce((accumulator, currentProject) => {
    const discount = ((currentProject.rate * currentProject.quantity) * currentProject.discount) / 100
    accumulator += (currentProject.rate * currentProject.quantity) - discount
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
    (project) => !otherSelectedProjects.includes(project.value)
  );

  if (selectedProject.length <= 1) {
    isProject.value = false
  } else {
    isProject.value = true
  }
  return model.value.customer_id ? selectedProject : []
}

let getId = route.params.id;
onMounted(async () => {
  await store.dispatch("invoices/fetchAllCustomers");
  await store.dispatch("company/fetch");
  if (getId != 0) {
    await store.dispatch("invoices/fetch", { id: getId });

    model.value = { ...invoice.value }
    if (invoice.value.status == 2 && !model.value.description) {
      draftNoteModal.value = true
    }

    model.value.invoice_date = moment(invoice.value.invoice_date).format('YYYY-MM-DD');
    model.value.due_date = moment(invoice.value.due_date).format('YYYY-MM-DD');
    model.value.currency_symbol = customer.value.primary_currency.symbol
    currencySymbol.value = customer.value.primary_currency.symbol

    await store.dispatch("invoices/fetchProjects", { customer_id: model.value.customer_id, invoice_id: getId });
  }

  if (getId == 0) {
    model.value.customer_id = store.state.customers.customer_id
  }

});

const company = computed(() => store.state.company.settings)

const gstValue = computed(() => {
  if (customer?.value) {
    const country = (customer?.value.billing.country_id == company.value.country_code)
    const state = (customer?.value.billing.state == company.value.state)
    const cgst = company.value.cgst ? parseInt(company.value.cgst) : 9
    const sgst = company.value.sgst ? parseInt(company.value.sgst) : 9
    const igst = company.value.igst ? parseInt(company.value.igst) : 18
    let gst = (country && customer?.value)
      ? (state ? { cgst, sgst, igst: 0 } : { cgst: 0, sgst: 0, igst })
      : { cgst: 0, sgst: 0, igst: 0 };
    return gst
  }
})


watchEffect(async () => {
  if (model.value.projects.length > 1) {
    showDelete.value = true
  } else {
    showDelete.value = false
  }
})
const addCGST = ref(0);
const addSGST = ref(0);
const addIGST = ref(0);

watchEffect(async () => {
  let hasValue = model.value.projects.some(item => (!!item.rate))
  if (hasValue) {
    let totalWithoutDiscount = 0;
    let discount = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;

    model.value.projects.forEach(project => {
      let tax = parseInt(project.cgst.rate) + parseInt(project.sgst.rate) + parseInt(project.igst.rate)
      totalWithoutDiscount = (project.rate * project.quantity);
      discount = (totalWithoutDiscount * project.discount / 100);
      let taxFactor = ((totalWithoutDiscount - discount) * tax / 100);
      console.log(project.cgst, "((totalWithoutDiscount - discount) * project.cgst.rate / 100);");
      project.cgst.amount = ((totalWithoutDiscount - discount) * project.cgst.rate / 100);
      project.sgst.amount = ((totalWithoutDiscount - discount) * project.sgst.rate / 100);
      project.igst.amount = ((totalWithoutDiscount - discount) * project.igst.rate / 100);

      totalCGST += project.cgst.amount;
      totalSGST += project.sgst.amount;
      totalIGST += project.igst.amount;

      project.total = (totalWithoutDiscount - discount) + taxFactor;
      project.amount = (totalWithoutDiscount - discount);
      project.taxable_value = taxFactor;
    });

    addCGST.value = totalCGST;
    addSGST.value = totalSGST;
    addIGST.value = totalIGST;
  }

  model.value.total_cost = totalCost.value ? totalCost.value : 0;
  model.value.total_tax = addCGST.value + addSGST.value + addIGST.value
});
watchEffect(() => {
  const transactionFee = model.value.transaction_fee;
  const totalCost = model.value.total_cost;
  if (!isLocal.value) {
    model.value.grand_total = totalCost && transactionFee ? (+totalCost + +transactionFee) : totalCost;
  }
});

watch(() => model.value.transaction_fee, (newTransactionFee) => {
  const totalCost = model.value.total_cost;
  model.value.grand_total = totalCost && newTransactionFee ?
    (+totalCost + +newTransactionFee) : totalCost;
});

watchEffect(() => {
  if (isLocal.value) {
    model.value.grand_total = model.value.total_cost + model.value.total_tax
  }
});
watchEffect(async () => {
  try {
    if (model.value.customer_id) {
      await store.dispatch("invoices/fetchProjects", { customer_id: model.value.customer_id, invoice_id: model.value._id });
      if (getId == 0) {
        model.value.projects = [
          {
            id: null,
            hsa: null,
            amount: null,
            uom: '',
            tasks: [],
            assigned_tasks: [],
            quantity: 1,
            discount: 0,
            rate: null,
            total: 0,
            cgst: { rate: gstValue.value.cgst, amount: 0 },
            sgst: { rate: gstValue.value.sgst, amount: 0 },
            igst: { rate: gstValue.value.igst, amount: 0 }
          }]
      }
    }
    isLocal.value = customer.value?.is_local
    if (model.value.customer_id && getId == 0) {
      await store.dispatch("invoices/getInvoiceNumber", { is_local: customer.value?.is_local });
      currencySymbol.value = customer.value.primary_currency.symbol
      model.value.invoice_number = store.state.invoices.invoiceNumber
    }
  } catch (error) {
    console.log("ErrorInLoop", error);
  }
});
const uom = computed(() => {
  return ['Resource',
    'Hourly',
    'Monthly'
  ]
})
const rules = {
  customer: [(v) => !!v || "Customer is Required"],
  project: [(v) => !!v || "Particulars is Required"],
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
      console.log("model.value", model.value)
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
          tasks: [],
          total: 0,
          cgst: { rate: gstValue.value.cgst, amount: 0 },
          sgst: { rate: gstValue.value.sgst, amount: 0 },
          igst: { rate: gstValue.value.igst, amount: 0 }
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
<style scoped>
/* .v-table th:first-child {
  text-align: center !important;
} */

.v-table>.v-table__wrapper>table>tbody>tr>td {
  padding: 0px 3px !important;
}
</style>