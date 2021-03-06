var view = {
	navigation: "Tenant",
  detail:     "Tenant",
  entity:     null,
	field:      null,
  export:     "Canonical",
  modal:      "",
	now:        "",
	mode:       "current"
}

//------------------------------------------------------------------------------

function tick() {
	var t = new Date();

	view.now = t.getFullYear()                   + "-" +
	           ("0" + t.getMonth()).substr(-2)   + "-" +
						 ("0" + t.getDate()).substr(-2)    + " " +
						 ("0" + t.getHours()).substr(-2)   + ":" +
						 ("0" + t.getMinutes()).substr(-2) + ":" +
						 ("0" + t.getSeconds()).substr(-2);
}

setInterval(tick, 1000)

//------------------------------------------------------------------------------

function setContext(context) {
	// import
	if ( context === 'Import' ) {
		view.navigation = 'Tenant'
		view.detail     = 'Import'
		return
	}
	// export
	if ( context === 'Export' ) {
		view.navigation = 'Tenant'
		view.detail     = 'Export'
		return
	}
	// delta
	if ( context === 'Delta' ) {
		view.navigation = 'Delta'
		view.detail     = 'Delta'
		return
	}
	// tenant
	if ( context === 'Tenant' ) {
		view.navigation = 'Tenant'
		view.detail     = 'Tenant'
		return
	}

	// otherwise
	view.navigation = context
	if ( view.detail !== view.navigation ) {
		view.detail = 'Tenant'
	}
}

//------------------------------------------------------------------------------

function setFocus(path) {
	var mapping = { flavors: "Flavor", images: 'Image', networks: 'Network', components: 'Component'}
  var parts   = path.split(".")
	var length  = parts.length

	console.log(path)

	// VNF/tenant related data
	if ( parts.length === 2 ) {
		view.navigation = 'Tenant'
		view.detail     = 'Tenant'
		view.field      = parts[1]
		return
	}

	// images/flavors and networks
	if ( parts.length === 3 ) {
		var pos      = parts[1].indexOf('[')
		var entities = parts[1].substr(0,pos)
		var index    = Number(parts[1].substr(pos+1).replace(']',''))
		var field    = parts[2]

		view.navigation = mapping[entities]
		view.detail     = mapping[entities]
		view.entity     = model[entities][index]
		view.field      = field
		return
	}

	// components
	if ( parts.length === 4 ) {
		var pos         = parts[1].indexOf('[')
		var entities    = parts[1].substr(0,pos)
		var index       = Number(parts[1].substr(pos+1).replace(']',''))

		var subpos      = parts[2].indexOf('[')
		var subentities = parts[2].substr(0,subpos)
		var subindex    = Number(parts[2].substr(subpos+1).replace(']',''))
		var field       = subentities + "_" + String(subindex) + "_" + parts[3]

		view.navigation = mapping[entities]
		view.detail     = mapping[entities]
		view.entity     = model[entities][index]
		view.field      = field
		return
	}

  console.log( parts)
}
