<template>
  <div class="w-full h-full flex flex-col items-center justify-center">
    <UButton @click="onClick">Click me!</UButton>
    <UButton @click="onClick">Click me!</UButton>
    <UButton @click="onClick">Click me!</UButton>
  </div>
</template>

<script setup lang="ts">
function onClick() {
  alert("Hello from MyPrettyComponent!");
}
</script>
