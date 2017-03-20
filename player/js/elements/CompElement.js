import {createElement} from "../utils/common";
import SVGBaseElement from "./svgElements/SVGBaseElement";
import SVGRenderer from "../renderers/SVGRenderer";


export default class CompElement extends SVGBaseElement
{
	constructor (data, parentContainer, globalData, comp, placeholder)
	{
		super(data, parentContainer, globalData, comp, placeholder);

		this.layers = data.layers;
		this.supports3d = true;
		this.completeLayers = false;
		this.pendingElements = [];
		this.elements = this.layers ? Array.apply(null, {length: this.layers.length}) : [];

		if (this.data.tm)
		{
			this.tm = PropertyFactory.getProp(this, this.data.tm, 0, globalData.frameRate, this.dynamicProperties);
		}
		if (this.data.xt)
		{
			this.layerElement = document.createElementNS(svgNS, 'g');
			this.buildAllItems();
		}
		else if (!globalData.progressiveLoad)
		{
			this.buildAllItems();
		}
	}


	hide ()
	{
		if (!this.hidden)
		{
			var i, len = this.elements.length;
			for (i = 0; i < len; i += 1)
			{
				if (this.elements[i])
				{
					this.elements[i].hide();
				}
			}
			this.hidden = true;
		}
	};

	prepareFrame (num)
	{
		super.prepareFrame(num);
		if (this.isVisible === false && !this.data.xt)
		{
			return;
		}

		if (this.tm)
		{
			var timeRemapped = this.tm.v;
			if (timeRemapped === this.data.op)
			{
				timeRemapped = this.data.op - 1;
			}
			this.renderedFrame = timeRemapped;
		}
		else
		{
			this.renderedFrame = num / this.data.sr;
		}
		var i, len = this.elements.length;
		if (!this.completeLayers)
		{
			this.checkLayers(this.renderedFrame);
		}
		for (i = 0; i < len; i += 1)
		{
			if (this.completeLayers || this.elements[i])
			{
				this.elements[i].prepareFrame(this.renderedFrame - this.layers[i].st);
			}
		}
	};

	renderFrame (parentMatrix)
	{
		var renderParent = super.renderFrame(parentMatrix);
		var i, len = this.layers.length;
		if (renderParent === false)
		{
			this.hide();
			return;
		}

		this.hidden = false;
		for (i = 0; i < len; i += 1)
		{
			if (this.completeLayers || this.elements[i])
			{
				this.elements[i].renderFrame();
			}
		}
		if (this.firstFrame)
		{
			this.firstFrame = false;
		}
	};

	setElements (elems)
	{
		this.elements = elems;
	};

	getElements ()
	{
		return this.elements;
	};

	destroy ()
	{
		super.destroy();
		var i, len = this.layers.length;
		for (i = 0; i < len; i += 1)
		{
			if (this.elements[i])
			{
				this.elements[i].destroy();
			}
		}
	}

	checkLayers (num)
	{
		return SVGRenderer.prototype.checkLayers.call(this, num);
	}

	buildItem (pos)
	{
		return SVGRenderer.prototype.buildItem.call(this, pos);
	}

	buildAllItems ()
	{
		return SVGRenderer.prototype.buildAllItems.call(this);
	}

	buildElementParenting (element, parentName, hierarchy)
	{
		return SVGRenderer.prototype.buildElementParenting.call(this, element, parentName, hierarchy);
	}

	createItem (layer)
	{
		return SVGRenderer.prototype.createItem.call(this, layer);
	}

	createImage (data)
	{
		return SVGRenderer.prototype.createImage.call(this, data);
	}

	createComp (data)
	{
		return SVGRenderer.prototype.createComp.call(this, data);
	}

	createSolid (data)
	{
		return SVGRenderer.prototype.createSolid.call(this, data);
	}

	createShape (data)
	{
		return SVGRenderer.prototype.createShape.call(this, data);
	}

	createText (data)
	{
		return SVGRenderer.prototype.createText.call(this, data);
	}

	createBase (data)
	{
		return SVGRenderer.prototype.createBase.call(this, data);
	}

	appendElementInPos (element, pos)
	{
		return SVGRenderer.prototype.appendElementInPos.call(this, element, pos);
	}

	checkPendingElements ()
	{
		return SVGRenderer.prototype.checkPendingElements.call(this);
	}

	addPendingElement (element)
	{
		return SVGRenderer.prototype.addPendingElement.call(this, element);
	}
}

// CompElement.prototype.checkLayers = SVGRenderer.prototype.checkLayers;
// CompElement.prototype.buildItem = SVGRenderer.prototype.buildItem;
// CompElement.prototype.buildAllItems = SVGRenderer.prototype.buildAllItems;
// CompElement.prototype.buildElementParenting = SVGRenderer.prototype.buildElementParenting;
// CompElement.prototype.createItem = SVGRenderer.prototype.createItem;
// CompElement.prototype.createImage = SVGRenderer.prototype.createImage;
// CompElement.prototype.createComp = SVGRenderer.prototype.createComp;
// CompElement.prototype.createSolid = SVGRenderer.prototype.createSolid;
// CompElement.prototype.createShape = SVGRenderer.prototype.createShape;
// CompElement.prototype.createText = SVGRenderer.prototype.createText;
// CompElement.prototype.createBase = SVGRenderer.prototype.createBase;
// CompElement.prototype.appendElementInPos = SVGRenderer.prototype.appendElementInPos;
// CompElement.prototype.checkPendingElements = SVGRenderer.prototype.checkPendingElements;
// CompElement.prototype.addPendingElement = SVGRenderer.prototype.addPendingElement;