var data = `
vnf:        VNF
tenant:     Tenant
datacenter: datacenter
version:    1.0.0
flavors:
  - { index: "0", name: "m1.tiny",   vcpu: "1", ram:   "512", disk:   "0", special: "a" }
  - { index: "1", name: "m1.small",  vcpu: "1", ram:  "2048", disk:  "20", special: "b" }
  - { index: "2", name: "m1.medium", vcpu: "2", ram:  "4096", disk:  "40", special: "c" }
  - { index: "3", name: "m1.large",  vcpu: "4", ram:  "8192", disk:  "80", special: "d" }
  - { index: "4", name: "m1.xlarge", vcpu: "8", ram: "16384", disk: "160", special: "e" }
images:
  - { index: "0", name: "CentOS-6" }
  - { index: "1", name: "CentOS-7" }
  - { index: "2", name: "Ubuntu-14.04" }
  - { index: "3", name: "Ubuntu-17.04" }
networks:
  - { index: "0",  name: "oam", ipv4: "", ipv6: "", route: "", special: "" }
  - { index: "1",  name: "svc", ipv4: "", ipv6: "", route: "", special: "" }
  - { index: "2",  name: "m2m", ipv4: "", ipv6: "", route: "", special: "" }
components:
  - { index: "0", name: "web", placement: "ext", flavor: "m1.small", image: "CentOS-6", min: 2, size: 3, max: 5,
      volumes: [],
      networks: [{name: "oam", ipv4: "192.168.0.1/24", ipv6: "", attributes: ""}, {name: "svc", ipv4: "192.168.1.1/24", ipv6: "", attributes: ""}, {name: "m2m", ipv4: "192.168.2.1/24", ipv6: "", attributes: ""}],
      services: [{name: "http", network: "svc", protocol: "tcp", range: "80,443"}, {name: "ssh", network: "oam", protocol: "tcp", range: "22"}],
      dependencies: [{component: "database", service: "mysql", network: "m2m"}]}
  - { index: "1", name: "database", placement: "int", flavor: "m1.small", image: "CentOS-6", min: 3, size: 3, max: 3,
      volumes: [{name: "data1", size: 100, type: "INT", attributes: ""}, {name: "data2", size: 2200, type: "INT", attributes: ""}],
      networks: [{name: "oam", ipv4: "192.168.0.1/24", ipv6: "", attributes: ""}, {name: "m2m", ipv4: "192.168.2.1/24", ipv6: "", attributes: ""}],
      services: [{name: "mysql", network: "m2m", protocol: "tcp", range: "3306"}, {name: "ssh", network: "oam", protocol: "tcp", range: "22"}],
      dependencies: []}
  - { index: "2", name: "jumphost", placement: "mgmt", flavor: "m1.small", image: "CentOS-6", min: 2, size: 2, max: 2,
      volumes: [],
      networks: [{name: "oam", ipv4: "192.168.0.1/24", ipv6: "", attributes: ""}, {name: "svc", ipv4: "192.168.1.1/24", ipv6: "", attributes: ""}],
      services: [{name: "ssh", network: "svc", protocol: "tcp", range: "22"}],
      dependencies: [{component: "web", service: "ssh", network: "oam"}, {component: "database", service: "ssh", network: "oam"}]}
`

var model = jsyaml.safeLoad(data);

//------------------------------------------------------------------------------

var configuration = {
	view:    "Tenant",
  type:    "",
  entity:  null,
  export:  "Canonical",
  modal:   ""
}

//------------------------------------------------------------------------------

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

//------------------------------------------------------------------------------

function addFlavor() {
  var index = uuidv4();

  model.flavors.push( { index: index, name: "flavor-" + index } );
}

//------------------------------------------------------------------------------

function addImage() {
  var index = uuidv4();

  model.images.push( { index: index, name: "image-" + index } );
}


//------------------------------------------------------------------------------

function addNetwork() {
  var index = uuidv4();

  model.networks.push( { index: index, name: "network-" + index, ipv4: "", ipv6: "", route: "", special: "" } );
}

//------------------------------------------------------------------------------

function addComponent() {
  var index = uuidv4();

  model.components.push({
    index: index, name: "component-" + index,
    placement: "", flavor: "", image: "", min: 1, max: 1, size: 1,
    volumes: [], networks: [], services: [], dependencies: [] } );
}

//------------------------------------------------------------------------------

function addComponentVolume(component) {
  var index = uuidv4();

  component.volumes.push({
    name: "volume-" + index, size: "100",
    type: component.placement.toUpperCase(), attributes:  ""});
}

//------------------------------------------------------------------------------

function delComponentVolume(component,volume) {
  var index = component.volumes.indexOf(volume);

  if (index > -1) { component.volumes.splice(index,1) }
}

//------------------------------------------------------------------------------

function addComponentNetwork(component) {
  var index = uuidv4();

  component.networks.push({
    name: "network-" + index, ipv4: "", ipv6: "", attributes:  ""});
}

//------------------------------------------------------------------------------

function delComponentNetwork(component,network) {
  var index = component.networks.indexOf(network);

  if (index > -1) { component.networks.splice(index,1) }
}

//------------------------------------------------------------------------------

function addComponentService(component) {
  var index = uuidv4();

  component.services.push({
    name: "service-" + index, network: "", protocol: "tcp", range:  ""});
}

//------------------------------------------------------------------------------

function delComponentService(component,service) {
  var index = component.services.indexOf(service);

  if (index > -1) { component.services.splice(index,1) }
}

//------------------------------------------------------------------------------

function addComponentDependency(component) {
  var index = uuidv4();

  component.dependencies.push({
    component: "dependency-" + index, service: "",network: ""});
}

//------------------------------------------------------------------------------

function delComponentDependency(component,dependency) {
  var index = component.dependencies.indexOf(dependency);

  if (index > -1) { component.dependencies.splice(index,1) }
}

//------------------------------------------------------------------------------

function deleteFlavor(flavor) {
  var index = model.flavors.indexOf(flavor);

  if (index > -1) { model.flavors.splice(index,1) }
}

//------------------------------------------------------------------------------

function deleteImage(image) {
  var index = model.images.indexOf(image);

  if (index > -1) { model.images.splice(index,1) }
}

//------------------------------------------------------------------------------

function deleteNetwork(network) {
  var index = model.networks.indexOf(network);

  if (index > -1) { model.networks.splice(index,1) }
}
//------------------------------------------------------------------------------

function deleteComponent(component) {
  var index = model.components.indexOf(component);

  if (index > -1) { model.components.splice(index,1) }
}

//------------------------------------------------------------------------------

function import_model() {
  var tmpl   = tosca
  var result = Mustache.render(tosca, model);
  console.log(result)
}

//------------------------------------------------------------------------------

function export_model() {

}

//------------------------------------------------------------------------------
