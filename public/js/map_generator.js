var mapGenerator = function () {
var _self = this;
    _self.markers = [];
    _self.marker;
    _self.map;
    _self.markerDrag = false;
    _self.flagDraggable = false;

    _self.mapOptions = {
        zoom: 10
    };
    //_self.initPosition = new google.maps.LatLngBounds();//new google.maps.LatLng(40.4482728, - 8.7371642); // Position Quiterios
    _self.options = {
        animation: google.maps.Animation.DROP
    };
    _self.element = document.getElementById('map-canvas');
    _self.elementLat = document.getElementById('map-canvas');
    _self.elementLon = document.getElementById('map-canvas');

    _self.initialize = function () {
        _self.map = new google.maps.Map(_self.element, _self.mapOptions);
        _self.options.map = map;
        //_self.options.position= _self.initPosition;
        _self.geolocation();
    }

    _self.updateLocation = function() {
        _self.elementLat.val(_self.marker.position.lat());
        _self.elementLon.val(_self.marker.position.lng());
    }

    _self.geolocation = function() {
        for (var i = 0; i < _self.markers.length; i++) {
            var dataMarker = _self.markers[i];
            var latLng = new google.maps.LatLng(dataMarker.latitude, dataMarker.longitude);
            _self.marker = new google.maps.Marker({
                draggable: _self.flagDraggable,
                zIndex: 1,
                optimized: false,
                map: _self.map,
                position: latLng,
                title: dataMarker.nome,
                url: dataMarker.id,
                animation: google.maps.Animation.DROP
            });

            google.maps.event.addListener(_self.marker, 'click', function() {
                window.location.href = this.url;
            });

        }
        //_self.map.setCenter(_self.options.position);
        if (_self.markerUpdate){
            _self.updateLocation();
        }
        if (_self.markerDrag){
            google.maps.event.addListener(_self.marker, 'dragend', _self.updateLocation);
        }
    }
}