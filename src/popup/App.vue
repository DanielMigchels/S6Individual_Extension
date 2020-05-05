<template>
  <div id="popup">
    <h1>FakeNews Extention</h1>
    <div v-if="State == 0">
      <button class="btn btn-primary" @click="SetState(1)">Sign in</button>
      <button class="btn btn-primary" @click="SetState(2)">Disable on this site</button>
    </div>
    <div v-if="State == 1">
      <button class="btn btn-primary" @click="SetState(0)">Back</button>
    </div>
    <div v-if="State == 2">
      <h2>Site is enabled.</h2>
      <button class="btn btn-primary" @click="SetState(0)">Back</button>
    </div>
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
      State: 0,
    };
  },
  created() {
    versionService.GetVersion().then(data => (this.backVersion = data.Data.Version));
  },
  methods: {
    SetState(state) {
      this.State = state;
    },
  },
};
</script>
