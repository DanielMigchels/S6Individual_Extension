<template>
  <div id="popup">
    <img alt="Vue logo" :src="vuelogo" />
    <h1>Vue Front-End</h1>
    <center>
      <table style="width:50%">
        <tr>
          <td>Front-End</td>
          <td>{{ frontersion }}</td>
        </tr>
        <tr>
          <td>Back-End</td>
          <td>{{ backVersion }}</td>
        </tr>
      </table>
    </center>
  </div>
</template>

<script>
import { version } from '../manifest.json';
import { versionService } from '../services/version.service.js';

export default {
  data() {
    return {
      vuelogo: '../assets/logo.png',
      frontersion: version,
      backVersion: 'Unknown',
    };
  },
  created() {
    versionService.GetVersion().then(data => (this.backVersion = data.Data.Version));
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
#popup {
  width: 250px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
