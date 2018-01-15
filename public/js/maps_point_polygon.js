/**
 * Created by ricardomendes on 30/06/17.
 */

var marker;
function initialize(flagEdit) {
    // Map Center
    var myLatLng = new google.maps.LatLng(40.6316055, -8.658540499999999);

    // General Options
    var mapOptions = {
        zoom: 12,
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.RoadMap
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var triangleCoords = [];

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        //var triangleCoords = [];

        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);

            // Polygon Coordinates
            triangleCoords = [
                new google.maps.LatLng(pos.lat + 0.017172, pos.lng - 0.0013732),
                new google.maps.LatLng(pos.lat - 0.0085873, pos.lng - 0.0374221),
                new google.maps.LatLng(pos.lat - 0.0186069, pos.lng + 0.0226593)
            ];


            /*var triangleCoords = [
             new google.maps.LatLng(40.6487775,-8.6599137),
             new google.maps.LatLng(40.6230182,-8.6959626),
             new google.maps.LatLng(40.6129986,-8.6358812)
             ];*/

            // Styling & Controls
            myPolygon = new google.maps.Polygon({
                paths: triangleCoords,
                draggable: flagEdit, // turn off if it gets annoying
                editable: flagEdit,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35
            });

            myPolygon.setMap(map);
            google.maps.event.addListener(myPolygon, "dragend", getPolygonCoords);
            google.maps.event.addListener(myPolygon.getPath(), "insert_at", getPolygonCoords);
            google.maps.event.addListener(myPolygon.getPath(), "remove_at", getPolygonCoords);
            google.maps.event.addListener(myPolygon.getPath(), "set_at", getPolygonCoords);

            marker = new google.maps.Marker({
                map: map,
                draggable: flagEdit,
                animation: google.maps.Animation.DROP,
                position: myLatLng
            });
            marker.addListener('click', toggleBounce);

            var polygon = [];
            var len = myPolygon.getPath().getLength();
            for (var i = 0; i < len; i++) {
                polygon.push([myPolygon.getPath().getAt(i).lat(), myPolygon.getPath().getAt(i).lng()]);
            }
            $('input[name=areaPosition]').val(JSON.stringify(polygon));
            $('input[name=position]').val(JSON.stringify(getCenterPolygon()));

        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });


    } else {
        triangleCoords = [
            new google.maps.LatLng(40.6487775, -8.6599137),
            new google.maps.LatLng(40.6230182, -8.6959626),
            new google.maps.LatLng(40.6129986, -8.6358812)
        ];
        // Styling & Controls
        myPolygon = new google.maps.Polygon({
            paths: triangleCoords,
            draggable: flagEdit, // turn off if it gets annoying
            editable: flagEdit,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });

        myPolygon.setMap(map);
        google.maps.event.addListener(myPolygon, "dragend", getPolygonCoords);
        google.maps.event.addListener(myPolygon.getPath(), "insert_at", getPolygonCoords);
        google.maps.event.addListener(myPolygon.getPath(), "remove_at", getPolygonCoords);
        google.maps.event.addListener(myPolygon.getPath(), "set_at", getPolygonCoords);

        marker = new google.maps.Marker({
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: myLatLng
        });
        marker.addListener('click', toggleBounce);

        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

//Display Coordinates below map
function getPolygonCoords() {
    var polygon = [];
    var len = myPolygon.getPath().getLength();
    for (var i = 0; i < len; i++) {
        polygon.push([myPolygon.getPath().getAt(i).lat(), myPolygon.getPath().getAt(i).lng()]);
    }
    polygon.push([myPolygon.getPath().getAt(0).lat(), myPolygon.getPath().getAt(0).lng()]);
    $('input[name=areaPosition]').val(JSON.stringify(polygon));
    $('input[name=position]').val(JSON.stringify(getCenterPolygon()));

    //return polygon;
}

function getCenterPolygon() {
    if (!google.maps.Polygon.prototype.getBounds) {

        google.maps.Polygon.prototype.getBounds = function () {
            var bounds = new google.maps.LatLngBounds()
            this.getPath().forEach(function (element, index) {
                bounds.extend(element)
            });
            return bounds;
        }
    }
    return [myPolygon.getBounds().getCenter().lat(), myPolygon.getBounds().getCenter().lng()];
}

function toggleBounce() {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

