import AnimationManager from "./animation/AnimationManager";

let bodymovin = {};

function play (animation)
{
	AnimationManager.play(animation);
}
function pause (animation)
{
	AnimationManager.pause(animation);
}
function togglePause (animation)
{
	AnimationManager.togglePause(animation);
}
function setSpeed (value, animation)
{
	AnimationManager.setSpeed(value, animation);
}
function setDirection (value, animation)
{
	AnimationManager.setDirection(value, animation);
}
function stop (animation)
{
	AnimationManager.stop(animation);
}
function moveFrame (value)
{
	AnimationManager.moveFrame(value);
}
function searchAnimations ()
{
	if (standalone === true)
	{
		AnimationManager.searchAnimations(animationData, standalone, renderer);
	}
	else
	{
		AnimationManager.searchAnimations();
	}
}
function registerAnimation (elem)
{
	return AnimationManager.registerAnimation(elem);
}
function resize ()
{
	AnimationManager.resize();
}
function start ()
{
	AnimationManager.start();
}
function goToAndStop (val, isFrame, animation)
{
	AnimationManager.goToAndStop(val, isFrame, animation);
}
function setSubframeRendering (flag)
{
	subframeEnabled = flag;
}
function loadAnimation (params)
{
	if (standalone === true)
	{
		params.animationData = JSON.parse(animationData);
	}
	return AnimationManager.loadAnimation(params);
}
function destroy (animation)
{
	return AnimationManager.destroy(animation);
}
function setQuality (value)
{
	if (typeof value === 'string')
	{
		switch (value)
		{
			case 'high':
				defaultCurveSegments = 200;
				break;
			case 'medium':
				defaultCurveSegments = 50;
				break;
			case 'low':
				defaultCurveSegments = 10;
				break;
		}
	}
	else if (!isNaN(value) && value > 1)
	{
		defaultCurveSegments = value;
	}
	if (defaultCurveSegments >= 50)
	{
		roundValues(false);
	}
	else
	{
		roundValues(true);
	}

}
function installPlugin (type, plugin)
{
	if (type === 'expressions')
	{
		expressionsPlugin = plugin;
	}
}

function getFactory (name)
{
	switch (name)
	{
		case "propertyFactory":
			return PropertyFactory;
		case "shapePropertyFactory":
			return ShapePropertyFactory;
		case "matrix":
			return Matrix;
	}
}

bodymovin.play = play;
bodymovin.pause = pause;
bodymovin.togglePause = togglePause;
bodymovin.setSpeed = setSpeed;
bodymovin.setDirection = setDirection;
bodymovin.stop = stop;
bodymovin.moveFrame = moveFrame;
bodymovin.searchAnimations = searchAnimations;
bodymovin.registerAnimation = registerAnimation;
bodymovin.loadAnimation = loadAnimation;
bodymovin.setSubframeRendering = setSubframeRendering;
bodymovin.resize = resize;
bodymovin.start = start;
bodymovin.goToAndStop = goToAndStop;
bodymovin.destroy = destroy;
bodymovin.setQuality = setQuality;
bodymovin.installPlugin = installPlugin;
bodymovin.__getFactory = getFactory;
bodymovin.version = '4.6';

function checkReady ()
{
	if (document.readyState === "complete")
	{
		clearInterval(readyStateCheckInterval);
		searchAnimations();
	}
}

function getQueryVariable (variable)
{
	var vars = queryString.split('&');
	for (var i = 0; i < vars.length; i++)
	{
		var pair = vars[i].split('=');
		if (decodeURIComponent(pair[0]) == variable)
		{
			return decodeURIComponent(pair[1]);
		}
	}
}

var standalone = '__[STANDALONE]__';
var animationData = '__[ANIMATIONDATA]__';

var renderer = '';
if (standalone)
{
	var scripts = document.getElementsByTagName('script');
	var index = scripts.length - 1;
	var myScript = scripts[index];
	var queryString = myScript.src.replace(/^[^\?]+\??/, '');
	renderer = getQueryVariable('renderer');
}

var readyStateCheckInterval = setInterval(checkReady, 100);

console.log('webpack2');

window.bodymovin = bodymovin;