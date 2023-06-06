import L from 'leaflet';
import './ToolbarControl.css';

L.Control.ToolbarsCTRL = L.Control.extend({
    initialize: function (options) {
        L.Util.setOptions(this, options);
        this._container = null;
    },
    onAdd: function (map) {
        this._map = map;
        this._container = L.DomUtil.create('div', 'ToolbarCTRL');
        this._container.id = "ToolbarCTRL";

        const btn = L.DomUtil.create("button");
        btn.textContent = "💩";
        btn.className = "customButton";
        btn.title = "elevation";
        btn.onmouseover = function () {
          // this.style.transform = "scale(1.3)";
        };
        btn.onmouseout = function () {
          // this.style.transform = "scale(1)";
        };
        btn.onclick = function () {
          
        };
        this._container.appendChild(btn);     
        // this._container.innerH
        // this._container.style.visibility = 'hidden';
        return this._container;
    },
});

L.control.ToolbarsCTRL = function (options) {
    return new L.Control.ToolbarsCTRL(options);
};


export default L.control.ToolbarsCTRL;