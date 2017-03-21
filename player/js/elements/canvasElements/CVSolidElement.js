import {createElement} from "../../utils/common";
import CVBaseElement from "./CVBaseElement";
export default class CVSolidElement extends CVBaseElement {
	constructor (data, comp, globalData)
	{
		super(data, comp, globalData);
	}

	renderFrame(parentMatrix)
	{
		if (super.renderFrame(parentMatrix) === false)
		{
			return;
		}
		var ctx = this.canvasContext;
		this.globalData.renderer.save();
		this.globalData.renderer.ctxTransform(this.finalTransform.mat.props);
		this.globalData.renderer.ctxOpacity(this.finalTransform.opacity);
		ctx.fillStyle = this.data.sc;
		ctx.fillRect(0, 0, this.data.sw, this.data.sh);
		this.globalData.renderer.restore(this.data.hasMask);
		if (this.firstFrame)
		{
			this.firstFrame = false;
		}
	}
}