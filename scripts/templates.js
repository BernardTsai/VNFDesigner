var canonical = `---
vnf:        {{vnf}}
tenant:     {{tenant}}
datacenter: {{datacenter}}
version:    {{version}}
flavors:
{{#flavors}}
  - { index: {{index}}, name: "{{name}}", vcpu: "{{vcpu}}", ram: "{{ram}}", disk:   "{{disk}}", special: "{{special}}" }
{{/flavors}}
images:
{{#images}}
  - { index: {{index}}, name: "{{name}}" }
{{/images}}
networks:
{{#networks}}
  - { index: {{index}}, name: "{{name}}", ipv4: "{{ipv4}}", ipv6: "{{ipv6}}", route: "{{route}}", special: "{{special}}" }
{{/networks}}
components:
{{#components}}
  - index:        {{index}}
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
    networks:     {{^networks}}[]{{/networks}}
{{#networks}}
      - { name: "{{name}}", ipv4: "{{ipv4}}", ipv6: "{{ipv6}}", attributes: "{{attributes}}" }
{{/networks}}
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

var summary = `---
vnf:        {{vnf}}
tenant:     {{tenant}}
datacenter: {{datacenter}}
version:    {{version}}
`

templates = { 'Canonical': canonical, 'Summary': summary }
