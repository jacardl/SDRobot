  <router-link
    v-for="item in menuItems"
    :key="item.path"
    :to="item.path"
    class="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200"
    :class="[
      route.path === item.path
        ? 'text-primary bg-primary-light'
        : 'text-gray-600 hover:text-primary hover:bg-primary-light/50'
    ]"
  >
    <component
      :is="item.icon"
      class="h-5 w-5 mr-3"
      :class="route.path === item.path ? 'text-primary' : 'text-gray-400'"
    />
    {{ t(item.title) }}
  </router-link> 