<script setup>
import router from '@/router';
const store = inject('store');
const imageUrl = inject('imageUrl');

const user = computed(() => store.state.user)
const userImage = computed(() => user.value.photo ? imageUrl + user.value.photo : 'https://backoffice.codecrewinfotech.com/static/media/01.156de087ecf69314edd6.png')
const roleName = computed(() => store.state.role.role_name)

const logout = () => {
  store.dispatch('logout').then(() => {
    router.push({ name: 'Login' })
  })
}
</script>

<template>
  <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success" bordered>
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VImg :src="userImage" />
      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success">
                  <VAvatar color="primary" variant="tonal">
                    <VImg :src="userImage" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ user.firstname }} {{ user.last_name }}
            </VListItemTitle>
            <VListItemSubtitle>{{ roleName }}</VListItemSubtitle>
          </VListItem>
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem @click="logout">
            <template #prepend>
              <VIcon class="me-2" icon="bx-log-out" size="22" />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
