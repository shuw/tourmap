select * from (
	select 
		p.latitude || ' ' || p.longitude as location, 
		p.property_type_id,
		l.listing_id,
		l.sale_date, 
		l.sale_price,
		l.original_price,
		l.sale_price / l.approx_sq_ft as price_sqft,
		l.list_price,
		l.listing_date,
		l.property_type_id,
		l.effective_cdom_date,
		l.is_short_sale,
		la.listing_agent_id, 
		la.first_name || ' ' || la.last_name as listing_agent_name,
		sa.listing_agent_id as selling_agent_id,
		sa.first_name || ' ' || sa.last_name as selling_agent_name,
		lb.listing_broker_id, 
		lb.name as listing_broker_name,
		sb.listing_broker_id as selling_broker_id, 
		sb.name as selling_broker_name
	from listings l 
		join properties p on	
			l.property_id = p.property_id
		left join listing_agents la on
			l.listing_agent_id = la.listing_agent_id
		left join listing_agents sa on
			l.selling_agent_id = sa.listing_agent_id
		left join  listing_brokers lb on
			l.listing_broker_id = lb.listing_broker_id
		left join listing_brokers sb on
			l.selling_broker_id = sb.listing_broker_id
		where
			l.search_status_id = 4 and	
			l.primary_market_id = 1 and -- Seattle
			l.user_visible = true and
			l.sale_date >= '1/1/2010'
	) solds