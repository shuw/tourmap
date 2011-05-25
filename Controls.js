function Controls(mapContainer, tours, deals) {
    var o = this;
    
    
    function getDateRange() {
        var min, max;
        $(deals, tours).each(function() {
            if (!min || this.createdDate < min) {
                min = this.createdDate;
            }
            if (!max || this.createdDate > max) {
                max = this.createdDate;
            }
        });
        
        return { min: new Date(min), max: new Date(max) };
    }

    function controlsChanged() {
        controlsUpdated();
        var createdDateFilterValues = o.createdDateSlider.slider('option','values');

        function filter(obj) {
            return obj.createdDate >= createdDateFilterValues[0] &&
                obj.createdDate <= createdDateFilterValues[1];
        }
        
        var fDeals = $.grep(deals, filter);
        var fTours = $.grep(tours, filter);
        
        mapContainer.setDeals(fDeals);
        mapContainer.setTours(fTours);        
    }
    
    function controlsUpdated() {
        var createdDateFilterValues = o.createdDateSlider.slider('option','values');
        
        o.status.html(new Date(createdDateFilterValues[0]).toDateString() + ' - ' +
                      new Date(createdDateFilterValues[1]).toDateString());
    }
    
    function createControls() {
        var root = $('<div>')
            .css({
                'padding': '10px 20px',
                'width': '300px',
                'background-color' : 'white',
                'opacity': '0.8'
            })
            .attr({ index : 1 })[0];
        
        mapContainer.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(root);
        
        var range = getDateRange();        
        var current = new Date(range.min);
        
        var values = [];
        do  {
            values.push(new Date(current).getTime());            
            current.setMonth(current.getMonth() + 1);
        } while (current < range.max)
        
        o.createdDateSlider = $('<div>')
            .slider({
                animate: true,
                range: true,
                min: range.min.getTime(),
                max: range.max.getTime(),
                values: [range.min.getTime(), range.max.getTime()],
                change: controlsChanged,
                slide: controlsUpdated
            })
            .appendTo(root);
            
        o.status = $('<div>')
            .css({
                'padding-top' : '5px',
                'font-family': 'Helvetica, Arial'
            })
            .appendTo(root);
    }
    
    
    createControls();
    controlsChanged();
}