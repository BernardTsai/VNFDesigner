var templates = {}

templates['Canonical'] = `---
vnf:        {{vnf}}
tenant:     {{tenant}}
datacenter: {{datacenter}}
version:    {{version}}
flavors:
{{#flavors}}
  - { uuid: "{{uuid}}", name: "{{name}}", vcpu: {{vcpu}}, ram: {{ram}}, disk: {{disk}}, special: "{{special}}" }
{{/flavors}}
images:
{{#images}}
  - { uuid: "{{uuid}}", name: "{{name}}", disk: "{{disk}}", container: "{{container}}", url: "{{url}}", special: "{{special}}" }
{{/images}}
networks:
{{#networks}}
  - { uuid: "{{uuid}}", name: "{{name}}", ipv4: "{{ipv4}}", ipv6: "{{ipv6}}", route: "{{route}}", special: "{{special}}" }
{{/networks}}
components:
{{#components}}
  - uuid:         "{{uuid}}"
    name:         "{{name}}"
    placement:    "{{placement}}"
    flavor:       "{{flavor}}"
    image:        "{{image}}"
    min:          {{min}}
    size:         {{size}}
    max:          {{max}}
    volumes:      {{^volumes}}[]{{/volumes}}
{{#volumes}}
      - { name: "{{name}}", size: {{size}}, type: "{{type}}", attributes: "{{attributes}}" }
{{/volumes}}
    interfaces:   {{^interfaces}}[]{{/interfaces}}
{{#interfaces}}
      - { network: "{{network}}", ipv4: "{{ipv4}}", ipv6: "{{ipv6}}", attributes: "{{attributes}}" }
{{/interfaces}}
    services:     {{^services}}[]{{/services}}
{{#services}}
      - { name: "{{name}}", network: "{{network}}", protocol: "{{protocol}}", range: "{{range}}" }
{{/services}}
    dependencies: {{^dependencies}}[]{{/dependencies}}
{{#dependencies}}
      - { component: "{{component}}", service: "{{service}}", network: "{{network}}" }
{{/dependencies}}
{{/components}}
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
{{#flavors}}
        - name:      {{name}}
          vcpu:      {{vcpu}}
          memory:    {{ram}}
          disk:      {{disk}}
          ephemeral: 0
          swap:      0
          isPublic:  true
{{/flavors}}


    ############################################################################
    # Phase 2: Networks
    ############################################################################

{{#networks}}
    {{name}}:
      type: tosca.dtag.nodes.Network
      properties:
        name:        {{name}}
        version:     '1.0'
        description: 'Tenant-network: {{name}}'
        tenant:      {{tenant}}
        target:      '{{route}}'
        ipv4:
          cidr:      '{{ipv4}}'
          gateway:   ''
          start:     ''
          end:       ''
        ipv6:
          cidr:      '{{ipv6}}'
          gateway:   ''
          start:     ''
          end:       ''

{{/networks}}

    ############################################################################
    # External Components
    ############################################################################

{{#components}}
    {{name}}:
      type: tosca.dtag.nodes.ExternalComponent
      properties:
        name:        {{name}}
        version:     {{version}}
        description: 'External component: {{name}} of tenant {{tenant}}'
        network:     {{networks[0].name}}
        ipv4:
          - '{{interfaces[0].ipv4}}'
        capabilities:
{{#services}}
          service{{@index}}:
            properties:
              name:      {{name}}
              interface: {{network}}
              ports:
                - protocol: {{protocol}}
                  range:    '{{range}}'
{{/services}}
        requirements:
{{#dependencies}}
        - {{component}}_{{service}}:
            node_filter:
              properties:
              - component:  {{component}}
                capability: {{service}}
                network:    {{network}}
{{/dependencies}}

{{/components}}

    ############################################################################
    # Phase 3
    ############################################################################

{{#components}}
    {{name}}:
      type: tosca.dtag.nodes.InternalComponent
      properties:
        name:         {{name}}
        version:      {{version}}
        description:  'Internal omponent: {{name}} of tenant {{tenant}}'
        tenant:       {{tenant}}
        placement:    {{placement}}
        flavor:       {{flavor}}
        image:        {{image}}
        minimum_size: {{min}}
        maximum_size: {{max}}
        default_size: {{size}}
        interfaces:
{{#interfaces}}
        - name: {{network}}
{{/interfaces}}
        volumes:
{{#volumes}}
        - name:   {{name}}
          size:   {{size}}
          type:   {{type}}
          device: {{device}}
{{/volumes}}
        capabilities:
{{#services}}
          service{{@index}}:
            properties:
              name:      {{name}}
              interface: {{network}}
              ports:
                - protocol: {{protocol}}
                  range:    '{{range}}'
{{/services}}
        requirements:
{{#dependencies}}
        - {{component}}_{{service}}:
            node_filter:
              properties:
              - component:  {{component}}
                capability: {{service}}
                network:    {{network}}
{{/dependencies}}

{{/components}}`
