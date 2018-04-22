var data = `
vnf:        Example
tenant:     Tenant
datacenter: datacenter
version:    1.0.0
flavors:
  - { uuid: "29539307-5dd5-49ab-a562-f2e6073798b0", name: "none",      vcpu: 0, ram:     0, disk:   0, special: "" }
  - { uuid: "29539307-5dd5-49ab-a562-f2e6073798b1", name: "m1.tiny",   vcpu: 1, ram:   512, disk:   0, special: "" }
  - { uuid: "29539307-5dd5-49ab-a562-f2e6073798b2", name: "m1.small",  vcpu: 1, ram:  2048, disk:  20, special: "" }
  - { uuid: "29539307-5dd5-49ab-a562-f2e6073798b3", name: "m1.medium", vcpu: 2, ram:  4096, disk:  40, special: "" }
  - { uuid: "29539307-5dd5-49ab-a562-f2e6073798b4", name: "m1.large",  vcpu: 4, ram:  8192, disk:  80, special: "" }
  - { uuid: "29539307-5dd5-49ab-a562-f2e6073798b5", name: "m1.xlarge", vcpu: 8, ram: 16384, disk: 160, special: "" }
images:
  - { uuid: "5b16f37c-eeae-4f3a-8a4e-f442cbc381e0", name: "none",            version: "0", format: "qcow2", container: "bare", checksum: "-", disk: "", size: "0", special: "", url: "-" }
  - { uuid: "5b16f37c-eeae-4f3a-8a4e-f442cbc381e1", name: "CentOS-6-x86_64", version: "6", format: "qcow2", container: "bare", checksum: "88dca6fef7081f789de94b26d91b189def9af379f7c9a07409274022b6d35af3", disk: "", size: "271", special: "", url: "http://cloud.centos.org/centos/6/images/CentOS-6-x86_64-GenericCloud.qcow2c" }
  - { uuid: "5b16f37c-eeae-4f3a-8a4e-f442cbc381e2", name: "CentOS-7-x86_64", version: "7", format: "qcow2", container: "bare", checksum: "93613cd4fce8a4e5de793e49357853d96ee695f6842eca379d333ed3bc593cbb", disk: "", size: "377", special: "", url: "http://cloud.centos.org/centos/7/images/CentOS-7-x86_64-GenericCloud.qcow2c" }
  - { uuid: "5b16f37c-eeae-4f3a-8a4e-f442cbc381e3", name: "Ubuntu-14.04",    version: "14.04", format: "qcow2", container: "bare", checksum: "067f9715fc977494ff653dbac2c2acbc398739f335cb1d6c196d4c13bc45f1ab", disk: "", size: "251", special: "", url: "http://cloud-images.ubuntu.com/trusty/20180419/trusty-server-cloudimg-amd64-disk1.img" }
  - { uuid: "5b16f37c-eeae-4f3a-8a4e-f442cbc381e4", name: "Ubuntu-16.04",    version: "16.04", format: "qcow2", container: "bare", checksum: "43a40f2beb4a1912c20903dca6820c28092728987f03160424feac98682cb967", disk: "", size: "278", special: "", url: "http://cloud-images.ubuntu.com/xenial/20180420/xenial-server-cloudimg-amd64-disk1.img" }
networks:
  - { uuid: "138e7669-4af5-4c6a-b8ae-7b17465810a0",  name: "oam", ipv4: "", ipv6: "", route: "", special: "" }
  - { uuid: "138e7669-4af5-4c6a-b8ae-7b17465810a1",  name: "svc", ipv4: "", ipv6: "", route: "", special: "" }
  - { uuid: "138e7669-4af5-4c6a-b8ae-7b17465810a2",  name: "m2m", ipv4: "", ipv6: "", route: "", special: "" }
components:
  - { uuid: "0daa3709-513e-46c8-8bc5-2536e533a9f0",
      name: "client", placement: "other", flavor: "none", image: "none", min: 1, size: 1, max: 1,
      volumes: [],
      interfaces: [{network: "svc", ipv4: "0.0.0.0/0", ipv6: "", attributes: ""}],
      services: [],
      dependencies: [{component: "web", service: "http", network: "svc"}]}
  - { uuid: "0daa3709-513e-46c8-8bc5-2536e533a9f1",
      name: "web", placement: "ext", flavor: "m1.small", image: "CentOS-6-x86_64", min: 2, size: 3, max: 5,
      volumes: [],
      interfaces: [{network: "oam", ipv4: "192.168.0.1/24", ipv6: "", attributes: ""}, {network: "svc", ipv4: "192.168.1.1/24", ipv6: "", attributes: ""}, {network: "m2m", ipv4: "192.168.2.1/24", ipv6: "", attributes: ""}],
      services: [{name: "http", network: "svc", protocol: "tcp", range: "80,443"}, {name: "ssh", network: "oam", protocol: "tcp", range: "22"}],
      dependencies: [{component: "database", service: "mysql", network: "m2m"}]}
  - { uuid: "0daa3709-513e-46c8-8bc5-2536e533a9f2",
      name: "database", placement: "int", flavor: "m1.small", image: "CentOS-6-x86_64", min: 3, size: 3, max: 3,
      volumes: [{name: "data1", size: 100, type: "INT", attributes: ""}, {name: "data2", size: 2200, type: "INT", attributes: ""}],
      interfaces: [{network: "oam", ipv4: "192.168.0.1/24", ipv6: "", attributes: ""}, {network: "m2m", ipv4: "192.168.2.1/24", ipv6: "", attributes: ""}],
      services: [{name: "mysql", network: "m2m", protocol: "tcp", range: "3306"}, {name: "ssh", network: "oam", protocol: "tcp", range: "22"}],
      dependencies: []}
  - { uuid: "0daa3709-513e-46c8-8bc5-2536e533a9f3",
      name: "jumphost", placement: "mgmt", flavor: "m1.small", image: "CentOS-6-x86_64", min: 2, size: 2, max: 2,
      volumes: [],
      interfaces: [{network: "oam", ipv4: "192.168.0.1/24", ipv6: "", attributes: ""}, {network: "svc", ipv4: "192.168.1.1/24", ipv6: "", attributes: ""}],
      services: [{name: "ssh", network: "svc", protocol: "tcp", range: "22"}],
      dependencies: [{component: "web", service: "ssh", network: "oam"}, {component: "database", service: "ssh", network: "oam"}]}
`

//------------------------------------------------------------------------------

var current = jsyaml.safeLoad(data);
var target  = jsyaml.safeLoad(data);
var model   = current;

//------------------------------------------------------------------------------

function setModel(object) {
  model.vnf        = object.vnf
  model.tenant     = object.tenant
  model.version    = object.version
  model.datacenter = object.datacenter
  model.flavors    = object.flavors
  model.images     = object.images
  model.networks   = object.networks
  model.components = object.components
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
  var uuid = uuidv4();
  var nr   = model.flavors.length + 1;

  model.flavors.push( { uuid: uuid, name: "flavor-" + nr } );
}

//------------------------------------------------------------------------------

function deleteFlavor(flavor) {
  var index = model.flavors.indexOf(flavor);

  if (index > -1) { model.flavors.splice(index,1) }
}

//------------------------------------------------------------------------------

function addImage() {
  var uuid = uuidv4();
  var nr   = model.images.length + 1;

  model.images.push( { uuid: uuid, name: "image-" + nr, version: "", format: "qcow2", container: "bare", disk: "0", size: "0", special: "", url: "" } );
}

//------------------------------------------------------------------------------

function deleteImage(image) {
  var index = model.images.indexOf(image);

  if (index > -1) { model.images.splice(index,1) }
}

//------------------------------------------------------------------------------

function addNetwork() {
  var uuid = uuidv4();
  var nr   = model.networks.length + 1;

  model.networks.push( { uuid: uuid, name: "net-" + nr, ipv4: "", ipv6: "", route: "", special: "" } );
}

//------------------------------------------------------------------------------

function deleteNetwork(network) {
  var index = model.networks.indexOf(network);

  if (index > -1) { model.networks.splice(index,1) }
}

//------------------------------------------------------------------------------

function hasComponent(name) {
  for (var comp of model.components) {
    if (comp.name === name) { return comp }
  }
  return null;
}

//------------------------------------------------------------------------------

function addComponent() {
  var uuid = uuidv4();
  var nr   = model.components.length + 1;

  model.components.push({
    uuid: uuid, name: "comp-" + nr,
    placement: "mgmt", flavor: "none", image: "none", min: 1, max: 1, size: 1,
    volumes: [], interfaces: [], services: [], dependencies: [] } );
}

//------------------------------------------------------------------------------

function deleteComponent(component) {
  var index = model.components.indexOf(component);

  if (index > -1) { model.components.splice(index,1) }
}

//------------------------------------------------------------------------------

function addComponentVolume(component) {
  var nr = component.volumes.length + 1;

  component.volumes.push({
    name: "volume-" + nr, size: 100,
    type: component.placement.toUpperCase(), attributes:  ""});
}

//------------------------------------------------------------------------------

function delComponentVolume(component,volume) {
  var index = component.volumes.indexOf(volume);

  if (index > -1) { component.volumes.splice(index,1) }
}

//------------------------------------------------------------------------------

function addComponentInterface(component,network="") {
  var name = (network !== "" ? network : "net-" + (component.interfaces.length + 1));

  component.interfaces.push({network: network, ipv4: "", ipv6: "", attributes:  ""});
}

//------------------------------------------------------------------------------

function delComponentInterface(component,interface) {
  var index = component.interfaces.indexOf(interface);

  if (index > -1) { component.interfaces.splice(index,1) }
}

//------------------------------------------------------------------------------

function hasComponentInterface(component,network) {
  for (var interface of component.interfaces) {
    if (interface.network === network) {return interface;}
  }
  return null;
}

//------------------------------------------------------------------------------

function addComponentService(component) {
  var nr = component.services.length + 1;

  component.services.push({
    name: "svc-" + nr, network: "", protocol: "tcp", range:  "0-65535"});
}

//------------------------------------------------------------------------------

function delComponentService(component,service) {
  var index = component.services.indexOf(service);

  if (index > -1) { component.services.splice(index,1) }
}

//------------------------------------------------------------------------------

function addComponentDependency(component) {
  var nr = component.dependencies.length + 1;

  component.dependencies.push({
    component: "dep-" + nr, service: "",network: ""});
}

//------------------------------------------------------------------------------

function delComponentDependency(component,dependency) {
  var index = component.dependencies.indexOf(dependency);

  if (index > -1) { component.dependencies.splice(index,1) }
}

//------------------------------------------------------------------------------
