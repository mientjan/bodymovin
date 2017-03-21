import Matrix from "../3rd_party/Matrix";
import PropertyFactory from "../utils/PropertyFactory";
import LayerExpressionInterface from "../utils/expressions/LayerExpressionInterface";
import EffectsExpressionInterface from "../utils/expressions/EffectsExpressionInterface";
import ShapeExpressionInterface from "../utils/expressions/ShapeExpressionInterface";
import TextExpressionInterface from "../utils/expressions/TextExpressionInterface";

export default class BaseElement {


	checkMasks ()
	{
		if (!this.data.hasMask)
		{
			return false;
		}
		var i = 0, len = this.data.masksProperties.length;
		while (i < len)
		{
			if ((this.data.masksProperties[i].mode !== 'n' && this.data.masksProperties[i].cl !== false))
			{
				return true;
			}
			i += 1;
		}
		return false;
	}

	checkParenting ()
	{
		if (this.data.parent !== undefined)
		{
			this.comp.buildElementParenting(this, this.data.parent);
		}
	}

	prepareFrame (num)
	{
		if (this.data.ip - this.data.st <= num && this.data.op - this.data.st > num)
		{
			if (this.isVisible !== true)
			{
				this.elemMdf = true;
				this.globalData.mdf = true;
				this.isVisible = true;
				this.firstFrame = true;
				if (this.data.hasMask)
				{
					this.maskManager.firstFrame = true;
				}
			}
		}
		else
		{
			if (this.isVisible !== false)
			{
				this.elemMdf = true;
				this.globalData.mdf = true;
				this.isVisible = false;
			}
		}
		var i, len = this.dynamicProperties.length;
		for (i = 0; i < len; i += 1)
		{
			if (this.isVisible || (this._isParent && this.dynamicProperties[i].type === 'transform'))
			{
				this.dynamicProperties[i].getValue();
				if (this.dynamicProperties[i].mdf)
				{
					this.elemMdf = true;
					this.globalData.mdf = true;
				}
			}
		}
		if (this.data.hasMask && this.isVisible)
		{
			this.maskManager.prepareFrame(num * this.data.sr);
		}

        /* TODO check this
         if(this.data.sy){
         if(this.data.sy[0].renderedData[num]){
         if(this.data.sy[0].renderedData[num].c){
         this.feFlood.setAttribute('flood-color','rgb('+Math.round(this.data.sy[0].renderedData[num].c[0])+','+Math.round(this.data.sy[0].renderedData[num].c[1])+','+Math.round(this.data.sy[0].renderedData[num].c[2])+')');
         }
         if(this.data.sy[0].renderedData[num].s){
         this.feMorph.setAttribute('radius',this.data.sy[0].renderedData[num].s);
         }
         }
         }
         */


		this.currentFrameNum = num * this.data.sr;
		return this.isVisible;
	}

	globalToLocal (pt)
	{
		var transforms = [];
		transforms.push(this.finalTransform);
		var flag = true;
		var comp = this.comp;
		while (flag)
		{
			if (comp.finalTransform)
			{
				if (comp.data.hasMask)
				{
					transforms.splice(0, 0, comp.finalTransform);
				}
				comp = comp.comp;
			}
			else
			{
				flag = false;
			}
		}
		var i, len = transforms.length, ptNew;
		for (i = 0; i < len; i += 1)
		{
			ptNew = transforms[i].mat.applyToPointArray(0, 0, 0);
			//ptNew = transforms[i].mat.applyToPointArray(pt[0],pt[1],pt[2]);
			pt = [pt[0] - ptNew[0], pt[1] - ptNew[1], 0];
		}
		return pt;
	}

	initExpressions ()
	{
		this.layerInterface = LayerExpressionInterface(this);
		//layers[i].layerInterface = LayerExpressionInterface(layers[i]);
		//layers[i].layerInterface = LayerExpressionInterface(layers[i]);
		if (this.data.hasMask)
		{
			this.layerInterface.registerMaskInterface(this.maskManager);
		}
		var effectsInterface = EffectsExpressionInterface.createEffectsInterface(this, this.layerInterface);
		this.layerInterface.registerEffectsInterface(effectsInterface);

		if (this.data.ty === 0 || this.data.xt)
		{
			this.compInterface = CompExpressionInterface(this);
		}
		else if (this.data.ty === 4)
		{
			this.layerInterface.shapeInterface = ShapeExpressionInterface.createShapeInterface(this.shapesData, this.viewData, this.layerInterface);
		}
		else if (this.data.ty === 5)
		{
			this.layerInterface.textInterface = TextExpressionInterface(this);
		}
	}

	setBlendMode ()
	{
		var blendModeValue = '';
		switch (this.data.bm)
		{
			case 1:
				blendModeValue = 'multiply';
				break;
			case 2:
				blendModeValue = 'screen';
				break;
			case 3:
				blendModeValue = 'overlay';
				break;
			case 4:
				blendModeValue = 'darken';
				break;
			case 5:
				blendModeValue = 'lighten';
				break;
			case 6:
				blendModeValue = 'color-dodge';
				break;
			case 7:
				blendModeValue = 'color-burn';
				break;
			case 8:
				blendModeValue = 'hard-light';
				break;
			case 9:
				blendModeValue = 'soft-light';
				break;
			case 10:
				blendModeValue = 'difference';
				break;
			case 11:
				blendModeValue = 'exclusion';
				break;
			case 12:
				blendModeValue = 'hue';
				break;
			case 13:
				blendModeValue = 'saturation';
				break;
			case 14:
				blendModeValue = 'color';
				break;
			case 15:
				blendModeValue = 'luminosity';
				break;
		}
		var elem = this.baseElement || this.layerElement;

		elem.style['mix-blend-mode'] = blendModeValue;
	}

	init ()
	{
		if (!this.data.sr)
		{
			this.data.sr = 1;
		}
		this.dynamicProperties = [];
		if (this.data.ef)
		{
			this.effects = new EffectsManager(this.data, this, this.dynamicProperties);
			//this.effect = this.effectsManager.bind(this.effectsManager);
		}
		//this.elemInterface = buildLayerExpressionInterface(this);
		this.hidden = false;
		this.firstFrame = true;
		this.isVisible = false;
		this._isParent = false;
		this.currentFrameNum = -99999;
		this.lastNum = -99999;
		if (this.data.ks)
		{
			this.finalTransform = {
				mProp: PropertyFactory.getProp(this, this.data.ks, 2, null, this.dynamicProperties),
				matMdf: false,
				opMdf: false,
				mat: new Matrix(),
				opacity: 1
			};
			if (this.data.ao)
			{
				this.finalTransform.mProp.autoOriented = true;
			}
			this.finalTransform.op = this.finalTransform.mProp.o;
			this.transform = this.finalTransform.mProp;
			if (this.data.ty !== 11)
			{
				this.createElements();
			}
			if (this.data.hasMask)
			{
				this.addMasks(this.data);
			}
		}
		this.elemMdf = false;
	}

	getType ()
	{
		return this.type;
	}

	resetHierarchy ()
	{
		if (!this.hierarchy)
		{
			this.hierarchy = [];
		}
		else
		{
			this.hierarchy.length = 0;
		}
	}

	getHierarchy ()
	{
		if (!this.hierarchy)
		{
			this.hierarchy = [];
		}
		return this.hierarchy;
	}

	setHierarchy (hierarchy)
	{
		this.hierarchy = hierarchy;
	}

	getLayerSize ()
	{
		if (this.data.ty === 5)
		{
			return {w: this.data.textData.width, h: this.data.textData.height};
		}
		else
		{
			return {w: this.data.width, h: this.data.height};
		}
	}

	hide ()
	{

	}
}

BaseElement.prototype.mHelper = new Matrix();