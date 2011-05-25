// TODO: Highlight on closest marker
// TODO: When a sold deal is highlighted, show tour that the customer made to close that deal
var imagesPath = 'images/';

function Viz(mapEl) {
    mapEl.innerHTML = "Loading data...";
    
    $.when(
        $.ajax({
            url: 'data/tours.json',
            dataType: 'json'
        }),    
        $.ajax({
            url: 'data/deals.json',
            dataType: 'json'
        })
    ).done(function(tours, deals) {        
        /* Normalize Deals & Tours JSON */
        
        deals = $(deals[0]).map(function() {
            return {
                dealId: parseInt(this.deal_id),
                createdDate: new Date(this.created_date),
                dealStatusId: parseInt(this.deal_status_id),
                listingId: parseInt(this.listing_id),
                propertyId: parseInt(this.property_id),
                longitude: parseFloat(this.longitude),
                latitude: parseFloat(this.latitude),
                salePrice: parseInt(this.sale_price),
                saleDate: new Date(this.sale_date),
                listPrice: parseInt(this.list_price),
                originalPrice: parseInt(this.original_price),
                listingDate: new Date(this.listing_date)
            }
        });
        
        tours = $(tours[0]).map(function() {
            return {
                tourId: parseInt(this.tour_id),
                createdDate: new Date(this.created_date),
                listingId: parseInt(this.listing_id),
                propertyId: parseInt(this.property_id),
                longitude: parseFloat(this.longitude),
                latitude: parseFloat(this.latitude),
                salePrice: parseInt(this.sale_price),
                saleDate: new Date(this.sale_date),
                listPrice: parseInt(this.list_price),
                originalPrice: parseInt(this.original_price),
                listingDate: new Date(this.listing_date)
            }
        });    
    
        var mapContainer = new Map(mapEl);
        var controls = new Controls(mapContainer, tours, deals);
    });    
}