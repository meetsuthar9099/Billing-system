import store from '@/store';

const permissions = computed(() => { return store.state.permissions})

function checkPermission(permission) {
  const result = permissions.value && permissions.value.includes(permission);
  return result;
}

export { checkPermission };