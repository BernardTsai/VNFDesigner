//------------------------------------------------------------------------------

var schema = {
  //"$schema":     "http://tsai.eu/vnfd-00-01-00/schema#",
  "title":       "VNF Desciptor",
  "description": "A simple VNF descriptor",
  "type":        "object",

  "properties": {

    "vnf": {
      "description": "The unique identifier for a virtual network function",
      "type":        "string"
    },

    "tenant": {
      "description": "The name of the virtual data center",
      "type":        "string"
    },

    "version": {
      "description": "Semantic version of the VNF descriptor",
      "type":        "string"
    },

    "datacenter": {
      "description": "The name of the virtual data center",
      "type":        "string"
    },

    "flavors": {
      "description": "The sizing of virtual servers",
      "type":        "array",
      "items": {
        "title": "Flavor",
        "type":  "object",
        "properties": {
          "index": {
            "description": "Unique identifier of the flavor",
            "type":        "string"
          },

          "name": {
            "description": "Name of the flavor",
            "type":        "string"
          },

          "vcpu": {
            "description": "Number of virtual core processing units as string",
            "type":        "string"
          },

          "ram": {
            "description": "Size of memory in megabytes as string",
            "type":        "string"
          },

          "disk": {
            "description": "Size of local disk in gigabytes as string",
            "type":        "string"
          },

          "special": {
            "description": "Additional special attributes",
            "type":        "string"
          }
        },
        "required": ["index","name","vcpu","ram","disk","special"]
      }
    },

    "images": {
      "description": "The operating systems for virtual servers",
      "type":        "array",
      "items": {
        "title": "Image",
        "type":  "object",
        "properties": {
          "index": {
            "description": "Unique identifier of the image",
            "type":        "string"
          },

          "name": {
            "description": "Name of the image",
            "type":        "string"
          }
        },
        "required": ["index","name"]
      }
    },

    "networks": {
      "description": "The virtual networks",
      "type":        "array",
      "items": {
        "title": "Network",
        "type":  "object",
        "properties": {
          "index": {
            "description": "Unique identifier of the virtual network",
            "type":        "string"
          },

          "name": {
            "description": "Name of the virtual network",
            "type":        "string"
          },

          "ipv4": {
            "description": "IPv4 attributes of the virtual network",
            "type":        "string"
          },

          "ipv6": {
            "description": "IPv6 attributes of the virtual network",
            "type":        "string"
          },

          "special": {
            "description": "Additional special attributes",
            "type":        "string"
          }
        },
        "required": ["index","ipv4","ipv6","special"]
      }
    },

    "components": {
      "description": "The virtual servers",
      "type":        "array",
      "items": {
        "title": "Component",
        "type":  "object",
        "properties": {
          "index": {
            "description": "Unique identifier of the virtual server",
            "type":        "string"
          },

          "name": {
            "description": "Name of the virtual server",
            "type":        "string"
          },

          "placement": {
            "description": "Placement of the virtual server",
            "type":        "string",
            "enum":        ["other", "ext", "int", "mgmt"]
          },

          "flavor": {
            "description": "Name of the virtual server sizing",
            "type":        "string"
          },

          "image": {
            "description": "Name of the operating system",
            "type":        "string"
          },

          "min": {
            "description": "Minimum size of the cluster",
            "type":        "number"
          },

          "size": {
            "description": "Default size of the cluster",
            "type":        "number"
          },

          "max": {
            "description": "Maximum size of the cluster",
            "type":        "number"
          },

          "networks": {
            "description": "The interfaces to virtual networks",
            "type":        "array",
            "items": {
              "title": "Component Network",
              "type":  "object",
              "properties": {
                "name": {
                  "description": "Name of the virtual network",
                  "type":        "string"
                },

                "ipv4": {
                  "description": "IPv4 attributes of the interface",
                  "type":        "string"
                },

                "ipv6": {
                  "description": "IPv6 attributes of the interface",
                  "type":        "string"
                },

                "attributes": {
                  "description": "Additional special attributes",
                  "type":        "string"
                }
              },
              "required": ["name","ipv4","ipv6","attributes"]
            }
          },

          "volumes": {
            "description": "The attached virtual block storage",
            "type":        "array",
            "items": {
              "title": "Component Network",
              "type":  "object",
              "properties": {
                "name": {
                  "description": "Name of the virtual network",
                  "type":        "string"
                },

                "size": {
                  "description": "Size of the block storage in gigabyte",
                  "type":        "number"
                },

                "type": {
                  "description": "Name of block storage pool",
                  "type":        "string",
                  "enum":        ["EXT", "INT"]
                },

                "attributes": {
                  "description": "Additional special attributes",
                  "type":        "string"
                }
              },
              "required": ["name","size","type","attributes"]
            }
          },

          "services": {
            "description": "The exposed services",
            "type":        "array",
            "items": {
              "title": "Component Network",
              "type":  "object",
              "properties": {
                "name": {
                  "description": "Name of the service",
                  "type":        "string"
                },

                "network": {
                  "description": "The virtual network via which the service is exposed",
                  "type":        "string"
                },

                "protocol": {
                  "description": "The service protocol",
                  "type":        "string",
                  "enum":        ["tcp", "udp", "icmp"]
                },

                "range": {
                  "description": "Port range",
                  "type":        "string"
                }
              },
              "required": ["name","network","protocol","range"]
            }
          },

          "dependencies": {
            "description": "The dependencies to services provided by other componenntse",
            "type":        "array",
            "items": {
              "title": "Component Network",
              "type":  "object",
              "properties": {

                "component": {
                  "description": "Name of the other component",
                  "type":        "string"
                },

                "service": {
                  "description": "The name of the service provided by the other component",
                  "type":        "string"
                },

                "network": {
                  "description": "The virtual network via which the service is consumed",
                  "type":        "string"
                }
              },
              "required": ["component","service","network"]
            }
          }
        },
        "required": ["index","name","placement","flavor","image","min","size","max","networks","volumes","services","dependencies"]
      }
    }

  },

  "required": ["vnf", "tenant", "version", "datacenter", "flavors", "images", "networks", "components"]
}

//------------------------------------------------------------------------------

function validate_schema(object) {
  var ajv    = new Ajv(); // options can be passed, e.g. {allErrors: true}
  var verify = ajv.compile(schema);
  var valid  = verify(object);

  if (!valid) {
    msg = "Schema error\n" +
          "Path: "   + verify.errors[0].dataPath + "\n" +
          "Reason: " + verify.errors[0].message;

    return msg;
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
  for ( var component of object.components ) {
    // check flavor
    if ( !flavors.includes(component.flavor) ) {
      msg = "Reference error\n" +
            "Component:" + component.name + "\n" +
            "Reason: invalid flavor '" + component.flavor +"'";

      return msg;
    }

    // check image
    if ( !images.includes(component.image) ) {
      msg = "Reference error\n" +
            "Component:" + component.name + "\n" +
            "Reason: invalid image '" + component.image +"'";

      return msg;
    }

    // check networks
    var component_networks = []
    for ( var network of component.networks ) {
      component_networks.push( network.name )
      if ( !networks.includes(network.name) ) {
        msg = "Reference error\n" +
              "Component:" + component.name + "\n" +
              "Reason: invalid network '" + network.name +"'";

        return msg;
      }
    }

    // check service networks
    for ( var service of component.services ) {
      if ( !component_networks.includes(service.network) ) {
        msg = "Reference error\n" +
              "Component:" + component.name + "/Service: " + service.name + "\n" +
              "Reason: invalid service network '" + service.network +"'";

        return msg;
      }
    }

    // check dependencies
    for ( var dependency of component.dependencies ) {
      var reference = dependency.component + ":" + dependency.service
      if ( !services.includes(reference) ) {
        msg = "Reference error\n" +
              "Component:" + component.name + "\n" +
              "Reason: invalid reference '" + dependency.component + "/" + dependency.service + "'";

        return msg;
      }
    }
  }

  return '';
}

//------------------------------------------------------------------------------
