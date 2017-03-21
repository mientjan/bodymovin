import TrimModifier from "../utils/shapes/TrimModifier";
import MouseModifier from "../utils/shapes/MouseModifier";
import RoundCornersModifier from "../utils/shapes/RoundCornersModifier";

export default class BaseRenderer {
	constructor ()
	{
	}

	checkLayers (num)
	{
		var i, len = this.layers.length, data;
		this.completeLayers = true;
		for (i = len - 1; i >= 0; i--)
		{
			if (!this.elements[i])
			{
				data = this.layers[i];
				if (data.ip - data.st <= (num - this.layers[i].st) && data.op - data.st > (num - this.layers[i].st))
				{
					this.buildItem(i);
				}
			}
			this.completeLayers = this.elements[i] ? this.completeLayers : false;
		}
		this.checkPendingElements();
	}

	createItem (layer)
	{
		let item = null;

		if(layer.ty == 2)
		{
			item = this.createImage(layer);
		}
		else if(layer.ty == 0)
		{
			item = this.createComp(layer);
		}
		else if(layer.ty == 1)
		{
			item = this.createSolid(layer);
		}
		else if(layer.ty == 4)
		{
			item = this.createShape(layer);
		}
		else if(layer.ty == 5)
		{
			item = this.createText(layer);
		}
		else if(layer.ty == 99)
		{
			item = null;
		} else {
			item = this.createBase(layer);
		}

		return item;
		// switch (layer.ty)
		// {
		// 	case 2:
		// 		return this.createImage(layer);
		// 	case 0:
		// 		return this.createComp(layer);
		// 	case 1:
		// 		return this.createSolid(layer);
		// 	case 4:
		// 		return this.createShape(layer);
		// 	case 5:
		// 		return this.createText(layer);
		// 	case 99:
		// 		return null;
		// }
		// return this.createBase(layer);
	}

	buildAllItems ()
	{
		var i, len = this.layers.length;
		for (i = 0; i < len; i += 1)
		{
			this.buildItem(i);
		}
		this.checkPendingElements();
	}

	includeLayers (newLayers)
	{
		this.completeLayers = false;
		var i, len = newLayers.length;
		var j, jLen = this.layers.length;
		for (i = 0; i < len; i += 1)
		{
			j = 0;
			while (j < jLen)
			{
				if (this.layers[j].id == newLayers[i].id)
				{
					this.layers[j] = newLayers[i];
					break;
				}
				j += 1;
			}
		}
	}

	setProjectInterface (pInterface)
	{
		this.globalData.projectInterface = pInterface;
	}

	initItems ()
	{
		if (!this.globalData.progressiveLoad)
		{
			this.buildAllItems();
		}
	}

	buildElementParenting (element, parentName, hierarchy)
	{
		hierarchy = hierarchy || [];
		var elements = this.elements;
		var layers = this.layers;
		var i = 0, len = layers.length;
		while (i < len)
		{
			if (layers[i].ind == parentName)
			{
				if (!elements[i] || elements[i] === true)
				{
					this.buildItem(i);
					this.addPendingElement(element);
				}
				else if (layers[i].parent !== undefined)
				{
					hierarchy.push(elements[i]);
					elements[i]._isParent = true;
					this.buildElementParenting(element, layers[i].parent, hierarchy);
				}
				else
				{
					hierarchy.push(elements[i]);
					elements[i]._isParent = true;
					element.setHierarchy(hierarchy);
				}


			}
			i += 1;
		}
	}

	addPendingElement (element)
	{
		this.pendingElements.push(element);
	}
}