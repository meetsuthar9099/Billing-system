import store from '@/store';

const permissions = computed(() => { return store.state.permissions })

function checkPermission(permission) {
  const result = permissions.value && permissions.value.includes(permission) || true; //Just for testing purpose
  return result;
}

export { checkPermission };
