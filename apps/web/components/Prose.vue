<template>
  <section class="contents">
    <slot />
  </section>
</template>
<style>
.contents {
  font-size: 15px;
  @apply sm:text-base;
}

.contents h1,
.contents h2,
.contents h3,
.contents h4 {
  @apply mt-10 mb-1 font-semibold;
}

.contents h1 {
  @apply text-2xl;
}

.contents h2 {
  @apply text-xl;
}

.contents h2 a {
  @apply text-white;
}

.contents h3 {
  @apply text-lg;
}

.contents h3 a {
  @apply text-white;
}

.contents h4 {
  @apply text-base;
}

.contents ul {
  @apply my-2 list-disc pl-4;
}
.contents li > ul {
  @apply my-0;
}

.contents p {
  @apply my-4;
}

.contents a {
  @apply text-blue-600;
}

.contents strong {
  @apply font-bold;
}
.contents blockquote {
  @apply border border-l-2 border-gray-900 border-l-blue-300 px-4;
}

.contents code:not(pre > *) {
  @apply mx-1  rounded-md bg-[#636e7b66] px-1 text-gray-400 shadow-lg;
}

.contents pre {
  @apply my-4 overflow-x-auto rounded-lg bg-[#222222] p-4 text-sm;
}

.contents table {
  @apply w-full table-auto border-collapse text-sm;
}
.contents th {
  @apply border-b border-gray-600  p-4 pl-8 pt-0 text-left text-gray-200;
}
.contents tbody {
  @apply bg-gray-800;
}
.contents td {
  @apply border-b border-gray-700 p-4 pl-8 text-gray-400;
}
</style>
