var app = new Vue({
  el:   '#app',
  data: {model: model, configuration: configuration, templates: templates},
  template: `
    <app
      v-bind:model="model"
      v-bind:configuration="configuration"
      v-bind:templates="templates">
    </app>`
})
