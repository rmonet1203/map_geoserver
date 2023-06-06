import L from 'leaflet';
import './SpinnerControl.css';

L.Control.SpinnerControl = L.Control.extend({
    initialize: function (options) {
        L.Util.setOptions(this, options);
        this._container = null;
    },
    onAdd: function (map) {
        this._map = map;
        this._container = L.DomUtil.create('div', 'SpinnerControl');
        this._container.id = "SpinnerControl";
        this._container.style.visibility = 'hidden';
        return this._container;
    },
});

L.control.spinnerControl = function (options) {
    return new L.Control.SpinnerControl(options);
};


export default L.control.spinnerControl;