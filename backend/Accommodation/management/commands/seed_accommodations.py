from decimal import Decimal
from django.core.management.base import BaseCommand

# Badilisha 'Destinations' na 'accommodations' ziendane na majina ya app zako
from Destinations.models import Destination
from Accommodation.models import (
    Accommodation,
    AccommodationSeason,
    AccommodationRoomType,
    RoomRate,
    AccommodationDescription
)


class Command(BaseCommand):
    help = "Seeds authentic accommodation data (2 per destination) with 3 custom descriptions each."

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("🏨 Starting to seed Accommodations data..."))

        # Data halisi za Accommodations kwa kila Destination
        accommodations_data = {
            "Serengeti National Park": [
                {
                    "name": "Four Seasons Safari Lodge Serengeti",
                    "tag_label": "LuxuryGlamping",
                    "park_status": "InsidePark",
                    "concession_fee_adult_non_resident": Decimal("70.80"), # Incl. VAT
                    "concession_fee_child_non_resident": Decimal("35.40"),
                    "concession_fee_adult_resident": Decimal("11800.00"),
                    "concession_fee_child_resident": Decimal("5900.00"),
                    "is_sponsored": True,
                    "sponsored_priority": 1,
                    "descriptions": [
                        "Deep in Africa’s finest game reserve, Four Seasons Safari Lodge Serengeti welcomes guests to an oasis of luxury next to an active watering hole frequented by elephant families.",
                        "Features an elevated wooden walkway system, infinity pool overlooking the savannah, pampering spa facilities, and an interactive Discovery Centre for wildlife education.",
                        "Ideally positioned in the Central Serengeti (Seronera), offering world-class year-round predator viewing and prime access to Great Migration trails."
                    ],
                    "rooms": [
                        {"name": "Savannah Room", "capacity": 2, "price_fb": Decimal("1250.00")},
                        {"name": "Horizon Terrace Suite", "capacity": 3, "price_fb": Decimal("2400.00")}
                    ]
                },
                {
                    "name": "Serengeti Serena Safari Lodge",
                    "tag_label": "Lodge",
                    "park_status": "InsidePark",
                    "concession_fee_adult_non_resident": Decimal("59.00"),
                    "concession_fee_child_non_resident": Decimal("11.80"),
                    "concession_fee_adult_resident": Decimal("11800.00"),
                    "concession_fee_child_resident": Decimal("2360.00"),
                    "is_sponsored": False,
                    "sponsored_priority": 0,
                    "descriptions": [
                        "Set high on a tree-clad ridge with panoramic views across the sweeping plains, Serengeti Serena blend seamlessly into the natural landscape inspired by traditional African rondavels.",
                        "Includes an infinity swimming pool carved into natural rock, open-air dining decks, and traditional cultural performances by local Maasai dancers.",
                        "Situated near the Western Corridor and Central Seronera, offering unmatched access to seasonal wildlife movements and big cat tracking."
                    ],
                    "rooms": [
                        {"name": "Standard Twin/Double Room", "capacity": 2, "price_fb": Decimal("580.00")},
                        {"name": "Luxury Suite", "capacity": 2, "price_fb": Decimal("950.00")}
                    ]
                }
            ],
            "Ngorongoro Crater": [
                {
                    "name": "Ngorongoro Crater Lodge (andBeyond)",
                    "tag_label": "Lodge",
                    "park_status": "InsidePark",
                    "concession_fee_adult_non_resident": Decimal("70.80"),
                    "concession_fee_child_non_resident": Decimal("35.40"),
                    "concession_fee_adult_resident": Decimal("11800.00"),
                    "concession_fee_child_resident": Decimal("5900.00"),
                    "is_sponsored": True,
                    "sponsored_priority": 1,
                    "descriptions": [
                        "Known as the 'Maasai meets Versailles' lodge, this architectural masterpiece perches dramatically on the edge of the Ngorongoro Crater rim.",
                        "Each stilted suite features handcrafted banana leaf ceilings, velvet sofas, wood-burning fireplaces, and personal butler service.",
                        "Offers direct, privileged early-morning access to the crater floor for optimal Black Rhino sightings before crowd arrival."
                    ],
                    "rooms": [
                        {"name": "Suite", "capacity": 2, "price_fb": Decimal("1850.00")},
                        {"name": "Family Suite", "capacity": 4, "price_fb": Decimal("3600.00")}
                    ]
                },
                {
                    "name": "Ngorongoro Farm House",
                    "tag_label": "BoutiqueHotel",
                    "park_status": "OutsidePark",
                    "concession_fee_adult_non_resident": None,
                    "concession_fee_child_non_resident": None,
                    "concession_fee_adult_resident": None,
                    "concession_fee_child_resident": None,
                    "is_sponsored": False,
                    "sponsored_priority": 0,
                    "descriptions": [
                        "A charming 500-acre coffee plantation style lodge located in Karatu, offering a quiet country retreat just minutes from the Ngorongoro gate.",
                        "Guests enjoy farm-to-table organic dining, guided walks through lush coffee fields, and a swimming pool overlooking Oldeani Volcano.",
                        "An excellent value base for exploring both Ngorongoro Crater and Lake Manyara National Park without paying park stay fees."
                    ],
                    "rooms": [
                        {"name": "Standard Cottage Room", "capacity": 2, "price_fb": Decimal("280.00")},
                        {"name": "Interconnected Family Interroom", "capacity": 4, "price_fb": Decimal("520.00")}
                    ]
                }
            ],
            "Tarangire National Park": [
                {
                    "name": "Tarangire Safari Lodge",
                    "tag_label": "TentedCamp",
                    "park_status": "InsidePark",
                    "concession_fee_adult_non_resident": Decimal("59.00"),
                    "concession_fee_child_non_resident": Decimal("11.80"),
                    "concession_fee_adult_resident": Decimal("11800.00"),
                    "concession_fee_child_resident": Decimal("2360.00"),
                    "is_sponsored": False,
                    "sponsored_priority": 0,
                    "descriptions": [
                        "Perched on a high bluff overlooking the Tarangire River, this iconic historic camp offers unmatched bird's-eye views of wildlife quenching their thirst.",
                        "Features classic thatched safari tents with private verandas, a large swimming pool, and an open-air lounge frequented by resident agama lizards.",
                        "Prime dry season location where hundreds of elephants, zebras, and wildebeests gather directly below the lodge main deck."
                    ],
                    "rooms": [
                        {"name": "Safari Tent (Twin/Double)", "capacity": 2, "price_fb": Decimal("320.00")},
                        {"name": "Bungalow", "capacity": 3, "price_fb": Decimal("390.00")}
                    ]
                },
                {
                    "name": "Maramboi Tented Lodge",
                    "tag_label": "LuxuryGlamping",
                    "park_status": "OutsidePark",
                    "concession_fee_adult_non_resident": None,
                    "concession_fee_child_non_resident": None,
                    "concession_fee_adult_resident": None,
                    "concession_fee_child_resident": None,
                    "is_sponsored": False,
                    "sponsored_priority": 0,
                    "descriptions": [
                        "Situated on a wildlife migratory corridor between Lake Manyara and Tarangire, offering permanent views of the Great Rift Valley wall.",
                        "Spacious luxury tents built on raised wooden decks with private facilities, swimming pool, and night campfire storytelling.",
                        "Offers unique guided nature walks along the shores of Lake Manyara to spot flamingos and pelicans up close."
                    ],
                    "rooms": [
                        {"name": "Standard Luxury Tent", "capacity": 2, "price_fb": Decimal("340.00")}
                    ]
                }
            ],
            "Zanzibar - Nungwi & Stone Town": [
                {
                    "name": "Zuri Zanzibar Resort",
                    "tag_label": "Resort",
                    "park_status": "OutsidePark",
                    "concession_fee_adult_non_resident": None,
                    "concession_fee_child_non_resident": None,
                    "concession_fee_adult_resident": None,
                    "concession_fee_child_resident": None,
                    "is_sponsored": True,
                    "sponsored_priority": 2,
                    "descriptions": [
                        "Set on an pristine 300-meter white sand beach in Nungwi, famous for non-tidal turquoise swimming waters throughout the entire day.",
                        "Eco-friendly luxury bungaloes with African outdoor showers, a spice garden, infinity pool, and world-class watersports centre.",
                        "Located on the north-west coast of Zanzibar, renowned for breathtaking sunset views over traditional sailing dhows."
                    ],
                    "rooms": [
                        {"name": "Garden Bungalow", "capacity": 2, "price_fb": Decimal("620.00")},
                        {"name": "Ocean View Suite", "capacity": 2, "price_fb": Decimal("980.00")}
                    ]
                },
                {
                    "name": "Emerson on Hurumzi",
                    "tag_label": "BoutiqueHotel",
                    "park_status": "OutsidePark",
                    "concession_fee_adult_non_resident": None,
                    "concession_fee_child_non_resident": None,
                    "concession_fee_adult_resident": None,
                    "concession_fee_child_resident": None,
                    "is_sponsored": False,
                    "sponsored_priority": 0,
                    "descriptions": [
                        "A lovingly restored historic merchant palace in the heart of Stone Town, reflecting rich Swahili and Arabian heritage architecture.",
                        "Features antique carved four-poster beds, stained glass windows, and the world-famous Tower Top Restaurant with rooftop city views.",
                        "Immersed within the UNESCO World Heritage winding alleys, minutes away from the Forodhani Gardens night food market."
                    ],
                    "rooms": [
                        {"name": "Heritage Room", "capacity": 2, "price_fb": Decimal("240.00")},
                        {"name": "Grand Suite", "capacity": 2, "price_fb": Decimal("380.00")}
                    ]
                }
            ],
            "Zanzibar - Stone Town & Beaches": [
                {
                    "name": "Park Hyatt Zanzibar",
                    "tag_label": "Hotel",
                    "park_status": "OutsidePark",
                    "concession_fee_adult_non_resident": None,
                    "concession_fee_child_non_resident": None,
                    "concession_fee_adult_resident": None,
                    "concession_fee_child_resident": None,
                    "is_sponsored": False,
                    "sponsored_priority": 0,
                    "descriptions": [
                        "The ultimate luxury beachfront hotel in Stone Town, combining UNESCO heritage architecture with modern sophistication.",
                        "Offers an oceanfront infinity pool, world-class Anantara Spa, and fine dining on a sea-facing outdoor terrace.",
                        "Situated on Shangani beachfront, providing seamless walkability to cultural monuments and sunset boat excursions."
                    ],
                    "rooms": [
                        {"name": "Park King Room", "capacity": 2, "price_fb": Decimal("520.00")},
                        {"name": "Ocean View Deluxe", "capacity": 2, "price_fb": Decimal("750.00")}
                    ]
                },
                {
                    "name": "Breezes Beach Club & Spa",
                    "tag_label": "Resort",
                    "park_status": "OutsidePark",
                    "concession_fee_adult_non_resident": None,
                    "concession_fee_child_non_resident": None,
                    "concession_fee_adult_resident": None,
                    "concession_fee_child_resident": None,
                    "is_sponsored": False,
                    "sponsored_priority": 0,
                    "descriptions": [
                        "An intimate beach resort situated along the pristine, peaceful South East Coast of Zanzibar at Bwejuu-Paje beach.",
                        "Renowned for romantic Swahili decor with hand-carved furniture, brass details, Frangipani Spa, and private beach dining.",
                        "Ideal for couples and honeymooners seeking tranquil white beaches and world-class scuba diving along coral reefs."
                    ],
                    "rooms": [
                        {"name": "Deluxe Room", "capacity": 2, "price_fb": Decimal("380.00")},
                        {"name": "Suites", "capacity": 2, "price_fb": Decimal("540.00")}
                    ]
                }
            ],
            "Mount Kilimanjaro": [
                {
                    "name": "Kilimanjaro Mountain Resort",
                    "tag_label": "Hotel",
                    "park_status": "OutsidePark",
                    "concession_fee_adult_non_resident": None,
                    "concession_fee_child_non_resident": None,
                    "concession_fee_adult_resident": None,
                    "concession_fee_child_resident": None,
                    "is_sponsored": False,
                    "sponsored_priority": 0,
                    "descriptions": [
                        "Nestled in the lush green foothills of Marangu village, surrounded by banana and coffee plantations near the mountain routes.",
                        "Offers traditional stone architecture, swimming pool, fireside lounge, and gear storage facilities for mountain climbers.",
                        "Located just 10 minutes drive from Marangu Gate, making it the perfect pre and post-climb acclimatization base."
                    ],
                    "rooms": [
                        {"name": "Standard Mountain View", "capacity": 2, "price_fb": Decimal("180.00")},
                        {"name": "Executive Suite", "capacity": 2, "price_fb": Decimal("260.00")}
                    ]
                },
                {
                    "name": "Kibo Palace Hotel Moshi",
                    "tag_label": "Hotel",
                    "park_status": "OutsidePark",
                    "concession_fee_adult_non_resident": None,
                    "concession_fee_child_non_resident": None,
                    "concession_fee_adult_resident": None,
                    "concession_fee_child_resident": None,
                    "is_sponsored": False,
                    "sponsored_priority": 0,
                    "descriptions": [
                        "A modern urban hotel located in Moshi town offering clear direct views of snow-capped Mount Kilimanjaro on clear mornings.",
                        "Equipped with air-conditioned rooms, outdoor pool, fitness centre, international buffet restaurant, and high-speed Wi-Fi.",
                        "Convenient urban hub located 40 minutes from Kilimanjaro International Airport (JRO)."
                    ],
                    "rooms": [
                        {"name": "Deluxe Room", "capacity": 2, "price_fb": Decimal("150.00")}
                    ]
                }
            ],
            "Lake Manyara National Park": [
                {
                    "name": "Lake Manyara Serena Safari Lodge",
                    "tag_label": "Lodge",
                    "park_status": "InsidePark",
                    "concession_fee_adult_non_resident": Decimal("59.00"),
                    "concession_fee_child_non_resident": Decimal("11.80"),
                    "concession_fee_adult_resident": Decimal("11800.00"),
                    "concession_fee_child_resident": Decimal("2360.00"),
                    "is_sponsored": False,
                    "sponsored_priority": 0,
                    "descriptions": [
                        "Perched dramatically on the edge of the Mto wa Mbu escarpment, offering breathtaking vistas over the pink flamingo lake below.",
                        "Designed around a flamingo motif, featuring an cliff-edge infinity pool, cultural talks, and mountain biking tours.",
                        "Prime position for fast access down the escarpment into the park for tree-climbing lions and flamingo birdwatching."
                    ],
                    "rooms": [
                        {"name": "Standard Twin/Double", "capacity": 2, "price_fb": Decimal("410.00")}
                    ]
                },
                {
                    "name": "Escarpment Luxury Lodge Manyara",
                    "tag_label": "LuxuryGlamping",
                    "park_status": "OutsidePark",
                    "concession_fee_adult_non_resident": None,
                    "concession_fee_child_non_resident": None,
                    "concession_fee_adult_resident": None,
                    "concession_fee_child_resident": None,
                    "is_sponsored": False,
                    "sponsored_priority": 0,
                    "descriptions": [
                        "A peaceful boutique sanctuary perched high on the Great Rift Valley rim, surrounded by natural wilderness trees.",
                        "Chalet-style wooden chalets feature wraparound wooden decks, deep freestanding baths, and outdoor rain showers.",
                        "Provides serene sunset dining overlooking Lake Manyara and surrounding wildlife corridors."
                    ],
                    "rooms": [
                        {"name": "Luxury Chalet", "capacity": 2, "price_fb": Decimal("490.00")}
                    ]
                }
            ],
            "Arusha City (Safari Capital)": [
                {
                    "name": "Gran Meliá Arusha",
                    "tag_label": "Hotel",
                    "park_status": "OutsidePark",
                    "concession_fee_adult_non_resident": None,
                    "concession_fee_child_non_resident": None,
                    "concession_fee_adult_resident": None,
                    "concession_fee_child_resident": None,
                    "is_sponsored": True,
                    "sponsored_priority": 1,
                    "descriptions": [
                        "An oasis of 5-star modern luxury set between coffee plantations and Mount Meru in the central heart of Arusha.",
                        "Includes a rooftop Indian fine dining venue, heated outdoor pool, state-of-the-art spa, and coffee plantation walk.",
                        "The premier safari departure hotel in Arusha, located 45 minutes from JRO Airport."
                    ],
                    "rooms": [
                        {"name": "Deluxe Mount Meru View", "capacity": 2, "price_fb": Decimal("320.00")},
                        {"name": "Junior Suite", "capacity": 2, "price_fb": Decimal("550.00")}
                    ]
                },
                {
                    "name": "Arusha Planet Lodge",
                    "tag_label": "GuestHouse",
                    "park_status": "OutsidePark",
                    "concession_fee_adult_non_resident": None,
                    "concession_fee_child_non_resident": None,
                    "concession_fee_adult_resident": None,
                    "concession_fee_child_resident": None,
                    "is_sponsored": False,
                    "sponsored_priority": 0,
                    "descriptions": [
                        "An eco-friendly, family-owned boutique lodge surrounded by lush tropical gardens in the suburb of Kimandolu.",
                        "African-style chalets offer private balconies, swimming pool, restaurant, and warm Tanzanian hospitality.",
                        "Quiet and affordable retreat away from city traffic noise, perfect for safari preparation."
                    ],
                    "rooms": [
                        {"name": "Garden Chalet", "capacity": 2, "price_fb": Decimal("120.00")}
                    ]
                }
            ],
            "Ruaha National Park": [
                {
                    "name": "Ruaha River Lodge",
                    "tag_label": "Lodge",
                    "park_status": "InsidePark",
                    "concession_fee_adult_non_resident": Decimal("59.00"),
                    "concession_fee_child_non_resident": Decimal("11.80"),
                    "concession_fee_adult_resident": Decimal("11800.00"),
                    "concession_fee_child_resident": Decimal("2360.00"),
                    "is_sponsored": False,
                    "sponsored_priority": 0,
                    "descriptions": [
                        "The first lodge built in Ruaha, occupying an unmatched position along a natural curve of the Great Ruaha River.",
                        "Individual stone chalets or banda structures built into natural granite kopjes right at the water's edge.",
                        "Phenomenal dry season game viewing directly from your private verandah as hippos and lions frequent the riverbank."
                    ],
                    "rooms": [
                        {"name": "Riverfront Banda", "capacity": 2, "price_fb": Decimal("480.00")}
                    ]
                },
                {
                    "name": "Jabali Ridge (Asilia Africa)",
                    "tag_label": "LuxuryGlamping",
                    "park_status": "InsidePark",
                    "concession_fee_adult_non_resident": Decimal("70.80"),
                    "concession_fee_child_non_resident": Decimal("35.40"),
                    "concession_fee_adult_resident": Decimal("11800.00"),
                    "concession_fee_child_resident": Decimal("5900.00"),
                    "is_sponsored": True,
                    "sponsored_priority": 2,
                    "descriptions": [
                        "A sophisticated luxury camp set high among iconic granite boulders in the wildlife-dense Mwagusi zone.",
                        "Features open-air louvred suites, rim-flow infinity pool, spa, and specialized open 4x4 night game drives.",
                        "Offers exclusive access to one of East Africa's largest lion populations in an undisturbed southern circuit wilderness."
                    ],
                    "rooms": [
                        {"name": "Luxury Ridge Suite", "capacity": 2, "price_fb": Decimal("1150.00")}
                    ]
                }
            ],
            "Mikumi National Park": [
                {
                    "name": "Mikumi Adventure Lodge",
                    "tag_label": "Lodge",
                    "park_status": "OutsidePark",
                    "concession_fee_adult_non_resident": None,
                    "concession_fee_child_non_resident": None,
                    "concession_fee_adult_resident": None,
                    "concession_fee_child_resident": None,
                    "is_sponsored": False,
                    "sponsored_priority": 0,
                    "descriptions": [
                        "Located on the quiet borders of Mikumi National Park, set among natural miombo woodland forest trees.",
                        "Spacious stone cottages with comfortable en-suite bathrooms, swimming pool, and traditional campfire area.",
                        "Just 10 minutes drive from the main park gate, convenient for quick weekend safaris from Dar es Salaam."
                    ],
                    "rooms": [
                        {"name": "Standard Cottage", "capacity": 2, "price_fb": Decimal("160.00")}
                    ]
                },
                {
                    "name": "Vuma Hills Tented Camp",
                    "tag_label": "TentedCamp",
                    "park_status": "InsidePark",
                    "concession_fee_adult_non_resident": Decimal("59.00"),
                    "concession_fee_child_non_resident": Decimal("11.80"),
                    "concession_fee_adult_resident": Decimal("11800.00"),
                    "concession_fee_child_resident": Decimal("2360.00"),
                    "is_sponsored": False,
                    "sponsored_priority": 0,
                    "descriptions": [
                        "Perched on a hillside overlooking the Mkata Floodplain, bringing a true classic safari feel to Mikumi.",
                        "Spacious tents built on wooden platforms with thatched roofs, wooden verandas, and cozy dining room area.",
                        "Excellent birdwatching and high chances of spotting wild dogs, impalas, and giraffes right around the camp grounds."
                    ],
                    "rooms": [
                        {"name": "Tented Room", "capacity": 2, "price_fb": Decimal("290.00")}
                    ]
                }
            ]
        }

        total_seeded = 0

        for dest_name, accs in accommodations_data.items():
            try:
                # Tafuta Destination
                destination = Destination.objects.get(name=dest_name)

                for acc_data in accs:
                    # 1. Tengeneza au tafuta Accommodation
                    accommodation, created = Accommodation.objects.get_or_create(
                        destination=destination,
                        name=acc_data["name"],
                        defaults={
                            "tag_label": acc_data["tag_label"],
                            "park_status": acc_data["park_status"],
                            "concession_fee_adult_non_resident": acc_data["concession_fee_adult_non_resident"],
                            "concession_fee_child_non_resident": acc_data["concession_fee_child_non_resident"],
                            "concession_fee_adult_resident": acc_data["concession_fee_adult_resident"],
                            "concession_fee_child_resident": acc_data["concession_fee_child_resident"],
                            "is_sponsored": acc_data["is_sponsored"],
                            "sponsored_priority": acc_data["sponsored_priority"],
                        }
                    )

                    if created:
                        total_seeded += 1
                        self.stdout.write(self.style.SUCCESS(f"✅ Created: {accommodation.name} ({dest_name})"))

                        # 2. Ongeza Exact Descriptions 3 kwa kila Accommodation
                        for desc_text in acc_data["descriptions"]:
                            AccommodationDescription.objects.create(
                                accommodation=accommodation,
                                description=desc_text
                            )

                        # 3. Tengeneza High Season ya default (June 1 - Oct 31)
                        season = AccommodationSeason.objects.create(
                            accommodation=accommodation,
                            name="High / Peak Season",
                            start_day=1,
                            start_month=6,
                            end_day=31,
                            end_month=10
                        )

                        # 4. Ongeza Room Types & Rates
                        for room_info in acc_data["rooms"]:
                            room_type = AccommodationRoomType.objects.create(
                                accommodation=accommodation,
                                name=room_info["name"],
                                capacity=room_info["capacity"]
                            )

                            RoomRate.objects.create(
                                room_type=room_type,
                                season=season,
                                meal_plan="FB", # Full Board Default
                                price_per_night=room_info["price_fb"]
                            )

                    else:
                        self.stdout.write(self.style.WARNING(f"ℹ️ Already exists: {accommodation.name}"))

            except Destination.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"❌ Destination '{dest_name}' haijapatikana DB!"))

        self.stdout.write(self.style.SUCCESS(f"\n🎉 DONE! Successfully seeded {total_seeded} Accommodations with descriptions and rates!"))