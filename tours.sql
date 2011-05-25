/* Finds Seattle Tours in 2011 */
select 
	ti.tour_id, 
	ti.created_date,
	l.listing_id,
	p.property_id,
	p.longitude,
	p.latitude,
	l.sale_price,
	l.sale_date,
	l.list_price,
	l.original_price,
	l.listing_date
from listings l
join (select t.tour_id, t.created_date, tour_items.listing_id from tour_items 
	join tours t
		on t.tour_id= tour_items.tour_id)
	as ti
	on l.listing_id=ti.listing_id

join properties p
	on l.property_id = p.property_id

where 
	l.primary_market_id=1 and -- Seattle market
	ti.created_date >= '1/1/2011'
order by tour_id
limit 30000


/* Finds Seattle Deals in 2011 */
select
	d.deal_id,
	d.deal_status_id,
	d.created_date,
	l.listing_id,
	p.property_id,
	p.longitude,
	p.latitude,
	l.sale_price,
	l.sale_date,
	l.list_price,
	l.original_price,
	l.listing_date
from deals d	
join listings l
	on l.listing_id = d.listing_id
join properties p
	on l.property_id = p.property_id
where 
	d.deal_status_id in (1 /* Offer Won */, 8 /* Listing Closed */) and
	d.created_date >= '1/1/2011' and
	l.primary_market_id = 1 -- Seattle
limit 10000