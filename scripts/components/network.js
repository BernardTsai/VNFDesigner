Vue.component(
  'networkitem',
  {
    props:    ['model','view','network'],
    methods:  {
      pick: function(entity) {
        this.view.detail='Network';
        this.view.entity=entity;
      },
      del: function(entity) {
        deleteNetwork(entity)
        if ( this.view.detail === 'Network' ) {
          this.view.detail='';
          this.view.entity=null;
        }
      }
    },
    template: `
      <div class="item">
        <div class="name"   v-on:click="pick(network)"><i class="fas fa-cloud"/>&nbsp;{{network.name}}</div>
        <div class="button" v-on:click="del(network)"><i class="fas fa-minus"/></div>
      </div>`
  }
)

//------------------------------------------------------------------------------

Vue.component(
  'networks',
  {
    props:    ['model','view'],
    template: `
      <div class="list">
        <networkitem
          :key="network.uuid"
          v-for="network in model.networks"
          v-bind:model="model"
          v-bind:view="view"
          v-bind:network="network"></networkitem>
      </div>`
  }
)

//------------------------------------------------------------------------------

// network form
Vue.component(
  'networkform',
  {
    props:    ['model','view','network'],
    template: `
    <div id="networkform">
      <div class="header">Network: {{network.name}}</div>

      <div class="line">
        <label for="name">Name:</label>
        <input v-model="network.name" id="name" name="name" required>
      </div>
      <div class="line">
        <label for="ipv4">IPv4:</label>
        <input v-model="network.ipv4" id="ipv4" name="ipv4">
      </div>
      <div class="line">
        <label for="ipv6">IPv6:</label>
        <input v-model="network.ipv6" id="ipv6" name="ipv6">
      </div>
      <div class="line">
        <label for="route">Route:</label>
        <input v-model="network.route" id="ipv4" name="route">
      </div>
      <div class="line">
        <label for="special">Attributes:</label>
        <input v-model="network.special" id="special" name="special">
      </div>
    </div>`
  }
)
