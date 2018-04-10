// header component
Vue.component(
  'appheader',
  {
    props:    ['model','configuration'],
    methods: {
      add: function() {
        if ( configuration.view === "Flavors" )    { addFlavor(); }
        if ( configuration.view === "Images" )     { addImage(); }
        if ( configuration.view === "Networks" )   { addNetwork(); }
        if ( configuration.view === "Components" ) { addComponent(); }
      },
      del: function() {
        if ( configuration.view === "Flavors" )    { deleteFlavor(); }
        if ( configuration.view === "Images" )     { deleteImage(); }
        if ( configuration.view === "Networks" )   { deleteNetwork(); }
        if ( configuration.view === "Components" ) { deleteComponent(); }
      },
      validate: function() {
        var object = JSON.parse(JSON.stringify(model));

        // verify schema
        msg = validate_schema(object);
        if (msg != '') {
          configuration.modal = msg
          return
        }

        // verify xrefs
        msg = validate_xref(object);
        if (msg != '') {
          configuration.modal = msg
          return
        }

        // everything is fine
        configuration.modal = "No Validation Errors"
      },
      import_model: function() {
        configuration.view = "Tenant"
        configuration.type = "Import"
      },
      export_model: function() {
        configuration.view = "Tenant"
        configuration.type = "Export"
      }
    },
    template: `
      <div id="appheader">
        <div class="logo"><i class="fas fa-cloud"/>&nbsp;VNF Designer 0.9.0</div>
        <div class="label">{{model.vnf}}/{{model.tenant}} ({{model.version}})</div>
        <div class="buttons">
        <div v-on:click="validate">
          <i class="fas fa-check-circle"/>&nbsp;Validate
        </div>
          <div v-on:click="import_model">
            <i class="fas fa-arrow-alt-circle-down"/>&nbsp;Import
          </div>
          <div v-on:click="export_model">
            <i class="fas fa-arrow-alt-circle-up"/>&nbsp;Export
          </div>
        </div>
        <div class="tabs">
          <template v-if="configuration.view === 'Tenant'">
            <div class="active">Tenant</div>
            <div v-on:click="configuration.view='Flavors'">Flavors</div>
            <div v-on:click="configuration.view='Images'">Images</div>
            <div v-on:click="configuration.view='Networks'">Networks</div>
            <div v-on:click="configuration.view='Components'">Components</div>
          </template>
          <template v-if="configuration.view === 'Images'">
            <div v-on:click="configuration.view='Tenant'">Tenant</div>
            <div v-on:click="configuration.view='Flavors'">Flavors</div>
            <div class="active">Images</div>
            <div v-on:click="configuration.view='Networks'">Networks</div>
            <div v-on:click="configuration.view='Components'">Components</div>
          </template>
          <template v-if="configuration.view === 'Flavors'">
            <div v-on:click="configuration.view='Tenant'">Tenant</div>
            <div class="active">Flavors</div>
            <div v-on:click="configuration.view='Images'">Images</div>
            <div v-on:click="configuration.view='Networks'">Networks</div>
            <div v-on:click="configuration.view='Components'">Components</div>
          </template>
          <template v-if="configuration.view === 'Networks'">
            <div v-on:click="configuration.view='Tenant'">Tenant</div>
            <div v-on:click="configuration.view='Flavors'">Flavors</div>
            <div v-on:click="configuration.view='Images'">Images</div>
            <div class="active">Networks</div>
            <div v-on:click="configuration.view='Components'">Components</div>
          </template>
          <template v-if="configuration.view === 'Components'">
            <div v-on:click="configuration.view='Tenant'">Tenant</div>
            <div v-on:click="configuration.view='Flavors'">Flavors</div>
            <div v-on:click="configuration.view='Images'">Images</div>
            <div v-on:click="configuration.view='Networks'">Networks</div>
            <div class="active">Components</div>
          </template>
          <div class="button" v-if="configuration.view!='Tenant'" v-on:click="add"><i class="fas fa-plus"/></div>
        </div>
      </div>`
  }
);

//------------------------------------------------------------------------------

// flavor item
Vue.component(
  'flavoritem',
  {
    props:    ['model','configuration','flavor'],
    methods:  {
      pick: function(entity) {
        this.configuration.type='Flavor';
        this.configuration.entity=entity;
      },
      del: function(entity) {
        deleteFlavor(entity)
        this.configuration.type='';
        this.configuration.entity=null;
      }
    },
    template: `
      <div class="flavoritem">
        <div class="name"   v-on:click="pick(flavor)"><i class="fas fa-microchip"/>&nbsp;{{flavor.name}}</div>
        <div class="button" v-on:click="del(flavor)"><i class="fas fa-minus"/></div>
      </div>`
  }
)

// flavors
Vue.component(
  'flavors',
  {
    props:    ['model','configuration'],
    template: `
      <div class="flavors">
        <flavoritem
          :key="flavor.index"
          v-for="flavor in model.flavors"
          v-bind:model="model"
          v-bind:configuration="configuration"
          v-bind:flavor="flavor"></flavoritem>
      </div>`
  }
)

//------------------------------------------------------------------------------

// image item
Vue.component(
  'imageitem',
  {
    props:    ['model','configuration','image'],
    methods:  {
      pick: function(entity) {
        this.configuration.type='Image';
        this.configuration.entity=entity;
      },
      del: function(entity) {
        deleteImage(entity)
        this.configuration.type='';
        this.configuration.entity=null;
        console.log("--"+this.configuration.type)
      }
    },
    template: `
      <div class="imageitem">
        <div class="name"   v-on:click="pick(image)"><i class="fas fa-hockey-puck"/>&nbsp;{{image.name}}</div>
        <div class="button" v-on:click="del(image)"><i class="fas fa-minus"/></div>
      </div>`
  }
)

// flavors
Vue.component(
  'images',
  {
    props:    ['model','configuration'],
    template: `
      <div class="images">
        <imageitem
          :key="image.index"
          v-for="image in model.images"
          v-bind:model="model"
          v-bind:configuration="configuration"
          v-bind:image="image"></imageitem>
      </div>`
  }
)

//------------------------------------------------------------------------------

// network item
Vue.component(
  'networkitem',
  {
    props:    ['model','configuration','network'],
    methods:  {
      pick: function(entity) {
        this.configuration.type='Network';
        this.configuration.entity=entity;
      },
      del: function(entity) {
        deleteNetwork(entity)
        this.configuration.type='';
        this.configuration.entity=null;
      }
    },
    template: `
      <div class="networkitem">
        <div class="name"   v-on:click="pick(network)"><i class="fas fa-cloud"/>&nbsp;{{network.name}}</div>
        <div class="button" v-on:click="del(network)"><i class="fas fa-minus"/></div>
      </div>`
  }
)

// networks
Vue.component(
  'networks',
  {
    props:    ['model','configuration'],
    template: `
      <div class="networks">
        <networkitem
          :key="network.index"
          v-for="network in model.networks"
          v-bind:model="model"
          v-bind:configuration="configuration"
          v-bind:network="network"></networkitem>
      </div>`
  }
)

//------------------------------------------------------------------------------

// component item
Vue.component(
  'componentitem',
  {
    props:    ['model','configuration','component'],
    methods:  {
      pick: function(entity) {
        this.configuration.type='Component';
        this.configuration.entity=entity;
      },
      del: function(entity) {
        deleteComponent(entity)
        this.configuration.type='';
        this.configuration.entity=null;
      }
    },
    template: `
      <div class="componentitem">
        <div class="name"   v-on:click="pick(component)"><i class="fas fa-server"/>&nbsp;{{component.name}}</div>
        <div class="button" v-on:click="del(component)"><i class="fas fa-minus"/></div>
      </div>`
  }
)

// components
Vue.component(
  'components',
  {
    props:    ['model','configuration'],
    template: `
      <div class="components">
        <componentitem
          :key="component.index"
          v-for="component in model.components"
          v-bind:model="model"
          v-bind:configuration="configuration"
          v-bind:component="component"></componentitem>
      </div>`
  }
)

//------------------------------------------------------------------------------

// navigation component
Vue.component(
  'appnavigation',
  {
    props:    ['model','configuration'],
    template: `
      <div id="appnavigation">
        <tenantform
          v-if="configuration.view === 'Tenant'"
          v-bind:model="model"
          v-bind:configuration="configuration">
        </tenantform>
        <flavors
          v-if="configuration.view === 'Flavors'"
          v-bind:model="model"
          v-bind:configuration="configuration">
        </flavors>
        <images
          v-if="configuration.view === 'Images'"
          v-bind:model="model"
          v-bind:configuration="configuration">
        </images>
        <networks
          v-if="configuration.view === 'Networks'"
          v-bind:model="model"
          v-bind:configuration="configuration">
        </networks>
        <components
          v-if="configuration.view === 'Components'"
          v-bind:model="model"
          v-bind:configuration="configuration">
        </components>
      </div>`
  }
)

// flavor form
Vue.component(
  'tenantform',
  {
    props:    ['model','configuration'],
    template: `
    <div id="tenantform">
      <div class="header">Tenant: {{model.name}}</div>

      <div class="line">
        <label for="name">VNF:</label>
        <input v-model="model.vnf" id="vnf" name="vnf" required>
      </div>
      <div class="line">
        <label for="tenant">Tenant:</label>
        <input v-model="model.tenant" id="tenant" name="tenant" required>
      </div>
      <div class="line">
        <label for="ram">Version:</label>
        <input v-model="model.version" id="version" name="version" required>
      </div>
      <div class="line">
        <label for="disk">Datacenter:</label>
        <input v-model="model.datacenter" id="datacenter" name="datacenter" required>
      </div>
    </div>`
  }
)

// flavor form
Vue.component(
  'flavorform',
  {
    props:    ['model','configuration','flavor'],
    template: `
    <div id="flavorform">
      <div class="header">Flavor: {{flavor.name}}</div>

      <div class="line">
        <label for="name">Name:</label>
        <input v-model="flavor.name" id="name" name="name" required>
      </div>
      <div class="line">
        <label for="vcpu">vCPU:</label>
        <input v-model="flavor.vcpu" id="vcpu" name="vcpu" required>
      </div>
      <div class="line">
        <label for="ram">RAM:</label>
        <input v-model="flavor.ram" id="ram" name="ram" required>
      </div>
      <div class="line">
        <label for="disk">Disk:</label>
        <input v-model="flavor.disk" id="ipv4" name="disk" required>
      </div>
      <div class="line">
        <label for="special">Attributes:</label>
        <input v-model="flavor.special" id="special" name="special">
      </div>
    </div>`
  }
)

// image form
Vue.component(
  'imageform',
  {
    props:    ['model','configuration','image'],
    template: `
    <div id="imageform">
      <div class="header">Image: {{image.name}}</div>

      <div class="line">
        <label for="name">Name:</label>
        <input v-model="image.name" id="name" name="name" required>
      </div>
    </div>`
  }
)

// network form
Vue.component(
  'networkform',
  {
    props:    ['model','configuration','network'],
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

// component form
Vue.component(
  'componentform',
  {
    props:    ['model','configuration','component'],
    computed: {
      services: function() {
        results = [];

        for (var component of model.components) {
          for (var service of component.services) {
            results.push({component: component.name, service: service.name})
          }
        }

        return results;
      },
      services2: function() {
        results = [];

        for (var component of model.components) {
          for (var service of component.services) {
            results.push( component.name + ":" + service.name)
          }
        }

        return results;
      },
      components: function() {
        return model.components.map(x => x.name)
      },
      all_networks: function() {
        return model.networks.map(x => x.name)
      },
      networks: function() {
        return this.component.networks.map(x => x.name)
      },
      zones: function() {
        return ['other','ext','int','mgmt']
      },
      flavors: function() {
        return model.flavors.map(x => x.name)
      },
      images: function() {
        return model.images.map(x => x.name)
      },
      storagetypes: function() {
        return ['EXT','INT']
      },
      protocols: function() {
        return ['tcp','udp','icmp']
      }
    },
    methods: {
      addVolume:     function()           { addComponentVolume(this.component); },
      delVolume:     function(volume)     { delComponentVolume(this.component,volume); },
      addNetwork:    function()           { addComponentNetwork(this.component); },
      delNetwork:    function(network)    { delComponentNetwork(this.component,network); },
      addService:    function()           { addComponentService(this.component); },
      delService:    function(service)    { delComponentService(this.component,service); },
      addDependency: function()           { addComponentDependency(this.component); },
      delDependency: function(dependency) { delComponentDependency(this.component,dependency); }
    },
    template: `
      <div id="componentform">
        <div class="header">Component: {{component.name}}</div>

        <div class="line">
          <label for="name">Name:</label>
          <input class="col5" v-model="component.name" id="name" name="name" required>
        </div>
        <div class="line">
          <label for="placement">Placement:</label>
          <select id="placement" name="placement" v-model="component.placement" v-bind:class="{valid: zones.includes(component.placement)}" required>
            <option disabled value="">Please select one</option>
            <option v-for="zone in zones" v-bind:value="zone">
              {{ zone }}
            </option>
          </select>
          <label for="flavor">Flavor:</label>
          <select id="flavor" name="flavor" v-model="component.flavor" v-bind:class="{valid: flavors.includes(component.flavor)}" required>
            <option disabled value="">Please select one</option>
            <option v-for="flavor in flavors" v-bind:value="flavor">
              {{ flavor }}
            </option>
          </select>
          <label for="image">Image:</label>
          <select id="image" name="image" v-model="component.image" v-bind:class="{valid: images.includes(component.image)}" required>
            <option disabled value="">Please select one</option>
            <option v-for="image in images" v-bind:value="image">
              {{ image }}
            </option>
          </select>
        </div>
        <div class="line">
          <label for="min">Minimum:</label>
          <input id="min" name="min" v-model="component.min" required>
          <label for="size">Size:</label>
          <input id="size" name="size" v-model="component.size" required>
          <label for="max">Maximum:</label>
          <input id="max" name="max" v-model="component.max" required>
        </div>

        <div class="subheader">Volumes:</div>

        <div class="line">
          <label class="top">Name:</label>
          <label class="top">Size:</label>
          <label class="top">Type:</label>
          <label class="top">Attributes:</label>
          <label v-on:click="addVolume"><i class="fas fa-plus-circle"/></label>
        </div>
        <div class="line" v-for="volume in component.volumes">
          <input id="volume_name" name="volume_name" v-model="volume.name" required>
          <input id="volume_size" name="volume_size" v-model="volume.size" required>
          <select id="volume_type" name="volume_type" v-model="volume.type" v-bind:class="{valid: storagetypes.includes(volume.type)}" required>
            <option disabled value="">Please select one</option>
            <option v-for="storagetype in storagetypes" v-bind:value="storagetype">
              {{ storagetype }}
            </option>
          </select>
          <input id="volume_attributes" name="volume_attributes" v-model="volume.attributes">
          <label v-on:click="delVolume(volume)"><i class="fas fa-minus-circle"/></label>
        </div>

        <div class="subheader">Networks:</div>

        <div class="line">
          <label class="top">Name:</label>
          <label class="top">IPv4:</label>
          <label class="top">IPv6:</label>
          <label class="top">Attributes:</label>
          <label v-on:click="addNetwork()"><i class="fas fa-plus-circle"/></label>
        </div>
        <div class="line" v-for="network in component.networks">
          <select id="network_name" name="network_name" v-model="network.name" v-bind:class="{valid: all_networks.includes(network.name)}" required>
            <option disabled value="">Please select one</option>
            <option v-for="network in all_networks" v-bind:value="network">
              {{ network }}
            </option>
          </select>
          <input id="network_ipv4"       name="network_ipv4"       v-model="network.ipv4">
          <input id="network_ipv6"       name="network_ipv6"       v-model="network.ipv6">
          <input id="network_attributes" name="network_attributes" v-model="network.attributes">
          <label v-on:click="delNetwork(network)"><i class="fas fa-minus-circle"/></label>
        </div>

        <div class="subheader">Services:</div>

        <div class="line">
          <label class="top">Name:</label>
          <label class="top">Network</label>
          <label class="top">Protocol</label>
          <label class="top">Range:</label>
          <label v-on:click="addService()"><i class="fas fa-plus-circle"/></label>
        </div>
        <div class="line" v-for="service in component.services">
          <input id="service_name" name="service_name" v-model="service.name" required>
          <select id="service_network" name="service_network" v-model="service.network" v-bind:class="{valid: service.network !== ''}">
            <option disabled value="">Please select one</option>
            <option v-for="network in component.networks" v-bind:value="network.name">
              {{ network.name }}
            </option>
          </select>
          <select id="service_protocol" name="service_protocol" v-model="service.protocol" v-bind:class="{valid: protocols.includes(service.protocol)}" required>
            <option disabled value="">Please select one</option>
            <option v-for="protocol in protocols" v-bind:value="protocol">
              {{ protocol }}
            </option>
          </select>
          <input id="service_range" name="service_range" v-model="service.range" required>
          <label v-on:click="delService(service)"><i class="fas fa-minus-circle"/></label>
        </div>

        <div class="subheader">Dependencies:</div>

        <div class="line">
          <label class="top">Component:</label>
          <label class="top">Service:</label>
          <label class="top">Network</label>
          <label v-on:click="addDependency()"><i class="fas fa-plus-circle"/></label>
        </div>
        <div class="line" v-for="dependency in component.dependencies">
          <select id="dependency_component" name="dependency_component" v-model="dependency.component" v-bind:class="{valid: components.includes(dependency.component)}" required>
            <option disabled value="">Please select one</option>
            <option v-for="component in components" v-bind:value="component">
              {{ component }}
            </option>
          </select>
          <select id="dependency_service" name="dependency_service" v-model="dependency.service" v-bind:class="{valid: services2.includes(dependency.component + ':' + dependency.service)}" required>
            <option disabled value="">Please select one</option>
            <option v-for="service in services" v-if="service.component === dependency.component" v-bind:value="service.service">
              {{ service.service }}
            </option>
          </select>
          <select id="dependency_network" name="dependency_network" v-model="dependency.network" v-bind:class="{valid: networks.includes(dependency.network)}" required>
            <option disabled value="">Please select one</option>
            <option v-for="network in networks" v-bind:value="network">
              {{ network }}
            </option>
          </select>

          <label v-on:click="delDependency(dependency)"><i class="fas fa-minus-circle"/></label>
        </div>

        <div class="line">&nbsp;</div>

      </div>`
  }
)

//------------------------------------------------------------------------------

// flavor form
Vue.component(
  'exportform',
  {
    props:    ['model','configuration','templates'],
    methods: {
      copyToClipboard: function() {
        document.getElementById("export").focus();
        document.getElementById("export").select();
        document.execCommand("Copy");
      },
      download: function() {
        var text     = document.getElementById("export").value;
        var element  = document.createElement('a');
        var filename = "vnf-descriptor.txt";

        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
      }
    },
    computed: {
      formats: function() {
        return Object.keys(templates)
      },
      result: function() {
        var format = configuration.export
        var tmpl   = templates[format]
        var result = Mustache.render(tmpl, model);
        return result;
      }
    },
    template: `
    <div id="exportform">
      <div class="header">
        Export: {{model.vnf}}/{{model.tenant}} ({{model.version}})
        <div class="button" v-on:click="download"><i class="fas fa-download"/>&nbsp;Download</div>
        <div class="button" v-on:click="copyToClipboard"><i class="fas fa-copy"/>&nbsp;Copy</div>
        <div class="format">
          Format: &nbsp;
          <select v-model="configuration.export">
            <option v-for="format in formats" v-bind:value="format">
              {{ format }}
            </option>
          </select>
        </div>
      </div>

      <div class="line">
        <textarea id="export" name="export" readonly>{{result}}</textarea>
      </div>
    </div>`
  }
)

//------------------------------------------------------------------------------

// flavor form
Vue.component(
  'importform',
  {
    props:    ['model','configuration','templates'],
    methods: {
      import_model: function() {
        var data   = document.getElementById("import").value;
        var object = null;
        var msg    = '';

        // convert data to object
        try {
          object = jsyaml.safeLoad(data);
        }
        catch (err)  {
          configuration.modal = err.message
          return
        }

        // verify schema
        msg = validate_schema(object);
        if (msg != '') {
          configuration.modal = msg
          return
        }

        // verify xrefs
        msg = validate_xref(object);
        if (msg != '') {
          configuration.modal = msg
          return
        }

        // copy data to model
        model.vnf        = object.vnf
        model.tenant     = object.tenant
        model.version    = object.version
        model.datacenter = object.version
        model.flavors    = object.flavors
        model.images     = object.images
        model.networks   = object.networks
        model.components = object.components
      }
    },
    template: `
    <div id="importform">
      <div class="header">
        Import:
        <div class="button" v-on:click="import_model"><i class="fas fa-redo-alt"/>&nbsp;Import</div>
      </div>

      <div class="line">
        <textarea id="import" name="import"></textarea>
      </div>
    </div>`
  }
)

//------------------------------------------------------------------------------

// detail component
Vue.component(
  'appdetail',
  {
    props:    ['model','configuration','templates'],
    template: `
      <div id="appdetail">
        <flavorform
          v-if="configuration.type === 'Flavor' && configuration.view === 'Flavors'"
          v-bind:model="model"
          v-bind:configuration="configuration"
          v-bind:flavor="configuration.entity">
        </flavorform>
        <imageform
          v-if="configuration.type === 'Image' && configuration.view === 'Images'"
          v-bind:model="model"
          v-bind:configuration="configuration"
          v-bind:image="configuration.entity">
        </imageform>
        <networkform
          v-if="configuration.type === 'Network' && configuration.view === 'Networks'"
          v-bind:model="model"
          v-bind:configuration="configuration"
          v-bind:network="configuration.entity">
        </networkform>
        <componentform
          v-if="configuration.type === 'Component' && configuration.view === 'Components'"
          v-bind:model="model"
          v-bind:component="configuration.entity">
        </componentform>
        <exportform
          v-if="configuration.type === 'Export'"
          v-bind:model="model"
          v-bind:configuration="configuration"
          v-bind:templates="templates">
        </exportform>
        <importform
          v-if="configuration.type === 'Import'"
          v-bind:model="model"
          v-bind:configuration="configuration">
        </importform>
      </div>`
  }
)

//------------------------------------------------------------------------------

// flavor form
Vue.component(
  'modal',
  {
    props:   ['configuration'],
    computed: {
      html: function() {
        var lines = configuration.modal.split("\n");
        var title = "<h2>" + lines[0] + "</h2>"
        var msgs  = ""

        for ( var index = 1; index < lines.length; index ++) {
          var line  = lines[index]
          var pos   = line.indexOf(":")

          if ( pos < 0 ) {
            msgs = msgs + line + "<br/>"
          } else {
            var subtitle = line.substr(0, pos)
            var text     = line.substr(pos+1)

            msgs = msgs + "<b>" + subtitle + ":</b> " + text + "<br/>"
          }
          var parts = line.split(":",1)
        }

        return title + msgs
      }
    },
    methods: {
      close: function() {
        configuration.modal = ""
      }
    },
    template: `
    <div id="modal">
      <div class="content">
        <span v-on:click="close" class="close">&times;</span>
        <span v-html="html"></span>
      </div>
    </div>`
  }
)

//------------------------------------------------------------------------------

// app component
Vue.component(
  'app',
  {
    props:    ['model','configuration','templates'],
    template: `
      <div>
        <appheader v-bind:model="model" v-bind:configuration="configuration"></appheader>
        <appnavigation v-bind:model="model" v-bind:configuration="configuration"></appnavigation>
        <appdetail v-bind:model="model" v-bind:configuration="configuration" v-bind:templates="templates"></appdetail>
        <modal v-if="configuration.modal !== ''" v-bind:configuration="configuration"></modal>
      </div>`
  }
)
