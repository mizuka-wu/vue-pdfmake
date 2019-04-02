<template>
    <pdf-make style="height: 100%; width: 100%" id="app">
        nihao
    </pdf-make>
</template>

<script>
import PdfMake from './components/PdfMake'
export default {
    name: 'app',
    components: {
        PdfMake,
    },
}
</script>
<style>
html,
body {
    margin: 0px auto;
    padding: 0px;
    height: 100%;
}
#app {
    margin-bottom: -16px;
}
</style>
