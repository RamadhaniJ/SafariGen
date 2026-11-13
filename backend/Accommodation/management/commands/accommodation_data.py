from decimal import Decimal

# # 1. 
# Arusha City
# Arusha National Park

# Mount Meru

# Tarangire National Park
# Lake Manyara National Park
# Ngorongoro Crater

# Serengeti National Park
# Mount Kilimanjaro National Park
# Mkomazi National Park
# Dar es Salaam City

# # 3.
# Mikumi National Park
# Nyerere National Park
# Ruaha National Park
# Udzungwa Mountains National Park
# Saadani National Park

# # 4. 
# Gombe Stream National Park
# Mahale Mountains National Park
# Katavi National Park
# Zanzibar Island
# Pemba Island & Mafia Island

 

ACCOMMODATION_DATA = {
    "Arusha City": [
    {
    "name": "Mvuli Hotel Arusha",
    "tag_label": "Hotel",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": None,   # Outside park - hakuna concession
    "concession_fee_child_non_resident": None,
    "concession_fee_adult_resident": None,
    "concession_fee_child_resident": None,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Strategically located at 1 Mvuli Street, off Kundayo Road in the heart of Arusha, offering seamless access to the city's business district, cultural attractions, and safari departure points.",
        "A modern, mid-range hotel featuring comfortable, well-appointed rooms with contemporary African decor, air conditioning, en-suite bathrooms, and reliable high-speed Wi-Fi throughout the property.",
        "The on-site restaurant serves a diverse menu of local Tanzanian dishes and international favorites, while the welcoming bar area provides the perfect spot to unwind after a long day of travel or meetings.",
        "Ideal for both leisure travelers embarking on northern circuit safaris and business guests attending conferences, with flexible meeting facilities and professional, multilingual staff ready to assist.",
        "Known for its consistent quality, warm Tanzanian hospitality, and excellent value for money, making it a reliable and comfortable base for exploring Arusha and its surrounding attractions."
    ],
    "seasons": [
        {
            "name": "High Season",
            "start_day": 1,
            "start_month": 6,
            "end_day": 31,
            "end_month": 10,
            "rooms": [
                {
                    "name": "Single Room",
                    "capacity": 1,
                    "rates": {
                        "BB": Decimal("59.00"),
                        "HB": Decimal("79.00"),
                        "FB": Decimal("99.00")
                    }
                },
                {
                    "name": "Double Room",
                    "capacity": 2,
                    "rates": {
                        "BB": Decimal("78.00"),
                        "HB": Decimal("118.00"),
                        "FB": Decimal("158.00")
                    }
                },
                {
                    "name": "Twin Room",
                    "capacity": 2,
                    "rates": {
                        "BB": Decimal("78.00"),
                        "HB": Decimal("118.00"),
                        "FB": Decimal("158.00")
                    }
                },
                {
                    "name": "Triple Room",
                    "capacity": 3,
                    "rates": {
                        "BB": Decimal("98.00"),
                        "HB": Decimal("158.00"),
                        "FB": Decimal("218.00")
                    }
                },
                {
                    "name": "Suite (2 Pax)",
                    "capacity": 2,
                    "rates": {
                        "BB": Decimal("96.00"),
                        "HB": Decimal("136.00"),
                        "FB": Decimal("176.00")
                    }
                },
                {
                    "name": "Suite (3 Pax)",
                    "capacity": 3,
                    "rates": {
                        "BB": Decimal("118.00"),
                        "HB": Decimal("178.00"),
                        "FB": Decimal("238.00")
                    }
                },
                {
                    "name": "Suite (4 Pax)",
                    "capacity": 4,
                    "rates": {
                        "BB": Decimal("140.00"),
                        "HB": Decimal("220.00"),
                        "FB": Decimal("300.00")
                    }
                }
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 20,
            "start_month": 12,
            "end_day": 15,
            "end_month": 3,
            "rooms": [
                {
                    "name": "Single Room",
                    "capacity": 1,
                    "rates": {
                        "BB": Decimal("59.00"),
                        "HB": Decimal("79.00"),
                        "FB": Decimal("99.00")
                    }
                },
                {
                    "name": "Double Room",
                    "capacity": 2,
                    "rates": {
                        "BB": Decimal("78.00"),
                        "HB": Decimal("118.00"),
                        "FB": Decimal("158.00")
                    }
                },
                {
                    "name": "Twin Room",
                    "capacity": 2,
                    "rates": {
                        "BB": Decimal("78.00"),
                        "HB": Decimal("118.00"),
                        "FB": Decimal("158.00")
                    }
                },
                {
                    "name": "Triple Room",
                    "capacity": 3,
                    "rates": {
                        "BB": Decimal("98.00"),
                        "HB": Decimal("158.00"),
                        "FB": Decimal("218.00")
                    }
                },
                {
                    "name": "Suite (2 Pax)",
                    "capacity": 2,
                    "rates": {
                        "BB": Decimal("96.00"),
                        "HB": Decimal("136.00"),
                        "FB": Decimal("176.00")
                    }
                },
                {
                    "name": "Suite (3 Pax)",
                    "capacity": 3,
                    "rates": {
                        "BB": Decimal("118.00"),
                        "HB": Decimal("178.00"),
                        "FB": Decimal("238.00")
                    }
                },
                {
                    "name": "Suite (4 Pax)",
                    "capacity": 4,
                    "rates": {
                        "BB": Decimal("140.00"),
                        "HB": Decimal("220.00"),
                        "FB": Decimal("300.00")
                    }
                }
            ]
        },
        {
            "name": "Low Season",
            "start_day": 16,
            "start_month": 3,
            "end_day": 31,
            "end_month": 5,
            "rooms": [
                {
                    "name": "Single Room",
                    "capacity": 1,
                    "rates": {
                        "BB": Decimal("52.00"),
                        "HB": Decimal("72.00"),
                        "FB": Decimal("92.00")
                    }
                },
                {
                    "name": "Double Room",
                    "capacity": 2,
                    "rates": {
                        "BB": Decimal("66.00"),
                        "HB": Decimal("106.00"),
                        "FB": Decimal("146.00")
                    }
                },
                {
                    "name": "Twin Room",
                    "capacity": 2,
                    "rates": {
                        "BB": Decimal("66.00"),
                        "HB": Decimal("106.00"),
                        "FB": Decimal("146.00")
                    }
                },
                {
                    "name": "Triple Room",
                    "capacity": 3,
                    "rates": {
                        "BB": Decimal("84.00"),
                        "HB": Decimal("144.00"),
                        "FB": Decimal("204.00")
                    }
                },
                {
                    "name": "Suite (2 Pax)",
                    "capacity": 2,
                    "rates": {
                        "BB": Decimal("82.00"),
                        "HB": Decimal("122.00"),
                        "FB": Decimal("162.00")
                    }
                },
                {
                    "name": "Suite (3 Pax)",
                    "capacity": 3,
                    "rates": {
                        "BB": Decimal("101.00"),
                        "HB": Decimal("161.00"),
                        "FB": Decimal("221.00")
                    }
                },
                {
                    "name": "Suite (4 Pax)",
                    "capacity": 4,
                    "rates": {
                        "BB": Decimal("119.00"),
                        "HB": Decimal("199.00"),
                        "FB": Decimal("279.00")
                    }
                }
            ]
        },
        {
            "name": "Low Season (Nov-Dec)",
            "start_day": 1,
            "start_month": 11,
            "end_day": 19,
            "end_month": 12,
            "rooms": [
                {
                    "name": "Single Room",
                    "capacity": 1,
                    "rates": {
                        "BB": Decimal("52.00"),
                        "HB": Decimal("72.00"),
                        "FB": Decimal("92.00")
                    }
                },
                {
                    "name": "Double Room",
                    "capacity": 2,
                    "rates": {
                        "BB": Decimal("66.00"),
                        "HB": Decimal("106.00"),
                        "FB": Decimal("146.00")
                    }
                },
                {
                    "name": "Twin Room",
                    "capacity": 2,
                    "rates": {
                        "BB": Decimal("66.00"),
                        "HB": Decimal("106.00"),
                        "FB": Decimal("146.00")
                    }
                },
                {
                    "name": "Triple Room",
                    "capacity": 3,
                    "rates": {
                        "BB": Decimal("84.00"),
                        "HB": Decimal("144.00"),
                        "FB": Decimal("204.00")
                    }
                },
                {
                    "name": "Suite (2 Pax)",
                    "capacity": 2,
                    "rates": {
                        "BB": Decimal("82.00"),
                        "HB": Decimal("122.00"),
                        "FB": Decimal("162.00")
                    }
                },
                {
                    "name": "Suite (3 Pax)",
                    "capacity": 3,
                    "rates": {
                        "BB": Decimal("101.00"),
                        "HB": Decimal("161.00"),
                        "FB": Decimal("221.00")
                    }
                },
                {
                    "name": "Suite (4 Pax)",
                    "capacity": 4,
                    "rates": {
                        "BB": Decimal("119.00"),
                        "HB": Decimal("199.00"),
                        "FB": Decimal("279.00")
                    }
                }
            ]
        }
    ]
},

# 2......................=============================================
{
    "name": "Arusha Planet Lodge & Spa",
    "tag_label": "Lodge",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": None,
    "concession_fee_child_non_resident": None,
    "concession_fee_adult_resident": None,
    "concession_fee_child_resident": None,
    "is_sponsored": True,
    "sponsored_priority": 2,
    "featured_image": "accommodation/arusha_planet_lodge.jpg",
    "descriptions": [
        "Nestled in the serene and lush Moshono Village, this beautiful lodge offers a peaceful retreat just minutes away from the bustling heart of Arusha city.",
        "Features well-appointed rooms with modern African decor, en-suite bathrooms, and private balconies overlooking the vibrant, tropical gardens.",
        "Guests can unwind at the on-site Planet Spa, take a refreshing dip in the outdoor swimming pool, or host events in the fully equipped conference facilities.",
        "The lodge's restaurant serves a delicious fusion of authentic Tanzanian cuisine and international favorites, prepared with fresh, locally sourced ingredients.",
        "An ideal pre- or post-safari base for travelers, offering a perfect blend of tranquility, warm Tanzanian hospitality, and easy access to northern circuit departure points."
    ],
    "seasons": [
        {
            "name": "High Season",
            "start_day": 1,
            "start_month": 1,
            "end_day": 29,
            "end_month": 2,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"BB": Decimal("127.00"), "HB": Decimal("149.00"), "FB": Decimal("171.00")}},
                {"name": "Twin/Double Room", "capacity": 2, "rates": {"BB": Decimal("146.00"), "HB": Decimal("168.00"), "FB": Decimal("190.00")}},
                {"name": "Triple Room", "capacity": 3, "rates": {"BB": Decimal("197.00"), "HB": Decimal("219.00"), "FB": Decimal("241.00")}},
                {"name": "Deluxe Suite", "capacity": 2, "rates": {"BB": Decimal("167.00"), "HB": Decimal("189.00"), "FB": Decimal("211.00")}}
            ]
        },
        {
            "name": "High Season",
            "start_day": 1,
            "start_month": 6,
            "end_day": 31,
            "end_month": 10,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"BB": Decimal("127.00"), "HB": Decimal("149.00"), "FB": Decimal("171.00")}},
                {"name": "Twin/Double Room", "capacity": 2, "rates": {"BB": Decimal("146.00"), "HB": Decimal("168.00"), "FB": Decimal("190.00")}},
                {"name": "Triple Room", "capacity": 3, "rates": {"BB": Decimal("197.00"), "HB": Decimal("219.00"), "FB": Decimal("241.00")}},
                {"name": "Deluxe Suite", "capacity": 2, "rates": {"BB": Decimal("167.00"), "HB": Decimal("189.00"), "FB": Decimal("211.00")}}
            ]
        },
        {
            "name": "High Season",
            "start_day": 16,
            "start_month": 12,
            "end_day": 31,
            "end_month": 12,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"BB": Decimal("127.00"), "HB": Decimal("149.00"), "FB": Decimal("171.00")}},
                {"name": "Twin/Double Room", "capacity": 2, "rates": {"BB": Decimal("146.00"), "HB": Decimal("168.00"), "FB": Decimal("190.00")}},
                {"name": "Triple Room", "capacity": 3, "rates": {"BB": Decimal("197.00"), "HB": Decimal("219.00"), "FB": Decimal("241.00")}},
                {"name": "Deluxe Suite", "capacity": 2, "rates": {"BB": Decimal("167.00"), "HB": Decimal("189.00"), "FB": Decimal("211.00")}}
            ]
        },
        {
            "name": "Mid Season",
            "start_day": 1,
            "start_month": 3,
            "end_day": 31,
            "end_month": 3,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"BB": Decimal("107.00"), "HB": Decimal("129.00"), "FB": Decimal("151.00")}},
                {"name": "Twin/Double Room", "capacity": 2, "rates": {"BB": Decimal("120.00"), "HB": Decimal("142.00"), "FB": Decimal("164.00")}},
                {"name": "Triple Room", "capacity": 3, "rates": {"BB": Decimal("167.00"), "HB": Decimal("189.00"), "FB": Decimal("211.00")}},
                {"name": "Deluxe Suite", "capacity": 2, "rates": {"BB": Decimal("154.00"), "HB": Decimal("176.00"), "FB": Decimal("198.00")}}
            ]
        },
        {
            "name": "Mid Season",
            "start_day": 1,
            "start_month": 11,
            "end_day": 15,
            "end_month": 12,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"BB": Decimal("107.00"), "HB": Decimal("129.00"), "FB": Decimal("151.00")}},
                {"name": "Twin/Double Room", "capacity": 2, "rates": {"BB": Decimal("120.00"), "HB": Decimal("142.00"), "FB": Decimal("164.00")}},
                {"name": "Triple Room", "capacity": 3, "rates": {"BB": Decimal("167.00"), "HB": Decimal("189.00"), "FB": Decimal("211.00")}},
                {"name": "Deluxe Suite", "capacity": 2, "rates": {"BB": Decimal("154.00"), "HB": Decimal("176.00"), "FB": Decimal("198.00")}}
            ]
        },
        {
            "name": "Low Season",
            "start_day": 1,
            "start_month": 4,
            "end_day": 31,
            "end_month": 5,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"BB": Decimal("82.00"), "HB": Decimal("104.00"), "FB": Decimal("126.00")}},
                {"name": "Twin/Double Room", "capacity": 2, "rates": {"BB": Decimal("97.00"), "HB": Decimal("119.00"), "FB": Decimal("141.00")}},
                {"name": "Triple Room", "capacity": 3, "rates": {"BB": Decimal("127.00"), "HB": Decimal("149.00"), "FB": Decimal("171.00")}},
                {"name": "Deluxe Suite", "capacity": 2, "rates": {"BB": Decimal("144.00"), "HB": Decimal("166.00"), "FB": Decimal("188.00")}}
            ]
        }
    ]
},
{
    "name": "Airport Planet Lodge & Spa",
    "tag_label": "Lodge",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": None,
    "concession_fee_child_non_resident": None,
    "concession_fee_adult_resident": None,
    "concession_fee_child_resident": None,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "featured_image": "accommodation/airport_planet_lodge.jpg",
    "descriptions": [
        "Strategically located just 5 miles from Kilimanjaro International Airport (JRO), making it the ultimate convenient stopover for early flights or late arrivals.",
        "Offers complimentary shared airport transfers for all overnight guests, ensuring a seamless and stress-free transition between your flight and your safari.",
        "Features spacious, elegantly designed rooms and suites with premium bedding, modern amenities, and tranquil views of the surrounding landscape.",
        "Guests can rejuvenate at the full-service Planet Spa, enjoy a meal at the diverse on-site restaurant, or utilize the comprehensive conference facilities.",
        "A highly reliable and comfortable haven for transit travelers, tour groups, and business professionals seeking quality service and proximity to the airport."
    ],
    "seasons": [
        {
            "name": "High Season",
            "start_day": 1,
            "start_month": 1,
            "end_day": 29,
            "end_month": 2,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"BB": Decimal("197.00"), "HB": Decimal("219.00"), "FB": Decimal("241.00")}},
                {"name": "STD Twin/Double", "capacity": 2, "rates": {"BB": Decimal("217.00"), "HB": Decimal("239.00"), "FB": Decimal("261.00")}},
                {"name": "STD Triple", "capacity": 3, "rates": {"BB": Decimal("287.00"), "HB": Decimal("309.00"), "FB": Decimal("331.00")}},
                {"name": "Deluxe Suite", "capacity": 2, "rates": {"BB": Decimal("237.00"), "HB": Decimal("259.00"), "FB": Decimal("281.00")}},
                {"name": "Executive Suite", "capacity": 2, "rates": {"BB": Decimal("347.00"), "HB": Decimal("369.00"), "FB": Decimal("391.00")}}
            ]
        },
        {
            "name": "High Season",
            "start_day": 1,
            "start_month": 6,
            "end_day": 31,
            "end_month": 10,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"BB": Decimal("197.00"), "HB": Decimal("219.00"), "FB": Decimal("241.00")}},
                {"name": "STD Twin/Double", "capacity": 2, "rates": {"BB": Decimal("217.00"), "HB": Decimal("239.00"), "FB": Decimal("261.00")}},
                {"name": "STD Triple", "capacity": 3, "rates": {"BB": Decimal("287.00"), "HB": Decimal("309.00"), "FB": Decimal("331.00")}},
                {"name": "Deluxe Suite", "capacity": 2, "rates": {"BB": Decimal("237.00"), "HB": Decimal("259.00"), "FB": Decimal("281.00")}},
                {"name": "Executive Suite", "capacity": 2, "rates": {"BB": Decimal("347.00"), "HB": Decimal("369.00"), "FB": Decimal("391.00")}}
            ]
        },
        {
            "name": "High Season",
            "start_day": 16,
            "start_month": 12,
            "end_day": 31,
            "end_month": 12,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"BB": Decimal("197.00"), "HB": Decimal("219.00"), "FB": Decimal("241.00")}},
                {"name": "STD Twin/Double", "capacity": 2, "rates": {"BB": Decimal("217.00"), "HB": Decimal("239.00"), "FB": Decimal("261.00")}},
                {"name": "STD Triple", "capacity": 3, "rates": {"BB": Decimal("287.00"), "HB": Decimal("309.00"), "FB": Decimal("331.00")}},
                {"name": "Deluxe Suite", "capacity": 2, "rates": {"BB": Decimal("237.00"), "HB": Decimal("259.00"), "FB": Decimal("281.00")}},
                {"name": "Executive Suite", "capacity": 2, "rates": {"BB": Decimal("347.00"), "HB": Decimal("369.00"), "FB": Decimal("391.00")}}
            ]
        },
        {
            "name": "Mid Season",
            "start_day": 1,
            "start_month": 3,
            "end_day": 31,
            "end_month": 3,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"BB": Decimal("177.00"), "HB": Decimal("199.00"), "FB": Decimal("221.00")}},
                {"name": "STD Twin/Double", "capacity": 2, "rates": {"BB": Decimal("197.00"), "HB": Decimal("219.00"), "FB": Decimal("241.00")}},
                {"name": "STD Triple", "capacity": 3, "rates": {"BB": Decimal("267.00"), "HB": Decimal("289.00"), "FB": Decimal("311.00")}},
                {"name": "Deluxe Suite", "capacity": 2, "rates": {"BB": Decimal("217.00"), "HB": Decimal("239.00"), "FB": Decimal("261.00")}},
                {"name": "Executive Suite", "capacity": 2, "rates": {"BB": Decimal("337.00"), "HB": Decimal("359.00"), "FB": Decimal("381.00")}}
            ]
        },
        {
            "name": "Mid Season",
            "start_day": 1,
            "start_month": 11,
            "end_day": 15,
            "end_month": 12,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"BB": Decimal("177.00"), "HB": Decimal("199.00"), "FB": Decimal("221.00")}},
                {"name": "STD Twin/Double", "capacity": 2, "rates": {"BB": Decimal("197.00"), "HB": Decimal("219.00"), "FB": Decimal("241.00")}},
                {"name": "STD Triple", "capacity": 3, "rates": {"BB": Decimal("267.00"), "HB": Decimal("289.00"), "FB": Decimal("311.00")}},
                {"name": "Deluxe Suite", "capacity": 2, "rates": {"BB": Decimal("217.00"), "HB": Decimal("239.00"), "FB": Decimal("261.00")}},
                {"name": "Executive Suite", "capacity": 2, "rates": {"BB": Decimal("337.00"), "HB": Decimal("359.00"), "FB": Decimal("381.00")}}
            ]
        },
        {
            "name": "Low Season",
            "start_day": 1,
            "start_month": 4,
            "end_day": 31,
            "end_month": 5,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"BB": Decimal("167.00"), "HB": Decimal("189.00"), "FB": Decimal("211.00")}},
                {"name": "STD Twin/Double", "capacity": 2, "rates": {"BB": Decimal("187.00"), "HB": Decimal("209.00"), "FB": Decimal("231.00")}},
                {"name": "STD Triple", "capacity": 3, "rates": {"BB": Decimal("247.00"), "HB": Decimal("269.00"), "FB": Decimal("291.00")}},
                {"name": "Deluxe Suite", "capacity": 2, "rates": {"BB": Decimal("207.00"), "HB": Decimal("229.00"), "FB": Decimal("251.00")}},
                {"name": "Executive Suite", "capacity": 2, "rates": {"BB": Decimal("307.00"), "HB": Decimal("329.00"), "FB": Decimal("351.00")}}
            ]
        }
    ]
},

{
    "name": "Kerama Silent Lodge",
    "tag_label": "Lodge",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": None,
    "concession_fee_child_non_resident": None,
    "concession_fee_adult_resident": None,
    "concession_fee_child_resident": None,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Nestled in the heart of Arusha, Kerama Silent Lodge is a middle-luxury retreat set within a lush, natural environment, featuring 38 beautifully appointed rooms just minutes from the city centre, Arusha Airport, and the gateway to the northern safari circuit.",
        "Our accommodations range from Executive Deluxe rooms with heated Jacuzzi and private balconies overlooking Mt. Meru, to garden-view Deluxe rooms, private Villas, authentic African red-brick Cottages, and spacious Family Cottages with living rooms and fireplaces.",
        "Each room is thoughtfully equipped with air conditioning, flat-screen satellite TV, mini bar, safe deposit box, Wi-Fi, coffee-making facilities, en-suite bathrooms, and outdoor seating — ensuring a comfortable and memorable stay for every guest.",
        "Guests can unwind at the swimming pool, gather around the outdoor fireplace, stroll through the fresh vegetable farm, jog along scenic trails, or enjoy bird watching and rabbit-keeping activities — perfect for families, couples, and nature lovers alike.",
        "Known for warm Tanzanian hospitality, authentic African architecture, and serene garden surroundings, Kerama Silent Lodge is the ideal base for exploring Arusha, Arusha National Park, and the greater East African safari experience."
    ],
    "seasons": [
        {
            "name": "High Season (Jan-Mar)",
            "start_day": 1,
            "start_month": 1,
            "end_day": 15,
            "end_month": 3,
            "rooms": [
                {"name": "Executive Deluxe (Single)", "capacity": 1, "rates": {"BB": Decimal("150.00")}},
                {"name": "Executive Deluxe (Double)", "capacity": 2, "rates": {"BB": Decimal("180.00")}},
                {"name": "Executive Deluxe (Triple)", "capacity": 3, "rates": {"BB": Decimal("200.00")}},
                {"name": "Deluxe (Single)", "capacity": 1, "rates": {"BB": Decimal("130.00")}},
                {"name": "Deluxe (Double)", "capacity": 2, "rates": {"BB": Decimal("140.00")}},
                {"name": "Deluxe (Triple)", "capacity": 3, "rates": {"BB": Decimal("150.00")}},
                {"name": "Villa (Single)", "capacity": 1, "rates": {"BB": Decimal("150.00")}},
                {"name": "Villa (Double)", "capacity": 2, "rates": {"BB": Decimal("180.00")}},
                {"name": "Villa (Triple)", "capacity": 3, "rates": {"BB": Decimal("200.00")}},
                {"name": "Family Room", "capacity": 5, "rates": {"BB": Decimal("340.00")}},
                {"name": "Cottage (Single)", "capacity": 1, "rates": {"BB": Decimal("180.00")}},
                {"name": "Cottage (Double)", "capacity": 2, "rates": {"BB": Decimal("220.00")}},
                {"name": "Family Cottage", "capacity": 5, "rates": {"BB": Decimal("400.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1,
            "start_month": 6,
            "end_day": 31,
            "end_month": 10,
            "rooms": [
                {"name": "Executive Deluxe (Single)", "capacity": 1, "rates": {"BB": Decimal("150.00")}},
                {"name": "Executive Deluxe (Double)", "capacity": 2, "rates": {"BB": Decimal("180.00")}},
                {"name": "Executive Deluxe (Triple)", "capacity": 3, "rates": {"BB": Decimal("200.00")}},
                {"name": "Deluxe (Single)", "capacity": 1, "rates": {"BB": Decimal("130.00")}},
                {"name": "Deluxe (Double)", "capacity": 2, "rates": {"BB": Decimal("140.00")}},
                {"name": "Deluxe (Triple)", "capacity": 3, "rates": {"BB": Decimal("150.00")}},
                {"name": "Villa (Single)", "capacity": 1, "rates": {"BB": Decimal("150.00")}},
                {"name": "Villa (Double)", "capacity": 2, "rates": {"BB": Decimal("180.00")}},
                {"name": "Villa (Triple)", "capacity": 3, "rates": {"BB": Decimal("200.00")}},
                {"name": "Family Room", "capacity": 5, "rates": {"BB": Decimal("340.00")}},
                {"name": "Cottage (Single)", "capacity": 1, "rates": {"BB": Decimal("180.00")}},
                {"name": "Cottage (Double)", "capacity": 2, "rates": {"BB": Decimal("220.00")}},
                {"name": "Family Cottage", "capacity": 5, "rates": {"BB": Decimal("400.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 16,
            "start_month": 12,
            "end_day": 31,
            "end_month": 12,
            "rooms": [
                {"name": "Executive Deluxe (Single)", "capacity": 1, "rates": {"BB": Decimal("150.00")}},
                {"name": "Executive Deluxe (Double)", "capacity": 2, "rates": {"BB": Decimal("180.00")}},
                {"name": "Executive Deluxe (Triple)", "capacity": 3, "rates": {"BB": Decimal("200.00")}},
                {"name": "Deluxe (Single)", "capacity": 1, "rates": {"BB": Decimal("130.00")}},
                {"name": "Deluxe (Double)", "capacity": 2, "rates": {"BB": Decimal("140.00")}},
                {"name": "Deluxe (Triple)", "capacity": 3, "rates": {"BB": Decimal("150.00")}},
                {"name": "Villa (Single)", "capacity": 1, "rates": {"BB": Decimal("150.00")}},
                {"name": "Villa (Double)", "capacity": 2, "rates": {"BB": Decimal("180.00")}},
                {"name": "Villa (Triple)", "capacity": 3, "rates": {"BB": Decimal("200.00")}},
                {"name": "Family Room", "capacity": 5, "rates": {"BB": Decimal("340.00")}},
                {"name": "Cottage (Single)", "capacity": 1, "rates": {"BB": Decimal("180.00")}},
                {"name": "Cottage (Double)", "capacity": 2, "rates": {"BB": Decimal("220.00")}},
                {"name": "Family Cottage", "capacity": 5, "rates": {"BB": Decimal("400.00")}}
            ]
        },
        {
            "name": "Low Season (Apr-May)",
            "start_day": 1,
            "start_month": 4,
            "end_day": 31,
            "end_month": 5,
            "rooms": [
                {"name": "Executive Deluxe (Single)", "capacity": 1, "rates": {"BB": Decimal("130.00")}},
                {"name": "Executive Deluxe (Double)", "capacity": 2, "rates": {"BB": Decimal("150.00")}},
                {"name": "Executive Deluxe (Triple)", "capacity": 3, "rates": {"BB": Decimal("180.00")}},
                {"name": "Deluxe (Single)", "capacity": 1, "rates": {"BB": Decimal("90.00")}},
                {"name": "Deluxe (Double)", "capacity": 2, "rates": {"BB": Decimal("100.00")}},
                {"name": "Deluxe (Triple)", "capacity": 3, "rates": {"BB": Decimal("170.00")}},
                {"name": "Villa (Single)", "capacity": 1, "rates": {"BB": Decimal("100.00")}},
                {"name": "Villa (Double)", "capacity": 2, "rates": {"BB": Decimal("120.00")}},
                {"name": "Villa (Triple)", "capacity": 3, "rates": {"BB": Decimal("180.00")}},
                {"name": "Family Room", "capacity": 5, "rates": {"BB": Decimal("220.00")}},
                {"name": "Cottage (Single)", "capacity": 1, "rates": {"BB": Decimal("150.00")}},
                {"name": "Cottage (Double)", "capacity": 2, "rates": {"BB": Decimal("300.00")}},
                {"name": "Cottage (Triple)", "capacity": 3, "rates": {"BB": Decimal("350.00")}},
                {"name": "Family Cottage", "capacity": 5, "rates": {"BB": Decimal("400.00")}}
            ]
        },
        {
            "name": "Low Season (Nov-Dec)",
            "start_day": 1,
            "start_month": 11,
            "end_day": 15,
            "end_month": 12,
            "rooms": [
                {"name": "Executive Deluxe (Single)", "capacity": 1, "rates": {"BB": Decimal("130.00")}},
                {"name": "Executive Deluxe (Double)", "capacity": 2, "rates": {"BB": Decimal("150.00")}},
                {"name": "Executive Deluxe (Triple)", "capacity": 3, "rates": {"BB": Decimal("180.00")}},
                {"name": "Deluxe (Single)", "capacity": 1, "rates": {"BB": Decimal("90.00")}},
                {"name": "Deluxe (Double)", "capacity": 2, "rates": {"BB": Decimal("100.00")}},
                {"name": "Deluxe (Triple)", "capacity": 3, "rates": {"BB": Decimal("170.00")}},
                {"name": "Villa (Single)", "capacity": 1, "rates": {"BB": Decimal("100.00")}},
                {"name": "Villa (Double)", "capacity": 2, "rates": {"BB": Decimal("120.00")}},
                {"name": "Villa (Triple)", "capacity": 3, "rates": {"BB": Decimal("180.00")}},
                {"name": "Family Room", "capacity": 5, "rates": {"BB": Decimal("220.00")}},
                {"name": "Cottage (Single)", "capacity": 1, "rates": {"BB": Decimal("150.00")}},
                {"name": "Cottage (Double)", "capacity": 2, "rates": {"BB": Decimal("300.00")}},
                {"name": "Cottage (Triple)", "capacity": 3, "rates": {"BB": Decimal("350.00")}},
                {"name": "Family Cottage", "capacity": 5, "rates": {"BB": Decimal("400.00")}}
            ]
        }
    ]
},



{
    "name": "Gran Melia Arusha",
    "tag_label": "Hotel",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": None,
    "concession_fee_child_non_resident": None,
    "concession_fee_adult_resident": None,
    "concession_fee_child_resident": None,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Gran Melia Arusha is a landmark 5-star urban resort set against the breathtaking backdrop of Mount Meru, blending contemporary Spanish luxury with authentic Tanzanian warmth in the heart of Arusha city.",
        "Each elegantly appointed room and suite — from the Deluxe City View to the exclusive Red Level Presidential Suite — features floor-to-ceiling windows, refined African-inspired interiors, and sweeping views of the city, Mount Meru, or the lush surrounding highlands.",
        "Guests dine at the all-day Saba Saba restaurant, offering a vibrant fusion of international cuisine and local flavours, while the rooftop lounge, spa, and infinity pool provide the perfect retreat after a day of meetings or safari adventures.",
        "Ideally positioned as the gateway to the northern safari circuit, the hotel is just minutes from Arusha Airport and Kilimanjaro International Airport, making it the perfect first or last stop for discerning travellers and business guests alike.",
        "With world-class service, exclusive Red Level privileges, expansive conference facilities, and the signature Melia hospitality, Gran Melia Arusha redefines 5-star luxury in Tanzania — a truly unforgettable experience awaits."
    ],
    "seasons": [
        {
            "name": "High Season",
            "start_day": 4,
            "start_month": 1,
            "end_day": 28,
            "end_month": 2,
            "rooms": [
                {"name": "Deluxe City View (Single)", "capacity": 1, "rates": {"BB": Decimal("250.00")}},
                {"name": "Deluxe City View (Double)", "capacity": 2, "rates": {"BB": Decimal("315.00")}},
                {"name": "Interconnecting Deluxe City View", "capacity": 4, "rates": {"BB": Decimal("695.00")}},
                {"name": "Deluxe Mount Meru View (Single)", "capacity": 1, "rates": {"BB": Decimal("285.00")}},
                {"name": "Deluxe Mount Meru View (Double)", "capacity": 2, "rates": {"BB": Decimal("360.00")}},
                {"name": "Interconnecting Deluxe Mount Meru View", "capacity": 4, "rates": {"BB": Decimal("795.00")}},
                {"name": "Red Level Deluxe Mount Meru View (Single)", "capacity": 1, "rates": {"BB": Decimal("325.00")}},
                {"name": "Red Level Deluxe Mount Meru View (Double)", "capacity": 2, "rates": {"BB": Decimal("405.00")}},
                {"name": "Red Level Junior Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("540.00")}},
                {"name": "Red Level Junior Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("670.00")}},
                {"name": "Red Level Junior Suite - 2 Bedrooms", "capacity": 4, "rates": {"BB": Decimal("1190.00")}},
                {"name": "Red Level Grand Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("860.00")}},
                {"name": "Red Level Grand Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("1075.00")}},
                {"name": "Red Level Grand Suite - 2 Bedrooms", "capacity": 6, "rates": {"BB": Decimal("1630.00")}},
                {"name": "Red Level Presidential Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("1720.00")}},
                {"name": "Red Level Presidential Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("2150.00")}},
                {"name": "Red Level Presidential Suite - 2 Bedrooms", "capacity": 6, "rates": {"BB": Decimal("2815.00")}}
            ]
        },
        {
            "name": "Shoulder Season",
            "start_day": 1,
            "start_month": 3,
            "end_day": 31,
            "end_month": 3,
            "rooms": [
                {"name": "Deluxe City View (Single)", "capacity": 1, "rates": {"BB": Decimal("230.00")}},
                {"name": "Deluxe City View (Double)", "capacity": 2, "rates": {"BB": Decimal("285.00")}},
                {"name": "Interconnecting Deluxe City View", "capacity": 4, "rates": {"BB": Decimal("630.00")}},
                {"name": "Deluxe Mount Meru View (Single)", "capacity": 1, "rates": {"BB": Decimal("265.00")}},
                {"name": "Deluxe Mount Meru View (Double)", "capacity": 2, "rates": {"BB": Decimal("330.00")}},
                {"name": "Interconnecting Deluxe Mount Meru View", "capacity": 4, "rates": {"BB": Decimal("720.00")}},
                {"name": "Red Level Deluxe Mount Meru View (Single)", "capacity": 1, "rates": {"BB": Decimal("300.00")}},
                {"name": "Red Level Deluxe Mount Meru View (Double)", "capacity": 2, "rates": {"BB": Decimal("375.00")}},
                {"name": "Red Level Junior Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("495.00")}},
                {"name": "Red Level Junior Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("615.00")}},
                {"name": "Red Level Junior Suite - 2 Bedrooms", "capacity": 4, "rates": {"BB": Decimal("1090.00")}},
                {"name": "Red Level Grand Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("790.00")}},
                {"name": "Red Level Grand Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("985.00")}},
                {"name": "Red Level Grand Suite - 2 Bedrooms", "capacity": 6, "rates": {"BB": Decimal("1495.00")}},
                {"name": "Red Level Presidential Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("1580.00")}},
                {"name": "Red Level Presidential Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("1975.00")}},
                {"name": "Red Level Presidential Suite - 2 Bedrooms", "capacity": 6, "rates": {"BB": Decimal("2585.00")}}
            ]
        },
        {
            "name": "Low Season",
            "start_day": 1,
            "start_month": 4,
            "end_day": 31,
            "end_month": 5,
            "rooms": [
                {"name": "Deluxe City View (Single)", "capacity": 1, "rates": {"BB": Decimal("200.00")}},
                {"name": "Deluxe City View (Double)", "capacity": 2, "rates": {"BB": Decimal("250.00")}},
                {"name": "Interconnecting Deluxe City View", "capacity": 4, "rates": {"BB": Decimal("545.00")}},
                {"name": "Deluxe Mount Meru View (Single)", "capacity": 1, "rates": {"BB": Decimal("230.00")}},
                {"name": "Deluxe Mount Meru View (Double)", "capacity": 2, "rates": {"BB": Decimal("285.00")}},
                {"name": "Interconnecting Deluxe Mount Meru View", "capacity": 4, "rates": {"BB": Decimal("630.00")}},
                {"name": "Red Level Deluxe Mount Meru View (Single)", "capacity": 1, "rates": {"BB": Decimal("265.00")}},
                {"name": "Red Level Deluxe Mount Meru View (Double)", "capacity": 2, "rates": {"BB": Decimal("335.00")}},
                {"name": "Red Level Junior Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("440.00")}},
                {"name": "Red Level Junior Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("545.00")}},
                {"name": "Red Level Junior Suite - 2 Bedrooms", "capacity": 4, "rates": {"BB": Decimal("965.00")}},
                {"name": "Red Level Grand Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("655.00")}},
                {"name": "Red Level Grand Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("820.00")}},
                {"name": "Red Level Grand Suite - 2 Bedrooms", "capacity": 6, "rates": {"BB": Decimal("1265.00")}},
                {"name": "Red Level Presidential Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("1245.00")}},
                {"name": "Red Level Presidential Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("1560.00")}},
                {"name": "Red Level Presidential Suite - 2 Bedrooms", "capacity": 6, "rates": {"BB": Decimal("2080.00")}}
            ]
        },
        {
            "name": "Peak Season (Jun-Aug)",
            "start_day": 1,
            "start_month": 6,
            "end_day": 31,
            "end_month": 8,
            "rooms": [
                {"name": "Deluxe City View (Single)", "capacity": 1, "rates": {"BB": Decimal("305.00")}},
                {"name": "Deluxe City View (Double)", "capacity": 2, "rates": {"BB": Decimal("380.00")}},
                {"name": "Interconnecting Deluxe City View", "capacity": 4, "rates": {"BB": Decimal("840.00")}},
                {"name": "Deluxe Mount Meru View (Single)", "capacity": 1, "rates": {"BB": Decimal("345.00")}},
                {"name": "Deluxe Mount Meru View (Double)", "capacity": 2, "rates": {"BB": Decimal("425.00")}},
                {"name": "Interconnecting Deluxe Mount Meru View", "capacity": 4, "rates": {"BB": Decimal("940.00")}},
                {"name": "Red Level Deluxe Mount Meru View (Single)", "capacity": 1, "rates": {"BB": Decimal("380.00")}},
                {"name": "Red Level Deluxe Mount Meru View (Double)", "capacity": 2, "rates": {"BB": Decimal("475.00")}},
                {"name": "Red Level Junior Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("625.00")}},
                {"name": "Red Level Junior Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("780.00")}},
                {"name": "Red Level Junior Suite - 2 Bedrooms", "capacity": 4, "rates": {"BB": Decimal("1385.00")}},
                {"name": "Red Level Grand Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("1000.00")}},
                {"name": "Red Level Grand Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("1255.00")}},
                {"name": "Red Level Grand Suite - 2 Bedrooms", "capacity": 6, "rates": {"BB": Decimal("1895.00")}},
                {"name": "Red Level Presidential Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("2000.00")}},
                {"name": "Red Level Presidential Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("2505.00")}},
                {"name": "Red Level Presidential Suite - 2 Bedrooms", "capacity": 6, "rates": {"BB": Decimal("3275.00")}}
            ]
        },
        {
            "name": "Peak Season (Sep-Oct)",
            "start_day": 1,
            "start_month": 9,
            "end_day": 31,
            "end_month": 10,
            "rooms": [
                {"name": "Deluxe City View (Single)", "capacity": 1, "rates": {"BB": Decimal("305.00")}},
                {"name": "Deluxe City View (Double)", "capacity": 2, "rates": {"BB": Decimal("380.00")}},
                {"name": "Interconnecting Deluxe City View", "capacity": 4, "rates": {"BB": Decimal("840.00")}},
                {"name": "Deluxe Mount Meru View (Single)", "capacity": 1, "rates": {"BB": Decimal("345.00")}},
                {"name": "Deluxe Mount Meru View (Double)", "capacity": 2, "rates": {"BB": Decimal("425.00")}},
                {"name": "Interconnecting Deluxe Mount Meru View", "capacity": 4, "rates": {"BB": Decimal("940.00")}},
                {"name": "Red Level Deluxe Mount Meru View (Single)", "capacity": 1, "rates": {"BB": Decimal("380.00")}},
                {"name": "Red Level Deluxe Mount Meru View (Double)", "capacity": 2, "rates": {"BB": Decimal("475.00")}},
                {"name": "Red Level Junior Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("625.00")}},
                {"name": "Red Level Junior Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("780.00")}},
                {"name": "Red Level Junior Suite - 2 Bedrooms", "capacity": 4, "rates": {"BB": Decimal("1385.00")}},
                {"name": "Red Level Grand Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("1000.00")}},
                {"name": "Red Level Grand Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("1255.00")}},
                {"name": "Red Level Grand Suite - 2 Bedrooms", "capacity": 6, "rates": {"BB": Decimal("1895.00")}},
                {"name": "Red Level Presidential Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("2000.00")}},
                {"name": "Red Level Presidential Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("2505.00")}},
                {"name": "Red Level Presidential Suite - 2 Bedrooms", "capacity": 6, "rates": {"BB": Decimal("3275.00")}}
            ]
        },
        {
            "name": "Peak Season (Nov-Dec)",
            "start_day": 1,
            "start_month": 11,
            "end_day": 20,
            "end_month": 12,
            "rooms": [
                {"name": "Deluxe City View (Single)", "capacity": 1, "rates": {"BB": Decimal("305.00")}},
                {"name": "Deluxe City View (Double)", "capacity": 2, "rates": {"BB": Decimal("380.00")}},
                {"name": "Interconnecting Deluxe City View", "capacity": 4, "rates": {"BB": Decimal("840.00")}},
                {"name": "Deluxe Mount Meru View (Single)", "capacity": 1, "rates": {"BB": Decimal("345.00")}},
                {"name": "Deluxe Mount Meru View (Double)", "capacity": 2, "rates": {"BB": Decimal("425.00")}},
                {"name": "Interconnecting Deluxe Mount Meru View", "capacity": 4, "rates": {"BB": Decimal("940.00")}},
                {"name": "Red Level Deluxe Mount Meru View (Single)", "capacity": 1, "rates": {"BB": Decimal("380.00")}},
                {"name": "Red Level Deluxe Mount Meru View (Double)", "capacity": 2, "rates": {"BB": Decimal("475.00")}},
                {"name": "Red Level Junior Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("625.00")}},
                {"name": "Red Level Junior Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("780.00")}},
                {"name": "Red Level Junior Suite - 2 Bedrooms", "capacity": 4, "rates": {"BB": Decimal("1385.00")}},
                {"name": "Red Level Grand Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("1000.00")}},
                {"name": "Red Level Grand Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("1255.00")}},
                {"name": "Red Level Grand Suite - 2 Bedrooms", "capacity": 6, "rates": {"BB": Decimal("1895.00")}},
                {"name": "Red Level Presidential Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("2000.00")}},
                {"name": "Red Level Presidential Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("2505.00")}},
                {"name": "Red Level Presidential Suite - 2 Bedrooms", "capacity": 6, "rates": {"BB": Decimal("3275.00")}}
            ]
        }
    ]
},

{
    "name": "Arusha Explorers Lodge",
    "tag_label": "Lodge",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": None,
    "concession_fee_child_non_resident": None,
    "concession_fee_adult_resident": None,
    "concession_fee_child_resident": None,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Set in the tranquil outskirts of Arusha, Arusha Explorers Lodge is a warm and welcoming retreat perfectly positioned as the gateway to Tanzania's northern safari circuit, just a short drive from both Arusha and Kilimanjaro International Airports.",
        "The lodge offers a range of comfortable and spacious rooms — from cosy Singles to family-friendly units — each thoughtfully designed with natural wood furnishings, mosquito nets, and en-suite bathrooms, opening onto lush garden views.",
        "Guests can unwind at the sparkling swimming pool, enjoy a refreshing drink at the lounge bar, or simply relax in the serene garden surroundings after a day of adventure or business in Arusha.",
        "With free Wi-Fi throughout, a friendly multilingual team, and a reputation for genuine Tanzanian hospitality, the lodge provides excellent value for leisure travellers, families, and small groups alike.",
        "Whether you are beginning or ending your safari, Arusha Explorers Lodge offers a peaceful, comfortable, and convenient base — a true home away from home in the heart of Arusha."
    ],
    "seasons": [
        {
            "name": "Low Season",
            "start_day": 16,
            "start_month": 3,
            "end_day": 30,
            "end_month": 6,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"BB": Decimal("100.00"), "HB": Decimal("120.00")}},
                {"name": "Double/Twin", "capacity": 2, "rates": {"BB": Decimal("160.00"), "HB": Decimal("200.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"BB": Decimal("210.00"), "HB": Decimal("270.00")}},
                {"name": "Family Room", "capacity": 4, "rates": {"BB": Decimal("240.00"), "HB": Decimal("320.00")}}
            ]
        },
        {
            "name": "High Season",
            "start_day": 1,
            "start_month": 7,
            "end_day": 15,
            "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"BB": Decimal("100.00"), "HB": Decimal("120.00")}},
                {"name": "Double/Twin", "capacity": 2, "rates": {"BB": Decimal("160.00"), "HB": Decimal("200.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"BB": Decimal("210.00"), "HB": Decimal("270.00")}},
                {"name": "Family Room", "capacity": 4, "rates": {"BB": Decimal("240.00"), "HB": Decimal("320.00")}}
            ]
        }
    ]
},

{
    "name": "Arusha Serena Hotel",
    "tag_label": "Hotel",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": None,
    "concession_fee_child_non_resident": None,
    "concession_fee_adult_resident": None,
    "concession_fee_child_resident": None,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Arusha Serena Hotel is an elegant colonial-style retreat set on a working coffee farm on the outskirts of Arusha, offering a peaceful and luxurious gateway to the northern safari circuit.",
        "The hotel's beautifully appointed rooms feature en-suite facilities, elegant African-inspired decor, and views over the lush coffee gardens and surrounding highlands.",
        "Guests enjoy delicious bed-and-breakfast dining in a charming setting, a sparkling swimming pool, and warm Serena hospitality just minutes from Arusha city centre and the airport.",
        "The hotel's prime location provides easy access to Arusha National Park, local markets, and the cultural heritage of the Maasai and Meru communities.",
        "Combining colonial charm, modern comfort, and an ideal location, Arusha Serena Hotel is the perfect first or last stop for any Tanzanian safari adventure."
    ],
    "seasons": [
        {"name": "High Season (Jan-Mar)", "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"BB": Decimal("240.00")}},
            {"name": "Double", "capacity": 2, "rates": {"BB": Decimal("320.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"BB": Decimal("480.00")}}
         ]},
        {"name": "Green Season", "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"BB": Decimal("216.00")}},
            {"name": "Double", "capacity": 2, "rates": {"BB": Decimal("288.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"BB": Decimal("432.00")}}
         ]},
        {"name": "Peak Season (Jun-Oct)", "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"BB": Decimal("288.00")}},
            {"name": "Double", "capacity": 2, "rates": {"BB": Decimal("384.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"BB": Decimal("576.00")}}
         ]},
        {"name": "High Season (Nov-Dec)", "start_day": 1, "start_month": 11, "end_day": 22, "end_month": 12,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"BB": Decimal("240.00")}},
            {"name": "Double", "capacity": 2, "rates": {"BB": Decimal("320.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"BB": Decimal("480.00")}}
         ]},
        {"name": "Peak Season (Festive)", "start_day": 23, "start_month": 12, "end_day": 1, "end_month": 1,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"BB": Decimal("288.00")}},
            {"name": "Double", "capacity": 2, "rates": {"BB": Decimal("384.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"BB": Decimal("576.00")}}
         ]}
    ]
}


    ],

"Tarangire National Park":[
   {
    "name": "Tarangire Sopa Lodge",
    "tag_label": "Lodge",
    "park_status": "InsidePark",  
    "concession_fee_adult_non_resident": 47.20,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 40.00,
    "concession_fee_child_resident": 10.00,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Tarangire Sopa Lodge is a magnificent retreat nestled among ancient baobab trees and rolling savannah within the heart of Tarangire National Park, home to Tanzania's largest elephant population and breathtaking landscapes.",
        "The lodge's spacious rooms are housed in uniquely designed round buildings blending seamlessly with the surrounding wilderness, each featuring private balconies with sweeping views of the park's wildlife-rich plains and iconic baobabs.",
        "Guests can enjoy superb full-board and half-board dining at the lodge's restaurant, refreshing drinks at the bar, and a sparkling swimming pool overlooking a busy waterhole where elephants, zebras, and antelopes frequently gather.",
        "With its prime location, Tarangire Sopa Lodge offers exceptional game-viewing opportunities year-round, particularly during the dry season when wildlife congregates along the Tarangire River — a true photographer's and nature lover's paradise.",
        "Combining warm Tanzanian hospitality, elegant comfort, and unforgettable safari experiences, Tarangire Sopa Lodge is the perfect base for exploring one of Tanzania's most rewarding and less-crowded national parks."
    ],
    "seasons": [
        {
            "name": "High Season",
            "start_day": 1,
            "start_month": 7,
            "end_day": 31,
            "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("289.00"), "HB": Decimal("284.00")}},
                {"name": "Twin/Double", "capacity": 2, "rates": {"FB": Decimal("444.00"), "HB": Decimal("434.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("567.00"), "HB": Decimal("552.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 22,
            "start_month": 12,
            "end_day": 1,
            "end_month": 1,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("289.00"), "HB": Decimal("284.00")}},
                {"name": "Twin/Double", "capacity": 2, "rates": {"FB": Decimal("444.00"), "HB": Decimal("434.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("567.00"), "HB": Decimal("552.00")}}
            ]
        },
        {
            "name": "Mid Season (Jan-Mar)",
            "start_day": 2,
            "start_month": 1,
            "end_day": 31,
            "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("246.00"), "HB": Decimal("241.00")}},
                {"name": "Twin/Double", "capacity": 2, "rates": {"FB": Decimal("379.00"), "HB": Decimal("369.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("483.00"), "HB": Decimal("468.00")}}
            ]
        },
        {
            "name": "Mid Season (Jun)",
            "start_day": 1,
            "start_month": 6,
            "end_day": 30,
            "end_month": 6,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("246.00"), "HB": Decimal("241.00")}},
                {"name": "Twin/Double", "capacity": 2, "rates": {"FB": Decimal("379.00"), "HB": Decimal("369.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("483.00"), "HB": Decimal("468.00")}}
            ]
        },
        {
            "name": "Mid Season (Nov-Dec)",
            "start_day": 1,
            "start_month": 11,
            "end_day": 21,
            "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("246.00"), "HB": Decimal("241.00")}},
                {"name": "Twin/Double", "capacity": 2, "rates": {"FB": Decimal("379.00"), "HB": Decimal("369.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("483.00"), "HB": Decimal("468.00")}}
            ]
        },
        {
            "name": "Green Season",
            "start_day": 1,
            "start_month": 4,
            "end_day": 31,
            "end_month": 5,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("148.00"), "HB": Decimal("143.00")}},
                {"name": "Twin/Double", "capacity": 2, "rates": {"FB": Decimal("228.00"), "HB": Decimal("218.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("291.00"), "HB": Decimal("276.00")}}
            ]
        }
    ]
},

{
    "name": "Ang'ata Tarangire Camp",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",  # TODO: Badilisha kuwa "InsidePark" ukishaweka concession fees
    "concession_fee_adult_non_resident": 47.20,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 40.00,
    "concession_fee_child_resident": 10.00,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Ang'ata Tarangire Camp is an intimate 10-tent safari camp tucked away in a secluded corner of Tarangire National Park, close to the Kuro Airstrip and surrounded by ancient baobabs and wildlife-rich plains.",
        "Each spacious tent features comfortable beds, en-suite bathrooms, and a private veranda overlooking the wilderness, offering guests an authentic yet comfortable bush experience in the heart of Tanzania's elephant country.",
        "The camp is open throughout the year, allowing guests to witness Tarangire's spectacular seasonal wildlife movements, especially the famous elephant herds and the dramatic riverine ecosystem along the Tarangire River.",
        "Evenings at Ang'ata Tarangire are spent around the campfire under a star-filled sky, enjoying freshly prepared full-board cuisine and the distant sounds of the African bush — a truly magical safari experience.",
        "With its prime location, personalised service, and immersive natural setting, Ang'ata Tarangire Camp is the perfect choice for travellers seeking an authentic, small-scale tented camp adventure."
    ],
    "seasons": [
        {
            "name": "Low Season (Apr-Jun)",
            "start_day": 1,
            "start_month": 4,
            "end_day": 14,
            "end_month": 6,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("310.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("390.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("515.00")}}
            ]
        },
        {
            "name": "Low Season (Sep-Dec)",
            "start_day": 15,
            "start_month": 9,
            "end_day": 9,
            "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("310.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("390.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("515.00")}}
            ]
        },
        {
            "name": "High Season (Dec-Mar)",
            "start_day": 10,
            "start_month": 12,
            "end_day": 31,
            "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("355.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("415.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("535.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Sep)",
            "start_day": 15,
            "start_month": 6,
            "end_day": 14,
            "end_month": 9,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("355.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("415.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("535.00")}}
            ]
        }
    ]
},

{
    "name": "Serian Tarangire Camp",
    "tag_label": "Lodge",
    "park_status": "InsidePark",  # TODO: Tarangire iko InsidePark - ongeza concession fees
    "concession_fee_adult_non_resident": 47.20,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 40.00,
    "concession_fee_child_resident": 10.00,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Serian Tarangire Camp is an intimate safari camp nestled in a quiet corner of Tarangire National Park, surrounded by ancient baobabs and home to some of Tanzania's largest elephant herds.",
        "The camp's elegant tents feature en-suite bathrooms, comfortable bedding, and private verandas overlooking the wilderness, offering guests an authentic yet refined bush experience.",
        "Guests enjoy full-board dining prepared with fresh local ingredients, refreshing drinks at the bar, and evenings around the campfire listening to the sounds of the African night.",
        "Open throughout the year, Serian Tarangire provides exceptional year-round game viewing, with the dry season offering spectacular concentrations of wildlife along the Tarangire River.",
        "Combining warm hospitality, superb guiding, and an unrivalled location, Serian Tarangire Camp is the perfect choice for discerning safari travellers seeking an authentic Tarangire experience."
    ],
    "seasons": [
        {
            "name": "Low Season (Apr-May)",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("183.50")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("300.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("355.50")}}
            ]
        },
        {
            "name": "Low Season (Nov)",
            "start_day": 1, "start_month": 11, "end_day": 30, "end_month": 11,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("183.50")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("300.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("355.50")}}
            ]
        },
        {
            "name": "Shoulder Season (Oct)",
            "start_day": 15, "start_month": 10, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("200.50")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("317.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("412.50")}}
            ]
        },
        {
            "name": "Shoulder Season (Dec)",
            "start_day": 1, "start_month": 12, "end_day": 15, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("200.50")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("317.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("412.50")}}
            ]
        },
        {
            "name": "High Season (Dec-Mar)",
            "start_day": 16, "start_month": 12, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("290.50")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("477.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("535.50")}}
            ]
        },
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 14, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("290.50")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("477.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("535.50")}}
            ]
        }
    ]
},


{
    "name": "Olkarien Eco Safari Camp",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",  # TODO: Verify location
    "concession_fee_adult_non_resident": 47.20,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 40.00,
    "concession_fee_child_resident": 10.00,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Olkarien Eco Safari Camp is an eco-conscious tented retreat set in a pristine wilderness area near Tarangire, designed to blend harmoniously with its natural surroundings while offering exceptional comfort.",
        "Each tent is elegantly furnished with en-suite facilities, comfortable beds, and private verandas where guests can unwind while taking in the serene African bush and its abundant birdlife.",
        "The camp operates on sustainable principles, using solar power and eco-friendly practices, making it an ideal choice for environmentally conscious travellers seeking a genuine safari experience.",
        "Guests enjoy delicious full-board meals, attentive service, and evenings around the fire under a canopy of stars, with the sounds of the wild providing a magical soundtrack.",
        "With access to superb game-viewing areas and a strong commitment to conservation, Olkarien Eco Safari Camp offers a unique blend of luxury, authenticity, and environmental responsibility."
    ],
    "seasons": [
        {
            "name": "Low Season (Apr-May)",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("375.50")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("647.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("820.50")}}
            ]
        },
        {
            "name": "Low Season (Nov)",
            "start_day": 1, "start_month": 11, "end_day": 30, "end_month": 11,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("375.50")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("647.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("820.50")}}
            ]
        },
        {
            "name": "Shoulder Season (Oct)",
            "start_day": 15, "start_month": 10, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("404.50")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("705.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("907.50")}}
            ]
        },
        {
            "name": "Shoulder Season (Dec)",
            "start_day": 1, "start_month": 12, "end_day": 15, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("404.50")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("705.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("907.50")}}
            ]
        },
        {
            "name": "High Season (Dec-Mar)",
            "start_day": 16, "start_month": 12, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("407.50")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("775.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("967.50")}}
            ]
        },
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 14, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("407.50")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("775.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("967.50")}}
            ]
        }
    ]
},

{
    "name": "Tarangire Kati Kati",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 47.20,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 40.00,
    "concession_fee_child_resident": 10.00,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Tarangire Kati Kati is an authentic mobile-style tented camp set in the heart of Tarangire National Park, surrounded by ancient baobabs and home to Tanzania's largest elephant herds.",
        "Each comfortable tent features en-suite facilities, cosy bedding, and a private veranda where guests can relax while watching wildlife wander past the camp.",
        "Guests enjoy hearty full-board meals, refreshing drinks, and evenings around the campfire under a sky blazing with stars — the essence of a true African safari.",
        "Open all year round, the camp offers exceptional game viewing, especially during the dry season when elephants, zebras, and predators congregate along the Tarangire River.",
        "Combining authentic bush charm, warm hospitality, and an unbeatable location, Tarangire Kati Kati is the perfect base for an unforgettable Tarangire adventure."
    ],
    "seasons": [
        {
            "name": "High Season (Jan-Mar)",
            "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("262.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("364.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("471.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("262.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("364.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("471.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 16, "start_month": 12, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("262.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("364.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("471.00")}}
            ]
        },
        {
            "name": "Shoulder Season",
            "start_day": 1, "start_month": 11, "end_day": 15, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("239.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("332.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("432.00")}}
            ]
        },
        {
            "name": "Low Season",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("217.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("302.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("393.00")}}
            ]
        }
    ]
},
{
    "name": "Tarangire Tortilis Camp",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 47.20,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 40.00,
    "concession_fee_child_resident": 10.00,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Tarangire Tortilis Camp is an authentic tented retreat set in the heart of Tarangire National Park, surrounded by ancient baobab trees and home to Tanzania's largest elephant herds.",
        "Each comfortable tent features en-suite facilities, cosy bedding, and a private veranda overlooking the wildlife-rich plains where zebras, elephants, and predators roam freely.",
        "Guests enjoy delicious full-board dining, refreshing drinks, and evenings around the campfire under a sky blazing with stars — the essence of a true African safari.",
        "The camp's prime location offers exceptional year-round game viewing, especially during the dry season when wildlife congregates along the Tarangire River.",
        "Combining authentic bush charm, warm hospitality, and an unbeatable location, Tarangire Tortilis Camp is the perfect base for an unforgettable Tarangire adventure."
    ],
    "seasons": [
        {
            "name": "High Season (Jan-Feb)",
            "start_day": 1, "start_month": 1, "end_day": 28, "end_month": 2,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("230.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("380.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("525.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("230.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("380.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("525.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 16, "start_month": 12, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("230.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("380.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("525.00")}}
            ]
        },
        {
            "name": "Low Season (Mar)",
            "start_day": 1, "start_month": 3, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("165.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("268.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("372.00")}}
            ]
        },
        {
            "name": "Low Season (Nov-Dec 15)",
            "start_day": 1, "start_month": 11, "end_day": 15, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("165.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("268.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("372.00")}}
            ]
        },
        {
            "name": "Special Offer Season",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("99.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("198.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("297.00")}}
            ]
        }
    ]
},


{
    "name": "Burunge Tented Lodge",
    "tag_label": "TentedCamp",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": 47.20,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 40.00,
    "concession_fee_child_resident": 10.00,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Burunge Tented Lodge is a charming tented retreat overlooking the shimmering Lake Burunge, on the edge of Tarangire National Park, offering spectacular views and abundant birdlife.",
        "The lodge's spacious tents feature en-suite facilities, comfortable beds, and private verandas facing the lake, where guests can watch flamingos, pelicans, and wildlife gather at the water's edge.",
        "Guests enjoy delicious full-board dining, refreshing drinks at the bar, and a refreshing swimming pool — perfect for unwinding after a day of game drives in nearby Tarangire.",
        "The lodge's unique position between Tarangire and Lake Manyara makes it an ideal base for exploring multiple northern circuit highlights, including the Great Rift Valley.",
        "Combining comfort, excellent value, and a stunning natural setting, Burunge Tented Lodge offers an unforgettable Tanzanian safari experience."
    ],
    "seasons": [
        {
            "name": "High Season (Jan-Mar)",
            "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("175.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("248.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("324.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("175.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("248.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("324.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 16, "start_month": 12, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("175.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("248.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("324.00")}}
            ]
        },
        {
            "name": "Shoulder Season",
            "start_day": 1, "start_month": 11, "end_day": 15, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("151.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("214.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("282.00")}}
            ]
        },
        {
            "name": "Low Season",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("126.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("182.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("240.00")}}
            ]
        }
    ]
},
{
    "name": "Lake Burunge Baobab Tented Lodge",
    "tag_label": "TentedCamp",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": 47.20,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 40.00,
    "concession_fee_child_resident": 10.00,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Lake Burunge Baobab Tented Lodge is a premium retreat set among iconic baobab trees overlooking Lake Burunge, offering a luxurious and serene escape near Tarangire National Park.",
        "The lodge features elegantly designed tents, bungalows, superior suites, and family suites — each thoughtfully furnished with en-suite facilities, private verandas, and premium amenities for discerning travellers.",
        "Guests enjoy exceptional full-board dining, drinks including local beers and house wines, and a stunning swimming pool with sweeping views of the lake and surrounding wilderness.",
        "The lodge's strategic location offers easy access to Tarangire's legendary elephant herds, Lake Manyara, and the cultural richness of the Maasai and Iraqw communities.",
        "Combining premium comfort, refined service, and a spectacular natural setting, Lake Burunge Baobab Tented Lodge is the ultimate northern circuit luxury retreat."
    ],
    "seasons": [
        {
            "name": "High Season (Jan-Mar)",
            "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Tent (Single)", "capacity": 1, "rates": {"FB": Decimal("195.00")}},
                {"name": "Tent (Double)", "capacity": 2, "rates": {"FB": Decimal("288.00")}},
                {"name": "Bungalow (Max 3)", "capacity": 3, "rates": {"FB": Decimal("384.00")}},
                {"name": "Superior Suite", "capacity": 2, "rates": {"FB": Decimal("500.00")}},
                {"name": "Superior Family Suite (2 rooms)", "capacity": 4, "rates": {"FB": Decimal("1000.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Tent (Single)", "capacity": 1, "rates": {"FB": Decimal("195.00")}},
                {"name": "Tent (Double)", "capacity": 2, "rates": {"FB": Decimal("288.00")}},
                {"name": "Bungalow (Max 3)", "capacity": 3, "rates": {"FB": Decimal("384.00")}},
                {"name": "Superior Suite", "capacity": 2, "rates": {"FB": Decimal("500.00")}},
                {"name": "Superior Family Suite (2 rooms)", "capacity": 4, "rates": {"FB": Decimal("1000.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 16, "start_month": 12, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Tent (Single)", "capacity": 1, "rates": {"FB": Decimal("195.00")}},
                {"name": "Tent (Double)", "capacity": 2, "rates": {"FB": Decimal("288.00")}},
                {"name": "Bungalow (Max 3)", "capacity": 3, "rates": {"FB": Decimal("384.00")}},
                {"name": "Superior Suite", "capacity": 2, "rates": {"FB": Decimal("500.00")}},
                {"name": "Superior Family Suite (2 rooms)", "capacity": 4, "rates": {"FB": Decimal("1000.00")}}
            ]
        },
        {
            "name": "Shoulder Season",
            "start_day": 1, "start_month": 11, "end_day": 15, "end_month": 12,
            "rooms": [
                {"name": "Tent (Single)", "capacity": 1, "rates": {"FB": Decimal("171.00")}},
                {"name": "Tent (Double)", "capacity": 2, "rates": {"FB": Decimal("254.00")}},
                {"name": "Bungalow (Max 3)", "capacity": 3, "rates": {"FB": Decimal("342.00")}},
                {"name": "Superior Suite", "capacity": 2, "rates": {"FB": Decimal("450.00")}},
                {"name": "Superior Family Suite (2 rooms)", "capacity": 4, "rates": {"FB": Decimal("900.00")}}
            ]
        },
        {
            "name": "Low Season",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Tent (Single)", "capacity": 1, "rates": {"FB": Decimal("146.00")}},
                {"name": "Tent (Double)", "capacity": 2, "rates": {"FB": Decimal("222.00")}},
                {"name": "Bungalow (Max 3)", "capacity": 3, "rates": {"FB": Decimal("300.00")}},
                {"name": "Superior Suite", "capacity": 2, "rates": {"FB": Decimal("400.00")}},
                {"name": "Superior Family Suite (2 rooms)", "capacity": 4, "rates": {"FB": Decimal("800.00")}}
            ]
        }
    ]
},

{
    "name": "Maramboi Tented Lodge",
    "tag_label": "TentedCamp",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": 47.20,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 40.00,
    "concession_fee_child_resident": 10.00,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Maramboi Tented Lodge is a premium tented retreat set on the shores of Lake Manyara with sweeping views of the Rift Valley escarpment and surrounding wildlife corridors.",
        "The lodge offers elegant tents, luxurious suite tents with or without private swimming pools, and expansive superior family suites — each designed for maximum comfort and privacy.",
        "Guests enjoy exceptional full-board dining with drinks included, a stunning swimming pool, and spectacular sunsets over the lake — a photographer's dream come true.",
        "The lodge's prime location offers easy access to Tarangire National Park, Lake Manyara National Park, and the cultural richness of the Maasai and Datoga communities.",
        "Combining premium luxury, personalised service, and a breathtaking natural setting, Maramboi Tented Lodge is the ultimate northern circuit retreat — reopening in 2026."
    ],
    "seasons": [
        {
            "name": "High Season (Jan-Mar)",
            "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Tent (Single)", "capacity": 1, "rates": {"FB": Decimal("286.00")}},
                {"name": "Tent (Double)", "capacity": 2, "rates": {"FB": Decimal("402.00")}},
                {"name": "Tent (Triple)", "capacity": 3, "rates": {"FB": Decimal("525.00")}},
                {"name": "Suite Tent with Pool (Max 2)", "capacity": 2, "rates": {"FB": Decimal("620.00")}},
                {"name": "Suite Tent without Pool (Max 2)", "capacity": 2, "rates": {"FB": Decimal("520.00")}},
                {"name": "Superior Family Suite with Pool", "capacity": 4, "rates": {"FB": Decimal("1240.00")}},
                {"name": "Superior Family Suite without Pool", "capacity": 4, "rates": {"FB": Decimal("1040.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Tent (Single)", "capacity": 1, "rates": {"FB": Decimal("286.00")}},
                {"name": "Tent (Double)", "capacity": 2, "rates": {"FB": Decimal("402.00")}},
                {"name": "Tent (Triple)", "capacity": 3, "rates": {"FB": Decimal("525.00")}},
                {"name": "Suite Tent with Pool (Max 2)", "capacity": 2, "rates": {"FB": Decimal("620.00")}},
                {"name": "Suite Tent without Pool (Max 2)", "capacity": 2, "rates": {"FB": Decimal("520.00")}},
                {"name": "Superior Family Suite with Pool", "capacity": 4, "rates": {"FB": Decimal("1240.00")}},
                {"name": "Superior Family Suite without Pool", "capacity": 4, "rates": {"FB": Decimal("1040.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 16, "start_month": 12, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Tent (Single)", "capacity": 1, "rates": {"FB": Decimal("286.00")}},
                {"name": "Tent (Double)", "capacity": 2, "rates": {"FB": Decimal("402.00")}},
                {"name": "Tent (Triple)", "capacity": 3, "rates": {"FB": Decimal("525.00")}},
                {"name": "Suite Tent with Pool (Max 2)", "capacity": 2, "rates": {"FB": Decimal("620.00")}},
                {"name": "Suite Tent without Pool (Max 2)", "capacity": 2, "rates": {"FB": Decimal("520.00")}},
                {"name": "Superior Family Suite with Pool", "capacity": 4, "rates": {"FB": Decimal("1240.00")}},
                {"name": "Superior Family Suite without Pool", "capacity": 4, "rates": {"FB": Decimal("1040.00")}}
            ]
        },
        {
            "name": "Shoulder Season",
            "start_day": 1, "start_month": 11, "end_day": 15, "end_month": 12,
            "rooms": [
                {"name": "Tent (Single)", "capacity": 1, "rates": {"FB": Decimal("258.00")}},
                {"name": "Tent (Double)", "capacity": 2, "rates": {"FB": Decimal("364.00")}},
                {"name": "Tent (Triple)", "capacity": 3, "rates": {"FB": Decimal("477.00")}},
                {"name": "Suite Tent with Pool (Max 2)", "capacity": 2, "rates": {"FB": Decimal("570.00")}},
                {"name": "Suite Tent without Pool (Max 2)", "capacity": 2, "rates": {"FB": Decimal("470.00")}},
                {"name": "Superior Family Suite with Pool", "capacity": 4, "rates": {"FB": Decimal("1140.00")}},
                {"name": "Superior Family Suite without Pool", "capacity": 4, "rates": {"FB": Decimal("940.00")}}
            ]
        },
        {
            "name": "Low Season",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Tent (Single)", "capacity": 1, "rates": {"FB": Decimal("231.00")}},
                {"name": "Tent (Double)", "capacity": 2, "rates": {"FB": Decimal("328.00")}},
                {"name": "Tent (Triple)", "capacity": 3, "rates": {"FB": Decimal("432.00")}},
                {"name": "Suite Tent with Pool (Max 2)", "capacity": 2, "rates": {"FB": Decimal("520.00")}},
                {"name": "Suite Tent without Pool (Max 2)", "capacity": 2, "rates": {"FB": Decimal("420.00")}},
                {"name": "Superior Family Suite with Pool", "capacity": 4, "rates": {"FB": Decimal("1040.00")}},
                {"name": "Superior Family Suite without Pool", "capacity": 4, "rates": {"FB": Decimal("840.00")}}
            ]
        }
    ]
},

{
    "name": "Tarangire Kuro Treetops Lodge",
    "tag_label": "Lodge",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 47.20,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 40.00,
    "concession_fee_child_resident": 10.00,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Tarangire Kuro Treetops Lodge is a luxurious all-inclusive retreat set among ancient baobabs and acacia trees in the heart of Tarangire National Park, offering breathtaking views over the wildlife-rich plains.",
        "The lodge's elegant rooms feature en-suite facilities, refined African decor, and private verandas overlooking the iconic landscapes of Tarangire, home to Tanzania's largest elephant herds.",
        "Guests enjoy exceptional all-inclusive dining with selected beverages and laundry, a stunning swimming pool, and evenings under the stars with the sounds of the bush.",
        "The lodge's prime location offers exceptional year-round game viewing, especially during the dry season when wildlife congregates along the Tarangire River.",
        "Combining luxury, exclusivity, and an unrivalled location, Tarangire Kuro Treetops Lodge is the ultimate Tarangire retreat."
    ],
    "seasons": [
        {"name": "Peak Season (Jul-Oct)", "start_day": 1, "start_month": 7, "end_day": 31, "end_month": 10,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"AI": Decimal("1430.00")}},
            {"name": "Double", "capacity": 2, "rates": {"AI": Decimal("1790.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"AI": Decimal("2685.00")}}
         ]},
        {"name": "Peak Season (Festive)", "start_day": 20, "start_month": 12, "end_day": 31, "end_month": 12,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"AI": Decimal("1430.00")}},
            {"name": "Double", "capacity": 2, "rates": {"AI": Decimal("1790.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"AI": Decimal("2685.00")}}
         ]},
        {"name": "High Season (Jun)", "start_day": 1, "start_month": 6, "end_day": 30, "end_month": 6,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"AI": Decimal("1270.00")}},
            {"name": "Double", "capacity": 2, "rates": {"AI": Decimal("1590.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"AI": Decimal("2385.00")}}
         ]},
        {"name": "High Season (Nov-Dec 19)", "start_day": 1, "start_month": 11, "end_day": 19, "end_month": 12,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"AI": Decimal("1270.00")}},
            {"name": "Double", "capacity": 2, "rates": {"AI": Decimal("1590.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"AI": Decimal("2385.00")}}
         ]},
        {"name": "Low Season (Jan-Mar)", "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"AI": Decimal("955.00")}},
            {"name": "Double", "capacity": 2, "rates": {"AI": Decimal("1190.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"AI": Decimal("1785.00")}}
         ]}
    ]
},

{
    "name": "Nyikani Tarangire Camp",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 47.20,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 40.00,
    "concession_fee_child_resident": 10.00,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Nyikani Tarangire Camp is an intimate tented retreat set in the heart of Tarangire National Park, surrounded by ancient baobabs and the wildlife-rich plains that make this park one of Tanzania's hidden gems.",
        "Each comfortable tent features en-suite facilities, cosy bedding, and a private veranda where guests can relax while watching elephants, zebras, and predators wander past the camp.",
        "Guests enjoy delicious full-board dining, complimentary drinking water, tea, and coffee, and evenings around the campfire under a sky blazing with stars.",
        "The camp's prime location offers exceptional year-round game viewing, especially during the dry season when wildlife congregates along the Tarangire River.",
        "Combining authentic bush charm, warm Tanzanian hospitality, and an unbeatable location, Nyikani Tarangire Camp is the perfect base for an unforgettable Tarangire adventure."
    ],
    "seasons": [
        {
            "name": "Peak Season",
            "start_day": 1, "start_month": 7, "end_day": 3, "end_month": 1,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"FB": Decimal("360.00")}},
                {"name": "Double Room", "capacity": 2, "rates": {"FB": Decimal("480.00")}},
                {"name": "Triple Room", "capacity": 3, "rates": {"FB": Decimal("720.00")}},
                {"name": "Family Tent", "capacity": 4, "rates": {"FB": Decimal("960.00")}}
            ]
        },
        {
            "name": "Low Season",
            "start_day": 11, "start_month": 1, "end_day": 19, "end_month": 12,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"FB": Decimal("160.00")}},
                {"name": "Double Room", "capacity": 2, "rates": {"FB": Decimal("320.00")}},
                {"name": "Triple Room", "capacity": 3, "rates": {"FB": Decimal("480.00")}},
                {"name": "Family Tent", "capacity": 4, "rates": {"FB": Decimal("640.00")}}
            ]
        }
    ]
}

],





"Serengeti National Park":[ # ---------------------------s-e-r-e-n-g-e-t-i--------------------

{
    "name": "Ang'ata Serengeti Camp",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",  
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Ang'ata Serengeti Camp is a classic 18-tent safari camp set in the Seronera area of Central Serengeti, surrounded by endless plains teeming with wildlife and renowned for its exceptional year-round game viewing.",
        "Each well-appointed tent offers en-suite facilities, comfortable bedding, and a private veranda where guests can relax while watching the timeless rhythm of the Serengeti unfold before them.",
        "The camp is open throughout the year, making it an ideal base for exploring the Seronera Valley's resident predators, the Great Migration corridors, and the iconic acacia-dotted landscapes of Central Serengeti.",
        "Guests enjoy delicious full-board meals in the camp's dining area, refreshing drinks under the stars, and the warm hospitality of an experienced team dedicated to making every safari unforgettable.",
        "Combining authentic tented-camp charm with modern comfort and an unbeatable location, Ang'ata Serengeti Camp delivers a truly immersive Serengeti experience."
    ],
    "seasons": [
        {
            "name": "Low Season (Apr-Jun)",
            "start_day": 1,
            "start_month": 4,
            "end_day": 14,
            "end_month": 6,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("335.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("415.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("535.00")}}
            ]
        },
        {
            "name": "Low Season (Sep-Dec)",
            "start_day": 15,
            "start_month": 9,
            "end_day": 9,
            "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("335.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("415.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("535.00")}}
            ]
        },
        {
            "name": "High Season (Dec-Mar)",
            "start_day": 10,
            "start_month": 12,
            "end_day": 31,
            "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("360.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("515.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("635.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Sep)",
            "start_day": 15,
            "start_month": 6,
            "end_day": 14,
            "end_month": 9,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("360.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("515.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("635.00")}}
            ]
        }
    ]
},
{
    "name": "Ang'ata Kimarishe Camp",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",  # TODO: Badilisha kuwa "InsidePark" ukishaweka concession fees
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Ang'ata Kimarishe Camp is an intimate 12-tent safari camp located in the Kimarishe area of the Serengeti ecosystem, surrounded by pristine wilderness and abundant wildlife away from the busier central circuits.",
        "The camp's spacious tents feature comfortable beds, en-suite bathrooms, and private verandas, offering guests a peaceful and private retreat in the heart of the African bush.",
        "Open throughout the year, Kimarishe Camp provides excellent access to seasonal wildlife movements, predator sightings, and the spectacular landscapes that make the Serengeti one of the world's greatest natural wonders.",
        "Guests are treated to freshly prepared full-board cuisine, attentive service, and unforgettable evenings under the vast African sky — the essence of an authentic safari adventure.",
        "For travellers seeking a quieter, more exclusive Serengeti experience without compromising on comfort, Ang'ata Kimarishe Camp is an exceptional choice."
    ],
    "seasons": [
        {
            "name": "Low Season (Apr-Jun)",
            "start_day": 1,
            "start_month": 4,
            "end_day": 14,
            "end_month": 6,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("335.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("415.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("535.00")}}
            ]
        },
        {
            "name": "Low Season (Sep-Dec)",
            "start_day": 15,
            "start_month": 9,
            "end_day": 9,
            "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("335.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("415.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("535.00")}}
            ]
        },
        {
            "name": "High Season (Dec-Mar)",
            "start_day": 10,
            "start_month": 12,
            "end_day": 31,
            "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("360.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("515.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("635.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Sep)",
            "start_day": 15,
            "start_month": 6,
            "end_day": 14,
            "end_month": 9,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("360.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("515.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("635.00")}}
            ]
        }
    ]
},
{
    "name": "Enkirari Wilderness Camp",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Enkirari Wilderness Camp is a secluded tented retreat set deep within Tanzania's untamed wilderness, offering guests an authentic safari experience far from the crowds.",
        "The camp's comfortable tents feature en-suite bathrooms, cosy bedding, and private verandas overlooking the surrounding bush, where wildlife often wanders past.",
        "Guests enjoy freshly prepared full-board cuisine in the camp's dining area, refreshing drinks at the bar, and unforgettable evenings around the campfire under the stars.",
        "With expert guides and access to prime game-viewing areas, Enkirari Wilderness Camp offers superb opportunities to spot the Big Five and witness the drama of the African bush.",
        "Combining rustic charm, modern comfort, and genuine Tanzanian hospitality, Enkirari Wilderness Camp is an excellent choice for travellers seeking an off-the-beaten-path safari adventure."
    ],
    "seasons": [
        {
            "name": "Low Season (Apr-May)",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("190.50")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("263.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("379.50")}}
            ]
        },
        {
            "name": "Low Season (Nov)",
            "start_day": 1, "start_month": 11, "end_day": 30, "end_month": 11,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("190.50")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("263.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("379.50")}}
            ]
        },
        {
            "name": "Shoulder Season (Oct)",
            "start_day": 15, "start_month": 10, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("210.50")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("295.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("430.50")}}
            ]
        },
        {
            "name": "Shoulder Season (Dec)",
            "start_day": 1, "start_month": 12, "end_day": 15, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("210.50")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("295.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("430.50")}}
            ]
        },
        {
            "name": "High Season (Dec-Mar)",
            "start_day": 16, "start_month": 12, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("228.50")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("367.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("451.50")}}
            ]
        },
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 14, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("228.50")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("367.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("451.50")}}
            ]
        }
    ]
},
{
    "name": "Enkutoto Migration Camp",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident":  11.80,
    "concession_fee_adult_resident":  35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Enkutoto Migration Camp is a mobile safari camp that follows the Great Migration across the Serengeti ecosystem, positioning guests at the heart of the action as wildebeest and zebra thunder across the plains.",
        "The camp's comfortable tents feature en-suite facilities, cosy bedding, and private verandas offering front-row seats to one of nature's greatest spectacles.",
        "Guests enjoy freshly prepared full-board meals, refreshing drinks, and evenings around the fire reliving the day's extraordinary wildlife encounters with expert guides.",
        "With its strategic seasonal positioning, Enkutoto Migration Camp offers unrivalled access to river crossings, predator action, and the raw drama of the migration.",
        "For travellers seeking the ultimate Serengeti migration experience, Enkutoto Migration Camp delivers authenticity, comfort, and unforgettable memories."
    ],
    "seasons": [
        {
            "name": "Low Season (Jan-May)",
            "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("221.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("314.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("465.00")}}
            ]
        },
        {
            "name": "Low Season (Nov)",
            "start_day": 1, "start_month": 11, "end_day": 30, "end_month": 11,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("221.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("314.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("465.00")}}
            ]
        },
        {
            "name": "Shoulder Season (Jun 1-15)",
            "start_day": 1, "start_month": 6, "end_day": 15, "end_month": 6,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("350.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("530.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("765.00")}}
            ]
        },
        {
            "name": "Shoulder Season (Dec)",
            "start_day": 1, "start_month": 12, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("350.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("530.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("765.00")}}
            ]
        },
        {
            "name": "High Season (Jun 16-Sep)",
            "start_day": 16, "start_month": 6, "end_day": 30, "end_month": 9,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("340.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("650.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("855.00")}}
            ]
        },
        {
            "name": "High Season (Oct)",
            "start_day": 1, "start_month": 10, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("340.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("650.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("855.00")}}
            ]
        }
    ]
},
{
    "name": "Serengeti Kati Kati",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Serengeti Kati Kati is an authentic mobile-style tented camp set in the heart of the Central Serengeti, offering guests an immersive safari experience in one of the world's greatest wildlife destinations.",
        "Each comfortable tent features en-suite facilities, cosy bedding, and a private veranda overlooking the endless plains, where the sounds and sights of the wild are constant companions.",
        "Guests enjoy hearty full-board meals, refreshing drinks, and evenings around the campfire under a sky blazing with stars — the essence of a true African safari.",
        "Open all year round, the camp offers exceptional game viewing, especially during the Great Migration when millions of wildebeest and zebra thunder across the plains.",
        "Combining authentic bush charm, warm hospitality, and an unbeatable location, Serengeti Kati Kati is the perfect base for an unforgettable Serengeti adventure."
    ],
    "seasons": [
        {
            "name": "High Season (Jan-Mar)",
            "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("262.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("364.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("471.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("262.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("364.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("471.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 16, "start_month": 12, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("262.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("364.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("471.00")}}
            ]
        },
        {
            "name": "Shoulder Season",
            "start_day": 1, "start_month": 11, "end_day": 15, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("239.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("332.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("432.00")}}
            ]
        },
        {
            "name": "Low Season",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("217.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("302.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("393.00")}}
            ]
        }
    ]
},

{
    "name": "Ndutu Kati Kati",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Ndutu Kati Kati is a seasonal mobile camp set in the Ndutu area of the Ngorongoro Conservation Area, positioned to follow the Great Migration during the calving season from December to March.",
        "Each comfortable tent features en-suite facilities, cosy bedding, and a private veranda overlooking the short-grass plains where wildebeest and zebra congregate in their thousands.",
        "Guests enjoy hearty full-board meals, refreshing drinks, and evenings around the campfire under a sky blazing with stars — the essence of a true African safari.",
        "The camp's strategic location offers unrivalled access to predator action, calving grounds, and the spectacular wildlife drama of the southern Serengeti ecosystem.",
        "Combining authentic bush charm, warm hospitality, and an unbeatable location, Ndutu Kati Kati is the perfect base for an unforgettable migration adventure."
    ],
    "seasons": [
        {
            "name": "High Season (Jan-Mar)",
            "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("262.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("364.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("471.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("262.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("364.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("471.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 16, "start_month": 12, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("262.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("364.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("471.00")}}
            ]
        },
        {
            "name": "Shoulder Season",
            "start_day": 1, "start_month": 11, "end_day": 15, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("239.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("332.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("432.00")}}
            ]
        },
        {
            "name": "Low Season",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("217.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("302.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("393.00")}}
            ]
        }
    ]
},

{
    "name": "Mara Kati Kati",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Mara Kati Kati is a seasonal mobile camp set in the Northern Serengeti, positioned to follow the Great Migration from June to November during the dramatic Mara River crossings.",
        "Each comfortable tent features en-suite facilities, cosy bedding, and a private veranda overlooking the rolling savannah where wildebeest and zebra gather in their thousands.",
        "Guests enjoy hearty full-board meals, refreshing drinks, and evenings around the campfire under a sky blazing with stars — the essence of a true African safari.",
        "The camp's strategic location offers unrivalled access to river crossings, predator action, and the spectacular wildlife drama of the northern Serengeti ecosystem.",
        "Combining authentic bush charm, warm hospitality, and an unbeatable location, Mara Kati Kati is the perfect base for an unforgettable migration adventure."
    ],
    "seasons": [
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("262.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("364.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("471.00")}}
            ]
        },
        {
            "name": "Shoulder Season",
            "start_day": 1, "start_month": 11, "end_day": 15, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("239.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("332.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("432.00")}}
            ]
        }
    ]
},

{
    "name": "Ndutu Under Canvas",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Ndutu Under Canvas is a premium seasonal camp set in the Ndutu area of the Ngorongoro Conservation Area, positioned to follow the Great Migration during the calving season from December to March.",
        "Each luxurious tent features en-suite facilities, elegant furnishings, and a private veranda overlooking the short-grass plains where wildebeest and zebra congregate in their thousands.",
        "Guests enjoy exceptional full-board dining with drinks included, attentive service, and evenings around the fire under a star-filled sky in one of Africa's most iconic landscapes.",
        "The camp's strategic location offers unrivalled access to predator action, calving grounds, and the spectacular wildlife drama of the southern Serengeti ecosystem.",
        "Combining premium luxury, authentic safari charm, and an unbeatable location, Ndutu Under Canvas is the perfect base for an unforgettable migration adventure."
    ],
    "seasons": [
        {
            "name": "High Season",
            "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("549.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("752.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("972.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 1, "start_month": 12, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("549.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("752.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("972.00")}}
            ]
        }
    ]
},

{
    "name": "Mara Under Canvas",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Mara Under Canvas is a premium seasonal camp set in the Northern Serengeti, positioned to follow the Great Migration from June to November during the dramatic Mara River crossings.",
        "Each luxurious tent features en-suite facilities, elegant furnishings, and a private veranda overlooking the rolling savannah where wildebeest and zebra gather in their thousands.",
        "Guests enjoy exceptional full-board dining with drinks included, attentive service, and evenings around the fire under a star-filled sky in one of Africa's most iconic landscapes.",
        "The camp's strategic location offers unrivalled access to river crossings, predator action, and the spectacular wildlife drama of the northern Serengeti ecosystem.",
        "Combining premium luxury, authentic safari charm, and an unbeatable location, Mara Under Canvas is the perfect base for an unforgettable migration adventure."
    ],
    "seasons": [
        {
            "name": "High Season (Jun-Nov)",
            "start_day": 1, "start_month": 6, "end_day": 30, "end_month": 11,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("549.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("752.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("972.00")}}
            ]
        }
    ]
},

{
    "name": "Kubu Kubu Tented Lodge",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Kubu Kubu Tented Lodge is a premium tented retreat set in the heart of the Central Serengeti, offering guests an unforgettable safari experience in one of the world's greatest wildlife destinations.",
        "The lodge's luxurious tents feature en-suite bathrooms, elegant furnishings, and private verandas with sweeping views of the endless plains where the Great Migration passes each year.",
        "Guests enjoy exceptional full-board dining with drinks included, a stunning infinity pool, and evenings around the fire under a sky blazing with stars in the heart of the Serengeti.",
        "The lodge's prime location offers exceptional year-round game viewing, with easy access to the Seronera Valley's resident predators and the iconic acacia-dotted landscapes of Central Serengeti.",
        "Combining premium luxury, personalised service, and an unbeatable location, Kubu Kubu Tented Lodge is the ultimate Serengeti retreat."
    ],
    "seasons": [
        {
            "name": "High Season (Jan-Mar)",
            "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("516.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("708.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("915.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("516.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("708.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("915.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 16, "start_month": 12, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("516.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("708.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("915.00")}}
            ]
        },
        {
            "name": "Shoulder Season",
            "start_day": 1, "start_month": 11, "end_day": 15, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("444.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("612.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("795.00")}}
            ]
        },
        {
            "name": "Low Season",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("371.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("514.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("669.00")}}
            ]
        }
    ]
},

{
    "name": "Lahia Tented Lodge",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Lahia Tented Lodge is a premium tented retreat set in the Western Serengeti, offering guests a luxurious base for exploring the quieter, wilder side of the Serengeti ecosystem.",
        "The lodge's elegant tents feature en-suite bathrooms, refined furnishings, and private verandas with sweeping views of the surrounding savannah and Grumeti River woodlands.",
        "Guests enjoy exceptional full-board dining with drinks included, a beautiful swimming pool, and evenings around the fire under a sky blazing with stars.",
        "The lodge's strategic location offers excellent access to the Grumeti River, the Western Corridor, and the dramatic river crossings of the Great Migration.",
        "Combining premium luxury, warm hospitality, and an unbeatable location, Lahia Tented Lodge is the ultimate Western Serengeti retreat."
    ],
    "seasons": [
        {
            "name": "High Season (Jan-Mar)",
            "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("437.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("604.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("783.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("437.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("604.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("783.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 16, "start_month": 12, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("437.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("604.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("783.00")}}
            ]
        },
        {
            "name": "Shoulder Season",
            "start_day": 1, "start_month": 11, "end_day": 15, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("365.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("508.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("660.00")}}
            ]
        },
        {
            "name": "Low Season",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("292.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("410.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("534.00")}}
            ]
        }
    ]
},

{
    "name": "Mara Mara Tented Lodge",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Mara Mara Tented Lodge is a premium tented retreat set in the Northern Serengeti, perfectly positioned for witnessing the dramatic Mara River crossings during the Great Migration.",
        "The lodge's elegant tents feature en-suite bathrooms, refined furnishings, and private verandas with sweeping views of the rolling savannah and distant Kopjes.",
        "Guests enjoy exceptional full-board dining with drinks included, a beautiful swimming pool, and evenings around the fire under a sky blazing with stars.",
        "The lodge's prime location offers exceptional access to the Mara River, the Lamai Wedge, and the spectacular wildlife drama of the northern Serengeti.",
        "Combining premium luxury, personalised service, and an unbeatable location, Mara Mara Tented Lodge is the ultimate Northern Serengeti retreat."
    ],
    "seasons": [
        {
            "name": "High Season (Jul-Oct)",
            "start_day": 1, "start_month": 7, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("809.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("1098.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("1413.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 1, "start_month": 12, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("809.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("1098.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("1413.00")}}
            ]
        },
        {
            "name": "Low Season (Jun)",
            "start_day": 1, "start_month": 6, "end_day": 30, "end_month": 6,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("419.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("580.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("753.00")}}
            ]
        },
        {
            "name": "Low Season (Nov)",
            "start_day": 1, "start_month": 11, "end_day": 30, "end_month": 11,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("419.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("580.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("753.00")}}
            ]
        }
    ]
},
{
    "name": "Serengeti Tortilis Camp",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Serengeti Tortilis Camp is a premium tented retreat set in the heart of the Central Serengeti, offering guests an immersive safari experience in one of the world's greatest wildlife destinations.",
        "Each comfortable tent features en-suite facilities, cosy bedding, and a private veranda overlooking the endless plains where wildebeest, zebras, and predators roam freely.",
        "Guests enjoy delicious full-board dining, refreshing drinks, and evenings around the campfire under a sky blazing with stars — the essence of a true African safari.",
        "The camp's prime location offers exceptional year-round game viewing, with easy access to the Seronera Valley's resident predators and the iconic acacia-dotted landscapes of Central Serengeti.",
        "Combining authentic bush charm, warm hospitality, and an unbeatable location, Serengeti Tortilis Camp is the perfect base for an unforgettable Serengeti adventure."
    ],
    "seasons": [
        {
            "name": "High Season (Jan-Feb)",
            "start_day": 1, "start_month": 1, "end_day": 28, "end_month": 2,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("250.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("420.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("585.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("250.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("420.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("585.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 16, "start_month": 12, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("250.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("420.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("585.00")}}
            ]
        },
        {
            "name": "Low Season (Mar)",
            "start_day": 1, "start_month": 3, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("180.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("298.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("417.00")}}
            ]
        },
        {
            "name": "Low Season (Nov-Dec 15)",
            "start_day": 1, "start_month": 11, "end_day": 15, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("180.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("298.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("417.00")}}
            ]
        },
        {
            "name": "Special Offer Season",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("125.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("248.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("372.00")}}
            ]
        }
    ]
},

{
    "name": "Serengeti Serena Safari Lodge",
    "tag_label": "Lodge",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Serengeti Serena Safari Lodge is an award-winning lodge set atop a hill in the heart of the Central Serengeti, offering panoramic views over the endless plains and surrounding wildlife-rich valleys.",
        "The lodge's elegant thatched rondavels are inspired by traditional Maasai huts, each featuring en-suite bathrooms, private verandas, and refined African decor.",
        "Guests enjoy exceptional full-board dining, a stunning infinity pool overlooking the plains, and evenings under the stars with the sounds of the wild in the distance.",
        "Perfectly positioned for exploring the Seronera Valley, home to Africa's highest concentration of predators and the iconic Great Migration.",
        "Combining iconic Serena hospitality, unique architecture, and an unrivalled location, Serengeti Serena Safari Lodge is the ultimate Serengeti retreat."
    ],
    "seasons": [
        {"name": "High Season (Jan)", "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 1,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("296.25")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("395.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("592.50")}}
         ]},
        {"name": "Peak Season (Feb)", "start_day": 1, "start_month": 2, "end_day": 28, "end_month": 2,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("537.75")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("717.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("1075.50")}}
         ]},
        {"name": "High Season (Mar)", "start_day": 1, "start_month": 3, "end_day": 31, "end_month": 3,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("282.75")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("377.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("565.50")}}
         ]},
        {"name": "Green Season", "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("226.50")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("302.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("453.00")}}
         ]},
        {"name": "Peak Season (Jun-Oct)", "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("537.75")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("717.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("1075.50")}}
         ]},
        {"name": "High Season (Nov-Dec)", "start_day": 1, "start_month": 11, "end_day": 22, "end_month": 12,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("282.75")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("377.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("565.50")}}
         ]},
        {"name": "Peak Season (Festive)", "start_day": 23, "start_month": 12, "end_day": 1, "end_month": 1,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("537.75")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("717.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("1075.50")}}
         ]}
    ]
},

{
    "name": "Mbuzi Mawe Serena Camp",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Mbuzi Mawe Serena Camp is an exclusive tented camp set among rocky outcrops in the Central Serengeti, offering guests an authentic safari experience in a stunning wilderness setting.",
        "Each spacious tent features en-suite facilities, elegant furnishings, and private verandas where guests can relax while watching wildlife wander past the camp.",
        "Guests enjoy exceptional full-board dining, attentive service, and evenings around the campfire under a sky blazing with stars.",
        "The camp's prime location offers exceptional year-round game viewing, with easy access to the Seronera Valley's resident predators and the Great Migration.",
        "Combining authentic bush charm, personalised Serena hospitality, and an unbeatable location, Mbuzi Mawe Serena Camp is the ultimate Serengeti tented retreat."
    ],
    "seasons": [
        {"name": "High Season (Jan)", "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 1,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("296.25")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("395.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("592.50")}}
         ]},
        {"name": "Peak Season (Feb)", "start_day": 1, "start_month": 2, "end_day": 28, "end_month": 2,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("474.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("632.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("948.00")}}
         ]},
        {"name": "High Season (Mar)", "start_day": 1, "start_month": 3, "end_day": 31, "end_month": 3,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("296.25")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("395.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("592.50")}}
         ]},
        {"name": "Green Season", "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("237.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("316.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("474.00")}}
         ]},
        {"name": "Peak Season (Jun-Oct)", "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("474.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("632.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("948.00")}}
         ]},
        {"name": "High Season (Nov-Dec)", "start_day": 1, "start_month": 11, "end_day": 22, "end_month": 12,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("296.25")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("395.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("592.50")}}
         ]},
        {"name": "Peak Season (Festive)", "start_day": 23, "start_month": 12, "end_day": 1, "end_month": 1,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("474.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("632.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("948.00")}}
         ]}
    ]
},

{
    "name": "Kirawira Serena Camp",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Kirawira Serena Camp is a colonial-style luxury tented camp set in the Western Serengeti, overlooking the Grumeti River and surrounding acacia woodlands teeming with wildlife.",
        "Each elegant tent features en-suite Victorian-style bathrooms, refined furnishings, and private verandas with sweeping views of the wilderness and riverine forest.",
        "Guests enjoy exceptional full-board dining in a beautiful mess tent, refreshing drinks on the terrace, and evenings under the stars with the sounds of the bush.",
        "The camp's prime location offers exceptional access to the Grumeti River's famous crocodile and hippo pools, and the dramatic river crossings of the Great Migration.",
        "Combining classic safari elegance, personalised Serena hospitality, and an unrivalled location, Kirawira Serena Camp is a true gem of the Western Serengeti."
    ],
    "seasons": [
        {"name": "High Season (Jan-Feb)", "start_day": 1, "start_month": 1, "end_day": 28, "end_month": 2,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("249.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("332.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("498.00")}}
         ]},
        {"name": "Green Season (Mar)", "start_day": 1, "start_month": 3, "end_day": 30, "end_month": 3,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("249.75")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("333.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("499.50")}}
         ]},
        {"name": "High Season (May)", "start_day": 1, "start_month": 5, "end_day": 31, "end_month": 5,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("249.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("332.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("498.00")}}
         ]},
        {"name": "Peak Season (Jun-Oct)", "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("411.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("548.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("822.00")}}
         ]},
        {"name": "High Season (Nov-Dec)", "start_day": 1, "start_month": 11, "end_day": 22, "end_month": 12,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("249.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("332.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("498.00")}}
         ]},
        {"name": "Peak Season (Festive)", "start_day": 23, "start_month": 12, "end_day": 1, "end_month": 1,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("411.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("548.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("822.00")}}
         ]}
    ]
},

{
    "name": "Serena Mvumo River Lodge",
    "tag_label": "Lodge",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Serena Mvumo River Lodge is an exclusive all-inclusive luxury retreat set on the banks of the Mvumo River in the remote Grumeti Reserve of the Western Serengeti.",
        "The lodge offers elegantly appointed rooms and the exclusive Mvumo Villa, each featuring en-suite facilities, refined African decor, and private verandas overlooking the river and surrounding wilderness.",
        "Guests enjoy an exceptional all-inclusive experience with full-board dining, game drives, return airstrip transfers, laundry, and a selection of fine wines, beers, and spirits.",
        "The lodge's exclusive location offers unrivalled access to the Grumeti River's famous wildlife action, private game drive areas, and the dramatic river crossings of the Great Migration.",
        "Combining ultra-luxury, exclusivity, and an unrivalled location, Serena Mvumo River Lodge is the ultimate Western Serengeti retreat for discerning travellers."
    ],
    "seasons": [
        {"name": "High Season (Jan)", "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 1,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"AI": Decimal("180.00")}},
            {"name": "Double", "capacity": 2, "rates": {"AI": Decimal("240.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"AI": Decimal("360.00")}}
         ]},
        {"name": "Peak Season (Feb)", "start_day": 1, "start_month": 2, "end_day": 28, "end_month": 2,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"AI": Decimal("180.00")}},
            {"name": "Double", "capacity": 2, "rates": {"AI": Decimal("240.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"AI": Decimal("360.00")}}
         ]},
        {"name": "High Season (Mar)", "start_day": 1, "start_month": 3, "end_day": 31, "end_month": 3,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"AI": Decimal("180.00")}},
            {"name": "Double", "capacity": 2, "rates": {"AI": Decimal("240.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"AI": Decimal("360.00")}}
         ]},
        {"name": "Peak Season (Jun-Oct)", "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"AI": Decimal("213.00")}},
            {"name": "Double", "capacity": 2, "rates": {"AI": Decimal("284.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"AI": Decimal("426.00")}}
         ]},
        {"name": "High Season (Nov-Dec)", "start_day": 1, "start_month": 11, "end_day": 22, "end_month": 12,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"AI": Decimal("180.00")}},
            {"name": "Double", "capacity": 2, "rates": {"AI": Decimal("240.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"AI": Decimal("360.00")}}
         ]},
        {"name": "Peak Season (Festive)", "start_day": 23, "start_month": 12, "end_day": 1, "end_month": 1,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"AI": Decimal("213.00")}},
            {"name": "Double", "capacity": 2, "rates": {"AI": Decimal("284.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"AI": Decimal("426.00")}}
         ]}
    ]
},

{
    "name": "Ole Serai Luxury Camp - Kogatende",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Ole Serai Luxury Camp - Kogatende is a premium tented retreat set in the Northern Serengeti, perfectly positioned for witnessing the dramatic Mara River crossings during the Great Migration.",
        "Each luxurious tent features en-suite facilities, elegant furnishings, and private verandas overlooking the rolling savannah and distant hills of the northern Serengeti.",
        "Guests enjoy exceptional full-board dining, attentive service, and evenings around the campfire under a sky blazing with stars.",
        "The camp's prime location offers exceptional access to the Mara River, the Lamai Wedge, and the spectacular wildlife drama of the northern Serengeti.",
        "Combining premium luxury, personalised service, and an unbeatable location, Ole Serai Kogatende is the ultimate Northern Serengeti retreat."
    ],
    "seasons": [
        {"name": "Peak Season (Jul-Oct)", "start_day": 1, "start_month": 7, "end_day": 31, "end_month": 10,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("1585.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("1980.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("2970.00")}}
         ]},
        {"name": "Peak Season (Festive)", "start_day": 20, "start_month": 12, "end_day": 31, "end_month": 12,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("1585.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("1980.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("2970.00")}}
         ]},
        {"name": "High Season (Jun)", "start_day": 1, "start_month": 6, "end_day": 30, "end_month": 6,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("1400.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("1750.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("2625.00")}}
         ]},
        {"name": "High Season (Nov-Dec 19)", "start_day": 1, "start_month": 11, "end_day": 19, "end_month": 12,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("1400.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("1750.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("2625.00")}}
         ]},
        {"name": "Low Season (Jan-Mar)", "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("795.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("990.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("1485.00")}}
         ]}
    ]
},

{
    "name": "Ole Serai Luxury Camp - Seronera",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Ole Serai Luxury Camp - Seronera is a premium tented retreat set in the heart of the Central Serengeti, offering guests an immersive safari experience in one of the world's greatest wildlife destinations.",
        "Each luxurious tent features en-suite facilities, elegant furnishings, and private verandas overlooking the endless plains where the Great Migration passes each year.",
        "Guests enjoy exceptional full-board dining, attentive service, and evenings around the campfire under a sky blazing with stars.",
        "The camp's prime location offers exceptional year-round game viewing, with easy access to the Seronera Valley's resident predators.",
        "Combining premium luxury, personalised service, and an unbeatable location, Ole Serai Seronera is the ultimate Central Serengeti retreat."
    ],
    "seasons": [
        {"name": "Peak Season (Jul-Oct)", "start_day": 1, "start_month": 7, "end_day": 31, "end_month": 10,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("1430.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("1790.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("2685.00")}}
         ]},
        {"name": "Peak Season (Festive)", "start_day": 20, "start_month": 12, "end_day": 31, "end_month": 12,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("1430.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("1790.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("2685.00")}}
         ]},
        {"name": "High Season (Jan-Mar)", "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("1295.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("1620.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("2430.00")}}
         ]},
        {"name": "High Season (Jun)", "start_day": 1, "start_month": 6, "end_day": 30, "end_month": 6,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("1295.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("1620.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("2430.00")}}
         ]},
        {"name": "High Season (Nov-Dec 19)", "start_day": 1, "start_month": 11, "end_day": 19, "end_month": 12,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("1295.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("1620.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("2430.00")}}
         ]},
        {"name": "Low Season (Apr-May)", "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("875.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("1090.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("1635.00")}}
         ]}
    ]
},

{
    "name": "Ole Serai Luxury Camp - Turner Springs",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Ole Serai Luxury Camp - Turner Springs is a premium tented retreat set in the Central Serengeti, offering guests an intimate and luxurious safari experience.",
        "Each luxurious tent features en-suite facilities, elegant furnishings, and private verandas overlooking the surrounding savannah and Turner Springs area.",
        "Guests enjoy exceptional full-board dining, attentive service, and evenings around the campfire under a sky blazing with stars.",
        "The camp's prime location offers excellent year-round game viewing, with easy access to the Seronera Valley's resident predators.",
        "Combining premium luxury, personalised service, and an unbeatable location, Ole Serai Turner Springs is the ultimate Central Serengeti retreat."
    ],
    "seasons": [
        {"name": "Peak Season (Jul-Oct)", "start_day": 1, "start_month": 7, "end_day": 31, "end_month": 10,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("1215.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("1520.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("2280.00")}}
         ]},
        {"name": "Peak Season (Festive)", "start_day": 20, "start_month": 12, "end_day": 31, "end_month": 12,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("1215.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("1520.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("2280.00")}}
         ]},
        {"name": "High Season (Jan-Mar)", "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("1115.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("1390.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("2085.00")}}
         ]},
        {"name": "High Season (Jun)", "start_day": 1, "start_month": 6, "end_day": 30, "end_month": 6,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("1115.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("1390.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("2085.00")}}
         ]},
        {"name": "High Season (Nov-Dec 19)", "start_day": 1, "start_month": 11, "end_day": 19, "end_month": 12,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("1115.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("1390.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("2085.00")}}
         ]},
        {"name": "Low Season (Apr-May)", "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("745.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("930.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("1395.00")}}
         ]}
    ]
},

{
    "name": "Ole Serai Luxury Camp - Moru Kopjes",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Ole Serai Luxury Camp - Moru Kopjes is a premium tented retreat set among the iconic granite kopjes of the Central Serengeti, offering guests an intimate and luxurious safari experience.",
        "Each luxurious tent features en-suite facilities, elegant furnishings, and private verandas overlooking the surrounding savannah and kopjes where lions often rest.",
        "Guests enjoy exceptional full-board dining, attentive service, and evenings around the campfire under a sky blazing with stars.",
        "The camp's prime location offers excellent year-round game viewing, with easy access to the Moru Kopjes' resident predators and the Great Migration.",
        "Combining premium luxury, personalised service, and an unbeatable location, Ole Serai Moru Kopjes is the ultimate Central Serengeti retreat."
    ],
    "seasons": [
        {"name": "Peak Season (Jul-Oct)", "start_day": 1, "start_month": 7, "end_day": 31, "end_month": 10,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("1060.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("1320.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("1980.00")}}
         ]},
        {"name": "Peak Season (Festive)", "start_day": 20, "start_month": 12, "end_day": 31, "end_month": 12,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("1060.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("1320.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("1980.00")}}
         ]},
        {"name": "High Season (Jan-Mar)", "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("955.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("1190.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("1785.00")}}
         ]},
        {"name": "High Season (Jun)", "start_day": 1, "start_month": 6, "end_day": 30, "end_month": 6,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("955.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("1190.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("1785.00")}}
         ]},
        {"name": "High Season (Nov-Dec 19)", "start_day": 1, "start_month": 11, "end_day": 19, "end_month": 12,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("955.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("1190.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("1785.00")}}
         ]},
        {"name": "Low Season (Apr-May)", "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("640.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("800.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("1200.00")}}
         ]}
    ]
},


{
    "name": "Serengeti Lake Magadi Lodge",
    "tag_label": "Lodge",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Serengeti Lake Magadi Lodge is a luxurious all-inclusive retreat set near the shores of Lake Magadi in the Central Serengeti, offering breathtaking views over the surrounding plains and resident wildlife.",
        "The lodge offers elegant Lake View and Kopjes View rooms, each featuring en-suite facilities, refined decor, and private verandas overlooking the iconic Serengeti landscapes.",
        "Guests enjoy exceptional all-inclusive dining with selected beverages and laundry, a beautiful swimming pool, and evenings under the stars with the sounds of the bush.",
        "The lodge's prime location offers exceptional year-round game viewing, with easy access to the Seronera Valley's resident predators and the Great Migration.",
        "Combining luxury, exclusivity, and an unrivalled location, Serengeti Lake Magadi Lodge is the ultimate Central Serengeti retreat."
    ],
    "seasons": [
        {"name": "Peak Season (Jul-Oct)", "start_day": 1, "start_month": 7, "end_day": 31, "end_month": 10,
         "rooms": [
            {"name": "Lake View Single", "capacity": 1, "rates": {"AI": Decimal("1825.00")}},
            {"name": "Lake View Double", "capacity": 2, "rates": {"AI": Decimal("2280.00")}},
            {"name": "Kopjes View Single", "capacity": 1, "rates": {"AI": Decimal("1560.00")}},
            {"name": "Kopjes View Double", "capacity": 2, "rates": {"AI": Decimal("1950.00")}}
         ]},
        {"name": "Peak Season (Festive)", "start_day": 20, "start_month": 12, "end_day": 31, "end_month": 12,
         "rooms": [
            {"name": "Lake View Single", "capacity": 1, "rates": {"AI": Decimal("1825.00")}},
            {"name": "Lake View Double", "capacity": 2, "rates": {"AI": Decimal("2280.00")}},
            {"name": "Kopjes View Single", "capacity": 1, "rates": {"AI": Decimal("1560.00")}},
            {"name": "Kopjes View Double", "capacity": 2, "rates": {"AI": Decimal("1950.00")}}
         ]},
        {"name": "High Season (Jun)", "start_day": 1, "start_month": 6, "end_day": 30, "end_month": 6,
         "rooms": [
            {"name": "Lake View Single", "capacity": 1, "rates": {"AI": Decimal("1455.00")}},
            {"name": "Lake View Double", "capacity": 2, "rates": {"AI": Decimal("1820.00")}},
            {"name": "Kopjes View Single", "capacity": 1, "rates": {"AI": Decimal("1245.00")}},
            {"name": "Kopjes View Double", "capacity": 2, "rates": {"AI": Decimal("1560.00")}}
         ]},
        {"name": "High Season (Nov-Dec 19)", "start_day": 1, "start_month": 11, "end_day": 19, "end_month": 12,
         "rooms": [
            {"name": "Lake View Single", "capacity": 1, "rates": {"AI": Decimal("1455.00")}},
            {"name": "Lake View Double", "capacity": 2, "rates": {"AI": Decimal("1820.00")}},
            {"name": "Kopjes View Single", "capacity": 1, "rates": {"AI": Decimal("1245.00")}},
            {"name": "Kopjes View Double", "capacity": 2, "rates": {"AI": Decimal("1560.00")}}
         ]},
        {"name": "Low Season (Jan-Mar)", "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
         "rooms": [
            {"name": "Lake View Single", "capacity": 1, "rates": {"AI": Decimal("1140.00")}},
            {"name": "Lake View Double", "capacity": 2, "rates": {"AI": Decimal("1420.00")}},
            {"name": "Kopjes View Single", "capacity": 1, "rates": {"AI": Decimal("1010.00")}},
            {"name": "Kopjes View Double", "capacity": 2, "rates": {"AI": Decimal("1260.00")}}
         ]}
    ]
},

{
    "name": "Embalakai Serengeti Camps",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Embalakai Authentic Camp is a boutique 12-tent retreat set along the Nyabogati River in the Banagi area of Central Serengeti, offering guests an intimate and authentic safari experience in one of the world's greatest wildlife destinations.",
        "Each elegantly furnished en-suite tent features comfortable single, double, twin, or triple bedding, with refined African-inspired decor and private verandas overlooking the surrounding wilderness.",
        "Guests enjoy delicious full-board dining — breakfast, hot lunch, dinner, and light snacks — complemented by drinking water, tea, and coffee, served in the camp's lounge and dining tent that can be partitioned for extra privacy.",
        "The camp's prime location, just 25-30 minutes from Seronera Airstrip, offers exceptional year-round game viewing, with easy access to the Seronera Valley's resident predators and the iconic Great Migration.",
        "Combining authentic bush charm, warm Tanzanian hospitality, and an unbeatable Central Serengeti location, Embalakai Authentic Camp is the perfect base for an unforgettable safari adventure."
    ],
    "seasons": [
        {
            "name": "High Season (Jul-Sep)",
            "start_day": 1, "start_month": 7, "end_day": 30, "end_month": 9,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("215.00")}},
                {"name": "Double/Twin", "capacity": 2, "rates": {"FB": Decimal("324.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("420.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 16, "start_month": 12, "end_day": 28, "end_month": 2,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("215.00")}},
                {"name": "Double/Twin", "capacity": 2, "rates": {"FB": Decimal("324.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("420.00")}}
            ]
        },
        {
            "name": "Shoulder Season (Mar)",
            "start_day": 1, "start_month": 3, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("200.00")}},
                {"name": "Double/Twin", "capacity": 2, "rates": {"FB": Decimal("304.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("390.00")}}
            ]
        },
        {
            "name": "Shoulder Season (Jun)",
            "start_day": 1, "start_month": 6, "end_day": 30, "end_month": 6,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("200.00")}},
                {"name": "Double/Twin", "capacity": 2, "rates": {"FB": Decimal("304.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("390.00")}}
            ]
        },
        {
            "name": "Shoulder Season (Oct)",
            "start_day": 1, "start_month": 10, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("200.00")}},
                {"name": "Double/Twin", "capacity": 2, "rates": {"FB": Decimal("304.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("390.00")}}
            ]
        },
        {
            "name": "Low Season (Apr-May)",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("170.00")}},
                {"name": "Double/Twin", "capacity": 2, "rates": {"FB": Decimal("242.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("345.00")}}
            ]
        },
        {
            "name": "Low Season (Nov-Dec 14)",
            "start_day": 1, "start_month": 11, "end_day": 14, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("170.00")}},
                {"name": "Double/Twin", "capacity": 2, "rates": {"FB": Decimal("242.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("345.00")}}
            ]
        }
    ]
},

{
    "name": "Four Seasons Safari Lodge Serengeti",
    "tag_label": "Lodge",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Four Seasons Safari Lodge Serengeti is a spectacular 5-star luxury retreat set in the heart of Central Serengeti, offering guests an unparalleled safari experience in one of the world's greatest wildlife destinations.",
        "The lodge's exquisite rooms, suites, and villas feature floor-to-ceiling windows, refined African-inspired interiors, and private terraces overlooking the endless plains, waterholes, and resident wildlife.",
        "Guests enjoy exceptional all-inclusive dining with premium beverages, a stunning infinity pool overlooking an elephant watering hole, the award-winning Spa, and complimentary access to the Discovery Center and Kijana Kids Club.",
        "Perfectly positioned for year-round game viewing, the lodge offers unrivalled access to the Seronera Valley's resident predators, the iconic Great Migration, and the extraordinary biodiversity of the Serengeti ecosystem.",
        "Combining world-class Four Seasons hospitality, iconic architecture, and a prime Serengeti location, Four Seasons Safari Lodge Serengeti is the ultimate luxury safari experience in Tanzania."
    ],
    "seasons": [
        {
            "name": "Green Season",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Savannah Room (Single)", "capacity": 1, "rates": {"AI": Decimal("755.00")}},
                {"name": "Savannah Room (Double)", "capacity": 2, "rates": {"AI": Decimal("825.00")}},
                {"name": "Horizon Room (Single)", "capacity": 1, "rates": {"AI": Decimal("835.00")}},
                {"name": "Horizon Room (Double)", "capacity": 2, "rates": {"AI": Decimal("900.00")}},
                {"name": "Savannah Waterhole View (Single)", "capacity": 1, "rates": {"AI": Decimal("910.00")}},
                {"name": "Savannah Waterhole View (Double)", "capacity": 2, "rates": {"AI": Decimal("980.00")}},
                {"name": "Horizon Waterhole View (Single)", "capacity": 1, "rates": {"AI": Decimal("980.00")}},
                {"name": "Horizon Waterhole View (Double)", "capacity": 2, "rates": {"AI": Decimal("1050.00")}},
                {"name": "Terrace Suite (Single)", "capacity": 1, "rates": {"AI": Decimal("1755.00")}},
                {"name": "Terrace Suite (Double)", "capacity": 2, "rates": {"AI": Decimal("1825.00")}},
                {"name": "Terrace Suite Waterhole View (Single)", "capacity": 1, "rates": {"AI": Decimal("1910.00")}},
                {"name": "Terrace Suite Waterhole View (Double)", "capacity": 2, "rates": {"AI": Decimal("1980.00")}},
                {"name": "One Bedroom Villa", "capacity": 2, "rates": {"AI": Decimal("3380.00")}},
                {"name": "Two Bedroom Villa", "capacity": 4, "rates": {"AI": Decimal("5965.00")}},
                {"name": "Presidential Villa", "capacity": 6, "rates": {"AI": Decimal("9745.00")}}
            ]
        },
        {
            "name": "Shoulder Season",
            "start_day": 1, "start_month": 3, "end_day": 21, "end_month": 12,
            "rooms": [
                {"name": "Savannah Room (Single)", "capacity": 1, "rates": {"AI": Decimal("1055.00")}},
                {"name": "Savannah Room (Double)", "capacity": 2, "rates": {"AI": Decimal("1125.00")}},
                {"name": "Horizon Room (Single)", "capacity": 1, "rates": {"AI": Decimal("1135.00")}},
                {"name": "Horizon Room (Double)", "capacity": 2, "rates": {"AI": Decimal("1205.00")}},
                {"name": "Savannah Waterhole View (Single)", "capacity": 1, "rates": {"AI": Decimal("1210.00")}},
                {"name": "Savannah Waterhole View (Double)", "capacity": 2, "rates": {"AI": Decimal("1280.00")}},
                {"name": "Horizon Waterhole View (Single)", "capacity": 1, "rates": {"AI": Decimal("1290.00")}},
                {"name": "Horizon Waterhole View (Double)", "capacity": 2, "rates": {"AI": Decimal("1355.00")}},
                {"name": "Terrace Suite (Single)", "capacity": 1, "rates": {"AI": Decimal("2080.00")}},
                {"name": "Terrace Suite (Double)", "capacity": 2, "rates": {"AI": Decimal("2150.00")}},
                {"name": "Terrace Suite Waterhole View (Single)", "capacity": 1, "rates": {"AI": Decimal("2235.00")}},
                {"name": "Terrace Suite Waterhole View (Double)", "capacity": 2, "rates": {"AI": Decimal("2300.00")}},
                {"name": "One Bedroom Villa", "capacity": 2, "rates": {"AI": Decimal("3690.00")}},
                {"name": "Two Bedroom Villa", "capacity": 4, "rates": {"AI": Decimal("6270.00")}},
                {"name": "Presidential Villa", "capacity": 6, "rates": {"AI": Decimal("10050.00")}}
            ]
        },
        {
            "name": "High Season",
            "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Savannah Room (Single)", "capacity": 1, "rates": {"AI": Decimal("1360.00")}},
                {"name": "Savannah Room (Double)", "capacity": 2, "rates": {"AI": Decimal("1425.00")}},
                {"name": "Horizon Room (Single)", "capacity": 1, "rates": {"AI": Decimal("1435.00")}},
                {"name": "Horizon Room (Double)", "capacity": 2, "rates": {"AI": Decimal("1505.00")}},
                {"name": "Savannah Waterhole View (Single)", "capacity": 1, "rates": {"AI": Decimal("1510.00")}},
                {"name": "Savannah Waterhole View (Double)", "capacity": 2, "rates": {"AI": Decimal("1580.00")}},
                {"name": "Horizon Waterhole View (Single)", "capacity": 1, "rates": {"AI": Decimal("1590.00")}},
                {"name": "Horizon Waterhole View (Double)", "capacity": 2, "rates": {"AI": Decimal("1660.00")}},
                {"name": "Terrace Suite (Single)", "capacity": 1, "rates": {"AI": Decimal("2385.00")}},
                {"name": "Terrace Suite (Double)", "capacity": 2, "rates": {"AI": Decimal("2455.00")}},
                {"name": "Terrace Suite Waterhole View (Single)", "capacity": 1, "rates": {"AI": Decimal("2540.00")}},
                {"name": "Terrace Suite Waterhole View (Double)", "capacity": 2, "rates": {"AI": Decimal("2610.00")}},
                {"name": "One Bedroom Villa", "capacity": 2, "rates": {"AI": Decimal("3995.00")}},
                {"name": "Two Bedroom Villa", "capacity": 4, "rates": {"AI": Decimal("6570.00")}},
                {"name": "Presidential Villa", "capacity": 6, "rates": {"AI": Decimal("10350.00")}}
            ]
        }
    ]
},

{
    "name": "Dove Serengeti Camp",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Dove Serengeti Camp is an intimate tented retreat set in the Lomoti area of Central Serengeti, offering guests an authentic and comfortable base for exploring one of the world's greatest wildlife destinations, open all year round.",
        "Each spacious tent — Standard, Suite, or Family — features an en-suite bathroom with both indoor and outdoor showers, a bathtub, hot water, comfortable bedding, and a private veranda with views over the surrounding savannah.",
        "Guests enjoy delicious full-board dining with complimentary soft drinks, local beers, house wines, tea, and coffee, all served in the camp's welcoming restaurant and bar, with a cozy campfire area for evenings under the stars.",
        "The camp's prime location offers exceptional year-round game viewing, with easy access to the Seronera Valley's resident predators, the iconic Great Migration, and the extraordinary biodiversity of the Central Serengeti.",
        "Combining authentic bush charm, warm Tanzanian hospitality, and excellent value, Dove Serengeti Camp is the perfect base for an unforgettable Serengeti adventure — with free Wi-Fi throughout the camp."
    ],
    "seasons": [
        {
            "name": "Full Year",
            "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Standard Room (Single)", "capacity": 1, "rates": {"FB": Decimal("190.00")}},
                {"name": "Standard Room (Double)", "capacity": 2, "rates": {"FB": Decimal("360.00")}},
                {"name": "Standard Room (Triple)", "capacity": 3, "rates": {"FB": Decimal("450.00")}},
                {"name": "Suite Room (Single)", "capacity": 1, "rates": {"FB": Decimal("190.00")}},
                {"name": "Suite Room (Double)", "capacity": 2, "rates": {"FB": Decimal("360.00")}},
                {"name": "Suite Room (Triple)", "capacity": 3, "rates": {"FB": Decimal("450.00")}},
                {"name": "Family Room", "capacity": 4, "rates": {"FB": Decimal("360.00")}}
            ]
        }
    ]
},

{
    "name": "Mbalageti Serengeti",
    "tag_label": "Lodge",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Mbalageti Serengeti is a magnificent lodge set on a scenic hilltop in the Western Serengeti, offering breathtaking panoramic views over the endless plains and the famous Grumeti River.",
        "The lodge offers a range of accommodations — from elegant Lodge Rooms and Tented Chalets to expansive Suites — each thoughtfully furnished with en-suite facilities, refined African decor, and private verandas overlooking the wilderness.",
        "Guests enjoy delicious full-board dining in the lodge's restaurant, refreshing drinks at the bar, a sparkling swimming pool, and evenings under the stars with the sounds of the African bush.",
        "The lodge's prime location offers exceptional year-round game viewing, with easy access to the Grumeti River's famous crocodile and hippo pools, and the dramatic river crossings of the Great Migration.",
        "Combining authentic safari charm, warm Tanzanian hospitality, and an unrivalled location, Mbalageti Serengeti is the perfect base for an unforgettable Serengeti adventure."
    ],
    "seasons": [
        {
            "name": "Peak Season (Jan 1-7)",
            "start_day": 1, "start_month": 1, "end_day": 7, "end_month": 1,
            "rooms": [
                {"name": "Lodge Room (Single)", "capacity": 1, "rates": {"FB": Decimal("225.00")}},
                {"name": "Lodge Room (Double)", "capacity": 2, "rates": {"FB": Decimal("300.00")}},
                {"name": "Tented Chalet (Single)", "capacity": 1, "rates": {"FB": Decimal("312.00")}},
                {"name": "Tented Chalet (Double)", "capacity": 2, "rates": {"FB": Decimal("550.00")}},
                {"name": "Tented Chalet (Triple)", "capacity": 3, "rates": {"FB": Decimal("735.00")}},
                {"name": "Suite Room (Single/Double)", "capacity": 2, "rates": {"AI": Decimal("750.00")}},
                {"name": "Suite Room (Triple)", "capacity": 3, "rates": {"AI": Decimal("1100.00")}},
                {"name": "Suite Room (Quad)", "capacity": 4, "rates": {"AI": Decimal("1250.00")}}
            ]
        },
        {
            "name": "High Season (Jan 8 - Feb)",
            "start_day": 8, "start_month": 1, "end_day": 28, "end_month": 2,
            "rooms": [
                {"name": "Tented Chalet (Single)", "capacity": 1, "rates": {"FB": Decimal("260.00")}},
                {"name": "Tented Chalet (Double)", "capacity": 2, "rates": {"FB": Decimal("400.00")}},
                {"name": "Tented Chalet (Triple)", "capacity": 3, "rates": {"FB": Decimal("530.00")}},
                {"name": "Suite Room (Single/Double)", "capacity": 2, "rates": {"AI": Decimal("600.00")}},
                {"name": "Suite Room (Triple)", "capacity": 3, "rates": {"AI": Decimal("875.00")}},
                {"name": "Suite Room (Quad)", "capacity": 4, "rates": {"AI": Decimal("1150.00")}}
            ]
        },
        {
            "name": "Shoulder Season (Mar-May)",
            "start_day": 1, "start_month": 3, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Tented Chalet (Single)", "capacity": 1, "rates": {"FB": Decimal("155.00")}},
                {"name": "Tented Chalet (Double)", "capacity": 2, "rates": {"FB": Decimal("235.00")}},
                {"name": "Tented Chalet (Triple)", "capacity": 3, "rates": {"FB": Decimal("352.50")}},
                {"name": "Suite Room (Single/Double)", "capacity": 2, "rates": {"AI": Decimal("400.00")}},
                {"name": "Suite Room (Triple)", "capacity": 3, "rates": {"AI": Decimal("585.00")}},
                {"name": "Suite Room (Quad)", "capacity": 4, "rates": {"AI": Decimal("770.00")}}
            ]
        },
        {
            "name": "High Season (Jun)",
            "start_day": 1, "start_month": 6, "end_day": 30, "end_month": 6,
            "rooms": [
                {"name": "Lodge Room (Single)", "capacity": 1, "rates": {"FB": Decimal("225.00")}},
                {"name": "Lodge Room (Double)", "capacity": 2, "rates": {"FB": Decimal("300.00")}},
                {"name": "Tented Chalet (Single)", "capacity": 1, "rates": {"FB": Decimal("260.00")}},
                {"name": "Tented Chalet (Double)", "capacity": 2, "rates": {"FB": Decimal("400.00")}},
                {"name": "Tented Chalet (Triple)", "capacity": 3, "rates": {"FB": Decimal("530.00")}},
                {"name": "Suite Room (Single/Double)", "capacity": 2, "rates": {"AI": Decimal("600.00")}},
                {"name": "Suite Room (Triple)", "capacity": 3, "rates": {"AI": Decimal("875.00")}},
                {"name": "Suite Room (Quad)", "capacity": 4, "rates": {"AI": Decimal("1150.00")}}
            ]
        },
        {
            "name": "Peak Season (Jul-Aug)",
            "start_day": 1, "start_month": 7, "end_day": 31, "end_month": 8,
            "rooms": [
                {"name": "Lodge Room (Single)", "capacity": 1, "rates": {"FB": Decimal("325.00")}},
                {"name": "Lodge Room (Double)", "capacity": 2, "rates": {"FB": Decimal("435.00")}},
                {"name": "Tented Chalet (Single)", "capacity": 1, "rates": {"FB": Decimal("365.00")}},
                {"name": "Tented Chalet (Double)", "capacity": 2, "rates": {"FB": Decimal("650.00")}},
                {"name": "Tented Chalet (Triple)", "capacity": 3, "rates": {"FB": Decimal("870.00")}},
                {"name": "Suite Room (Single/Double)", "capacity": 2, "rates": {"AI": Decimal("890.00")}},
                {"name": "Suite Room (Triple)", "capacity": 3, "rates": {"AI": Decimal("1310.00")}},
                {"name": "Suite Room (Quad)", "capacity": 4, "rates": {"AI": Decimal("1490.00")}}
            ]
        },
        {
            "name": "High Season (Sep-Oct)",
            "start_day": 1, "start_month": 9, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Tented Chalet (Single)", "capacity": 1, "rates": {"FB": Decimal("260.00")}},
                {"name": "Tented Chalet (Double)", "capacity": 2, "rates": {"FB": Decimal("400.00")}},
                {"name": "Tented Chalet (Triple)", "capacity": 3, "rates": {"FB": Decimal("530.00")}},
                {"name": "Suite Room (Single/Double)", "capacity": 2, "rates": {"AI": Decimal("600.00")}},
                {"name": "Suite Room (Triple)", "capacity": 3, "rates": {"AI": Decimal("875.00")}},
                {"name": "Suite Room (Quad)", "capacity": 4, "rates": {"AI": Decimal("1150.00")}}
            ]
        },
        {
            "name": "Shoulder Season (Nov)",
            "start_day": 1, "start_month": 11, "end_day": 30, "end_month": 11,
            "rooms": [
                {"name": "Tented Chalet (Single)", "capacity": 1, "rates": {"FB": Decimal("145.00")}},
                {"name": "Tented Chalet (Double)", "capacity": 2, "rates": {"FB": Decimal("200.00")}},
                {"name": "Tented Chalet (Triple)", "capacity": 3, "rates": {"FB": Decimal("300.00")}},
                {"name": "Suite Room (Single/Double)", "capacity": 2, "rates": {"AI": Decimal("400.00")}},
                {"name": "Suite Room (Triple)", "capacity": 3, "rates": {"AI": Decimal("585.00")}},
                {"name": "Suite Room (Quad)", "capacity": 4, "rates": {"AI": Decimal("770.00")}}
            ]
        },
        {
            "name": "High Season (Dec 1-20)",
            "start_day": 1, "start_month": 12, "end_day": 20, "end_month": 12,
            "rooms": [
                {"name": "Lodge Room (Single)", "capacity": 1, "rates": {"FB": Decimal("225.00")}},
                {"name": "Lodge Room (Double)", "capacity": 2, "rates": {"FB": Decimal("300.00")}},
                {"name": "Tented Chalet (Single)", "capacity": 1, "rates": {"FB": Decimal("260.00")}},
                {"name": "Tented Chalet (Double)", "capacity": 2, "rates": {"FB": Decimal("400.00")}},
                {"name": "Tented Chalet (Triple)", "capacity": 3, "rates": {"FB": Decimal("530.00")}},
                {"name": "Suite Room (Single/Double)", "capacity": 2, "rates": {"AI": Decimal("600.00")}},
                {"name": "Suite Room (Triple)", "capacity": 3, "rates": {"AI": Decimal("875.00")}},
                {"name": "Suite Room (Quad)", "capacity": 4, "rates": {"AI": Decimal("1150.00")}}
            ]
        },
        {
            "name": "Peak Season (Dec 22-31)",
            "start_day": 22, "start_month": 12, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Lodge Room (Single)", "capacity": 1, "rates": {"FB": Decimal("225.00")}},
                {"name": "Lodge Room (Double)", "capacity": 2, "rates": {"FB": Decimal("300.00")}},
                {"name": "Tented Chalet (Single)", "capacity": 1, "rates": {"FB": Decimal("312.00")}},
                {"name": "Tented Chalet (Double)", "capacity": 2, "rates": {"FB": Decimal("550.00")}},
                {"name": "Tented Chalet (Triple)", "capacity": 3, "rates": {"FB": Decimal("735.00")}},
                {"name": "Suite Room (Single/Double)", "capacity": 2, "rates": {"AI": Decimal("750.00")}},
                {"name": "Suite Room (Triple)", "capacity": 3, "rates": {"AI": Decimal("1100.00")}},
                {"name": "Suite Room (Quad)", "capacity": 4, "rates": {"AI": Decimal("1250.00")}}
            ]
        }
    ]
},

{
    "name": "Nyikani Central Serengeti Camp",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Nyikani Central Serengeti Camp is an intimate tented retreat set in the heart of the Central Serengeti, offering guests an immersive safari experience in one of the world's greatest wildlife destinations.",
        "Each comfortable tent features en-suite facilities, cosy bedding, and a private veranda overlooking the endless plains where wildebeest, zebras, and predators roam freely.",
        "Guests enjoy delicious full-board dining, complimentary drinking water, tea, and coffee, and evenings around the campfire under a sky blazing with stars.",
        "The camp's prime location offers exceptional year-round game viewing, with easy access to the Seronera Valley's resident predators and the iconic Great Migration.",
        "Combining authentic bush charm, warm Tanzanian hospitality, and an unbeatable location, Nyikani Central Serengeti Camp is the perfect base for an unforgettable Serengeti adventure."
    ],
    "seasons": [
        {
            "name": "Peak Season (Jul-Sep)",
            "start_day": 1, "start_month": 7, "end_day": 30, "end_month": 9,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"FB": Decimal("430.00")}},
                {"name": "Double Room", "capacity": 2, "rates": {"FB": Decimal("580.00")}},
                {"name": "Triple Room", "capacity": 3, "rates": {"FB": Decimal("870.00")}},
                {"name": "Family Tent", "capacity": 4, "rates": {"FB": Decimal("1160.00")}}
            ]
        },
        {
            "name": "Peak Season (Festive)",
            "start_day": 20, "start_month": 12, "end_day": 3, "end_month": 1,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"FB": Decimal("430.00")}},
                {"name": "Double Room", "capacity": 2, "rates": {"FB": Decimal("580.00")}},
                {"name": "Triple Room", "capacity": 3, "rates": {"FB": Decimal("870.00")}},
                {"name": "Family Tent", "capacity": 4, "rates": {"FB": Decimal("1160.00")}}
            ]
        },
        {
            "name": "High Season (Jan-Mar)",
            "start_day": 11, "start_month": 1, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"FB": Decimal("210.00")}},
                {"name": "Double Room", "capacity": 2, "rates": {"FB": Decimal("420.00")}},
                {"name": "Triple Room", "capacity": 3, "rates": {"FB": Decimal("630.00")}},
                {"name": "Family Tent", "capacity": 4, "rates": {"FB": Decimal("840.00")}}
            ]
        },
        {
            "name": "High Season (Jun)",
            "start_day": 1, "start_month": 6, "end_day": 30, "end_month": 6,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"FB": Decimal("210.00")}},
                {"name": "Double Room", "capacity": 2, "rates": {"FB": Decimal("420.00")}},
                {"name": "Triple Room", "capacity": 3, "rates": {"FB": Decimal("630.00")}},
                {"name": "Family Tent", "capacity": 4, "rates": {"FB": Decimal("840.00")}}
            ]
        },
        {
            "name": "High Season (Oct)",
            "start_day": 1, "start_month": 10, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"FB": Decimal("210.00")}},
                {"name": "Double Room", "capacity": 2, "rates": {"FB": Decimal("420.00")}},
                {"name": "Triple Room", "capacity": 3, "rates": {"FB": Decimal("630.00")}},
                {"name": "Family Tent", "capacity": 4, "rates": {"FB": Decimal("840.00")}}
            ]
        },
        {
            "name": "Low Season",
            "start_day": 1, "start_month": 4, "end_day": 19, "end_month": 12,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"FB": Decimal("170.00")}},
                {"name": "Double Room", "capacity": 2, "rates": {"FB": Decimal("340.00")}},
                {"name": "Triple Room", "capacity": 3, "rates": {"FB": Decimal("510.00")}},
                {"name": "Family Tent", "capacity": 4, "rates": {"FB": Decimal("680.00")}}
            ]
        }
    ]
},

{
    "name": "Nyikani Migration Camp - Kogatende",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Nyikani Migration Camp - Kogatende is a mobile tented retreat set in the Northern Serengeti, perfectly positioned for witnessing the dramatic Mara River crossings during the Great Migration.",
        "Each comfortable tent features en-suite facilities, cosy bedding, and a private veranda overlooking the rolling savannah where wildebeest and zebra gather in their thousands.",
        "Guests enjoy delicious full-board dining, complimentary drinking water, tea, and coffee, and evenings around the campfire under a sky blazing with stars.",
        "The camp's prime location offers unrivalled access to the Mara River, the Lamai Wedge, and the spectacular wildlife drama of the Northern Serengeti.",
        "Combining authentic bush charm, warm hospitality, and an unbeatable location, Nyikani Kogatende is the perfect base for an unforgettable migration adventure."
    ],
    "seasons": [
        {
            "name": "Peak Season (Jul-Sep)",
            "start_day": 1, "start_month": 7, "end_day": 30, "end_month": 9,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"FB": Decimal("430.00")}},
                {"name": "Double Room", "capacity": 2, "rates": {"FB": Decimal("580.00")}},
                {"name": "Triple Room", "capacity": 3, "rates": {"FB": Decimal("870.00")}},
                {"name": "Family Tent", "capacity": 4, "rates": {"FB": Decimal("1160.00")}}
            ]
        },
        {
            "name": "High Season (Oct-Nov 14)",
            "start_day": 1, "start_month": 10, "end_day": 14, "end_month": 11,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"FB": Decimal("210.00")}},
                {"name": "Double Room", "capacity": 2, "rates": {"FB": Decimal("420.00")}},
                {"name": "Triple Room", "capacity": 3, "rates": {"FB": Decimal("630.00")}},
                {"name": "Family Tent", "capacity": 4, "rates": {"FB": Decimal("840.00")}}
            ]
        },
        {
            "name": "Low Season (Jun)",
            "start_day": 1, "start_month": 6, "end_day": 30, "end_month": 6,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"FB": Decimal("170.00")}},
                {"name": "Double Room", "capacity": 2, "rates": {"FB": Decimal("340.00")}},
                {"name": "Triple Room", "capacity": 3, "rates": {"FB": Decimal("510.00")}},
                {"name": "Family Tent", "capacity": 4, "rates": {"FB": Decimal("680.00")}}
            ]
        }
    ]
},

{
    "name": "Matawi Serengeti Camp",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Matawi Serengeti Camp is an intimate all-suite luxury tented retreat set in the Topi area of Central Serengeti, just 5 kilometres from Seronera Airstrip, offering guests an exclusive and immersive safari experience.",
        "Each of the camp's 10 spacious luxury tents features en-suite facilities, elegant furnishings, and private verandas overlooking the endless plains where wildebeest, zebras, and predators roam freely.",
        "Guests enjoy delicious full-board dining with complimentary drinking water, tea, and coffee, all served in the camp's welcoming lounge and dining area, with evenings around the campfire under a sky blazing with stars.",
        "The camp's prime location offers exceptional year-round game viewing, with easy access to the Seronera Valley's resident predators and the iconic Great Migration.",
        "Combining authentic bush charm, warm Tanzanian hospitality, and an unbeatable location, Matawi Serengeti Camp is the perfect base for an unforgettable Serengeti adventure."
    ],
    "seasons": [
        {
            "name": "High Season (Dec-Mar)",
            "start_day": 1, "start_month": 12, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("253.00")}},
                {"name": "Double/Twin", "capacity": 2, "rates": {"FB": Decimal("440.00")}},
                {"name": "Family", "capacity": 4, "rates": {"FB": Decimal("880.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("253.00")}},
                {"name": "Double/Twin", "capacity": 2, "rates": {"FB": Decimal("440.00")}},
                {"name": "Family", "capacity": 4, "rates": {"FB": Decimal("880.00")}}
            ]
        },
        {
            "name": "Low Season (Apr-May)",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("187.00")}},
                {"name": "Double/Twin", "capacity": 2, "rates": {"FB": Decimal("308.00")}},
                {"name": "Family", "capacity": 4, "rates": {"FB": Decimal("616.00")}}
            ]
        },
        {
            "name": "Low Season (Nov)",
            "start_day": 1, "start_month": 11, "end_day": 30, "end_month": 11,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("187.00")}},
                {"name": "Double/Twin", "capacity": 2, "rates": {"FB": Decimal("308.00")}},
                {"name": "Family", "capacity": 4, "rates": {"FB": Decimal("616.00")}}
            ]
        }
    ]
}



],

"Ngorongoro Crater":[
    {
    "name": "Ang'ata Ngorongoro Camp",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",  # TODO: Badilisha kuwa "InsidePark" ukishaweka concession fees
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident":  11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Ang'ata Ngorongoro Camp is a charming 10-tent safari camp situated in the Nyati area near the Ngorongoro Conservation Area, offering a serene base from which to explore one of the world's greatest natural wonders.",
        "Each comfortable tent is equipped with en-suite facilities and a private veranda, providing guests with a peaceful retreat after a day of breathtaking game drives into the Ngorongoro Crater.",
        "The camp is open throughout the year, allowing visitors to experience the crater's extraordinary wildlife — including the Big Five — as well as the rich cultural heritage of the Maasai communities living in the conservation area.",
        "Guests enjoy wholesome full-board meals and warm hospitality, with evenings spent around the fire reliving the day's adventures under the clear highland skies.",
        "Ang'ata Ngorongoro Camp combines authentic safari charm with modern comfort and an unrivalled location — the perfect gateway to the Ngorongoro Crater and its surrounding highlands."
    ],
    "seasons": [
        {
            "name": "Low Season (Apr-Jun)",
            "start_day": 1,
            "start_month": 4,
            "end_day": 14,
            "end_month": 6,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("350.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("415.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("535.00")}}
            ]
        },
        {
            "name": "Low Season (Sep-Dec)",
            "start_day": 15,
            "start_month": 9,
            "end_day": 9,
            "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("350.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("415.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("535.00")}}
            ]
        },
        {
            "name": "High Season (Dec-Mar)",
            "start_day": 10,
            "start_month": 12,
            "end_day": 31,
            "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("390.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("545.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("665.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Sep)",
            "start_day": 15,
            "start_month": 6,
            "end_day": 14,
            "end_month": 9,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("390.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("545.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("665.00")}}
            ]
        }
    ]
},
{
    "name": "The Castle at Ngorongoro",
    "tag_label": "Lodge",
    "park_status": "InsidePark",  # TODO: Ngorongoro iko InsidePark - ongeza concession fees
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "The Castle at Ngorongoro is a unique boutique retreat perched on the rim of the world-famous Ngorongoro Crater, offering guests breathtaking panoramic views of one of Africa's greatest natural wonders.",
        "Styled like a European castle with elegant interiors and thoughtful touches throughout, each room provides comfort, warmth, and stunning vistas of the crater floor and surrounding highlands.",
        "Guests enjoy fine full-board dining, a cosy lounge with fireplace, and warm Tanzanian hospitality — all set against the dramatic backdrop of the Ngorongoro Conservation Area.",
        "With its prime location, The Castle offers early access to crater game drives, allowing guests to witness the Big Five and the extraordinary wildlife density of the Ngorongoro Crater.",
        "Combining European charm with African wilderness, The Castle at Ngorongoro delivers a truly unforgettable highland safari experience."
    ],
    "seasons": [
        {
            "name": "Low Season (Apr-May)",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("125.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("200.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("261.00")}}
            ]
        },
        {
            "name": "Low Season (Nov)",
            "start_day": 1, "start_month": 11, "end_day": 30, "end_month": 11,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("125.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("200.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("261.00")}}
            ]
        },
        {
            "name": "Shoulder Season (Oct)",
            "start_day": 15, "start_month": 10, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("150.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("260.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("303.00")}}
            ]
        },
        {
            "name": "Shoulder Season (Dec)",
            "start_day": 1, "start_month": 12, "end_day": 15, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("150.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("260.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("303.00")}}
            ]
        },
        {
            "name": "High Season (Dec-Mar)",
            "start_day": 16, "start_month": 12, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("175.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("300.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("375.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 14, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("175.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("300.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("375.00")}}
            ]
        }
    ]
},


{
    "name": "Ngorongoro Farm House",
    "tag_label": "Lodge",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Ngorongoro Farm House is a charming colonial-style lodge set on a working coffee farm in Karatu, offering a peaceful and authentic base for exploring the Ngorongoro Crater and surrounding highlands.",
        "The lodge offers comfortable Standard rooms and spacious Suites, each elegantly furnished with en-suite facilities, cosy bedding, and views over the lush farm gardens and coffee plantations.",
        "Guests enjoy delicious full-board dining featuring fresh farm produce, complimentary afternoon coffee walks, and warm Tanzanian hospitality in a truly unique agricultural setting.",
        "The lodge's prime location provides easy access to the Ngorongoro Crater, Lake Manyara, and the cultural highlights of the Iraqw and Maasai communities.",
        "Combining rustic charm, modern comfort, and a beautiful natural setting, Ngorongoro Farm House delivers an unforgettable highland safari experience."
    ],
    "seasons": [
        {
            "name": "High Season (Jan-Mar)",
            "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("259.00")}},
                {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("358.00")}},
                {"name": "Standard Triple", "capacity": 3, "rates": {"FB": Decimal("465.00")}},
                {"name": "Suite Single", "capacity": 1, "rates": {"FB": Decimal("341.00")}},
                {"name": "Suite Double", "capacity": 2, "rates": {"FB": Decimal("468.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("259.00")}},
                {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("358.00")}},
                {"name": "Standard Triple", "capacity": 3, "rates": {"FB": Decimal("465.00")}},
                {"name": "Suite Single", "capacity": 1, "rates": {"FB": Decimal("341.00")}},
                {"name": "Suite Double", "capacity": 2, "rates": {"FB": Decimal("468.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 16, "start_month": 12, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("259.00")}},
                {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("358.00")}},
                {"name": "Standard Triple", "capacity": 3, "rates": {"FB": Decimal("465.00")}},
                {"name": "Suite Single", "capacity": 1, "rates": {"FB": Decimal("341.00")}},
                {"name": "Suite Double", "capacity": 2, "rates": {"FB": Decimal("468.00")}}
            ]
        },
        {
            "name": "Shoulder Season",
            "start_day": 1, "start_month": 11, "end_day": 15, "end_month": 12,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("208.00")}},
                {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("292.00")}},
                {"name": "Standard Triple", "capacity": 3, "rates": {"FB": Decimal("381.00")}},
                {"name": "Suite Single", "capacity": 1, "rates": {"FB": Decimal("290.00")}},
                {"name": "Suite Double", "capacity": 2, "rates": {"FB": Decimal("400.00")}}
            ]
        },
        {
            "name": "Low Season",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("159.00")}},
                {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("226.00")}},
                {"name": "Standard Triple", "capacity": 3, "rates": {"FB": Decimal("297.00")}},
                {"name": "Suite Single", "capacity": 1, "rates": {"FB": Decimal("239.00")}},
                {"name": "Suite Double", "capacity": 2, "rates": {"FB": Decimal("332.00")}}
            ]
        }
    ]
},

{
    "name": "Ngorongoro Farm House Valley",
    "tag_label": "Lodge",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Ngorongoro Farm House Valley is a serene farm-style lodge nestled in the lush Karatu highlands, offering a tranquil escape surrounded by coffee plantations and rolling green hills.",
        "The lodge offers comfortable Standard rooms, each thoughtfully furnished with en-suite facilities and garden views, providing a peaceful retreat after a day of crater exploration.",
        "Guests enjoy delicious full-board dining featuring fresh farm-to-table produce, complimentary afternoon coffee walks, and warm, personalised Tanzanian hospitality.",
        "The lodge's excellent location provides easy access to the Ngorongoro Crater, Lake Manyara, and the cultural and natural wonders of the northern highlands.",
        "Combining rustic charm, green surroundings, and excellent value, Ngorongoro Farm House Valley is a delightful highland retreat for discerning travellers."
    ],
    "seasons": [
        {
            "name": "High Season (Jan-Mar)",
            "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("259.00")}},
                {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("358.00")}},
                {"name": "Standard Triple", "capacity": 3, "rates": {"FB": Decimal("465.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("259.00")}},
                {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("358.00")}},
                {"name": "Standard Triple", "capacity": 3, "rates": {"FB": Decimal("465.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 16, "start_month": 12, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("259.00")}},
                {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("358.00")}},
                {"name": "Standard Triple", "capacity": 3, "rates": {"FB": Decimal("465.00")}}
            ]
        },
        {
            "name": "Shoulder Season",
            "start_day": 1, "start_month": 11, "end_day": 15, "end_month": 12,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("208.00")}},
                {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("292.00")}},
                {"name": "Standard Triple", "capacity": 3, "rates": {"FB": Decimal("381.00")}}
            ]
        },
        {
            "name": "Low Season",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("159.00")}},
                {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("226.00")}},
                {"name": "Standard Triple", "capacity": 3, "rates": {"FB": Decimal("297.00")}}
            ]
        }
    ]
},

{
    "name": "Kitela Lodge",
    "tag_label": "Lodge",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Kitela Lodge is a premium retreat set on a working coffee farm in the lush Karatu highlands, offering guests a serene and elegant base for exploring the Ngorongoro Crater.",
        "The lodge's spacious rooms feature en-suite facilities, cosy bedding, and private verandas overlooking manicured gardens and rolling coffee plantations.",
        "Guests enjoy exceptional full-board dining with complimentary afternoon coffee walks and premium drinks including water, soft drinks, local beers, and house wines.",
        "The lodge's prime location provides easy access to the Ngorongoro Crater, Lake Manyara, and the cultural highlights of the Iraqw and Maasai communities.",
        "Combining premium comfort, warm hospitality, and a beautiful natural setting, Kitela Lodge offers a truly memorable Tanzanian highland experience."
    ],
    "seasons": [
        {
            "name": "High Season (Jan-Mar)",
            "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("384.00")}},
                {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("532.00")}},
                {"name": "Standard Triple", "capacity": 3, "rates": {"FB": Decimal("693.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("384.00")}},
                {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("532.00")}},
                {"name": "Standard Triple", "capacity": 3, "rates": {"FB": Decimal("693.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 16, "start_month": 12, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("384.00")}},
                {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("532.00")}},
                {"name": "Standard Triple", "capacity": 3, "rates": {"FB": Decimal("693.00")}}
            ]
        },
        {
            "name": "Shoulder Season",
            "start_day": 1, "start_month": 11, "end_day": 15, "end_month": 12,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("328.00")}},
                {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("458.00")}},
                {"name": "Standard Triple", "capacity": 3, "rates": {"FB": Decimal("597.00")}}
            ]
        },
        {
            "name": "Low Season",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("272.00")}},
                {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("384.00")}},
                {"name": "Standard Triple", "capacity": 3, "rates": {"FB": Decimal("501.00")}}
            ]
        }
    ]
},


{
    "name": "Tloma Lodge",
    "tag_label": "Lodge",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Tloma Lodge is a charming retreat set on a working coffee farm in the lush Karatu highlands, offering guests a warm and authentic base for exploring the Ngorongoro Crater.",
        "The lodge offers comfortable Standard and Garden rooms, each thoughtfully furnished with en-suite facilities and beautiful views of the surrounding coffee plantations and gardens.",
        "Guests enjoy delicious full-board dining featuring fresh farm produce, complimentary afternoon coffee walks, and warm Tanzanian hospitality in a truly unique agricultural setting.",
        "The lodge's excellent location provides easy access to the Ngorongoro Crater, Lake Manyara, and the cultural and natural wonders of the northern highlands.",
        "Combining rustic charm, green surroundings, and excellent value, Tloma Lodge is a delightful highland retreat for discerning travellers."
    ],
    "seasons": [
        {
            "name": "High Season (Jan-Mar)",
            "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("200.00")}},
                {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("280.00")}},
                {"name": "Standard Triple", "capacity": 3, "rates": {"FB": Decimal("366.00")}},
                {"name": "Garden Single", "capacity": 1, "rates": {"FB": Decimal("188.00")}},
                {"name": "Garden Double", "capacity": 2, "rates": {"FB": Decimal("264.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("200.00")}},
                {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("280.00")}},
                {"name": "Standard Triple", "capacity": 3, "rates": {"FB": Decimal("366.00")}},
                {"name": "Garden Single", "capacity": 1, "rates": {"FB": Decimal("188.00")}},
                {"name": "Garden Double", "capacity": 2, "rates": {"FB": Decimal("264.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 16, "start_month": 12, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("200.00")}},
                {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("280.00")}},
                {"name": "Standard Triple", "capacity": 3, "rates": {"FB": Decimal("366.00")}},
                {"name": "Garden Single", "capacity": 1, "rates": {"FB": Decimal("188.00")}},
                {"name": "Garden Double", "capacity": 2, "rates": {"FB": Decimal("264.00")}}
            ]
        },
        {
            "name": "Shoulder Season",
            "start_day": 1, "start_month": 11, "end_day": 15, "end_month": 12,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("167.00")}},
                {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("236.00")}},
                {"name": "Standard Triple", "capacity": 3, "rates": {"FB": Decimal("309.00")}},
                {"name": "Garden Single", "capacity": 1, "rates": {"FB": Decimal("160.00")}},
                {"name": "Garden Double", "capacity": 2, "rates": {"FB": Decimal("228.00")}}
            ]
        },
        {
            "name": "Low Season",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("134.00")}},
                {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("192.00")}},
                {"name": "Standard Triple", "capacity": 3, "rates": {"FB": Decimal("255.00")}},
                {"name": "Garden Single", "capacity": 1, "rates": {"FB": Decimal("134.00")}},
                {"name": "Garden Double", "capacity": 2, "rates": {"FB": Decimal("192.00")}}
            ]
        }
    ]
},

{
    "name": "Masek Tented Lodge",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Masek Tented Lodge is a premium tented retreat located in the Ngorongoro Conservation Area, on the southern edge of the Serengeti ecosystem, surrounded by breathtaking highland scenery.",
        "The lodge's elegant tents feature en-suite bathrooms, cosy bedding, and private verandas with sweeping views of the surrounding wilderness and distant crater highlands.",
        "Guests enjoy exceptional full-board dining with drinks included, attentive service, and evenings around the fire under a star-filled sky in one of Africa's most iconic landscapes.",
        "The lodge's strategic location provides excellent access to the Ngorongoro Crater, the Serengeti plains, and the cultural heritage of the Maasai communities living in the conservation area.",
        "Combining premium comfort, authentic safari charm, and an unbeatable location, Masek Tented Lodge is the perfect base for exploring Tanzania's greatest natural wonders."
    ],
    "seasons": [
        {
            "name": "High Season (Jan-Mar)",
            "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("613.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("838.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("1080.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 1, "start_month": 12, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("613.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("838.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("1080.00")}}
            ]
        },
        {
            "name": "Low Season",
            "start_day": 1, "start_month": 4, "end_day": 30, "end_month": 11,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("308.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("430.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("561.00")}}
            ]
        }
    ]
},
{
    "name": "Ngorongoro Tortilis Camp",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Ngorongoro Tortilis Camp is a premium tented retreat set on the rim of the world-famous Ngorongoro Crater, offering guests breathtaking views of one of Africa's greatest natural wonders.",
        "Each comfortable tent features en-suite facilities, cosy bedding, and a private veranda overlooking the surrounding highlands and the vast crater below.",
        "Guests enjoy delicious full-board dining, refreshing drinks, and evenings around the campfire under a sky blazing with stars — the essence of a true African safari.",
        "The camp's prime location provides early access to the Ngorongoro Crater, allowing guests to witness the Big Five and the extraordinary wildlife density of this UNESCO World Heritage Site.",
        "Combining authentic bush charm, warm hospitality, and an unbeatable location, Ngorongoro Tortilis Camp is the perfect base for exploring the crater and its surrounding highlands."
    ],
    "seasons": [
        {
            "name": "High Season (Jan-Feb)",
            "start_day": 1, "start_month": 1, "end_day": 28, "end_month": 2,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("285.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("470.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("690.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("285.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("470.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("690.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 16, "start_month": 12, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("285.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("470.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("690.00")}}
            ]
        },
        {
            "name": "Low Season (Mar)",
            "start_day": 1, "start_month": 3, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("240.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("380.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("555.00")}}
            ]
        },
        {
            "name": "Low Season (Nov-Dec 15)",
            "start_day": 1, "start_month": 11, "end_day": 15, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("240.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("380.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("555.00")}}
            ]
        },
        {
            "name": "Special Offer Season",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("165.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("330.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("495.00")}}
            ]
        }
    ]
},
{
    "name": "Ngorongoro Serena Safari Lodge",
    "tag_label": "Lodge",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Ngorongoro Serena Safari Lodge is dramatically perched on the rim of the world-famous Ngorongoro Crater, offering guests breathtaking views into one of Africa's greatest natural wonders.",
        "The lodge's stone-and-thatch rooms blend seamlessly into the crater rim, each featuring en-suite facilities, private balconies, and sweeping vistas of the crater floor below.",
        "Guests enjoy exceptional full-board dining, a warm fireplace lounge, and early morning access to the crater for unforgettable Big Five game viewing.",
        "The lodge's UNESCO World Heritage location offers a once-in-a-lifetime opportunity to witness the extraordinary wildlife density of the Ngorongoro Crater.",
        "Combining iconic Serena hospitality, dramatic architecture, and an unrivalled location, Ngorongoro Serena Safari Lodge delivers a truly unforgettable highland safari."
    ],
    "seasons": [
        {"name": "High Season (Jan)", "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 1,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("308.25")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("411.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("616.50")}}
         ]},
        {"name": "Peak Season (Feb)", "start_day": 1, "start_month": 2, "end_day": 28, "end_month": 2,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("570.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("760.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("1140.00")}}
         ]},
        {"name": "High Season (Mar)", "start_day": 1, "start_month": 3, "end_day": 31, "end_month": 3,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("294.75")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("393.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("589.50")}}
         ]},
        {"name": "Green Season", "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("221.25")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("295.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("442.50")}}
         ]},
        {"name": "Peak Season (Jun-Oct)", "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("570.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("760.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("1140.00")}}
         ]},
        {"name": "High Season (Nov-Dec)", "start_day": 1, "start_month": 11, "end_day": 22, "end_month": 12,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("294.75")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("393.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("589.50")}}
         ]},
        {"name": "Peak Season (Festive)", "start_day": 23, "start_month": 12, "end_day": 1, "end_month": 1,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("570.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("760.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("1140.00")}}
         ]}
    ]
},

{
    "name": "Ngorongoro Oldeani Mountain Lodge",
    "tag_label": "Lodge",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Ngorongoro Oldeani Mountain Lodge is an elegant retreat set on the forested slopes of Oldeani Mountain, offering breathtaking views over the surrounding highlands and distant Ngorongoro Crater.",
        "The lodge's refined rooms and exclusive 2-bedroom suite with private pool feature en-suite facilities, cosy fireplaces, and private verandas overlooking the lush gardens and coffee plantations.",
        "Guests enjoy exceptional full-board dining, a warm fireplace lounge, and evenings under the stars with the sounds of the African highlands.",
        "The lodge's prime location provides easy access to the Ngorongoro Crater, Lake Manyara, and the cultural highlights of the Iraqw and Maasai communities.",
        "Combining luxury, comfort, and an unrivalled location, Ngorongoro Oldeani Mountain Lodge is the perfect highland retreat."
    ],
    "seasons": [
        {"name": "Peak Season (Jul-Oct)", "start_day": 1, "start_month": 7, "end_day": 31, "end_month": 10,
         "rooms": [
            {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("780.00")}},
            {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("960.00")}},
            {"name": "2-Bedroom Suite (2 Pax)", "capacity": 2, "rates": {"FB": Decimal("1634.00")}}
         ]},
        {"name": "Peak Season (Festive)", "start_day": 20, "start_month": 12, "end_day": 31, "end_month": 12,
         "rooms": [
            {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("780.00")}},
            {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("960.00")}},
            {"name": "2-Bedroom Suite (2 Pax)", "capacity": 2, "rates": {"FB": Decimal("1634.00")}}
         ]},
        {"name": "High Season (Jun)", "start_day": 1, "start_month": 6, "end_day": 30, "end_month": 6,
         "rooms": [
            {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("690.00")}},
            {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("860.00")}},
            {"name": "2-Bedroom Suite (2 Pax)", "capacity": 2, "rates": {"FB": Decimal("1089.00")}}
         ]},
        {"name": "High Season (Nov-Dec 19)", "start_day": 1, "start_month": 11, "end_day": 19, "end_month": 12,
         "rooms": [
            {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("690.00")}},
            {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("860.00")}},
            {"name": "2-Bedroom Suite (2 Pax)", "capacity": 2, "rates": {"FB": Decimal("1089.00")}}
         ]},
        {"name": "Low Season (Jan-Mar)", "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
         "rooms": [
            {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("455.00")}},
            {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("570.00")}},
            {"name": "2-Bedroom Suite (2 Pax)", "capacity": 2, "rates": {"FB": Decimal("809.00")}}
         ]}
    ]
},


{
    "name": "Ngorongoro Lodge - Member of Melia Collection",
    "tag_label": "Lodge",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Ngorongoro Lodge - Member of Melia Collection is a spectacular 5-star luxury retreat perched on the rim of the world-famous Ngorongoro Crater, offering guests breathtaking panoramic views into one of Africa's greatest natural wonders.",
        "The lodge's exquisite rooms and suites — from the elegant Rim Rooms to the palatial Ngorongoro House — feature floor-to-ceiling windows, refined African-inspired interiors, and private terraces overlooking the crater and surrounding highlands.",
        "Guests dine at the Savannah Restaurant on exceptional à la carte and buffet menus, with a selection of premium drinks, while the Crater Grill, spa, infinity pool, and butler-serviced suites deliver an experience of unrivalled luxury.",
        "Perfectly positioned for early-morning crater descents, the lodge offers unrivalled access to the Big Five, the extraordinary wildlife density of the Ngorongoro Crater, and the rich cultural heritage of the Maasai.",
        "Combining world-class Melia hospitality, iconic architecture, and a UNESCO World Heritage location, Ngorongoro Lodge is the ultimate luxury retreat in Tanzania — an unforgettable experience awaits."
    ],
    "seasons": [
        {
            "name": "High Season (Jan-Feb)",
            "start_day": 4, "start_month": 1, "end_day": 28, "end_month": 2,
            "rooms": [
                {"name": "The Rim Room (Single)", "capacity": 1, "rates": {"BB": Decimal("910.00"), "FB": Decimal("925.00")}},
                {"name": "The Rim Room (Double)", "capacity": 2, "rates": {"BB": Decimal("1025.00"), "FB": Decimal("1090.00")}},
                {"name": "Interconnected The Rim Room", "capacity": 4, "rates": {"BB": Decimal("2335.00"), "FB": Decimal("2400.00")}},
                {"name": "Family Room", "capacity": 3, "rates": {"BB": Decimal("1575.00"), "FB": Decimal("1640.00")}},
                {"name": "Enkaji Junior Suite", "capacity": 3, "rates": {"BB": Decimal("2170.00"), "FB": Decimal("2235.00")}},
                {"name": "Executive Suite", "capacity": 3, "rates": {"BB": Decimal("2345.00"), "FB": Decimal("2410.00")}},
                {"name": "Crater Suite with Terrace", "capacity": 3, "rates": {"BB": Decimal("2435.00"), "FB": Decimal("2495.00")}},
                {"name": "Presidential Suite with Terrace", "capacity": 3, "rates": {"BB": Decimal("3310.00"), "FB": Decimal("3370.00")}},
                {"name": "2 Bedroom Presidential Suite with Terrace", "capacity": 5, "rates": {"BB": Decimal("4395.00"), "FB": Decimal("4460.00")}},
                {"name": "Royal Suite", "capacity": 3, "rates": {"BB": Decimal("4675.00"), "FB": Decimal("4740.00")}},
                {"name": "2 Bedroom Royal Suite", "capacity": 5, "rates": {"BB": Decimal("5765.00"), "FB": Decimal("5830.00")}},
                {"name": "Ngorongoro Suite", "capacity": 7, "rates": {"BB": Decimal("7975.00"), "FB": Decimal("8035.00")}},
                {"name": "4 Bedroom Ngorongoro Suite", "capacity": 9, "rates": {"BB": Decimal("10380.00"), "FB": Decimal("10445.00")}},
                {"name": "Ngorongoro House", "capacity": 7, "rates": {"BB": Decimal("11415.00"), "FB": Decimal("11480.00")}}
            ]
        },
        {
            "name": "Shoulder Season (Mar-May)",
            "start_day": 1, "start_month": 3, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "The Rim Room (Single)", "capacity": 1, "rates": {"BB": Decimal("685.00"), "FB": Decimal("695.00")}},
                {"name": "The Rim Room (Double)", "capacity": 2, "rates": {"BB": Decimal("755.00"), "FB": Decimal("820.00")}},
                {"name": "Interconnected The Rim Room", "capacity": 4, "rates": {"BB": Decimal("1735.00"), "FB": Decimal("1800.00")}},
                {"name": "Family Room", "capacity": 3, "rates": {"BB": Decimal("1165.00"), "FB": Decimal("1230.00")}},
                {"name": "Enkaji Junior Suite", "capacity": 3, "rates": {"BB": Decimal("1615.00"), "FB": Decimal("1675.00")}},
                {"name": "Executive Suite", "capacity": 3, "rates": {"BB": Decimal("1790.00"), "FB": Decimal("1850.00")}},
                {"name": "Crater Suite with Terrace", "capacity": 3, "rates": {"BB": Decimal("1875.00"), "FB": Decimal("1940.00")}},
                {"name": "Presidential Suite with Terrace", "capacity": 3, "rates": {"BB": Decimal("2555.00"), "FB": Decimal("2620.00")}},
                {"name": "2 Bedroom Presidential Suite with Terrace", "capacity": 5, "rates": {"BB": Decimal("3370.00"), "FB": Decimal("3435.00")}},
                {"name": "Royal Suite", "capacity": 3, "rates": {"BB": Decimal("3815.00"), "FB": Decimal("3880.00")}},
                {"name": "2 Bedroom Royal Suite", "capacity": 5, "rates": {"BB": Decimal("4630.00"), "FB": Decimal("4695.00")}},
                {"name": "Ngorongoro Suite", "capacity": 7, "rates": {"BB": Decimal("6310.00"), "FB": Decimal("6375.00")}},
                {"name": "4 Bedroom Ngorongoro Suite", "capacity": 9, "rates": {"BB": Decimal("8160.00"), "FB": Decimal("8225.00")}},
                {"name": "Ngorongoro House", "capacity": 7, "rates": {"BB": Decimal("9050.00"), "FB": Decimal("9110.00")}}
            ]
        },
        {
            "name": "High Season (Jun)",
            "start_day": 1, "start_month": 6, "end_day": 30, "end_month": 6,
            "rooms": [
                {"name": "The Rim Room (Single)", "capacity": 1, "rates": {"BB": Decimal("910.00"), "FB": Decimal("925.00")}},
                {"name": "The Rim Room (Double)", "capacity": 2, "rates": {"BB": Decimal("1025.00"), "FB": Decimal("1090.00")}},
                {"name": "Interconnected The Rim Room", "capacity": 4, "rates": {"BB": Decimal("2335.00"), "FB": Decimal("2400.00")}},
                {"name": "Family Room", "capacity": 3, "rates": {"BB": Decimal("1575.00"), "FB": Decimal("1640.00")}},
                {"name": "Enkaji Junior Suite", "capacity": 3, "rates": {"BB": Decimal("2170.00"), "FB": Decimal("2235.00")}},
                {"name": "Executive Suite", "capacity": 3, "rates": {"BB": Decimal("2345.00"), "FB": Decimal("2410.00")}},
                {"name": "Crater Suite with Terrace", "capacity": 3, "rates": {"BB": Decimal("2435.00"), "FB": Decimal("2495.00")}},
                {"name": "Presidential Suite with Terrace", "capacity": 3, "rates": {"BB": Decimal("3310.00"), "FB": Decimal("3370.00")}},
                {"name": "2 Bedroom Presidential Suite with Terrace", "capacity": 5, "rates": {"BB": Decimal("4395.00"), "FB": Decimal("4460.00")}},
                {"name": "Royal Suite", "capacity": 3, "rates": {"BB": Decimal("4675.00"), "FB": Decimal("4740.00")}},
                {"name": "2 Bedroom Royal Suite", "capacity": 5, "rates": {"BB": Decimal("5765.00"), "FB": Decimal("5830.00")}},
                {"name": "Ngorongoro Suite", "capacity": 7, "rates": {"BB": Decimal("7975.00"), "FB": Decimal("8035.00")}},
                {"name": "4 Bedroom Ngorongoro Suite", "capacity": 9, "rates": {"BB": Decimal("10380.00"), "FB": Decimal("10445.00")}},
                {"name": "Ngorongoro House", "capacity": 7, "rates": {"BB": Decimal("11415.00"), "FB": Decimal("11480.00")}}
            ]
        },
        {
            "name": "Peak Season (Jul-Sep)",
            "start_day": 1, "start_month": 7, "end_day": 30, "end_month": 9,
            "rooms": [
                {"name": "The Rim Room (Single)", "capacity": 1, "rates": {"BB": Decimal("1220.00"), "FB": Decimal("1230.00")}},
                {"name": "The Rim Room (Double)", "capacity": 2, "rates": {"BB": Decimal("1385.00"), "FB": Decimal("1450.00")}},
                {"name": "Interconnected The Rim Room", "capacity": 4, "rates": {"BB": Decimal("3120.00"), "FB": Decimal("3185.00")}},
                {"name": "Family Room", "capacity": 3, "rates": {"BB": Decimal("2110.00"), "FB": Decimal("2175.00")}},
                {"name": "Enkaji Junior Suite", "capacity": 3, "rates": {"BB": Decimal("2910.00"), "FB": Decimal("2970.00")}},
                {"name": "Executive Suite", "capacity": 3, "rates": {"BB": Decimal("3085.00"), "FB": Decimal("3145.00")}},
                {"name": "Crater Suite with Terrace", "capacity": 3, "rates": {"BB": Decimal("3170.00"), "FB": Decimal("3235.00")}},
                {"name": "Presidential Suite with Terrace", "capacity": 3, "rates": {"BB": Decimal("4305.00"), "FB": Decimal("4370.00")}},
                {"name": "2 Bedroom Presidential Suite with Terrace", "capacity": 5, "rates": {"BB": Decimal("5750.00"), "FB": Decimal("5815.00")}},
                {"name": "Royal Suite", "capacity": 3, "rates": {"BB": Decimal("6405.00"), "FB": Decimal("6470.00")}},
                {"name": "2 Bedroom Royal Suite", "capacity": 5, "rates": {"BB": Decimal("7850.00"), "FB": Decimal("7915.00")}},
                {"name": "Ngorongoro Suite", "capacity": 7, "rates": {"BB": Decimal("10190.00"), "FB": Decimal("10250.00")}},
                {"name": "4 Bedroom Ngorongoro Suite", "capacity": 9, "rates": {"BB": Decimal("13335.00"), "FB": Decimal("13400.00")}},
                {"name": "Ngorongoro House", "capacity": 7, "rates": {"BB": Decimal("14580.00"), "FB": Decimal("14645.00")}}
            ]
        },
        {
            "name": "High Season (Oct)",
            "start_day": 1, "start_month": 10, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "The Rim Room (Single)", "capacity": 1, "rates": {"BB": Decimal("910.00"), "FB": Decimal("925.00")}},
                {"name": "The Rim Room (Double)", "capacity": 2, "rates": {"BB": Decimal("1025.00"), "FB": Decimal("1090.00")}},
                {"name": "Interconnected The Rim Room", "capacity": 4, "rates": {"BB": Decimal("2335.00"), "FB": Decimal("2400.00")}},
                {"name": "Family Room", "capacity": 3, "rates": {"BB": Decimal("1575.00"), "FB": Decimal("1640.00")}},
                {"name": "Enkaji Junior Suite", "capacity": 3, "rates": {"BB": Decimal("2170.00"), "FB": Decimal("2235.00")}},
                {"name": "Executive Suite", "capacity": 3, "rates": {"BB": Decimal("2345.00"), "FB": Decimal("2410.00")}},
                {"name": "Crater Suite with Terrace", "capacity": 3, "rates": {"BB": Decimal("2435.00"), "FB": Decimal("2495.00")}},
                {"name": "Presidential Suite with Terrace", "capacity": 3, "rates": {"BB": Decimal("3310.00"), "FB": Decimal("3370.00")}},
                {"name": "2 Bedroom Presidential Suite with Terrace", "capacity": 5, "rates": {"BB": Decimal("4395.00"), "FB": Decimal("4460.00")}},
                {"name": "Royal Suite", "capacity": 3, "rates": {"BB": Decimal("4675.00"), "FB": Decimal("4740.00")}},
                {"name": "2 Bedroom Royal Suite", "capacity": 5, "rates": {"BB": Decimal("5765.00"), "FB": Decimal("5830.00")}},
                {"name": "Ngorongoro Suite", "capacity": 7, "rates": {"BB": Decimal("7975.00"), "FB": Decimal("8035.00")}},
                {"name": "4 Bedroom Ngorongoro Suite", "capacity": 9, "rates": {"BB": Decimal("10380.00"), "FB": Decimal("10445.00")}},
                {"name": "Ngorongoro House", "capacity": 7, "rates": {"BB": Decimal("11415.00"), "FB": Decimal("11480.00")}}
            ]
        },
        {
            "name": "Shoulder Season (Nov-Dec 21)",
            "start_day": 1, "start_month": 11, "end_day": 21, "end_month": 12,
            "rooms": [
                {"name": "The Rim Room (Single)", "capacity": 1, "rates": {"BB": Decimal("685.00"), "FB": Decimal("695.00")}},
                {"name": "The Rim Room (Double)", "capacity": 2, "rates": {"BB": Decimal("755.00"), "FB": Decimal("820.00")}},
                {"name": "Interconnected The Rim Room", "capacity": 4, "rates": {"BB": Decimal("1735.00"), "FB": Decimal("1800.00")}},
                {"name": "Family Room", "capacity": 3, "rates": {"BB": Decimal("1165.00"), "FB": Decimal("1230.00")}},
                {"name": "Enkaji Junior Suite", "capacity": 3, "rates": {"BB": Decimal("1615.00"), "FB": Decimal("1675.00")}},
                {"name": "Executive Suite", "capacity": 3, "rates": {"BB": Decimal("1790.00"), "FB": Decimal("1850.00")}},
                {"name": "Crater Suite with Terrace", "capacity": 3, "rates": {"BB": Decimal("1875.00"), "FB": Decimal("1940.00")}},
                {"name": "Presidential Suite with Terrace", "capacity": 3, "rates": {"BB": Decimal("2555.00"), "FB": Decimal("2620.00")}},
                {"name": "2 Bedroom Presidential Suite with Terrace", "capacity": 5, "rates": {"BB": Decimal("3370.00"), "FB": Decimal("3435.00")}},
                {"name": "Royal Suite", "capacity": 3, "rates": {"BB": Decimal("3815.00"), "FB": Decimal("3880.00")}},
                {"name": "2 Bedroom Royal Suite", "capacity": 5, "rates": {"BB": Decimal("4630.00"), "FB": Decimal("4695.00")}},
                {"name": "Ngorongoro Suite", "capacity": 7, "rates": {"BB": Decimal("6310.00"), "FB": Decimal("6375.00")}},
                {"name": "4 Bedroom Ngorongoro Suite", "capacity": 9, "rates": {"BB": Decimal("8160.00"), "FB": Decimal("8225.00")}},
                {"name": "Ngorongoro House", "capacity": 7, "rates": {"BB": Decimal("9050.00"), "FB": Decimal("9110.00")}}
            ]
        },
        {
            "name": "Peak Season (Festive)",
            "start_day": 22, "start_month": 12, "end_day": 3, "end_month": 1,
            "rooms": [
                {"name": "The Rim Room (Single)", "capacity": 1, "rates": {"BB": Decimal("1220.00"), "FB": Decimal("1230.00")}},
                {"name": "The Rim Room (Double)", "capacity": 2, "rates": {"BB": Decimal("1385.00"), "FB": Decimal("1450.00")}},
                {"name": "Interconnected The Rim Room", "capacity": 4, "rates": {"BB": Decimal("3120.00"), "FB": Decimal("3185.00")}},
                {"name": "Family Room", "capacity": 3, "rates": {"BB": Decimal("2110.00"), "FB": Decimal("2175.00")}},
                {"name": "Enkaji Junior Suite", "capacity": 3, "rates": {"BB": Decimal("2910.00"), "FB": Decimal("2970.00")}},
                {"name": "Executive Suite", "capacity": 3, "rates": {"BB": Decimal("3085.00"), "FB": Decimal("3145.00")}},
                {"name": "Crater Suite with Terrace", "capacity": 3, "rates": {"BB": Decimal("3170.00"), "FB": Decimal("3235.00")}},
                {"name": "Presidential Suite with Terrace", "capacity": 3, "rates": {"BB": Decimal("4305.00"), "FB": Decimal("4370.00")}},
                {"name": "2 Bedroom Presidential Suite with Terrace", "capacity": 5, "rates": {"BB": Decimal("5750.00"), "FB": Decimal("5815.00")}},
                {"name": "Royal Suite", "capacity": 3, "rates": {"BB": Decimal("6405.00"), "FB": Decimal("6470.00")}},
                {"name": "2 Bedroom Royal Suite", "capacity": 5, "rates": {"BB": Decimal("7850.00"), "FB": Decimal("7915.00")}},
                {"name": "Ngorongoro Suite", "capacity": 7, "rates": {"BB": Decimal("10190.00"), "FB": Decimal("10250.00")}},
                {"name": "4 Bedroom Ngorongoro Suite", "capacity": 9, "rates": {"BB": Decimal("13335.00"), "FB": Decimal("13400.00")}},
                {"name": "Ngorongoro House", "capacity": 7, "rates": {"BB": Decimal("14580.00"), "FB": Decimal("14645.00")}}
            ]
        }
    ]
},

{
    "name": "Embalakai Ngorongoro Camp",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Embalakai Ngorongoro Camp is an authentic tented retreat set in the heart of the Ngorongoro Conservation Area, offering guests an intimate and comfortable base for exploring the world-famous Ngorongoro Crater.",
        "Each elegantly furnished en-suite tent features comfortable single, double, twin, or triple bedding, with refined African-inspired decor and private verandas overlooking the surrounding highland wilderness.",
        "Guests enjoy delicious full-board dining — breakfast, hot lunch, dinner, and light snacks — complemented by drinking water, tea, and coffee, served in the camp's welcoming lounge and dining area.",
        "The camp's strategic location provides early access to the Ngorongoro Crater, allowing guests to witness the Big Five and the extraordinary wildlife density of this UNESCO World Heritage Site.",
        "Combining authentic bush charm, warm Tanzanian hospitality, and an unrivalled highland location, Embalakai Ngorongoro Camp is the perfect base for an unforgettable crater adventure."
    ],
    "seasons": [
        {
            "name": "Peak Season (Jan-Feb)",
            "start_day": 1, "start_month": 1, "end_day": 28, "end_month": 2,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("290.00")}},
                {"name": "Double/Twin", "capacity": 2, "rates": {"FB": Decimal("460.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("570.00")}}
            ]
        },
        {
            "name": "Peak Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("290.00")}},
                {"name": "Double/Twin", "capacity": 2, "rates": {"FB": Decimal("460.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("570.00")}}
            ]
        },
        {
            "name": "Peak Season (Festive)",
            "start_day": 15, "start_month": 12, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("290.00")}},
                {"name": "Double/Twin", "capacity": 2, "rates": {"FB": Decimal("460.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("570.00")}}
            ]
        },
        {
            "name": "High Season (Mar)",
            "start_day": 1, "start_month": 3, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("240.00")}},
                {"name": "Double/Twin", "capacity": 2, "rates": {"FB": Decimal("440.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("525.00")}}
            ]
        },
        {
            "name": "High Season (Nov-Dec 14)",
            "start_day": 1, "start_month": 11, "end_day": 14, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("240.00")}},
                {"name": "Double/Twin", "capacity": 2, "rates": {"FB": Decimal("440.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("525.00")}}
            ]
        },
        {
            "name": "Green Season",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("195.00")}},
                {"name": "Double/Twin", "capacity": 2, "rates": {"FB": Decimal("330.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("468.00")}}
            ]
        }
    ]
},

{
    "name": "Nyikani Migration Camp - Ndutu",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 59.00,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 35.40,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Nyikani Migration Camp - Ndutu is a seasonal mobile camp set in the Ndutu area of the Ngorongoro Conservation Area, positioned to follow the Great Migration during the calving season.",
        "Each comfortable tent features en-suite facilities, cosy bedding, and a private veranda overlooking the short-grass plains where wildebeest and zebra congregate in their thousands.",
        "Guests enjoy delicious full-board dining, complimentary drinking water, tea, and coffee, and evenings around the campfire under a sky blazing with stars.",
        "The camp's prime location offers unrivalled access to predator action, calving grounds, and the spectacular wildlife drama of the southern Serengeti ecosystem.",
        "Combining authentic bush charm, warm hospitality, and an unbeatable location, Nyikani Ndutu is the perfect base for an unforgettable migration adventure."
    ],
    "seasons": [
        {
            "name": "High Season (Jan-Apr 14)",
            "start_day": 11, "start_month": 1, "end_day": 14, "end_month": 4,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"FB": Decimal("210.00")}},
                {"name": "Double Room", "capacity": 2, "rates": {"FB": Decimal("420.00")}},
                {"name": "Triple Room", "capacity": 3, "rates": {"FB": Decimal("630.00")}},
                {"name": "Family Tent", "capacity": 4, "rates": {"FB": Decimal("840.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 20, "start_month": 12, "end_day": 3, "end_month": 1,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"FB": Decimal("210.00")}},
                {"name": "Double Room", "capacity": 2, "rates": {"FB": Decimal("420.00")}},
                {"name": "Triple Room", "capacity": 3, "rates": {"FB": Decimal("630.00")}},
                {"name": "Family Tent", "capacity": 4, "rates": {"FB": Decimal("840.00")}}
            ]
        },
        {
            "name": "Low Season (Dec 1-19)",
            "start_day": 1, "start_month": 12, "end_day": 19, "end_month": 12,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"FB": Decimal("170.00")}},
                {"name": "Double Room", "capacity": 2, "rates": {"FB": Decimal("340.00")}},
                {"name": "Triple Room", "capacity": 3, "rates": {"FB": Decimal("510.00")}},
                {"name": "Family Tent", "capacity": 4, "rates": {"FB": Decimal("680.00")}}
            ]
        }
    ]
}





],


"Lake Manyara National Park":[
    {
    "name": "Lake Manyara Tortilis Camp",
    "tag_label": "TentedCamp",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 47.20,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 40.00,
    "concession_fee_child_resident": 10.00,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Lake Manyara Tortilis Camp is a charming tented retreat set in a secluded corner of Lake Manyara National Park, surrounded by groundwater forests, acacia woodlands, and breathtaking views of the Rift Valley escarpment.",
        "Each comfortable tent features en-suite facilities, cosy bedding, and a private veranda where guests can relax while watching elephants, baboons, and the famous tree-climbing lions of Manyara.",
        "Guests enjoy delicious full-board dining, refreshing drinks, and evenings around the campfire under a sky blazing with stars — the essence of an authentic safari experience.",
        "The camp's prime location offers exceptional access to Lake Manyara's legendary birdlife, including thousands of flamingos, pelicans, and storks, as well as the park's famous hippo pool.",
        "Combining authentic bush charm, warm hospitality, and an unbeatable location, Lake Manyara Tortilis Camp is the perfect base for exploring one of Tanzania's most scenic national parks."
    ],
    "seasons": [
        {
            "name": "High Season (Jan-Feb)",
            "start_day": 1, "start_month": 1, "end_day": 28, "end_month": 2,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("200.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("320.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("432.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Oct)",
            "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("200.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("320.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("432.00")}}
            ]
        },
        {
            "name": "High Season (Festive)",
            "start_day": 16, "start_month": 12, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("200.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("320.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("432.00")}}
            ]
        },
        {
            "name": "Low Season (Mar)",
            "start_day": 1, "start_month": 3, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("145.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("228.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("312.00")}}
            ]
        },
        {
            "name": "Low Season (Nov-Dec 15)",
            "start_day": 1, "start_month": 11, "end_day": 15, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("145.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("228.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("312.00")}}
            ]
        },
        {
            "name": "Special Offer Season",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("99.00")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("198.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("297.00")}}
            ]
        }
    ]
},

{
    "name": "Manyara's Secret",
    "tag_label": "Lodge",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": None,
    "concession_fee_child_non_resident": None,
    "concession_fee_adult_resident": None,
    "concession_fee_child_resident": None,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Manyara's Secret is an exclusive collection of private villas set within a pristine Wildlife Management Area near Lake Manyara, offering guests a hidden sanctuary of luxury, privacy, and breathtaking natural beauty.",
        "Each beautifully designed villa features private plunge pools, en-suite bathrooms, spacious living areas, and expansive terraces overlooking the baobab-dotted landscape and distant Rift Valley escarpment.",
        "Guests dine on exquisite à la carte menus crafted from fresh, seasonal ingredients, served with warm hospitality — no buffets, just personalised fine dining in a stunning natural setting.",
        "From the romantic honeymoon villa with its private baobab terrace to interconnecting family villas and accessible rooms, every detail is thoughtfully designed for an unforgettable stay.",
        "Whether enjoying a Maasai cultural experience, a massage under the open sky, or simply relaxing in your private plunge pool, Manyara's Secret delivers a truly exceptional Tanzanian retreat."
    ],
    "seasons": [
        {
            "name": "Peak Season (Dec-Feb)",
            "start_day": 19, "start_month": 12, "end_day": 28, "end_month": 2,
            "rooms": [
                {"name": "2 Pax Villa", "capacity": 2, "rates": {"FB": Decimal("395.00")}},
                {"name": "2 Pax Semi-Detached Villa", "capacity": 2, "rates": {"FB": Decimal("385.00")}},
                {"name": "4 Pax Villa", "capacity": 4, "rates": {"FB": Decimal("715.00")}},
                {"name": "6 Pax Villa", "capacity": 6, "rates": {"FB": Decimal("1015.00")}},
                {"name": "8 Pax Villa", "capacity": 8, "rates": {"FB": Decimal("1195.00")}}
            ]
        },
        {
            "name": "Peak Season (Jul-Oct)",
            "start_day": 1, "start_month": 7, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "2 Pax Villa", "capacity": 2, "rates": {"FB": Decimal("395.00")}},
                {"name": "2 Pax Semi-Detached Villa", "capacity": 2, "rates": {"FB": Decimal("385.00")}},
                {"name": "4 Pax Villa", "capacity": 4, "rates": {"FB": Decimal("715.00")}},
                {"name": "6 Pax Villa", "capacity": 6, "rates": {"FB": Decimal("1015.00")}},
                {"name": "8 Pax Villa", "capacity": 8, "rates": {"FB": Decimal("1195.00")}}
            ]
        },
        {
            "name": "High Season",
            "start_day": 1, "start_month": 6, "end_day": 30, "end_month": 6,
            "rooms": [
                {"name": "2 Pax Villa", "capacity": 2, "rates": {"FB": Decimal("355.00")}},
                {"name": "2 Pax Semi-Detached Villa", "capacity": 2, "rates": {"FB": Decimal("345.00")}},
                {"name": "4 Pax Villa", "capacity": 4, "rates": {"FB": Decimal("635.00")}},
                {"name": "6 Pax Villa", "capacity": 6, "rates": {"FB": Decimal("885.00")}},
                {"name": "8 Pax Villa", "capacity": 8, "rates": {"FB": Decimal("1095.00")}}
            ]
        },
        {
            "name": "Green Season (Mar-May)",
            "start_day": 1, "start_month": 3, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "2 Pax Villa", "capacity": 2, "rates": {"FB": Decimal("285.00")}},
                {"name": "2 Pax Semi-Detached Villa", "capacity": 2, "rates": {"FB": Decimal("275.00")}},
                {"name": "4 Pax Villa", "capacity": 4, "rates": {"FB": Decimal("525.00")}},
                {"name": "6 Pax Villa", "capacity": 6, "rates": {"FB": Decimal("745.00")}},
                {"name": "8 Pax Villa", "capacity": 8, "rates": {"FB": Decimal("910.00")}}
            ]
        },
        {
            "name": "Green Season (Nov-Dec 18)",
            "start_day": 1, "start_month": 11, "end_day": 18, "end_month": 12,
            "rooms": [
                {"name": "2 Pax Villa", "capacity": 2, "rates": {"FB": Decimal("285.00")}},
                {"name": "2 Pax Semi-Detached Villa", "capacity": 2, "rates": {"FB": Decimal("275.00")}},
                {"name": "4 Pax Villa", "capacity": 4, "rates": {"FB": Decimal("525.00")}},
                {"name": "6 Pax Villa", "capacity": 6, "rates": {"FB": Decimal("745.00")}},
                {"name": "8 Pax Villa", "capacity": 8, "rates": {"FB": Decimal("910.00")}}
            ]
        }
    ]
},
{
    "name": "Lake Manyara Serena Safari Lodge",
    "tag_label": "Lodge",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 47.20,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 40.00,
    "concession_fee_child_resident": 10.00,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Perched on the dramatic rim of the Great Rift Valley escarpment, Lake Manyara Serena Safari Lodge offers breathtaking views over Lake Manyara, its shimmering waters, and the vast plains below.",
        "The lodge's elegant circular cottages are inspired by traditional Maasai architecture, each featuring en-suite facilities and private verandas overlooking the lake and surrounding forests.",
        "Guests enjoy exceptional full-board dining, a stunning infinity pool perched on the escarpment edge, and evenings under the stars with the sounds of the African bush.",
        "Perfectly located for exploring Lake Manyara National Park, home to tree-climbing lions, giant elephants, and millions of flamingos along the lakeshore.",
        "Combining iconic Serena hospitality, distinctive architecture, and an unrivalled location, Lake Manyara Serena Safari Lodge is the perfect northern circuit retreat."
    ],
    "seasons": [
        {"name": "High Season (Jan)", "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 1,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("237.75")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("317.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("475.50")}}
         ]},
        {"name": "Peak Season (Feb)", "start_day": 1, "start_month": 2, "end_day": 28, "end_month": 2,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("303.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("404.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("606.00")}}
         ]},
        {"name": "High Season (Mar)", "start_day": 1, "start_month": 3, "end_day": 31, "end_month": 3,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("237.75")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("317.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("475.50")}}
         ]},
        {"name": "Green Season", "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("189.75")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("253.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("379.50")}}
         ]},
        {"name": "Peak Season (Jun-Oct)", "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("303.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("404.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("606.00")}}
         ]},
        {"name": "High Season (Nov-Dec)", "start_day": 1, "start_month": 11, "end_day": 22, "end_month": 12,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("237.75")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("317.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("475.50")}}
         ]},
        {"name": "Peak Season (Festive)", "start_day": 23, "start_month": 12, "end_day": 1, "end_month": 1,
         "rooms": [
            {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("303.00")}},
            {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("404.00")}},
            {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("606.00")}}
         ]}
    ]
},

{
    "name": "Lake Manyara Kilimamoja Lodge",
    "tag_label": "Lodge",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 47.20,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 40.00,
    "concession_fee_child_resident": 10.00,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Lake Manyara Kilimamoja Lodge is a luxurious retreat perched on the edge of the Great Rift Valley escarpment, offering breathtaking panoramic views over Lake Manyara and the surrounding highlands.",
        "The lodge's elegant rooms and exclusive 2-bedroom suites with private pools feature en-suite facilities, refined African decor, and private verandas overlooking the lake and forests.",
        "Guests enjoy exceptional full-board dining, a stunning infinity pool, and evenings under the stars with the sounds of the African bush in the distance.",
        "Perfectly located for exploring Lake Manyara National Park, home to tree-climbing lions, giant elephants, and millions of flamingos along the lakeshore.",
        "Combining luxury, exclusivity, and an unrivalled location, Lake Manyara Kilimamoja Lodge is the ultimate northern circuit retreat."
    ],
    "seasons": [
        {"name": "Peak Season (Jul-Oct)", "start_day": 1, "start_month": 7, "end_day": 31, "end_month": 10,
         "rooms": [
            {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("795.00")}},
            {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("990.00")}},
            {"name": "2-Bedroom Suite (4 Pax)", "capacity": 4, "rates": {"FB": Decimal("2826.00")}}
         ]},
        {"name": "Peak Season (Festive)", "start_day": 20, "start_month": 12, "end_day": 31, "end_month": 12,
         "rooms": [
            {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("795.00")}},
            {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("990.00")}},
            {"name": "2-Bedroom Suite (4 Pax)", "capacity": 4, "rates": {"FB": Decimal("2826.00")}}
         ]},
        {"name": "High Season (Jun)", "start_day": 1, "start_month": 6, "end_day": 30, "end_month": 6,
         "rooms": [
            {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("720.00")}},
            {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("900.00")}},
            {"name": "2-Bedroom Suite (4 Pax)", "capacity": 4, "rates": {"FB": Decimal("2049.00")}}
         ]},
        {"name": "High Season (Nov-Dec 19)", "start_day": 1, "start_month": 11, "end_day": 19, "end_month": 12,
         "rooms": [
            {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("720.00")}},
            {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("900.00")}},
            {"name": "2-Bedroom Suite (4 Pax)", "capacity": 4, "rates": {"FB": Decimal("2049.00")}}
         ]},
        {"name": "Low Season (Jan-Mar)", "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 3,
         "rooms": [
            {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("480.00")}},
            {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("600.00")}},
            {"name": "2-Bedroom Suite (4 Pax)", "capacity": 4, "rates": {"FB": Decimal("1485.00")}}
         ]}
    ]
},

{
    "name": "Mawe Mawe Lake Manyara",
    "tag_label": "Lodge",
    "park_status": "OutsidePark",  # TODO: Verify - iko karibu Lake Manyara
    "concession_fee_adult_non_resident": None,
    "concession_fee_child_non_resident": None,
    "concession_fee_adult_resident": None,
    "concession_fee_child_resident": None,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Mawe Mawe Lake Manyara is a charming retreat set near the shores of Lake Manyara, offering guests a peaceful and comfortable base for exploring one of Tanzania's most scenic national parks.",
        "The lodge offers Single, Double, Triple, and spacious Family rooms — each thoughtfully furnished with en-suite facilities, cosy bedding, and views over the surrounding gardens and natural landscape.",
        "Guests enjoy delicious full-board dining, refreshing drinks, and warm Tanzanian hospitality in a relaxed and welcoming atmosphere, perfect for families, couples, and small groups.",
        "The lodge's prime location provides easy access to Lake Manyara National Park, home to tree-climbing lions, giant elephants, and millions of flamingos along the lakeshore.",
        "Combining comfort, excellent value, and an ideal location, Mawe Mawe Lake Manyara is the perfect base for an unforgettable northern circuit safari adventure."
    ],
    "seasons": [
        {
            "name": "Full Year",
            "start_day": 1, "start_month": 1, "end_day": 31, "end_month": 12,
            "rooms": [
                {"name": "Single", "capacity": 1, "rates": {"FB": Decimal("159.90")}},
                {"name": "Double", "capacity": 2, "rates": {"FB": Decimal("246.00")}},
                {"name": "Triple", "capacity": 3, "rates": {"FB": Decimal("369.00")}},
                {"name": "Quad/Family", "capacity": 4, "rates": {"FB": Decimal("492.00")}}
            ]
        }
    ]
}


],

"Mikumi National Park":[
    {
    "name": "Mikumi Wildlife Lodge",
    "tag_label": "Lodge",
    "park_status": "InsidePark",
    "concession_fee_adult_non_resident": 29.50,
    "concession_fee_child_non_resident": 11.80,
    "concession_fee_adult_resident": 29.50,
    "concession_fee_child_resident": 11.80,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Mikumi Wildlife Lodge is a comfortable retreat set on the edge of Mikumi National Park, offering guests a peaceful base for exploring one of Tanzania's most accessible and wildlife-rich parks.",
        "The lodge offers Standard and Deluxe rooms, each featuring en-suite facilities, cosy bedding, and views over the surrounding gardens and distant wilderness.",
        "Guests enjoy delicious full-board dining, a refreshing swimming pool, and warm Tanzanian hospitality in a relaxed, family-friendly setting.",
        "The lodge's prime location provides easy access to Mikumi's famous wildlife, including elephants, lions, giraffes, zebras, and over 400 species of birds.",
        "Combining comfort, excellent value, and an ideal location, Mikumi Wildlife Lodge is the perfect base for exploring southern Tanzania's premier national park."
    ],
    "seasons": [
        {"name": "High Season (Jul-Oct)", "start_day": 1, "start_month": 7, "end_day": 31, "end_month": 10,
         "rooms": [
            {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("480.00")}},
            {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("600.00")}},
            {"name": "Deluxe Single", "capacity": 1, "rates": {"FB": Decimal("640.00")}},
            {"name": "Deluxe Double", "capacity": 2, "rates": {"FB": Decimal("800.00")}}
         ]},
        {"name": "High Season (Festive)", "start_day": 24, "start_month": 12, "end_day": 4, "end_month": 1,
         "rooms": [
            {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("480.00")}},
            {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("600.00")}},
            {"name": "Deluxe Single", "capacity": 1, "rates": {"FB": Decimal("640.00")}},
            {"name": "Deluxe Double", "capacity": 2, "rates": {"FB": Decimal("800.00")}}
         ]},
        {"name": "Low Season (Jan-Jun)", "start_day": 5, "start_month": 1, "end_day": 30, "end_month": 6,
         "rooms": [
            {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("400.00")}},
            {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("500.00")}},
            {"name": "Deluxe Single", "capacity": 1, "rates": {"FB": Decimal("560.00")}},
            {"name": "Deluxe Double", "capacity": 2, "rates": {"FB": Decimal("700.00")}}
         ]},
        {"name": "Low Season (Nov-Dec 23)", "start_day": 1, "start_month": 11, "end_day": 23, "end_month": 12,
         "rooms": [
            {"name": "Standard Single", "capacity": 1, "rates": {"FB": Decimal("400.00")}},
            {"name": "Standard Double", "capacity": 2, "rates": {"FB": Decimal("500.00")}},
            {"name": "Deluxe Single", "capacity": 1, "rates": {"FB": Decimal("560.00")}},
            {"name": "Deluxe Double", "capacity": 2, "rates": {"FB": Decimal("700.00")}}
         ]}
    ]
}

],

"Zanzibar Island":[
    {
    "name": "Royal Zanzibar Beach Resort",
    "tag_label": "Resort",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": None,
    "concession_fee_child_non_resident": None,
    "concession_fee_adult_resident": None,
    "concession_fee_child_resident": None,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Royal Zanzibar Beach Resort is a spectacular 5-star all-inclusive retreat set on the pristine white sands of Nungwi Beach, on the northern tip of Zanzibar Island, offering guests an unforgettable tropical escape.",
        "The resort's elegantly appointed rooms and suites feature refined Swahili-inspired decor, en-suite facilities, private balconies or terraces, and views over the turquoise Indian Ocean or lush tropical gardens.",
        "Guests enjoy exceptional all-inclusive dining across multiple restaurants, unlimited premium beverages, a stunning infinity pool, a world-class spa, and a private stretch of powder-white beach with crystal-clear waters.",
        "The resort's prime location offers easy access to Zanzibar's legendary diving and snorkelling sites, historic Stone Town, spice plantations, and the rich cultural heritage of the Swahili Coast.",
        "Combining luxurious comfort, warm Zanzibari hospitality, and breathtaking ocean views, Royal Zanzibar Beach Resort is the ultimate tropical paradise for couples, families, and discerning travellers alike."
    ],
    "seasons": [
        {
            "name": "Season (Nov-Dec 23)",
            "start_day": 1, "start_month": 11, "end_day": 23, "end_month": 12,
            "rooms": [
                {"name": "Standard Room (Single)", "capacity": 1, "rates": {"AI": Decimal("297.00")}},
                {"name": "Standard Room (Double)", "capacity": 2, "rates": {"AI": Decimal("396.00")}},
                {"name": "Superior Deluxe (Double)", "capacity": 2, "rates": {"AI": Decimal("528.00")}},
                {"name": "Ocean Front Suite (Double)", "capacity": 2, "rates": {"AI": Decimal("628.00")}}
            ]
        },
        {
            "name": "Festive Season",
            "start_day": 24, "start_month": 12, "end_day": 5, "end_month": 1,
            "rooms": [
                {"name": "Standard Room (Single)", "capacity": 1, "rates": {"AI": Decimal("710.00")}},
                {"name": "Standard Room (Double)", "capacity": 2, "rates": {"AI": Decimal("946.00")}},
                {"name": "Superior Deluxe (Double)", "capacity": 2, "rates": {"AI": Decimal("1078.00")}},
                {"name": "Ocean Front Suite (Double)", "capacity": 2, "rates": {"AI": Decimal("1178.00")}}
            ]
        },
        {
            "name": "High Season (Jan-Mar)",
            "start_day": 6, "start_month": 1, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Standard Room (Single)", "capacity": 1, "rates": {"AI": Decimal("405.00")}},
                {"name": "Standard Room (Double)", "capacity": 2, "rates": {"AI": Decimal("540.00")}},
                {"name": "Superior Deluxe (Double)", "capacity": 2, "rates": {"AI": Decimal("672.00")}},
                {"name": "Ocean Front Suite (Double)", "capacity": 2, "rates": {"AI": Decimal("772.00")}}
            ]
        },
        {
            "name": "Low Season (Apr-May)",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Standard Room (Single)", "capacity": 1, "rates": {"AI": Decimal("224.00")}},
                {"name": "Standard Room (Double)", "capacity": 2, "rates": {"AI": Decimal("298.00")}},
                {"name": "Superior Deluxe (Double)", "capacity": 2, "rates": {"AI": Decimal("430.00")}},
                {"name": "Ocean Front Suite (Double)", "capacity": 2, "rates": {"AI": Decimal("530.00")}}
            ]
        },
        {
            "name": "Shoulder Season (Jun)",
            "start_day": 1, "start_month": 6, "end_day": 30, "end_month": 6,
            "rooms": [
                {"name": "Standard Room (Single)", "capacity": 1, "rates": {"AI": Decimal("281.00")}},
                {"name": "Standard Room (Double)", "capacity": 2, "rates": {"AI": Decimal("374.00")}},
                {"name": "Superior Deluxe (Double)", "capacity": 2, "rates": {"AI": Decimal("506.00")}},
                {"name": "Ocean Front Suite (Double)", "capacity": 2, "rates": {"AI": Decimal("606.00")}}
            ]
        },
        {
            "name": "High Season (Jul-Aug)",
            "start_day": 1, "start_month": 7, "end_day": 31, "end_month": 8,
            "rooms": [
                {"name": "Standard Room (Single)", "capacity": 1, "rates": {"AI": Decimal("405.00")}},
                {"name": "Standard Room (Double)", "capacity": 2, "rates": {"AI": Decimal("540.00")}},
                {"name": "Superior Deluxe (Double)", "capacity": 2, "rates": {"AI": Decimal("672.00")}},
                {"name": "Ocean Front Suite (Double)", "capacity": 2, "rates": {"AI": Decimal("772.00")}}
            ]
        },
        {
            "name": "High Season (Sep-Oct)",
            "start_day": 1, "start_month": 9, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Standard Room (Single)", "capacity": 1, "rates": {"AI": Decimal("297.00")}},
                {"name": "Standard Room (Double)", "capacity": 2, "rates": {"AI": Decimal("396.00")}},
                {"name": "Superior Deluxe (Double)", "capacity": 2, "rates": {"AI": Decimal("528.00")}},
                {"name": "Ocean Front Suite (Double)", "capacity": 2, "rates": {"AI": Decimal("628.00")}}
            ]
        }
    ]
},


{
    "name": "Nungwi Dreams by Mantis",
    "tag_label": "Resort",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": None,
    "concession_fee_child_non_resident": None,
    "concession_fee_adult_resident": None,
    "concession_fee_child_resident": None,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Nungwi Dreams by Mantis is a stunning boutique beach resort set on the powder-white sands of Nungwi Beach, on the northern tip of Zanzibar Island, offering guests an intimate and luxurious tropical escape.",
        "The resort's elegantly appointed rooms — Standard, Seaview, and Beach Front — feature refined Swahili-inspired decor, en-suite facilities, and private balconies or terraces overlooking the turquoise Indian Ocean or lush tropical gardens.",
        "Guests enjoy exceptional dining across the resort's restaurants, refreshing drinks at the bar, a sparkling infinity pool, and direct access to one of Zanzibar's most beautiful and vibrant beaches.",
        "The resort's prime location offers easy access to Nungwi's legendary diving and snorkelling sites, historic Stone Town, spice plantations, and the rich cultural heritage of the Swahili Coast.",
        "Combining boutique luxury, warm Zanzibari hospitality, and breathtaking ocean views, Nungwi Dreams by Mantis is the ultimate tropical retreat for couples, families, and discerning travellers alike."
    ],
    "seasons": [
        {
            "name": "Low Season (Apr-May 2025)",
            "start_day": 1, "start_month": 4, "end_day": 31, "end_month": 5,
            "rooms": [
                {"name": "Standard Room (Single)", "capacity": 1, "rates": {"BB": Decimal("183.00")}},
                {"name": "Standard Room (Double)", "capacity": 2, "rates": {"BB": Decimal("400.00")}},
                {"name": "Seaview Room (Single)", "capacity": 1, "rates": {"BB": Decimal("221.00")}},
                {"name": "Seaview Room (Double)", "capacity": 2, "rates": {"BB": Decimal("460.00")}},
                {"name": "Beach Front Room (Single)", "capacity": 1, "rates": {"BB": Decimal("313.00")}},
                {"name": "Beach Front Room (Double)", "capacity": 2, "rates": {"BB": Decimal("600.00")}},
                {"name": "Villa (Up to 6 pax)", "capacity": 6, "rates": {"BB": Decimal("1700.00")}}
            ]
        },
        {
            "name": "High Season (Jun-Aug 2025)",
            "start_day": 1, "start_month": 6, "end_day": 31, "end_month": 8,
            "rooms": [
                {"name": "Standard Room (Single)", "capacity": 1, "rates": {"BB": Decimal("145.00")}},
                {"name": "Standard Room (Double)", "capacity": 2, "rates": {"BB": Decimal("265.00")}},
                {"name": "Seaview Room (Single)", "capacity": 1, "rates": {"BB": Decimal("179.00")}},
                {"name": "Seaview Room (Double)", "capacity": 2, "rates": {"BB": Decimal("295.00")}},
                {"name": "Beach Front Room (Single)", "capacity": 1, "rates": {"BB": Decimal("250.00")}},
                {"name": "Beach Front Room (Double)", "capacity": 2, "rates": {"BB": Decimal("370.00")}},
                {"name": "Villa (Up to 6 pax)", "capacity": 6, "rates": {"BB": Decimal("1765.00")}}
            ]
        },
        {
            "name": "Mid Season (Sep-Dec 19 2025)",
            "start_day": 1, "start_month": 9, "end_day": 19, "end_month": 12,
            "rooms": [
                {"name": "Standard Room (Single)", "capacity": 1, "rates": {"BB": Decimal("210.00")}},
                {"name": "Standard Room (Double)", "capacity": 2, "rates": {"BB": Decimal("240.00")}},
                {"name": "Seaview Room (Single)", "capacity": 1, "rates": {"BB": Decimal("240.00")}},
                {"name": "Seaview Room (Double)", "capacity": 2, "rates": {"BB": Decimal("275.00")}},
                {"name": "Beach Front Room (Single)", "capacity": 1, "rates": {"BB": Decimal("315.00")}},
                {"name": "Beach Front Room (Double)", "capacity": 2, "rates": {"BB": Decimal("345.00")}},
                {"name": "Villa (Up to 6 pax)", "capacity": 6, "rates": {"BB": Decimal("1745.00")}}
            ]
        },
        {
            "name": "Peak Season (Festive)",
            "start_day": 20, "start_month": 12, "end_day": 10, "end_month": 1,
            "rooms": [
                {"name": "Standard Room (Single)", "capacity": 1, "rates": {"HB": Decimal("190.00")}},
                {"name": "Standard Room (Double)", "capacity": 2, "rates": {"HB": Decimal("240.00")}},
                {"name": "Seaview Room (Single)", "capacity": 1, "rates": {"HB": Decimal("220.00")}},
                {"name": "Seaview Room (Double)", "capacity": 2, "rates": {"HB": Decimal("275.00")}},
                {"name": "Beach Front Room (Single)", "capacity": 1, "rates": {"HB": Decimal("295.00")}},
                {"name": "Beach Front Room (Double)", "capacity": 2, "rates": {"HB": Decimal("345.00")}},
                {"name": "Villa (Up to 6 pax)", "capacity": 6, "rates": {"HB": Decimal("1800.00")}}
            ]
        },
        {
            "name": "Mid Season (Jan-Mar 2026)",
            "start_day": 11, "start_month": 1, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Standard Room (Single)", "capacity": 1, "rates": {"BB": Decimal("238.00")}},
                {"name": "Standard Room (Double)", "capacity": 2, "rates": {"BB": Decimal("606.00")}},
                {"name": "Seaview Room (Single)", "capacity": 1, "rates": {"BB": Decimal("276.00")}},
                {"name": "Seaview Room (Double)", "capacity": 2, "rates": {"BB": Decimal("682.00")}},
                {"name": "Beach Front Room (Single)", "capacity": 1, "rates": {"BB": Decimal("368.00")}},
                {"name": "Beach Front Room (Double)", "capacity": 2, "rates": {"BB": Decimal("866.00")}},
                {"name": "Villa (Up to 6 pax)", "capacity": 6, "rates": {"BB": Decimal("1800.00")}}
            ]
        }
    ]
},

{
    "name": "Zanzibar Pearl",
    "tag_label": "Resort",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": None,
    "concession_fee_child_non_resident": None,
    "concession_fee_adult_resident": None,
    "concession_fee_child_resident": None,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Zanzibar Pearl is a boutique beachfront retreat set on the pristine shores of Zanzibar Island, offering guests an intimate and luxurious tropical escape surrounded by the turquoise waters of the Indian Ocean.",
        "The resort's exquisite suites and villas — from the elegant Oyster Suite to the expansive Villa Lulu — feature refined Swahili-inspired decor, en-suite facilities, private terraces or plunge pools, and views over the ocean or lush tropical gardens.",
        "Guests enjoy exceptional dining across the resort's restaurants, refreshing drinks at the bar, and direct access to one of Zanzibar's most beautiful and unspoiled beaches with crystal-clear waters and vibrant marine life.",
        "The resort's prime location offers easy access to Zanzibar's legendary diving and snorkelling sites, historic Stone Town, spice plantations, and the rich cultural heritage of the Swahili Coast.",
        "Combining boutique luxury, warm Zanzibari hospitality, and breathtaking ocean views, Zanzibar Pearl is the ultimate tropical paradise for couples, families, and discerning travellers alike."
    ],
    "seasons": [
        {
            "name": "Low Season (Mar-Jun)",
            "start_day": 16, "start_month": 3, "end_day": 30, "end_month": 6,
            "rooms": [
                {"name": "Oyster Suite - Garden View (Single)", "capacity": 1, "rates": {"BB": Decimal("101.00")}},
                {"name": "Oyster Suite - Garden View (Double)", "capacity": 2, "rates": {"BB": Decimal("144.00")}},
                {"name": "Oyster Suite - Garden View (Triple)", "capacity": 3, "rates": {"BB": Decimal("195.00")}},
                {"name": "Pearl Suite - Beach Front (Single)", "capacity": 1, "rates": {"BB": Decimal("123.00")}},
                {"name": "Pearl Suite - Beach Front (Double)", "capacity": 2, "rates": {"BB": Decimal("176.00")}},
                {"name": "Pearl Suite - Beach Front (Triple)", "capacity": 3, "rates": {"BB": Decimal("237.00")}},
                {"name": "Deluxe Suite - Pool Side (Single)", "capacity": 1, "rates": {"BB": Decimal("140.00")}},
                {"name": "Deluxe Suite - Pool Side (Double)", "capacity": 2, "rates": {"BB": Decimal("200.00")}},
                {"name": "Deluxe Suite - Pool Side (Triple)", "capacity": 3, "rates": {"BB": Decimal("270.00")}},
                {"name": "Oyster Villa - Garden View + Pool (Single)", "capacity": 1, "rates": {"BB": Decimal("171.00")}},
                {"name": "Oyster Villa - Garden View + Pool (Double)", "capacity": 2, "rates": {"BB": Decimal("244.00")}},
                {"name": "Oyster Villa - Garden View + Pool (Triple)", "capacity": 3, "rates": {"BB": Decimal("329.00")}},
                {"name": "Oyster Villa - Garden View + Pool (Quad)", "capacity": 4, "rates": {"BB": Decimal("414.00")}},
                {"name": "Pearl Villa - Ocean Front + Plunge Pool (Double)", "capacity": 2, "rates": {"BB": Decimal("317.00")}},
                {"name": "Pearl Villa - Ocean Front + Plunge Pool (Triple)", "capacity": 3, "rates": {"BB": Decimal("426.00")}},
                {"name": "Pearl Villa - Ocean Front + Plunge Pool (Quad)", "capacity": 4, "rates": {"BB": Decimal("535.00")}},
                {"name": "Villa Lulu - Ocean Front + Pool (Double)", "capacity": 2, "rates": {"BB": Decimal("344.00")}},
                {"name": "Villa Lulu - Ocean Front + Pool (Triple)", "capacity": 3, "rates": {"BB": Decimal("465.00")}},
                {"name": "Villa Lulu - Ocean Front + Pool (Quad)", "capacity": 4, "rates": {"BB": Decimal("586.00")}},
                {"name": "Villa Lulu - Ocean Front + Pool (Quint)", "capacity": 5, "rates": {"BB": Decimal("707.00")}}
            ]
        },
        {
            "name": "Low Season (Nov-Dec 22)",
            "start_day": 1, "start_month": 11, "end_day": 22, "end_month": 12,
            "rooms": [
                {"name": "Oyster Suite - Garden View (Single)", "capacity": 1, "rates": {"BB": Decimal("101.00")}},
                {"name": "Oyster Suite - Garden View (Double)", "capacity": 2, "rates": {"BB": Decimal("144.00")}},
                {"name": "Oyster Suite - Garden View (Triple)", "capacity": 3, "rates": {"BB": Decimal("195.00")}},
                {"name": "Pearl Suite - Beach Front (Single)", "capacity": 1, "rates": {"BB": Decimal("123.00")}},
                {"name": "Pearl Suite - Beach Front (Double)", "capacity": 2, "rates": {"BB": Decimal("176.00")}},
                {"name": "Pearl Suite - Beach Front (Triple)", "capacity": 3, "rates": {"BB": Decimal("237.00")}},
                {"name": "Deluxe Suite - Pool Side (Single)", "capacity": 1, "rates": {"BB": Decimal("140.00")}},
                {"name": "Deluxe Suite - Pool Side (Double)", "capacity": 2, "rates": {"BB": Decimal("200.00")}},
                {"name": "Deluxe Suite - Pool Side (Triple)", "capacity": 3, "rates": {"BB": Decimal("270.00")}},
                {"name": "Oyster Villa - Garden View + Pool (Single)", "capacity": 1, "rates": {"BB": Decimal("171.00")}},
                {"name": "Oyster Villa - Garden View + Pool (Double)", "capacity": 2, "rates": {"BB": Decimal("244.00")}},
                {"name": "Oyster Villa - Garden View + Pool (Triple)", "capacity": 3, "rates": {"BB": Decimal("329.00")}},
                {"name": "Oyster Villa - Garden View + Pool (Quad)", "capacity": 4, "rates": {"BB": Decimal("414.00")}},
                {"name": "Pearl Villa - Ocean Front + Plunge Pool (Double)", "capacity": 2, "rates": {"BB": Decimal("317.00")}},
                {"name": "Pearl Villa - Ocean Front + Plunge Pool (Triple)", "capacity": 3, "rates": {"BB": Decimal("426.00")}},
                {"name": "Pearl Villa - Ocean Front + Plunge Pool (Quad)", "capacity": 4, "rates": {"BB": Decimal("535.00")}},
                {"name": "Villa Lulu - Ocean Front + Pool (Double)", "capacity": 2, "rates": {"BB": Decimal("344.00")}},
                {"name": "Villa Lulu - Ocean Front + Pool (Triple)", "capacity": 3, "rates": {"BB": Decimal("465.00")}},
                {"name": "Villa Lulu - Ocean Front + Pool (Quad)", "capacity": 4, "rates": {"BB": Decimal("586.00")}},
                {"name": "Villa Lulu - Ocean Front + Pool (Quint)", "capacity": 5, "rates": {"BB": Decimal("707.00")}}
            ]
        },
        {
            "name": "High Season (Jan-Mar)",
            "start_day": 11, "start_month": 1, "end_day": 15, "end_month": 3,
            "rooms": [
                {"name": "Oyster Suite - Garden View (Single)", "capacity": 1, "rates": {"BB": Decimal("126.00")}},
                {"name": "Oyster Suite - Garden View (Double)", "capacity": 2, "rates": {"BB": Decimal("180.00")}},
                {"name": "Oyster Suite - Garden View (Triple)", "capacity": 3, "rates": {"BB": Decimal("243.00")}},
                {"name": "Pearl Suite - Beach Front (Single)", "capacity": 1, "rates": {"BB": Decimal("171.00")}},
                {"name": "Pearl Suite - Beach Front (Double)", "capacity": 2, "rates": {"BB": Decimal("244.00")}},
                {"name": "Pearl Suite - Beach Front (Triple)", "capacity": 3, "rates": {"BB": Decimal("329.00")}},
                {"name": "Deluxe Suite - Pool Side (Single)", "capacity": 1, "rates": {"BB": Decimal("179.00")}},
                {"name": "Deluxe Suite - Pool Side (Double)", "capacity": 2, "rates": {"BB": Decimal("256.00")}},
                {"name": "Deluxe Suite - Pool Side (Triple)", "capacity": 3, "rates": {"BB": Decimal("346.00")}},
                {"name": "Oyster Villa - Garden View + Pool (Single)", "capacity": 1, "rates": {"BB": Decimal("210.00")}},
                {"name": "Oyster Villa - Garden View + Pool (Double)", "capacity": 2, "rates": {"BB": Decimal("300.00")}},
                {"name": "Oyster Villa - Garden View + Pool (Triple)", "capacity": 3, "rates": {"BB": Decimal("405.00")}},
                {"name": "Oyster Villa - Garden View + Pool (Quad)", "capacity": 4, "rates": {"BB": Decimal("510.00")}},
                {"name": "Pearl Villa - Ocean Front + Plunge Pool (Double)", "capacity": 2, "rates": {"BB": Decimal("360.00")}},
                {"name": "Pearl Villa - Ocean Front + Plunge Pool (Triple)", "capacity": 3, "rates": {"BB": Decimal("486.00")}},
                {"name": "Pearl Villa - Ocean Front + Plunge Pool (Quad)", "capacity": 4, "rates": {"BB": Decimal("612.00")}},
                {"name": "Villa Lulu - Ocean Front + Pool (Double)", "capacity": 2, "rates": {"BB": Decimal("396.00")}},
                {"name": "Villa Lulu - Ocean Front + Pool (Triple)", "capacity": 3, "rates": {"BB": Decimal("534.00")}},
                {"name": "Villa Lulu - Ocean Front + Pool (Quad)", "capacity": 4, "rates": {"BB": Decimal("672.00")}},
                {"name": "Villa Lulu - Ocean Front + Pool (Quint)", "capacity": 5, "rates": {"BB": Decimal("810.00")}}
            ]
        },
        {
            "name": "High Season (Jul-Oct)",
            "start_day": 1, "start_month": 7, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Oyster Suite - Garden View (Single)", "capacity": 1, "rates": {"BB": Decimal("126.00")}},
                {"name": "Oyster Suite - Garden View (Double)", "capacity": 2, "rates": {"BB": Decimal("180.00")}},
                {"name": "Oyster Suite - Garden View (Triple)", "capacity": 3, "rates": {"BB": Decimal("243.00")}},
                {"name": "Pearl Suite - Beach Front (Single)", "capacity": 1, "rates": {"BB": Decimal("171.00")}},
                {"name": "Pearl Suite - Beach Front (Double)", "capacity": 2, "rates": {"BB": Decimal("244.00")}},
                {"name": "Pearl Suite - Beach Front (Triple)", "capacity": 3, "rates": {"BB": Decimal("329.00")}},
                {"name": "Deluxe Suite - Pool Side (Single)", "capacity": 1, "rates": {"BB": Decimal("179.00")}},
                {"name": "Deluxe Suite - Pool Side (Double)", "capacity": 2, "rates": {"BB": Decimal("256.00")}},
                {"name": "Deluxe Suite - Pool Side (Triple)", "capacity": 3, "rates": {"BB": Decimal("346.00")}},
                {"name": "Oyster Villa - Garden View + Pool (Single)", "capacity": 1, "rates": {"BB": Decimal("210.00")}},
                {"name": "Oyster Villa - Garden View + Pool (Double)", "capacity": 2, "rates": {"BB": Decimal("300.00")}},
                {"name": "Oyster Villa - Garden View + Pool (Triple)", "capacity": 3, "rates": {"BB": Decimal("405.00")}},
                {"name": "Oyster Villa - Garden View + Pool (Quad)", "capacity": 4, "rates": {"BB": Decimal("510.00")}},
                {"name": "Pearl Villa - Ocean Front + Plunge Pool (Double)", "capacity": 2, "rates": {"BB": Decimal("360.00")}},
                {"name": "Pearl Villa - Ocean Front + Plunge Pool (Triple)", "capacity": 3, "rates": {"BB": Decimal("486.00")}},
                {"name": "Pearl Villa - Ocean Front + Plunge Pool (Quad)", "capacity": 4, "rates": {"BB": Decimal("612.00")}},
                {"name": "Villa Lulu - Ocean Front + Pool (Double)", "capacity": 2, "rates": {"BB": Decimal("396.00")}},
                {"name": "Villa Lulu - Ocean Front + Pool (Triple)", "capacity": 3, "rates": {"BB": Decimal("534.00")}},
                {"name": "Villa Lulu - Ocean Front + Pool (Quad)", "capacity": 4, "rates": {"BB": Decimal("672.00")}},
                {"name": "Villa Lulu - Ocean Front + Pool (Quint)", "capacity": 5, "rates": {"BB": Decimal("810.00")}}
            ]
        },
        {
            "name": "Peak Season (Festive)",
            "start_day": 23, "start_month": 12, "end_day": 10, "end_month": 1,
            "rooms": [
                {"name": "Oyster Suite - Garden View (Single)", "capacity": 1, "rates": {"BB": Decimal("155.00")}},
                {"name": "Oyster Suite - Garden View (Double)", "capacity": 2, "rates": {"BB": Decimal("222.00")}},
                {"name": "Oyster Suite - Garden View (Triple)", "capacity": 3, "rates": {"BB": Decimal("300.00")}},
                {"name": "Pearl Suite - Beach Front (Single)", "capacity": 1, "rates": {"BB": Decimal("182.00")}},
                {"name": "Pearl Suite - Beach Front (Double)", "capacity": 2, "rates": {"BB": Decimal("260.00")}},
                {"name": "Pearl Suite - Beach Front (Triple)", "capacity": 3, "rates": {"BB": Decimal("351.00")}},
                {"name": "Deluxe Suite - Pool Side (Single)", "capacity": 1, "rates": {"BB": Decimal("193.00")}},
                {"name": "Deluxe Suite - Pool Side (Double)", "capacity": 2, "rates": {"BB": Decimal("276.00")}},
                {"name": "Deluxe Suite - Pool Side (Triple)", "capacity": 3, "rates": {"BB": Decimal("372.00")}},
                {"name": "Oyster Villa - Garden View + Pool (Single)", "capacity": 1, "rates": {"BB": Decimal("246.00")}},
                {"name": "Oyster Villa - Garden View + Pool (Double)", "capacity": 2, "rates": {"BB": Decimal("352.00")}},
                {"name": "Oyster Villa - Garden View + Pool (Triple)", "capacity": 3, "rates": {"BB": Decimal("474.00")}},
                {"name": "Oyster Villa - Garden View + Pool (Quad)", "capacity": 4, "rates": {"BB": Decimal("596.00")}},
                {"name": "Pearl Villa - Ocean Front + Plunge Pool (Double)", "capacity": 2, "rates": {"BB": Decimal("416.00")}},
                {"name": "Pearl Villa - Ocean Front + Plunge Pool (Triple)", "capacity": 3, "rates": {"BB": Decimal("561.00")}},
                {"name": "Pearl Villa - Ocean Front + Plunge Pool (Quad)", "capacity": 4, "rates": {"BB": Decimal("706.00")}},
                {"name": "Villa Lulu - Ocean Front + Pool (Double)", "capacity": 2, "rates": {"BB": Decimal("472.00")}},
                {"name": "Villa Lulu - Ocean Front + Pool (Triple)", "capacity": 3, "rates": {"BB": Decimal("636.00")}},
                {"name": "Villa Lulu - Ocean Front + Pool (Quad)", "capacity": 4, "rates": {"BB": Decimal("800.00")}},
                {"name": "Villa Lulu - Ocean Front + Pool (Quint)", "capacity": 5, "rates": {"BB": Decimal("964.00")}}
            ]
        }
    ]
},


{
    "name": "Villa Kiva Boutique Hotel",
    "tag_label": "Resort",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": None,
    "concession_fee_child_non_resident": None,
    "concession_fee_adult_resident": None,
    "concession_fee_child_resident": None,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Villa Kiva Boutique Hotel is a charming beachfront retreat set on the pristine white sands of Matemwe, on the north-eastern coast of Zanzibar, offering guests an intimate and relaxing tropical escape.",
        "The hotel's elegant rooms and suites — from Economy Garden View to Superior Sea View — feature refined Swahili-inspired decor, en-suite facilities, private terraces or balconies, and views over lush tropical gardens or the turquoise Indian Ocean.",
        "Guests enjoy delicious breakfast and dining options, refreshing drinks at the bar, a sparkling swimming pool, and direct access to one of Zanzibar's most beautiful and unspoiled beaches with crystal-clear waters.",
        "The hotel's prime location offers easy access to Zanzibar's legendary diving and snorkelling sites, historic Stone Town, spice plantations, and the rich cultural heritage of the Swahili Coast.",
        "Combining boutique luxury, warm Zanzibari hospitality, and breathtaking ocean views, Villa Kiva Boutique Hotel is the ultimate tropical retreat for couples, families, and discerning travellers alike."
    ],
    "seasons": [
        {
            "name": "Season (Jan 1-6)",
            "start_day": 1, "start_month": 1, "end_day": 6, "end_month": 1,
            "rooms": [
                {"name": "Economy Garden View (Single)", "capacity": 1, "rates": {"BB": Decimal("72.10")}},
                {"name": "Economy Garden View (Double)", "capacity": 2, "rates": {"BB": Decimal("206.00")}},
                {"name": "Garden View (Single)", "capacity": 1, "rates": {"BB": Decimal("79.10")}},
                {"name": "Garden View (Double)", "capacity": 2, "rates": {"BB": Decimal("226.00")}},
                {"name": "Garden View (Triple)", "capacity": 3, "rates": {"BB": Decimal("339.00")}},
                {"name": "Sea View (Single)", "capacity": 1, "rates": {"BB": Decimal("95.20")}},
                {"name": "Sea View (Double)", "capacity": 2, "rates": {"BB": Decimal("272.00")}},
                {"name": "Sea View (Triple)", "capacity": 3, "rates": {"BB": Decimal("408.00")}},
                {"name": "Garden & Junior Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("105.00")}},
                {"name": "Garden & Junior Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("300.00")}},
                {"name": "Garden & Junior Suite (Triple)", "capacity": 3, "rates": {"BB": Decimal("450.00")}},
                {"name": "Superior Sea View (Single)", "capacity": 1, "rates": {"BB": Decimal("115.50")}},
                {"name": "Superior Sea View (Double)", "capacity": 2, "rates": {"BB": Decimal("330.00")}},
                {"name": "Superior Sea View (Triple)", "capacity": 3, "rates": {"BB": Decimal("495.00")}},
                {"name": "Family Room (4 Pax)", "capacity": 4, "rates": {"BB": Decimal("476.00")}}
            ]
        },
        {
            "name": "Season (Jan 6 - Mar 1)",
            "start_day": 6, "start_month": 1, "end_day": 1, "end_month": 3,
            "rooms": [
                {"name": "Economy Garden View (Single)", "capacity": 1, "rates": {"BB": Decimal("54.60")}},
                {"name": "Economy Garden View (Double)", "capacity": 2, "rates": {"BB": Decimal("156.00")}},
                {"name": "Garden View (Single)", "capacity": 1, "rates": {"BB": Decimal("60.20")}},
                {"name": "Garden View (Double)", "capacity": 2, "rates": {"BB": Decimal("172.00")}},
                {"name": "Garden View (Triple)", "capacity": 3, "rates": {"BB": Decimal("258.00")}},
                {"name": "Sea View (Single)", "capacity": 1, "rates": {"BB": Decimal("72.10")}},
                {"name": "Sea View (Double)", "capacity": 2, "rates": {"BB": Decimal("206.00")}},
                {"name": "Sea View (Triple)", "capacity": 3, "rates": {"BB": Decimal("309.00")}},
                {"name": "Garden & Junior Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("79.10")}},
                {"name": "Garden & Junior Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("226.00")}},
                {"name": "Garden & Junior Suite (Triple)", "capacity": 3, "rates": {"BB": Decimal("339.00")}},
                {"name": "Superior Sea View (Single)", "capacity": 1, "rates": {"BB": Decimal("87.50")}},
                {"name": "Superior Sea View (Double)", "capacity": 2, "rates": {"BB": Decimal("250.00")}},
                {"name": "Superior Sea View (Triple)", "capacity": 3, "rates": {"BB": Decimal("375.00")}},
                {"name": "Family Room (4 Pax)", "capacity": 4, "rates": {"BB": Decimal("360.00")}}
            ]
        },
        {
            "name": "Season (Mar 1 - Jul 1)",
            "start_day": 1, "start_month": 3, "end_day": 1, "end_month": 7,
            "rooms": [
                {"name": "Economy Garden View (Single)", "capacity": 1, "rates": {"BB": Decimal("37.10")}},
                {"name": "Economy Garden View (Double)", "capacity": 2, "rates": {"BB": Decimal("106.00")}},
                {"name": "Garden View (Single)", "capacity": 1, "rates": {"BB": Decimal("40.60")}},
                {"name": "Garden View (Double)", "capacity": 2, "rates": {"BB": Decimal("116.00")}},
                {"name": "Garden View (Triple)", "capacity": 3, "rates": {"BB": Decimal("174.00")}},
                {"name": "Sea View (Single)", "capacity": 1, "rates": {"BB": Decimal("49.00")}},
                {"name": "Sea View (Double)", "capacity": 2, "rates": {"BB": Decimal("140.00")}},
                {"name": "Sea View (Triple)", "capacity": 3, "rates": {"BB": Decimal("210.00")}},
                {"name": "Garden & Junior Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("53.90")}},
                {"name": "Garden & Junior Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("154.00")}},
                {"name": "Garden & Junior Suite (Triple)", "capacity": 3, "rates": {"BB": Decimal("231.00")}},
                {"name": "Superior Sea View (Single)", "capacity": 1, "rates": {"BB": Decimal("58.80")}},
                {"name": "Superior Sea View (Double)", "capacity": 2, "rates": {"BB": Decimal("168.00")}},
                {"name": "Superior Sea View (Triple)", "capacity": 3, "rates": {"BB": Decimal("252.00")}},
                {"name": "Family Room (4 Pax)", "capacity": 4, "rates": {"BB": Decimal("244.00")}}
            ]
        },
        {
            "name": "Season (Jul 1 - Sep 1)",
            "start_day": 1, "start_month": 7, "end_day": 1, "end_month": 9,
            "rooms": [
                {"name": "Economy Garden View (Single)", "capacity": 1, "rates": {"BB": Decimal("50.40")}},
                {"name": "Economy Garden View (Double)", "capacity": 2, "rates": {"BB": Decimal("144.00")}},
                {"name": "Garden View (Single)", "capacity": 1, "rates": {"BB": Decimal("55.30")}},
                {"name": "Garden View (Double)", "capacity": 2, "rates": {"BB": Decimal("158.00")}},
                {"name": "Garden View (Triple)", "capacity": 3, "rates": {"BB": Decimal("237.00")}},
                {"name": "Sea View (Single)", "capacity": 1, "rates": {"BB": Decimal("65.80")}},
                {"name": "Sea View (Double)", "capacity": 2, "rates": {"BB": Decimal("188.00")}},
                {"name": "Sea View (Triple)", "capacity": 3, "rates": {"BB": Decimal("282.00")}},
                {"name": "Garden & Junior Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("72.80")}},
                {"name": "Garden & Junior Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("208.00")}},
                {"name": "Garden & Junior Suite (Triple)", "capacity": 3, "rates": {"BB": Decimal("312.00")}},
                {"name": "Superior Sea View (Single)", "capacity": 1, "rates": {"BB": Decimal("79.80")}},
                {"name": "Superior Sea View (Double)", "capacity": 2, "rates": {"BB": Decimal("228.00")}},
                {"name": "Superior Sea View (Triple)", "capacity": 3, "rates": {"BB": Decimal("342.00")}},
                {"name": "Family Room (4 Pax)", "capacity": 4, "rates": {"BB": Decimal("332.00")}}
            ]
        },
        {
            "name": "Season (Sep 1 - Dec 23)",
            "start_day": 1, "start_month": 9, "end_day": 23, "end_month": 12,
            "rooms": [
                {"name": "Economy Garden View (Single)", "capacity": 1, "rates": {"BB": Decimal("37.10")}},
                {"name": "Economy Garden View (Double)", "capacity": 2, "rates": {"BB": Decimal("106.00")}},
                {"name": "Garden View (Single)", "capacity": 1, "rates": {"BB": Decimal("40.60")}},
                {"name": "Garden View (Double)", "capacity": 2, "rates": {"BB": Decimal("116.00")}},
                {"name": "Garden View (Triple)", "capacity": 3, "rates": {"BB": Decimal("174.00")}},
                {"name": "Sea View (Single)", "capacity": 1, "rates": {"BB": Decimal("49.00")}},
                {"name": "Sea View (Double)", "capacity": 2, "rates": {"BB": Decimal("140.00")}},
                {"name": "Sea View (Triple)", "capacity": 3, "rates": {"BB": Decimal("210.00")}},
                {"name": "Garden & Junior Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("53.90")}},
                {"name": "Garden & Junior Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("154.00")}},
                {"name": "Garden & Junior Suite (Triple)", "capacity": 3, "rates": {"BB": Decimal("231.00")}},
                {"name": "Superior Sea View (Single)", "capacity": 1, "rates": {"BB": Decimal("59.50")}},
                {"name": "Superior Sea View (Double)", "capacity": 2, "rates": {"BB": Decimal("170.00")}},
                {"name": "Superior Sea View (Triple)", "capacity": 3, "rates": {"BB": Decimal("255.00")}},
                {"name": "Family Room (4 Pax)", "capacity": 4, "rates": {"BB": Decimal("244.00")}}
            ]
        },
        {
            "name": "Season (Dec 23 - Jan 1)",
            "start_day": 23, "start_month": 12, "end_day": 1, "end_month": 1,
            "rooms": [
                {"name": "Economy Garden View (Single)", "capacity": 1, "rates": {"BB": Decimal("72.10")}},
                {"name": "Economy Garden View (Double)", "capacity": 2, "rates": {"BB": Decimal("206.00")}},
                {"name": "Garden View (Single)", "capacity": 1, "rates": {"BB": Decimal("79.10")}},
                {"name": "Garden View (Double)", "capacity": 2, "rates": {"BB": Decimal("226.00")}},
                {"name": "Garden View (Triple)", "capacity": 3, "rates": {"BB": Decimal("339.00")}},
                {"name": "Sea View (Single)", "capacity": 1, "rates": {"BB": Decimal("95.20")}},
                {"name": "Sea View (Double)", "capacity": 2, "rates": {"BB": Decimal("272.00")}},
                {"name": "Sea View (Triple)", "capacity": 3, "rates": {"BB": Decimal("408.00")}},
                {"name": "Garden & Junior Suite (Single)", "capacity": 1, "rates": {"BB": Decimal("105.00")}},
                {"name": "Garden & Junior Suite (Double)", "capacity": 2, "rates": {"BB": Decimal("300.00")}},
                {"name": "Garden & Junior Suite (Triple)", "capacity": 3, "rates": {"BB": Decimal("450.00")}},
                {"name": "Superior Sea View (Single)", "capacity": 1, "rates": {"BB": Decimal("115.50")}},
                {"name": "Superior Sea View (Double)", "capacity": 2, "rates": {"BB": Decimal("330.00")}},
                {"name": "Superior Sea View (Triple)", "capacity": 3, "rates": {"BB": Decimal("495.00")}},
                {"name": "Family Room (4 Pax)", "capacity": 4, "rates": {"BB": Decimal("476.00")}}
            ]
        }
    ]
},


{
    "name": "Melia Zanzibar",
    "tag_label": "Resort",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": None,
    "concession_fee_child_non_resident": None,
    "concession_fee_adult_resident": None,
    "concession_fee_child_resident": None,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Melia Zanzibar is a spectacular 5-star all-inclusive resort set on a pristine stretch of beach on the north-east coast of Zanzibar Island, offering guests an unforgettable tropical escape surrounded by lush gardens and turquoise waters.",
        "The resort's exquisite rooms, suites, and villas — from the elegant Melia Garden to the expansive 3-Bedroom Ocean Villa — feature refined Swahili-inspired decor, en-suite facilities, private terraces, and views over the ocean or tropical gardens.",
        "Guests enjoy exceptional all-inclusive dining across multiple restaurants, unlimited premium beverages, a stunning infinity pool, a world-class spa, and the exclusive adults-only The Level service with private lounge and pool.",
        "The resort's prime location offers easy access to Zanzibar's legendary diving and snorkelling sites, historic Stone Town, spice plantations, and the rich cultural heritage of the Swahili Coast.",
        "Combining world-class Melia hospitality, luxurious comfort, and breathtaking ocean views, Melia Zanzibar is the ultimate tropical paradise for couples, families, and discerning travellers alike."
    ],
    "seasons": [
        {
            "name": "Festive Season",
            "start_day": 22, "start_month": 12, "end_day": 6, "end_month": 1,
            "rooms": [
                {"name": "Melia Garden (Single)", "capacity": 1, "rates": {"AI": Decimal("464.00")}},
                {"name": "Melia Garden (Double)", "capacity": 2, "rates": {"AI": Decimal("1280.00")}},
                {"name": "Melia Terrace (Single)", "capacity": 1, "rates": {"AI": Decimal("508.00")}},
                {"name": "Melia Terrace (Double)", "capacity": 2, "rates": {"AI": Decimal("1400.00")}},
                {"name": "Melia Terrace Interconnected", "capacity": 4, "rates": {"AI": Decimal("1675.00")}},
                {"name": "Premium Garden (Single)", "capacity": 1, "rates": {"AI": Decimal("508.00")}},
                {"name": "Premium Garden (Double)", "capacity": 2, "rates": {"AI": Decimal("1400.00")}},
                {"name": "Premium Terrace (Single)", "capacity": 1, "rates": {"AI": Decimal("558.00")}},
                {"name": "Premium Terrace (Double)", "capacity": 2, "rates": {"AI": Decimal("1540.00")}},
                {"name": "Premium Terrace Interconnected", "capacity": 4, "rates": {"AI": Decimal("1845.00")}},
                {"name": "Family Room", "capacity": 4, "rates": {"AI": Decimal("935.00")}},
                {"name": "Ocean View Bungalow", "capacity": 2, "rates": {"AI": Decimal("1000.00")}},
                {"name": "Beach Room", "capacity": 2, "rates": {"AI": Decimal("1050.00")}},
                {"name": "Grand Suite", "capacity": 3, "rates": {"AI": Decimal("1060.00")}},
                {"name": "O.F. Romance Pavilion", "capacity": 2, "rates": {"AI": Decimal("1185.00")}},
                {"name": "Beach Pavilion", "capacity": 2, "rates": {"AI": Decimal("1370.00")}},
                {"name": "2 Bedroom Beach Pavilion", "capacity": 4, "rates": {"AI": Decimal("2325.00")}},
                {"name": "1 Bedroom Garden Villa", "capacity": 4, "rates": {"AI": Decimal("2065.00")}},
                {"name": "1 Bedroom Ocean Villa", "capacity": 4, "rates": {"AI": Decimal("2475.00")}},
                {"name": "2 Bedroom Ocean Villa", "capacity": 4, "rates": {"AI": Decimal("2840.00")}},
                {"name": "Grand 2 Bedroom Ocean Villa", "capacity": 6, "rates": {"AI": Decimal("3835.00")}},
                {"name": "3 Bedroom Ocean Villa", "capacity": 6, "rates": {"AI": Decimal("4230.00")}},
                {"name": "Grand 3 Bedroom Ocean Villa", "capacity": 8, "rates": {"AI": Decimal("6345.00")}}
            ]
        },
        # High Season (Jan 7 - Feb 28)
        {
            "name": "High Season (Jan-Feb)",
            "start_day": 7, "start_month": 1, "end_day": 28, "end_month": 2,
            "rooms": [
                {"name": "Melia Garden (Single)", "capacity": 1, "rates": {"AI": Decimal("323.00")}},
                {"name": "Melia Garden (Double)", "capacity": 2, "rates": {"AI": Decimal("890.00")}},
                {"name": "Melia Terrace (Single)", "capacity": 1, "rates": {"AI": Decimal("359.00")}},
                {"name": "Melia Terrace (Double)", "capacity": 2, "rates": {"AI": Decimal("990.00")}},
                {"name": "Melia Terrace Interconnected", "capacity": 4, "rates": {"AI": Decimal("1190.00")}},
                {"name": "Premium Garden (Single)", "capacity": 1, "rates": {"AI": Decimal("355.00")}},
                {"name": "Premium Garden (Double)", "capacity": 2, "rates": {"AI": Decimal("980.00")}},
                {"name": "Premium Terrace (Single)", "capacity": 1, "rates": {"AI": Decimal("395.00")}},
                {"name": "Premium Terrace (Double)", "capacity": 2, "rates": {"AI": Decimal("1090.00")}},
                {"name": "Premium Terrace Interconnected", "capacity": 4, "rates": {"AI": Decimal("1310.00")}},
                {"name": "Family Room", "capacity": 4, "rates": {"AI": Decimal("665.00")}},
                {"name": "Ocean View Bungalow", "capacity": 2, "rates": {"AI": Decimal("785.00")}},
                {"name": "Beach Room", "capacity": 2, "rates": {"AI": Decimal("815.00")}},
                {"name": "Grand Suite", "capacity": 3, "rates": {"AI": Decimal("810.00")}},
                {"name": "O.F. Romance Pavilion", "capacity": 2, "rates": {"AI": Decimal("890.00")}},
                {"name": "Beach Pavilion", "capacity": 2, "rates": {"AI": Decimal("1060.00")}},
                {"name": "2 Bedroom Beach Pavilion", "capacity": 4, "rates": {"AI": Decimal("1755.00")}},
                {"name": "1 Bedroom Garden Villa", "capacity": 4, "rates": {"AI": Decimal("1500.00")}},
                {"name": "1 Bedroom Ocean Villa", "capacity": 4, "rates": {"AI": Decimal("1800.00")}},
                {"name": "2 Bedroom Ocean Villa", "capacity": 4, "rates": {"AI": Decimal("2300.00")}},
                {"name": "Grand 2 Bedroom Ocean Villa", "capacity": 6, "rates": {"AI": Decimal("3100.00")}},
                {"name": "3 Bedroom Ocean Villa", "capacity": 6, "rates": {"AI": Decimal("3295.00")}},
                {"name": "Grand 3 Bedroom Ocean Villa", "capacity": 8, "rates": {"AI": Decimal("4940.00")}}
            ]
        },
        # High Season (Mar)
        {
            "name": "High Season (Mar)",
            "start_day": 1, "start_month": 3, "end_day": 31, "end_month": 3,
            "rooms": [
                {"name": "Melia Garden (Single)", "capacity": 1, "rates": {"AI": Decimal("297.00")}},
                {"name": "Melia Garden (Double)", "capacity": 2, "rates": {"AI": Decimal("820.00")}},
                {"name": "Melia Terrace (Single)", "capacity": 1, "rates": {"AI": Decimal("337.00")}},
                {"name": "Melia Terrace (Double)", "capacity": 2, "rates": {"AI": Decimal("930.00")}},
                {"name": "Melia Terrace Interconnected", "capacity": 4, "rates": {"AI": Decimal("1190.00")}},
                {"name": "Premium Garden (Single)", "capacity": 1, "rates": {"AI": Decimal("330.00")}},
                {"name": "Premium Garden (Double)", "capacity": 2, "rates": {"AI": Decimal("910.00")}},
                {"name": "Premium Terrace (Single)", "capacity": 1, "rates": {"AI": Decimal("373.00")}},
                {"name": "Premium Terrace (Double)", "capacity": 2, "rates": {"AI": Decimal("1030.00")}},
                {"name": "Premium Terrace Interconnected", "capacity": 4, "rates": {"AI": Decimal("1310.00")}},
                {"name": "Family Room", "capacity": 4, "rates": {"AI": Decimal("635.00")}},
                {"name": "Ocean View Bungalow", "capacity": 2, "rates": {"AI": Decimal("785.00")}},
                {"name": "Beach Room", "capacity": 2, "rates": {"AI": Decimal("785.00")}},
                {"name": "Grand Suite", "capacity": 3, "rates": {"AI": Decimal("810.00")}},
                {"name": "O.F. Romance Pavilion", "capacity": 2, "rates": {"AI": Decimal("860.00")}},
                {"name": "Beach Pavilion", "capacity": 2, "rates": {"AI": Decimal("1030.00")}},
                {"name": "2 Bedroom Beach Pavilion", "capacity": 4, "rates": {"AI": Decimal("1720.00")}},
                {"name": "1 Bedroom Garden Villa", "capacity": 4, "rates": {"AI": Decimal("1465.00")}},
                {"name": "1 Bedroom Ocean Villa", "capacity": 4, "rates": {"AI": Decimal("1760.00")}},
                {"name": "2 Bedroom Ocean Villa", "capacity": 4, "rates": {"AI": Decimal("2265.00")}},
                {"name": "Grand 2 Bedroom Ocean Villa", "capacity": 6, "rates": {"AI": Decimal("3060.00")}},
                {"name": "3 Bedroom Ocean Villa", "capacity": 6, "rates": {"AI": Decimal("3265.00")}},
                {"name": "Grand 3 Bedroom Ocean Villa", "capacity": 8, "rates": {"AI": Decimal("4895.00")}}
            ]
        },
        # Low Season (Apr - Jun 30)
        {
            "name": "Low Season (Apr-Jun)",
            "start_day": 1, "start_month": 4, "end_day": 30, "end_month": 6,
            "rooms": [
                {"name": "Melia Garden (Single)", "capacity": 1, "rates": {"AI": Decimal("272.00")}},
                {"name": "Melia Garden (Double)", "capacity": 2, "rates": {"AI": Decimal("750.00")}},
                {"name": "Melia Terrace (Single)", "capacity": 1, "rates": {"AI": Decimal("312.00")}},
                {"name": "Melia Terrace (Double)", "capacity": 2, "rates": {"AI": Decimal("860.00")}},
                {"name": "Melia Terrace Interconnected", "capacity": 4, "rates": {"AI": Decimal("1115.00")}},
                {"name": "Premium Garden (Single)", "capacity": 1, "rates": {"AI": Decimal("301.00")}},
                {"name": "Premium Garden (Double)", "capacity": 2, "rates": {"AI": Decimal("830.00")}},
                {"name": "Premium Terrace (Single)", "capacity": 1, "rates": {"AI": Decimal("341.00")}},
                {"name": "Premium Terrace (Double)", "capacity": 2, "rates": {"AI": Decimal("940.00")}},
                {"name": "Premium Terrace Interconnected", "capacity": 4, "rates": {"AI": Decimal("1230.00")}},
                {"name": "Family Room", "capacity": 4, "rates": {"AI": Decimal("635.00")}},
                {"name": "Ocean View Bungalow", "capacity": 2, "rates": {"AI": Decimal("715.00")}},
                {"name": "Beach Room", "capacity": 2, "rates": {"AI": Decimal("735.00")}},
                {"name": "Grand Suite", "capacity": 3, "rates": {"AI": Decimal("735.00")}},
                {"name": "O.F. Romance Pavilion", "capacity": 2, "rates": {"AI": Decimal("800.00")}},
                {"name": "Beach Pavilion", "capacity": 2, "rates": {"AI": Decimal("970.00")}},
                {"name": "2 Bedroom Beach Pavilion", "capacity": 4, "rates": {"AI": Decimal("1650.00")}},
                {"name": "1 Bedroom Garden Villa", "capacity": 4, "rates": {"AI": Decimal("1195.00")}},
                {"name": "1 Bedroom Ocean Villa", "capacity": 4, "rates": {"AI": Decimal("1435.00")}},
                {"name": "2 Bedroom Ocean Villa", "capacity": 4, "rates": {"AI": Decimal("2005.00")}},
                {"name": "Grand 2 Bedroom Ocean Villa", "capacity": 6, "rates": {"AI": Decimal("3070.00")}},
                {"name": "3 Bedroom Ocean Villa", "capacity": 6, "rates": {"AI": Decimal("3265.00")}},
                {"name": "Grand 3 Bedroom Ocean Villa", "capacity": 8, "rates": {"AI": Decimal("3985.00")}}
            ]
        },
        # Peak Season (Jul - Aug)
        {
            "name": "Peak Season (Jul-Aug)",
            "start_day": 1, "start_month": 7, "end_day": 31, "end_month": 8,
            "rooms": [
                {"name": "Melia Garden (Single)", "capacity": 1, "rates": {"AI": Decimal("377.00")}},
                {"name": "Melia Garden (Double)", "capacity": 2, "rates": {"AI": Decimal("1040.00")}},
                {"name": "Melia Terrace (Single)", "capacity": 1, "rates": {"AI": Decimal("421.00")}},
                {"name": "Melia Terrace (Double)", "capacity": 2, "rates": {"AI": Decimal("1160.00")}},
                {"name": "Melia Terrace Interconnected", "capacity": 4, "rates": {"AI": Decimal("1030.00")}},
                {"name": "Premium Garden (Single)", "capacity": 1, "rates": {"AI": Decimal("413.00")}},
                {"name": "Premium Garden (Double)", "capacity": 2, "rates": {"AI": Decimal("1140.00")}},
                {"name": "Premium Terrace (Single)", "capacity": 1, "rates": {"AI": Decimal("464.00")}},
                {"name": "Premium Terrace (Double)", "capacity": 2, "rates": {"AI": Decimal("1280.00")}},
                {"name": "Premium Terrace Interconnected", "capacity": 4, "rates": {"AI": Decimal("1130.00")}},
                {"name": "Family Room", "capacity": 4, "rates": {"AI": Decimal("790.00")}},
                {"name": "Ocean View Bungalow", "capacity": 2, "rates": {"AI": Decimal("890.00")}},
                {"name": "Beach Room", "capacity": 2, "rates": {"AI": Decimal("920.00")}},
                {"name": "Grand Suite", "capacity": 3, "rates": {"AI": Decimal("905.00")}},
                {"name": "O.F. Romance Pavilion", "capacity": 2, "rates": {"AI": Decimal("1000.00")}},
                {"name": "Beach Pavilion", "capacity": 2, "rates": {"AI": Decimal("1160.00")}},
                {"name": "2 Bedroom Beach Pavilion", "capacity": 4, "rates": {"AI": Decimal("2040.00")}},
                {"name": "1 Bedroom Garden Villa", "capacity": 4, "rates": {"AI": Decimal("1755.00")}},
                {"name": "1 Bedroom Ocean Villa", "capacity": 4, "rates": {"AI": Decimal("2105.00")}},
                {"name": "2 Bedroom Ocean Villa", "capacity": 4, "rates": {"AI": Decimal("2705.00")}},
                {"name": "Grand 2 Bedroom Ocean Villa", "capacity": 6, "rates": {"AI": Decimal("3515.00")}},
                {"name": "3 Bedroom Ocean Villa", "capacity": 6, "rates": {"AI": Decimal("3265.00")}},
                {"name": "Grand 3 Bedroom Ocean Villa", "capacity": 8, "rates": {"AI": Decimal("5685.00")}}
            ]
        },
        # High Season (Sep - Oct)
        {
            "name": "High Season (Sep-Oct)",
            "start_day": 1, "start_month": 9, "end_day": 31, "end_month": 10,
            "rooms": [
                {"name": "Melia Garden (Single)", "capacity": 1, "rates": {"AI": Decimal("323.00")}},
                {"name": "Melia Garden (Double)", "capacity": 2, "rates": {"AI": Decimal("890.00")}},
                {"name": "Melia Terrace (Single)", "capacity": 1, "rates": {"AI": Decimal("359.00")}},
                {"name": "Melia Terrace (Double)", "capacity": 2, "rates": {"AI": Decimal("990.00")}},
                {"name": "Melia Terrace Interconnected", "capacity": 4, "rates": {"AI": Decimal("1190.00")}},
                {"name": "Premium Garden (Single)", "capacity": 1, "rates": {"AI": Decimal("355.00")}},
                {"name": "Premium Garden (Double)", "capacity": 2, "rates": {"AI": Decimal("980.00")}},
                {"name": "Premium Terrace (Single)", "capacity": 1, "rates": {"AI": Decimal("395.00")}},
                {"name": "Premium Terrace (Double)", "capacity": 2, "rates": {"AI": Decimal("1090.00")}},
                {"name": "Premium Terrace Interconnected", "capacity": 4, "rates": {"AI": Decimal("1310.00")}},
                {"name": "Family Room", "capacity": 4, "rates": {"AI": Decimal("765.00")}},
                {"name": "Ocean View Bungalow", "capacity": 2, "rates": {"AI": Decimal("785.00")}},
                {"name": "Beach Room", "capacity": 2, "rates": {"AI": Decimal("815.00")}},
                {"name": "Grand Suite", "capacity": 3, "rates": {"AI": Decimal("810.00")}},
                {"name": "O.F. Romance Pavilion", "capacity": 2, "rates": {"AI": Decimal("890.00")}},
                {"name": "Beach Pavilion", "capacity": 2, "rates": {"AI": Decimal("1060.00")}},
                {"name": "2 Bedroom Beach Pavilion", "capacity": 4, "rates": {"AI": Decimal("1755.00")}},
                {"name": "1 Bedroom Garden Villa", "capacity": 4, "rates": {"AI": Decimal("1755.00")}},
                {"name": "1 Bedroom Ocean Villa", "capacity": 4, "rates": {"AI": Decimal("1800.00")}},
                {"name": "2 Bedroom Ocean Villa", "capacity": 4, "rates": {"AI": Decimal("2305.00")}},
                {"name": "Grand 2 Bedroom Ocean Villa", "capacity": 6, "rates": {"AI": Decimal("3515.00")}},
                {"name": "3 Bedroom Ocean Villa", "capacity": 6, "rates": {"AI": Decimal("3295.00")}},
                {"name": "Grand 3 Bedroom Ocean Villa", "capacity": 8, "rates": {"AI": Decimal("4940.00")}}
            ]
        },
        # Low Season (Nov - Dec 21)
        {
            "name": "Low Season (Nov-Dec)",
            "start_day": 1, "start_month": 11, "end_day": 21, "end_month": 12,
            "rooms": [
                {"name": "Melia Garden (Single)", "capacity": 1, "rates": {"AI": Decimal("315.00")}},
                {"name": "Melia Garden (Double)", "capacity": 2, "rates": {"AI": Decimal("870.00")}},
                {"name": "Melia Terrace (Single)", "capacity": 1, "rates": {"AI": Decimal("352.00")}},
                {"name": "Melia Terrace (Double)", "capacity": 2, "rates": {"AI": Decimal("970.00")}},
                {"name": "Melia Terrace Interconnected", "capacity": 4, "rates": {"AI": Decimal("1165.00")}},
                {"name": "Premium Garden (Single)", "capacity": 1, "rates": {"AI": Decimal("348.00")}},
                {"name": "Premium Garden (Double)", "capacity": 2, "rates": {"AI": Decimal("960.00")}},
                {"name": "Premium Terrace (Single)", "capacity": 1, "rates": {"AI": Decimal("388.00")}},
                {"name": "Premium Terrace (Double)", "capacity": 2, "rates": {"AI": Decimal("1070.00")}},
                {"name": "Premium Terrace Interconnected", "capacity": 4, "rates": {"AI": Decimal("1285.00")}},
                {"name": "Family Room", "capacity": 4, "rates": {"AI": Decimal("565.00")}},
                {"name": "Ocean View Bungalow", "capacity": 2, "rates": {"AI": Decimal("765.00")}},
                {"name": "Beach Room", "capacity": 2, "rates": {"AI": Decimal("780.00")}},
                {"name": "Grand Suite", "capacity": 3, "rates": {"AI": Decimal("790.00")}},
                {"name": "O.F. Romance Pavilion", "capacity": 2, "rates": {"AI": Decimal("840.00")}},
                {"name": "Beach Pavilion", "capacity": 2, "rates": {"AI": Decimal("1010.00")}},
                {"name": "2 Bedroom Beach Pavilion", "capacity": 4, "rates": {"AI": Decimal("1680.00")}},
                {"name": "1 Bedroom Garden Villa", "capacity": 4, "rates": {"AI": Decimal("1235.00")}},
                {"name": "1 Bedroom Ocean Villa", "capacity": 4, "rates": {"AI": Decimal("1475.00")}},
                {"name": "2 Bedroom Ocean Villa", "capacity": 4, "rates": {"AI": Decimal("2025.00")}},
                {"name": "Grand 2 Bedroom Ocean Villa", "capacity": 6, "rates": {"AI": Decimal("3515.00")}},
                {"name": "3 Bedroom Ocean Villa", "capacity": 6, "rates": {"AI": Decimal("3265.00")}},
                {"name": "Grand 3 Bedroom Ocean Villa", "capacity": 8, "rates": {"AI": Decimal("3995.00")}}
            ]
        }
    ]
},


{
    "name": "Tembo House Hotel & Apartments",
    "tag_label": "Hotel",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": None,
    "concession_fee_child_non_resident": None,
    "concession_fee_adult_resident": None,
    "concession_fee_child_resident": None,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Tembo House Hotel & Apartments is a charming 4-star boutique retreat set in the heart of historic Stone Town, Zanzibar, blending traditional Swahili architecture with modern comfort just steps from the seafront.",
        "The hotel's beautifully decorated rooms and suites feature traditional Swahili furniture, en-suite facilities, air conditioning, and private balconies overlooking the city, pool, or Indian Ocean.",
        "Guests enjoy a delicious buffet breakfast, refreshing drinks at the lounge, two stunning rooftop infinity pools, and direct access to the beach with complimentary beach beds and a sunset terrace.",
        "The hotel's prime location offers easy access to Stone Town's UNESCO World Heritage sites, the famous Forodhani Gardens night market, spice tours, and the rich cultural heritage of the Swahili Coast.",
        "Combining historic charm, warm Zanzibari hospitality, and an unbeatable location, Tembo House Hotel & Apartments is the perfect base for exploring Stone Town and Zanzibar Island."
    ],
    "seasons": [
        {
            "name": "Full Year",
            "start_day": 1, "start_month": 1, "end_day": 1, "end_month": 12,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"BB": Decimal("100.00")}},
                {"name": "Ground Floor Standard Double Room", "capacity": 2, "rates": {"BB": Decimal("110.00")}},
                {"name": "Ground Floor Standard Twin Room", "capacity": 2, "rates": {"BB": Decimal("110.00")}},
                {"name": "Ground Floor Standard Triple Room", "capacity": 3, "rates": {"BB": Decimal("140.00")}},
                {"name": "City View and Balcony Double Room", "capacity": 2, "rates": {"BB": Decimal("120.00")}},
                {"name": "City View and Balcony Twin Room", "capacity": 2, "rates": {"BB": Decimal("120.00")}},
                {"name": "Prime Double Room (Pool/Sea View with Balcony)", "capacity": 2, "rates": {"BB": Decimal("130.00")}},
                {"name": "Prime Twin Room (Pool/Sea View with Balcony)", "capacity": 2, "rates": {"BB": Decimal("130.00")}},
                {"name": "Prime Triple Room (Pool/Sea View with Balcony)", "capacity": 3, "rates": {"BB": Decimal("160.00")}},
                {"name": "Deluxe Suite (Beach Front with Terrace)", "capacity": 2, "rates": {"BB": Decimal("170.00")}},
                {"name": "Junior Suite (Sea Front with Balcony)", "capacity": 2, "rates": {"BB": Decimal("170.00")}},
                {"name": "Family Suite (Sea Front with Balcony)", "capacity": 4, "rates": {"BB": Decimal("190.00")}},
                {"name": "Presidential Suite (Sea Front with Balcony)", "capacity": 4, "rates": {"BB": Decimal("200.00")}}
            ]
        }
    ]
},

{
    "name": "Tembo Palace Hotel",
    "tag_label": "Hotel",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": None,
    "concession_fee_child_non_resident": None,
    "concession_fee_adult_resident": None,
    "concession_fee_child_resident": None,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Tembo Palace Hotel is a charming 4-star retreat set in the heart of historic Stone Town, Zanzibar, offering guests a peaceful and comfortable base for exploring the island's rich cultural heritage.",
        "The hotel's beautifully decorated rooms and suites feature traditional Swahili furniture, en-suite facilities, air conditioning, and views over the courtyard pool or surrounding Stone Town.",
        "Guests enjoy a delicious buffet breakfast, refreshing drinks at the lounge, a sparkling swimming pool, and access to the facilities of the nearby Tembo Hotel Main Building, including rooftop infinity pools and beach access.",
        "The hotel's prime location offers easy access to Stone Town's UNESCO World Heritage sites, the famous Forodhani Gardens night market, spice tours, and the vibrant Swahili Coast culture.",
        "Combining historic charm, warm Zanzibari hospitality, and an unbeatable location, Tembo Palace Hotel is the perfect base for exploring Stone Town and Zanzibar Island."
    ],
    "seasons": [
        {
            "name": "Full Year",
            "start_day": 1, "start_month": 1, "end_day": 1, "end_month": 12,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"BB": Decimal("80.00")}},
                {"name": "Superior Twin Room", "capacity": 2, "rates": {"BB": Decimal("90.00")}},
                {"name": "Superior Double Room", "capacity": 2, "rates": {"BB": Decimal("90.00")}},
                {"name": "Superior Triple Room", "capacity": 3, "rates": {"BB": Decimal("110.00")}},
                {"name": "Family Suite", "capacity": 4, "rates": {"BB": Decimal("160.00")}},
                {"name": "Executive Suite", "capacity": 4, "rates": {"BB": Decimal("190.00")}}
            ]
        }
    ]
},

{
    "name": "Tembo B&B Apartments",
    "tag_label": "Hotel",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": None,
    "concession_fee_child_non_resident": None,
    "concession_fee_adult_resident": None,
    "concession_fee_child_resident": None,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Tembo B&B Apartments is a charming 4-star retreat set in the heart of historic Stone Town, Zanzibar, offering guests comfortable and well-appointed apartments perfect for longer stays.",
        "The beautifully decorated rooms and studios feature traditional Swahili furniture, en-suite facilities, air conditioning, and private balconies or terraces overlooking the surrounding Stone Town.",
        "Guests enjoy a delicious buffet breakfast, refreshing drinks at the lounge, and access to the facilities of the nearby Tembo Hotel Main Building, including rooftop infinity pools and beach access.",
        "The hotel's prime location offers easy access to Stone Town's UNESCO World Heritage sites, the famous Forodhani Gardens night market, spice tours, and the vibrant Swahili Coast culture.",
        "Combining historic charm, warm Zanzibari hospitality, and an unbeatable location, Tembo B&B Apartments is the perfect base for exploring Stone Town and Zanzibar Island."
    ],
    "seasons": [
        {
            "name": "Full Year",
            "start_day": 1, "start_month": 1, "end_day": 1, "end_month": 12,
            "rooms": [
                {"name": "Single Room", "capacity": 1, "rates": {"BB": Decimal("60.00")}},
                {"name": "Double Room", "capacity": 2, "rates": {"BB": Decimal("70.00")}},
                {"name": "Twin Room", "capacity": 2, "rates": {"BB": Decimal("70.00")}},
                {"name": "Double Room with Balcony", "capacity": 2, "rates": {"BB": Decimal("75.00")}},
                {"name": "Twin Room with Balcony", "capacity": 2, "rates": {"BB": Decimal("75.00")}},
                {"name": "Studio with Terrace", "capacity": 2, "rates": {"BB": Decimal("90.00")}}
            ]
        }
    ]
},

{
    "name": "Freddie Mercury Apartments",
    "tag_label": "Hotel",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": None,
    "concession_fee_child_non_resident": None,
    "concession_fee_adult_resident": None,
    "concession_fee_child_resident": None,
    "is_sponsored": False,
    "sponsored_priority": 0,
    "descriptions": [
        "Freddie Mercury Apartments is a charming 4-star retreat set in the heart of historic Stone Town, Zanzibar, celebrating the legacy of the legendary Queen frontman who was born on the island.",
        "The beautifully decorated apartments feature traditional Swahili furniture, en-suite facilities, air conditioning, separate sitting and dining areas, kitchenettes, and private balconies with city views.",
        "Guests enjoy a delicious buffet breakfast, refreshing drinks at the lounge, and access to the facilities of the nearby Tembo Hotel Main Building, including rooftop infinity pools and beach access.",
        "The hotel's prime location offers easy access to Stone Town's UNESCO World Heritage sites, the famous Forodhani Gardens night market, spice tours, and the vibrant Swahili Coast culture.",
        "Combining historic charm, warm Zanzibari hospitality, and an unbeatable location, Freddie Mercury Apartments is the perfect base for exploring Stone Town and Zanzibar Island."
    ],
    "seasons": [
        {
            "name": "Full Year",
            "start_day": 1, "start_month": 1, "end_day": 1, "end_month": 12,
            "rooms": [
                {"name": "2 Bedroom Apartment", "capacity": 4, "rates": {"BB": Decimal("190.00")}}
            ]
        }
    ]
}


]


        
}