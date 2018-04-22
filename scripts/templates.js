var templates = {}

templates['Canonical'] = `---
vnf:        {{vnf}}
tenant:     {{tenant}}
datacenter: {{datacenter}}
version:    {{version}}
flavors:
{% for flavor in flavors -%}
  - { uuid: "{{flavor.uuid}}", name: "{{flavor.name}}", vcpu: {{flavor.vcpu}}, ram: {{flavor.ram}}, disk: {{flavor.disk}}, special: "{{flavor.special}}" }
{% endfor %}
images:
{% for image in images -%}
  - { uuid: "{{image.uuid}}", name: "{{image.name}}", version: "{{image.version}}", format: "{{image.format}}", container: "{{image.container}}", disk: "{{image.disk}}", size: "{{image.size}}", checksum: "{{image.checksum}}", url: "{{image.url}}", special: "{{image.special}}" }
{% endfor %}
networks:
{% for network in networks -%}
  - { uuid: "{{network.uuid}}", name: "{{network.name}}", ipv4: "{{network.ipv4}}", ipv6: "{{network.ipv6}}", route: "{{network.route}}", special: "{{network.special}}" }
{% endfor %}
components:
{% for component in components %}
  - uuid:         "{{component.uuid}}"
    name:         "{{component.name}}"
    placement:    "{{component.placement}}"
    flavor:       "{{component.flavor}}"
    image:        "{{component.image}}"
    min:          {{component.min}}
    size:         {{component.size}}
    max:          {{component.max}}
{% if component.volumes|length == 0 %}
    volumes:      []
{% endif -%}
{% if component.volumes|length >  0 %}
    volumes:
{% endif -%}
{% for volume in component.volumes %}
      - { name: "{{volume.name}}", size: {{volume.size}}, type: "{{volume.type}}", attributes: "{{volume.attributes}}" }
{% endfor %}
{% if component.interfaces|length == 0 %}
    interfaces:   []
{% endif -%}
{% if component.interfaces|length >  0 %}
    interfaces:
{% endif -%}
{% for interface in component.interfaces %}
      - { network: "{{interface.network}}", ipv4: "{{interface.ipv4}}", ipv6: "{{interface.ipv6}}", attributes: "{{interface.attributes}}" }
{% endfor %}
{% if component.services|length == 0 %}
    services:     []
{% endif -%}
{% if component.services|length >  0 %}
    services:
{% endif -%}
{% for service in component.services %}
      - { name: "{{service.name}}", network: "{{service.network}}", protocol: "{{service.protocol}}", range: "{{service.range}}" }
{% endfor %}
{% if component.dependencies|length == 0 %}
    dependencies: []
{% endif -%}
{% if component.dependencies|length >  0 %}
    dependencies:
{% endif -%}
{% for dependency in component.dependencies %}
      - { component: "{{dependency.component}}", service: "{{dependency.service}}", network: "{{dependency.network}}" }
{% endfor %}

{% endfor %}
`

templates['Summary'] = `---
vnf:        {{vnf}}
tenant:     {{tenant}}
datacenter: {{datacenter}}
version:    {{version}}
`

templates['DTAG Tosca'] = `---
tosca_definitions_version: TOSCA_dtag_profile_for_nfv_0_0_6

description: VNF Template for the {{tenant}} tenant.

metadata:
  template_name:                  TOSCA DTAG NFV Sample Template
  feature_EnableResourceGroup:    True
  feature_EnableAutoScalingGroup: False
  feature_SingleInstance:         True
  feature_AllDummySecurityGroups: True
  feature_EnableContrailRBAC:     True
  feature_EnableHeatStackOutput:  False

################################################################################

topology_template:

  node_templates:

    ############################################################################
    # Phase 1: Tenant
    ############################################################################
    {{vnf}}:
      type: tosca.dtag.nodes.VNF
      properties:
        name:        {{vnf}}
        version:     '{{version}}'
        vendor:      {{vendor}}
        description: 'Tenant for the VNF: {{vnf}} in data center: {{datacenter}}'

    {{tenant}}:
      type: tosca.dtag.nodes.Tenant
      properties:
        name:        {{vnf}}_{{tenant}}
        version:     '{{version}}'
        description: {{vnf}} tenant in {{datacenter}} data center
        vnf:         {{vnf}}
        datacenter:  {{datacenter}}
        ipv6_prefix: 'fdfd:1:1:b208::' # dummy
        keys: |

        flavors:
{% for flavor in flavors %}
        - name:      {{flavor.name}}
          vcpu:      {{flavor.vcpu}}
          memory:    {{flavor.ram}}
          disk:      {{flavor.disk}}
          ephemeral: 0
          swap:      0
          isPublic:  true
{% endfor %}


    ############################################################################
    # Phase 2: Networks
    ############################################################################

{% for network in networks %}
    {{network.name}}:
      type: tosca.dtag.nodes.Network
      properties:
        name:        {{network.name}}
        version:     '1.0'
        description: 'Tenant-network: {{network.name}}'
        tenant:      {{tenant}}
        target:      '{{network.route}}'
        ipv4:
          cidr:      '{{network.ipv4}}'
          gateway:   ''
          start:     ''
          end:       ''
        ipv6:
          cidr:      '{{network.ipv6}}'
          gateway:   ''
          start:     ''
          end:       ''

{% endfor %}

    ############################################################################
    # External Components
    ############################################################################

{% for component in components %}
{% if component.placement == "other" %}
    {{component.name}}:
      type: tosca.dtag.nodes.ExternalComponent
      properties:
        name:        {{component.name}}
        version:     {{version}}
        description: 'External component: {{component.name}} of tenant {{tenant}}'
        network:     {{component.interfaces[0].name}}
        ipv4:
          - '{{component.interfaces[0].ipv4}}'
{% if component.services|length == 0 %}
        capabilities: []
{% endif -%}
{% if component.services|length >  0 %}
        capabilities:
{% endif -%}
{% for service in component.services %}
          service{{loop.index}}:
            properties:
              name:      {{component.name}}
              interface: {{service.network}}
              ports:
                - protocol: {{service.protocol}}
                  range:    '{{service.range}}'
{% endfor %}
{% if component.dependencies|length == 0 %}
        requirements: []
{% endif -%}
{% if component.dependencies|length >  0 %}
        requirements:
{% endif -%}
{% for dependency in component.dependencies %}
        - {{dependency.component}}_{{dependency.service}}:
            node_filter:
              properties:
              - component:  {{dependency.component}}
                capability: {{dependency.service}}
                network:    {{dependency.network}}
{% endfor %}
{% endif %}
{% endfor %}

    ############################################################################
    # Phase 3
    ############################################################################

{% for component in components %}
{% if component.placement != "other" %}
    {{component.name}}:
      type: tosca.dtag.nodes.InternalComponent
      properties:
        name:         {{component.name}}
        version:      {{version}}
        description:  'Internal omponent: {{component.name}} of tenant {{tenant}}'
        tenant:       {{tenant}}
        placement:    {{component.placement}}
        flavor:       {{component.flavor}}
        image:        {{component.image}}
        minimum_size: {{component.min}}
        maximum_size: {{component.max}}
        default_size: {{component.size}}
        interfaces:
{% for interface in component.interfaces %}
        - name: {{interface.network}}
{% endfor %}
{% if component.volumes|length == 0 %}
        volumes:      []
{% endif -%}
{% if component.services|length >  0 %}
        volumes:
{% endif -%}
{% for volume in component.volumes %}
        - name:   {{volume.name}}
          size:   {{volume.size}}
          type:   {{volume.type}}
          device: {{volume.device}}
{% endfor %}
{% if component.services|length == 0 %}
        capabilities: []
{% endif -%}
{% if component.services|length >  0 %}
        capabilities:
{% endif -%}
{% for service in component.services %}
          service{{loop.index}}:
            properties:
              name:      {{component.name}}
              interface: {{service.network}}
              ports:
                - protocol: {{service.protocol}}
                  range:    '{{service.range}}'
{% endfor %}
{% if component.dependencies|length == 0 %}
        requirements: []
{% endif -%}
{% if component.dependencies|length >  0 %}
        requirements:
{% endif -%}
{% for dependency in component.dependencies %}
        - {{dependency.component}}_{{dependency.service}}:
            node_filter:
              properties:
              - component:  {{dependency.component}}
                capability: {{dependency.service}}
                network:    {{dependency.network}}
{% endfor %}

{% endif %}
{% endfor %}`

templates['TOSCA Simple Profile'] = `---
tosca_definitions_version: tosca_simple_yaml_1_1

description: >
  VNF: '{{vnf}}' in tenant '{{tenant}}' version {{version}}
metadata:
  vnfd_id: {{vnf}}_{{version | replace(".", "_")}}
  vnf_provider: name_of_organization
  vnf_product_name: {{vnf}}
  vnf_software_version: {{version}}
  vnfd_version: {{version}}
  template_name: MainServiceTemplate
  template_author: author_name
  template_version: {{version}}
  vnf_product_info_name: {{vnf}}
  vnf_product_info_description: some description
  vnf_product_info_features: {{vnf}} V{{version}}
  localization_language: En
  default_localization_language: En

imports:
  - netcracker-types: definitions/nc-nfv-tosca-types.yaml

group_types:
{% for component in components -%}
{% if component.placement != "other" %}
  {{component.name}}.vnfGroup:
    derived_from: netcracker.groups.nfv.VnfGroup
    capabilities:
      availability:
        type: {{component.name}}.capabilities.availability
      monitoring:
        type: {{component.name}}.capabilities.sizing

{% endif -%}
{% endfor %}

capability_types:
{% for component in components -%}
{% if component.placement != "other" %}
  {{component.name}}.capabilities.availability:
    description: Availabity Status
    derived_from: tosca.capabilities.nfv.Metric
    attributes:
      availability:
        type: string
        description: 'true / false'
        default: false

  {{component.name}}.capabilities.sizing:
    description: Sizing Status
    derived_from: tosca.capabilities.nfv.Metric
    attributes:
      sizing:
        type: string
        description: '-n / 0 / +n or n'
        default: 0

  {{component.name}}.capabilities.VirtualCompute:
    description: Server flavor
    derived_from: tosca.capabilities.nfv.VirtualCompute
{% for flavor in flavors -%}
{% if component.flavor == flavor.name %}
    properties:
      flavour_id:
        type: string
        default: {{flavor.name}}
      virtual_cpu:
        type: string
        default: {{flavor.vcpu}}
      virtual_memory:
        type: string
        default: {{flavor.ram}}
      local_drive_size:
        type: string
        default: {{flavor.disk}}
      special:
        type: string
        default: {{flavor.special}}

{% endif -%}
{% endfor -%}

{% endif -%}
{% endfor %}

node_types:
  .nodes.nfv.VNF.vnf:
    derived_from: tosca.nodes.nfv.vnfd
    properties:
      vnfd_id:
        type: string
      vnf_provider:
        type: string
      vnf_product_name:
        type: string
      vnf_software_version:
        type: string
      vnfd_version:
        type: string
      vnf_product_info_name:
        type: string
      deployment_flavour:
        type: string
      instantiation_level:
        type: string
      keypair_name:
        type: string
      zone_name:
        type: string
        required: false
      zone_secret:
        type: string
        required: false

{% for component in components %}
{% if component.placement != "other" %}
  {{component.name}}.compute:
    derived_from: tosca.nodes.nfv.VDU.Compute
    capabilities:
      virtual_compute:
        type: {{component.name}}.capabilities.VirtualCompute
      availability:
        type: {{component.name}}.capabilities.availability
      monitoring:
        type: {{component.name}}.capabilities.monitoring

{% endif -%}
{% endfor %}

topology_template:
  inputs:
    instantiation_level:
      type: string
      required: false
      default: defaultLevel
    os_user:
      type: string
      required: true
      default: ubuntu
    os_password:
      type: string
      required: true
      description: Ubuntu pasword
      default: ubuntu
    zone_name:
      type: string
      description: Name of Zone on DNS Server
      required: true
     # default: dev-vims.com
    zone_secret:
      type: string
      description: Zone secret on DNS Server
      required: true
     # default: M6wx7acatsdEsaTFpLrpjA==

  # Interface for NSD integration as VNF
  substitution_mappings:
    node_type: .nodes.nfv.VNF.vnf
    properties:
      vnfd_id: {{vnf}}_{{version | replace(".", "_")}}
      vnf_provider: name_of_organization
      vnf_product_name:  {{vnf}}
      vnf_software_version: {{version}}
      vnfd_version: {{version}}
      template_name: MainServiceTemplate
      template_author: author_name
      template_version: {{version}}
      vnf_product_info_name:  {{vnf}} V{{version}}
      zone_name: [zone_name]
      zone_secret: [zone_secret]

  # VNF Components:
  node_templates:

    # Virtual Links:
{% for network in networks %}
    {{network.name}}_VL:
      type: tosca.nodes.nfv.VnfVirtualLinkDesc
      properties:
        connectivity_type:
            layer_protocol: ipv4
            flow_pattern: Mesh

{% endfor %}

{% for component in components %}
{% if component.placement != "other" %}
    {{component.name}}:
      type: {{component.name}}.compute
      requirements:
        - dependency: haproxy
      properties:
        name: {{component.name}}
        description: {{component.name}} of VNF {{vnf}} in tenant {{tenant}}
        configurable_properties:
      capabilities:
        scalable:
          properties:
            min_instances: {{component.min}}
            max_instances: {{component.max}}
      artifacts:
        {{component.name}}_install:
          type: tosca.artifacts.Implementation.Ansible
          file: implementation/configuration/Ansible/tasks/{{component.name}}_install.yml
          deploy_path: tasks/{{component.name}}_install.yml
          properties:
            ansible_version: 2.3.2.0
        {{component.name}}_configure:
          type: tosca.artifacts.Implementation.Ansible
          file: implementation/configuration/Ansible/{{component.name}}_configure.yml
          deploy_path: tasks/{{component.name}}_configure.yml
          properties:
            ansible_version: 2.3.2.0
        {{component.name}}_terminate:
          type: tosca.artifacts.Implementation.Ansible
          file: implementation/configuration/Ansible/{{component.name}}_terminate.yml
          deploy_path: tasks/{{component.name}}_terminate.yml
          properties:
            ansible_version: 2.3.2.0
        {{component.name}}_register:
          type: tosca.artifacts.Implementation.Ansible
          file: implementation/configuration/Ansible/tasks/{{component.name}}_register.yml
          deploy_path: tasks/{{component.name}}_register.yml
          properties:
            ansible_version: 2.3.2.0
        {{component.name}}_unregister:
          type: tosca.artifacts.Implementation.Ansible
          file: implementation/configuration/Ansible/tasks/{{component.name}}_unregister.yml
          deploy_path: tasks/{{component.name}}_unregister.yml
          properties:
            ansible_version: 2.3.2.0
        {{component.name}}_prometheus_rules:
          type: tosca.artifacts.prometheus.rules
          file: implementation/monitoring/{{component.name}}_prometheus.rules
          properties:
            ansible_version: 2.3.2.0
        check_hosts:
          type: tosca.artifacts.Implementation.Ansible
          file: implementation/configuration/Ansible/check_hosts.yml
          properties:
            ansible_version: 2.3.2.0
        ansible-nic_config:
          type: tosca.artifacts.Implementation.Ansible
          file: implementation/configuration/Ansible/tasks/nic_config.yml
          deploy_path: tasks/nic_config.yml
          properties:
            ansible_version: 2.3.2.0
        handlers:
          type: tosca.artifacts.Implementation.Ansible
          file: implementation/configuration/Ansible/handlers/handlers.yml
          properties:
            ansible_version: 2.3.2.0
        ansible-bootstrap_proxy:
          type: tosca.artifacts.Implementation.Ansible
          file: implementation/configuration/Ansible/tasks/bootstrap_proxy.yml
          deploy_path: tasks/bootstrap_proxy.yml
          properties:
            ansible_version: 2.3.2.0
        monitoring_blackbox_exporter:
          type: tosca.artifacts.prometheus.blackbox_exporter
          file: implementation/monitoring/blackbox-exporter.yml
          properties:
            scrape_interval: 20s
            ansible_version: 2.3.2.0
        sw_image:
{% for image in images -%}
{% if component.image == image.name %}
          type: tosca.artifacts.nfv.SwImage
          file: {{image.url}}
          properties:
            name: {{image.name}}
            version: {{image.version}}
            checksum: {{image.checksum}}
            container_format: {{image.container}}
            disk_format: {{image.format}}
            min_disk: {{image.disk}} GB
            size: {{image.size}} MB
            supported_virtualisation_environments:
              - KVM
{% endif -%}
{% endfor %}
      interfaces:
        Standard:
          create: sw_image
          configure:
            inputs:
              ansible_playbook:
                target: { get_attribute: [ SELF, tosca_id ] }
              ansible_inventory:
                ansible_user: { get_input: os_user }
                os_pass: { get_input: os_password }
                ansible_ssh_private_key_file: ~/.ssh/id_rsa
                ansible_python_interpreter: /usr/bin/python3
                role: { get_attribute: [ SELF, name ] }
                m2m_cidr: { get_attribute: [ m2m_VL, subnet, cidr ] }
                host_prefix: { get_attribute: [ squid, name ] }
                host_index: { get_attribute: [ squid, vmIndex ] }
                m2m_ip: { get_operation_output: [ squid_m2m_cp, Standard, create, ip_address ] }
                zone_name: { get_input: zone_name }
                zone_secret: { get_input: zone_secret }
            implementation:
              primary: configuration
              dependencies:
                 - handlers
                 - ansible-bootstrap_http-proxy
                 - {{component.name}}_install
                 - ansible-nic_config
                 - {{component.name}}_register
          stop:
            inputs:
              ansible_playbook:
                target: { get_attribute: [ SELF, tosca_id ] }
            implementation:
              primary: terminate
              dependencies:
                - handlers
                - ansible-nic_config

{% endif %}
{% endfor %}

{% for component in components %}
{% if component.placement != "other" %}
{% for interface in component.interfaces %}
    {{component.name}}_{{interface.network}}_CP:
      type: tosca.nodes.nfv.VduCpd
      properties:
{% if interface.network == "oam" %}
        role: management
{% endif %}
        layer_protocol: ipv4
        address_data:
          -
            address_type: ip_address
            l3_address_data:
              ip_address_assignment: true
              floating_ip_activated: false
              ip_address_type:       ipv4
              number_of_ip_address:  1
      requirements:
        - virtual_binding: {{component.name}}
        - virtual_link: {{interface.network}}_VL
{% if interface.network != "oam" %}
        - dependency: {{component.name}}_oam_cp
{% endif %}

    {{component.name}}_{{interface.network}}_EXT_CP:
      type: tosca.nodes.nfv.VnfExtCpd
      properties:
        layer_protocol: ipv4
        role: management
        address_data:
          - address_type: ip_address
            l3_address_data:
              ip_address_assignment: false
              floating_ip_activated: false
              ip_address_type:       ipv4
              number_of_ip_address:  1
      requirements:
        - VduCpd_binding: {{component.name}}_{{interface.network}}_CP

{% endfor %}
{% endif %}
{% endfor %}

  groups:
    # Scaling associatedGroups:
{% for component in components %}
{% if component.placement != "other" %}
    {{component.name}}_SG:
      type: tosca.groups.nfv.VnfdElementGroup
      description:
      members: [ {{component.name}} ]
{% endif %}
{% endfor %}

  policies:
    # Instantiation Levels:
    - defaultLevel:
        type: tosca.policies.nfv.instantiationlevel
        properties:
          description:
          isDefault: true
          vduLevels:
{% for component in components %}
{% if component.placement != "other" %}
            {{component.name}}:
              numberOfInstances: {{component.size}}
{% endif %}
{% endfor %}
          scaleInfo:
{% for component in components %}
{% if component.placement != "other" %}
            {{component.name}}_SA:
              scaleLevel: {{component.size}}
{% endif %}
{% endfor %}

    # Scaling Aspects:
{% for component in components %}
{% if component.placement != "other" %}
    - {{component.name}}_SA:
        type: tosca.policies.nfv.scalingAspect
        properties:
          name: {{component.name}}
          description:
          maxScaleLevel: {{component.max}}
        targets: [ {{component.name}}_SG ]
{% endif %}
{% endfor %}`
