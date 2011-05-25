function Map(mapEl, tours, deals) {
    var o = this;
    o.tourIdToMarkerMap = {};
    o.highlightedMarkers = [];
    o.map = createMap();
    o.tourMarkers = [];
    o.dealMarkers = [];
    
    function createMap() {
        var myLatlng = new google.maps.LatLng(47.721330448, -122.28583219);
        var myOptions = {
          zoom: 12,
          center: myLatlng,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };        

        return new google.maps.Map(mapEl, myOptions);
    }
    
    function onMouseOverMarker() {
        var marker = this;
        $(o.highlightedMarkers).each(function() {
            this.highlight(false);
        });
        o.highlightedMarkers = [];
           
        // Highlight markers
        $(this.items).each(function() {
            $(o.tourIdToMarkerMap[this.tourId]).each(function() {
                this.highlight(true);
                o.highlightedMarkers.push(this);
            });
        });
    }
    
    o.setTours = function(items) {
        var itemsMap = {};
        var itemsByPropertyId = [];
        
        $(items).each(function() {
            var items = itemsMap[this.propertyId];
            if (!items) {
                items = itemsMap[this.propertyId] = [];
                itemsByPropertyId.push(items);
            }            
            items.push(this);
        });
        
        // Clear existing tour markers
        $(o.tourMarkers).each(function() { this.dispose() });
        o.tourMarkers = [];
        
        var markers = $(itemsByPropertyId ).map(function(i, items) {
            if (!items[0].longitude) {
                return null;
            }
            
            var location = new google.maps.LatLng(items[0].latitude, items[0].longitude);
            var marker = new TourItemMarker(o.map, items, location);
            o.tourMarkers.push(marker);
            $(items).each(function() {
                (o.tourIdToMarkerMap[this.tourId] = o.tourIdToMarkerMap[this.tourId] || []).push(marker);
            });
             
            marker.setMouseOverAction(onMouseOverMarker);
            return marker;
        });        
    }
    
    o.setDeals = function(deals) {
        $(o.dealMarkers).each(function() { this.dispose() });
        o.dealMarkers   = [];
        
        var markers = $(deals).each(function(i, deal) {
            if (!deal.longitude) {
                return;
            }
            var location = new google.maps.LatLng(deal.latitude, deal.longitude);
            o.dealMarkers.push(new DealMarker(o.map, deal, location));
        });
    }
}

Marker = {
    dispose : function() {
        this.marker.setMap(null);
    }
};

function DealMarker(map, deal, location) {
    this.marker = new google.maps.Marker({
        position: location,
        title: "I'm a successful deal",
        map: map,
        deal: deal,
        icon: imagesPath + 'ico_list_prev_sale.gif'
    });    
}
DealMarker.prototype = Marker;

function TourItemMarker(map, items, location) {    
    var o = this;
    o.items = items;
    
    var item = items[0];
    
    var icon = items.length > 1                
        ? 'dot_green.png'
        : 'dot_red.png';
        
    var icon;
    switch (items.length) {
        case 1:
            icon = 'dot_red_light_3.png';
            break;
        case 2:
            icon = 'dot_red_light_2.png';
            break;
        case 3:
            icon = 'dot_red_light_1.png';
            break;
        default:
            icon = 'dot_red.png';
            break;        
    }
    
    o.marker = new google.maps.Marker({
        position: location,
        title: "I'm a tour",
        map: map,
        icon: imagesPath + icon,
        items: items,
        propertyId: item.propertyId
    });    
    
    o.setMouseOverAction = function(func) {
        google.maps.event.addListener(o.marker, 'mouseover', function() {
            func.apply(o, arguments);
        });
    }
    
    o.dispose = function() {
        Marker.dispose.call(o);
        google.maps.event.clearListeners(o.marker, 'mouseover');
    }
    
    o.highlight = function(value) {
        if (value) {
            iconToUse = 'dot_blue_12.png';
        } else {
            iconToUse = icon;
        }
        
        o.marker.setIcon(imagesPath + iconToUse);   
    }
}
TourItemMarker.prototype = Marker;