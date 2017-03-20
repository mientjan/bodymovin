import SVGBaseElement from "./svgElements/SVGBaseElement";
import {createElement} from "../utils/common";
import ImageElement from "./ImageElement";

export default function SolidElement(data, parentContainer, globalData, comp, placeholder){
    this._parent.constructor.call(this,data,parentContainer,globalData,comp, placeholder);
}
createElement(SVGBaseElement, SolidElement);

SolidElement.prototype.createElements = function(){
    this._parent.createElements.call(this);

    var rect = document.createElementNS(svgNS,'rect');
    ////rect.style.width = this.data.sw;
    ////rect.style.height = this.data.sh;
    ////rect.style.fill = this.data.sc;
    rect.setAttribute('width',this.data.sw);
    rect.setAttribute('height',this.data.sh);
    rect.setAttribute('fill',this.data.sc);
    this.layerElement.appendChild(rect);
    this.innerElem = rect;
    if(this.data.ln){
        this.layerElement.setAttribute('id',this.data.ln);
    }
    if(this.data.cl){
        this.layerElement.setAttribute('class',this.data.cl);
    }
};

SolidElement.prototype.hide = ImageElement.prototype.hide;
SolidElement.prototype.renderFrame = ImageElement.prototype.renderFrame;
SolidElement.prototype.destroy = ImageElement.prototype.destroy;
