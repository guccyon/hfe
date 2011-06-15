//-----package-----
// /effect/infonic.Effect.base.js
//-----package-----
Element.getOpacity = function(element){  
  var opacity;
  if (opacity = Element.getStyle(element, 'opacity'))  
    return parseFloat(opacity);  
  if (opacity = (Element.getStyle(element, 'filter') || '').match(/alpha\(opacity=(.*)\)/))  
    if(opacity[1]) return parseFloat(opacity[1]) / 100;  
  return 1.0;  
}
Element.setOpacity = function(element, value){  
  element= $(element);  
  if (value == 1){
    Element.setStyle(element, { opacity: 
      (/Gecko/.test(navigator.userAgent) && !/Konqueror|Safari|KHTML/.test(navigator.userAgent)) ? 
      0.999999 : null });
    if(/MSIE/.test(navigator.userAgent))  
      Element.setStyle(element, {filter: Element.getStyle(element,'filter').replace(/alpha\([^\)]*\)/gi,'')});  
  } else {  
    if(value < 0.00001) value = 0;  
    Element.setStyle(element, {opacity: value});
    if(/MSIE/.test(navigator.userAgent))  
     Element.setStyle(element, 
       { filter: Element.getStyle(element,'filter').replace(/alpha\([^\)]*\)/gi,'') +
                 'alpha(opacity='+value*100+')' });  
  }
}
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
infonic.Effect = {
	Method:{},
	EffectableElement: function(element) {
		element.effect = {};
		for (var i in infonic.Effect.Method) {
			element.effect[i] = infonic.Effect.Method[i].bind(element);
		}
	},
	getElementOpacity: function(element) {
      	if (element.effect.effectOpacity == undefined ) {
	        var opacity = infonic.Effect.getElementsComputedStyle(element, 'opacity');
	        element.effect.effectOpacity = opacity != undefined ? opacity : 1.0;
      	}
	    return parseFloat(element.effect.effectOpacity);
	},
	getElementsComputedStyle: function ( htmlElement, cssProperty, mozillaEquivalentCSS) {
      if ( arguments.length == 2 )
         mozillaEquivalentCSS = cssProperty;

      var el = $(htmlElement);
      if ( el.currentStyle )
         return el.currentStyle[cssProperty];
      else
         return document.defaultView.getComputedStyle(el, null).getPropertyValue(mozillaEquivalentCSS);
	}
};
