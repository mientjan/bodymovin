import {createElement} from "../../utils/common";
import CVBaseElement from "./CVBaseElement";
import CanvasRenderer from "../../renderers/CanvasRenderer";
import Matrix from "../../3rd_party/Matrix";

export default function CVCompElement (data, comp, globalData)
{
	this._parent.constructor.call(this, data, comp, globalData);
	var compGlobalData = {};
	for (var s in globalData)
	{
		if (globalData.hasOwnProperty(s))
		{
			compGlobalData[s] = globalData[s];
		}
	}
	compGlobalData.renderer = this;
	compGlobalData.compHeight = this.data.h;
	compGlobalData.compWidth = this.data.w;
	this.renderConfig = {
		clearCanvas: true
	};
	this.contextData = {
		saved: Array.apply(null, {length: 15}),
		savedOp: Array.apply(null, {length: 15}),
		cArrPos: 0,
		cTr: new Matrix(),
		cO: 1
	};
	this.completeLayers = false;
	var i, len = 15;
	for (i = 0; i < len; i += 1)
	{
		this.contextData.saved[i] = Array.apply(null, {length: 16});
	}
	this.transformMat = new Matrix();
	this.parentGlobalData = this.globalData;
	var cv = document.createElement('canvas');
	//document.body.appendChild(cv);
	compGlobalData.canvasContext = cv.getContext('2d');
	this.canvasContext = compGlobalData.canvasContext;
	cv.width = this.data.w;
	cv.height = this.data.h;
	this.canvas = cv;
	this.globalData = compGlobalData;
	this.layers = data.layers;
	this.pendingElements = [];
	this.elements = Array.apply(null, {length: this.layers.length});
	if (this.data.tm)
	{
		this.tm = PropertyFactory.getProp(this, this.data.tm, 0, globalData.frameRate, this.dynamicProperties);
	}
	if (this.data.xt || !globalData.progressiveLoad)
	{
		this.buildAllItems();
	}
}
createElement(CVBaseElement, CVCompElement);

CVCompElement.prototype.ctxTransform = function ()
{
	CanvasRenderer.prototype.ctxTransform.apply(this, arguments);
};

CVCompElement.prototype.ctxOpacity = function ()
{
	CanvasRenderer.prototype.ctxOpacity.apply(this, arguments);
};
CVCompElement.prototype.save = function ()
{
	CanvasRenderer.prototype.save.apply(this, arguments);
};
CVCompElement.prototype.restore = () => CanvasRenderer.prototype.restore.apply(this, arguments);

CVCompElement.prototype.reset = function ()
{
	this.contextData.cArrPos = 0;
	this.contextData.cTr.reset();
	this.contextData.cO = 1;
};
CVCompElement.prototype.resize = function (transformCanvas)
{
	var maxScale = Math.max(transformCanvas.sx, transformCanvas.sy);
	this.canvas.width = this.data.w * maxScale;
	this.canvas.height = this.data.h * maxScale;
	this.transformCanvas = {
		sc: maxScale,
		w: this.data.w * maxScale,
		h: this.data.h * maxScale,
		props: [maxScale, 0, 0, 0, 0, maxScale, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
	}
	var i, len = this.elements.length;
	for (i = 0; i < len; i += 1)
	{
		if (this.elements[i] && this.elements[i].data.ty === 0)
		{
			this.elements[i].resize(transformCanvas);
		}
	}
};

CVCompElement.prototype.prepareFrame = function (num)
{
	this.globalData.frameId = this.parentGlobalData.frameId;
	this.globalData.mdf = false;
	this._parent.prepareFrame.call(this, num);
	if (this.isVisible === false && !this.data.xt)
	{
		return;
	}
	var timeRemapped = num;
	if (this.tm)
	{
		timeRemapped = this.tm.v;
		if (timeRemapped === this.data.op)
		{
			timeRemapped = this.data.op - 1;
		}
	}
	this.renderedFrame = timeRemapped / this.data.sr;
	var i, len = this.elements.length;

	if (!this.completeLayers)
	{
		this.checkLayers(num);
	}

	for (i = 0; i < len; i += 1)
	{
		if (this.completeLayers || this.elements[i])
		{
			this.elements[i].prepareFrame(timeRemapped / this.data.sr - this.layers[i].st);
			if (this.elements[i].data.ty === 0 && this.elements[i].globalData.mdf)
			{
				this.globalData.mdf = true;
			}
		}
	}
	if (this.globalData.mdf && !this.data.xt)
	{
		this.canvasContext.clearRect(0, 0, this.data.w, this.data.h);
		this.ctxTransform(this.transformCanvas.props);
	}
};

CVCompElement.prototype.renderFrame = function (parentMatrix)
{
	if (this._parent.renderFrame.call(this, parentMatrix) === false)
	{
		return;
	}
	if (this.globalData.mdf)
	{
		var i, len = this.layers.length;
		for (i = len - 1; i >= 0; i -= 1)
		{
			if (this.completeLayers || this.elements[i])
			{
				this.elements[i].renderFrame();
			}
		}
	}
	if (this.data.hasMask)
	{
		this.globalData.renderer.restore(true);
	}
	if (this.firstFrame)
	{
		this.firstFrame = false;
	}
	this.parentGlobalData.renderer.save();
	this.parentGlobalData.renderer.ctxTransform(this.finalTransform.mat.props);
	this.parentGlobalData.renderer.ctxOpacity(this.finalTransform.opacity);
	this.parentGlobalData.renderer.canvasContext.drawImage(this.canvas, 0, 0, this.data.w, this.data.h);
	this.parentGlobalData.renderer.restore();

	if (this.globalData.mdf)
	{
		this.reset();
	}
};

CVCompElement.prototype.setElements = function (elems)
{
	this.elements = elems;
};

CVCompElement.prototype.getElements = function ()
{
	return this.elements;
};

CVCompElement.prototype.destroy = function ()
{
	var i, len = this.layers.length;
	for (i = len - 1; i >= 0; i -= 1)
	{
		this.elements[i].destroy();
	}
	this.layers = null;
	this.elements = null;
	this._parent.destroy.call(this._parent);
};

CVCompElement.prototype.checkLayers = function ()
{
	return CanvasRenderer.prototype.checkLayers.apply(this, arguments);
}

CVCompElement.prototype.buildItem = function ()
{
	return CanvasRenderer.prototype.buildItem.apply(this, arguments);
}
CVCompElement.prototype.checkPendingElements = function ()
{
	return CanvasRenderer.prototype.checkPendingElements.apply(this, arguments);
}
CVCompElement.prototype.addPendingElement = function ()
{
	return CanvasRenderer.prototype.addPendingElement.apply(this, arguments);
}
CVCompElement.prototype.buildAllItems = function ()
{
	return CanvasRenderer.prototype.buildAllItems.apply(this, arguments);
}
CVCompElement.prototype.createItem = function ()
{
	return CanvasRenderer.prototype.createItem.apply(this, arguments);
}
CVCompElement.prototype.createImage = function ()
{
	return CanvasRenderer.prototype.createImage.apply(this, arguments);
}
CVCompElement.prototype.createComp = function ()
{
	return CanvasRenderer.prototype.createComp.apply(this, arguments);
}
CVCompElement.prototype.createSolid = function ()
{
	return CanvasRenderer.prototype.createSolid.apply(this, arguments);
}
CVCompElement.prototype.createShape = function ()
{
	return CanvasRenderer.prototype.createShape.apply(this, arguments);
}
CVCompElement.prototype.createText = function ()
{
	return CanvasRenderer.prototype.createText.apply(this, arguments);
}
CVCompElement.prototype.createBase = function ()
{
	return CanvasRenderer.prototype.createBase.apply(this, arguments);
}
CVCompElement.prototype.buildElementParenting = function ()
{
	return CanvasRenderer.prototype.buildElementParenting.apply(this, arguments);
}