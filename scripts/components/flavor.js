Vue.component(
  'flavoritem',
  {
    props:    ['model','view','flavor'],
    methods:  {
      pick: function(entity) {
        this.view.detail='Flavor';
        this.view.entity=entity;
      },
      del: function(entity) {
        deleteFlavor(entity)
        if ( this.view.detail === 'Flavor' ) {
          this.view.detail='';
          this.view.entity=null;
        }
      }
    },
    template: `
      <div class="item">
        <div class="name"   v-on:click="pick(flavor)"><i class="fas fa-microchip"/>&nbsp;{{flavor.name}}</div>
        <div class="button" v-on:click="del(flavor)"><i class="fas fa-minus"/></div>
      </div>`
  }
)

//------------------------------------------------------------------------------

Vue.component(
  'flavors',
  {
    props:    ['model','view'],
    template: `
      <div class="list">
        <flavoritem
          :key="flavor.uuid"
          v-for="flavor in model.flavors"
          v-bind:model="model"
          v-bind:view="view"
          v-bind:flavor="flavor"></flavoritem>
      </div>`
  }
)

//------------------------------------------------------------------------------

Vue.component(
  'flavorform',
  {
    props:    ['model','view','flavor'],
    template: `
    <div id="flavorform">
      <div class="header">Flavor: {{flavor.name}}</div>

      <div class="line">
        <label for="name">Name:</label>
        <input v-model="flavor.name" id="name" name="name" required>
      </div>
      <div class="line">
        <label for="vcpu">vCPU:</label>
        <input v-model.number="flavor.vcpu" id="vcpu" name="vcpu" type="number" required>
      </div>
      <div class="line">
        <label for="ram">RAM:</label>
        <input v-model.number="flavor.ram" id="ram" name="ram" type="number" required>
      </div>
      <div class="line">
        <label for="disk">Disk:</label>
        <input v-model.number="flavor.disk" id="ipv4" name="disk" type="number" required>
      </div>
      <div class="line">
        <label for="special">Attributes:</label>
        <input v-model="flavor.special" id="special" name="special">
      </div>
    </div>`
  }
)
