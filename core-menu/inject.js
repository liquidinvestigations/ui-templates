(function() {
  var container = document.querySelector('#liquid-menu-container')
  var div = document.createElement('div')
  var menu_url = '__LIQUID_PROTOCOL__://__LIQUID_DOMAIN__/menu/index.html'
  var style = "border: 0; height: 100%; width: 100%;"
  div.innerHTML = '<iframe style="' + style + '" src="' + menu_url + '">'
  container.append(div)
})()
