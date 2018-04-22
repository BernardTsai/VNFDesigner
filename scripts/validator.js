var schema = {
  // "$schema":     "http://tsai.eu/vnfd-00-01-00/schema#",
  "title":       "VNF Desciptor",
  "description": "A simple VNF descriptor",
  "type":        "object",
  "required":    ["vnf", "tenant", "version", "datacenter", "flavors", "images", "networks", "components"],
  "properties": {

    "vnf": { "type": "string", "minLength": 1,
      "description": "The unique identifier for a virtual network function" },

    "tenant": { "type": "string", "minLength": 1,
      "description": "The name of the virtual data center" },

    "version": { "type": "string", "pattern": "^\\d+\\.\\d+\.\\d+$",
      "description": "Semantic version of the VNF descriptor" },

    "datacenter": { "type": "string", "minLength": 1,
      "description": "The name of the virtual data center" },

    "flavors": {
      "description": "The sizing of virtual servers",
      "type":        "array",
      "items": {
        "title":    "Flavor",
        "type":     "object",
        "required": ["uuid","name","vcpu","ram","disk","special"],
        "properties": {

          "uuid": { "type": "string",
            "description": "Unique identifier of the flavor" },

          "name": { "type": "string",
            "description": "Name of the flavor" },

          "vcpu": { "type": "number",
            "description": "Number of virtual core processing units as string" },

          "ram": { "type": "number",
            "description": "Size of memory in megabytes as string" },

          "disk": { "type": "number",
            "description": "Size of local disk in gigabytes as string" },

          "special": { "type": "string",
            "description": "Additional special attributes" }
        }
      }
    },

    "images": {
      "description": "The operating systems for virtual servers",
      "type":        "array",
      "items": {
        "title":    "Image",
        "type":     "object",
        "required": ["uuid","name","disk","container"],
        "properties": {

          "uuid": { "type": "string",
            "description": "Unique identifier of the image" },

          "name": { "type": "string",
            "description": "Name of the image" },

          "version": { "type": "string",
            "description": "Version of the image" },

          "format": { "type": "string", "enum": ['aki','ami','ari','iso','qcow2','raw','vdi','vhd','vhdx','vmdk'],
            "description": "Disk format of the image" },

          "container": { "type": "string", "enum": ['aki','ami','ari','bare','docker','ova','ovf'],
            "description": "Container format of the image" },

          "disk": { "type": "string",
            "description": "Minimum disk requirements" },

          "size": { "type": "string",
            "description": "Size of the image" },

          "checksum": { "type": "string",
            "description": "Checksum of the image" },

          "url": { "type": "string",
            "description": "URL for the image" },

          "special": { "type": "string",
            "description": "Additional special attributes" }
        }
      }
    },

    "networks": {
      "description": "The virtual networks",
      "type":        "array",
      "items": {
        "title":    "Network",
        "type":     "object",
        "required": ["uuid","ipv4","ipv6","special"],
        "properties": {
          "uuid": { "type": "string",
            "description": "Unique identifier of the virtual network" },

          "name": { "type": "string",
            "description": "Name of the virtual network" },

          "ipv4": { "type": "string",
            "description": "IPv4 attributes of the virtual network" },

          "ipv6": { "type": "string",
            "description": "IPv6 attributes of the virtual network" },

          "special": { "type": "string",
            "description": "Additional special attributes" }
        }
      }
    },

    "components": {
      "description": "The virtual servers",
      "type":        "array",
      "items": {
        "title":    "Component",
        "type":     "object",
        "required": ["uuid","name","placement","flavor","image","min","size","max","interfaces","volumes","services","dependencies"],
        "properties": {

          "uuid": { "type": "string",
            "description": "Unique identifier of the virtual server" },

          "name": { "type": "string",
            "description": "Name of the virtual server" },

          "placement": { "type": "string", "enum": ["other", "ext", "int", "mgmt"],
            "description": "Placement of the virtual server" },

          "flavor": { "type": "string",
            "description": "Name of the virtual server sizing" },

          "image": { "type": "string",
            "description": "Name of the operating system" },

          "min": { "type": "number",
            "description": "Minimum size of the cluster" },

          "size": { "type": "number",
            "description": "Default size of the cluster" },

          "max": { "type": "number",
            "description": "Maximum size of the cluster" },

          "interfaces": {
            "description": "The interfaces to virtual networks",
            "type":        "array",
            "items": {
              "title":    "Component Interface",
              "type":     "object",
              "required": ["network","ipv4","ipv6","attributes"],
              "properties": {

                "network": { "type": "string",
                  "description": "Name of the virtual network" },

                "ipv4": { "type": "string",
                  "description": "IPv4 attributes of the interface" },

                "ipv6": { "type": "string",
                  "description": "IPv6 attributes of the interface" },

                "attributes": { "type": "string",
                  "description": "Additional special attributes" }
              }
            }
          },

          "volumes": {
            "description": "The attached virtual block storage",
            "type":        "array",
            "items": {
              "title": "Component Volume",
              "type":  "object",
              "required": ["name","size","type","attributes"],
              "properties": {

                "name": { "type": "string",
                  "description": "Name of the virtual network" },

                "size": { "type": "number",
                  "description": "Size of the block storage in gigabyte" },

                "type": { "type": "string", "enum": ["EXT", "INT"],
                  "description": "Name of block storage pool" },

                "attributes": { "type": "string",
                  "description": "Additional special attributes" }
              }
            }
          },

          "services": {
            "description": "The exposed services",
            "type":        "array",
            "items": {
              "title":    "Component Service",
              "type":     "object",
              "required": ["name","network","protocol","range"],
              "properties": {

                "name": { "type": "string",
                  "description": "Name of the service" },

                "network": { "type": "string",
                  "description": "The virtual network via which the service is exposed" },

                "protocol": { "type": "string", "enum": ["tcp", "udp", "icmp"],
                  "description": "The service protocol" },

                "range": { "type": "string", "minimum": 1,
                  "description": "Port range" }
              }
            }
          },

          "dependencies": {
            "description": "The dependencies to services provided by other componenntse",
            "type":        "array",
            "items": {
              "title":      "Component Network",
              "type":       "object",
              "required":   ["component","service","network"],
              "properties": {

                "component": { "type": "string",
                  "description": "Name of the other component"},

                "service": { "type": "string",
                  "description": "The name of the service provided by the other component"},

                "network": { "type": "string",
                  "description": "The virtual network via which the service is consumed" }
              }
            }
          }
        }
      }
    }
  }
}

//------------------------------------------------------------------------------

function validate_schema(object) {
  var ajv    = new Ajv(); // options can be passed, e.g. {allErrors: true}
  var verify = ajv.compile(schema);
  var valid  = verify(object);

  if (!valid) {
    setFocus(verify.errors[0].dataPath)

    return "Schema error:\nfield " + verify.errors[0].message;
  }

  return '';
}

//------------------------------------------------------------------------------

function validate_xref(object) {

  // construct lookups
  var flavors    = object.flavors.map( x => x.name )
  var images     = object.images.map( x => x.name )
  var networks   = object.networks.map( x => x.name )
  var components = object.components.map( x => x.name )
  var services   = []

  for ( var component of object.components ) {
    for ( var service of component.services ) {
      services.push(component.name + ":" + service.name)
    }
  }

  // check flavors, images, networks and dependencies
  for ( var index =  0; index < object.components.length; index++ ) {
    component = object.components[index]

    // check flavor
    if ( !flavors.includes(component.flavor) ) {
      setFocus(".components[" + index + "].flavor")

      return "Reference error:\ninvalid flavor";
    }

    // check image
    if ( !images.includes(component.image) ) {
      setFocus(".components[" + index + "].image")

      return "Reference error:\ninvalid image";
    }

    // check interfaces
    var component_networks = []
    for ( var subindex = 0; subindex < component.interfaces.length; subindex++) {
      var interface = component.interfaces[subindex]

      component_networks.push( interface.network )

      if ( !networks.includes(interface.network) ) {
        setFocus(".components[" + index + "].interfaces[" + subindex + "].network")

        return "Reference error\ninvalid network";
      }
    }

    // check service networks
    for ( var subindex = 0; subindex < component.services.length; subindex++) {
      service = component.services[subindex]

      if ( !component_networks.includes(service.network) ) {
        setFocus(".components[" + index + "].services[" + subindex + "].network")

        return "Reference error\ninvalid network";
      }
    }

    // check dependencies
    for ( var subindex = 0; subindex < component.dependencies.length; subindex++) {
      dependency = component.dependencies[subindex]

      if ( !components.includes(dependency.component) ) {
        setFocus(".components[" + index + "].dependencies[" + subindex + "].component")

        return "Reference error\ninvalid component";
      }

      if ( !component_networks.includes(dependency.network) ) {
        setFocus(".components[" + index + "].dependencies[" + subindex + "].network")

        return "Reference error\ninvalid network";
      }

      var reference = dependency.component + ":" + dependency.service
      console.log(reference)
      console.log(services)
      if ( !services.includes(reference) ) {
        setFocus(".components[" + index + "].dependencies[" + subindex + "].service")

        return "Reference error\ninvalid service";
      }
    }
  }

  return '';
}

//------------------------------------------------------------------------------
