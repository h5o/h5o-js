(function(){
	
	var channel;
	
	var popupMsgHandler = function(e)
	{
		if (e.data.msg == 'getOutline')
		{
			var outline = HTML5Outline(document.body);
			channel.port1.postMessage({msg:"pageOutline", outline: outline ? outline.asHTML(true) : "No outline - is there a FRAMESET?"});
		}
		if (e.data.msg == 'jumpTo')
		{
			window.location.href = '#'+e.data.id;
			highlight(e.data.id);
		}
	};
	
	var bgMsgHandler = function(e)
	{
		if (e.data.msg == 'getPorts')
		{
			channel = new MessageChannel();
			channel.port1.onmessage = popupMsgHandler;
			e.source.postMessage({msg:"establishConnection"}, [channel.port2]);
		}
	};

	var highlight = function(id)
	{
		var el = document.getElementById(id);
		var currentOpacity = window.getComputedStyle(el).opacity,
			currentTransition = window.getComputedStyle(el).oTransition;
		
		var duration=200, 
			itr=0;
		el.style.oTransitionProperty="opacity";
		el.style.oTransitionDuration=duration+"ms"
		el.style.oTransitionTimingFunction="ease";
		var blink = function()
		{
			el.style.opacity = (itr % 2 == 0 ? 0 : currentOpacity);
			if (itr < 3) {
				itr++;
				setTimeout(blink, duration);
			} else {
				el.style.oTransition = currentTransition;
			}
		}
		blink();
	}

	opera.extension.onmessage = bgMsgHandler;

}());

