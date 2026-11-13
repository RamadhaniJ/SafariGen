from decimal import Decimal, ROUND_HALF_UP
from django.core.management.base import BaseCommand

from Destinations.models import Destination
from Accommodation.models import (
    Accommodation,
    AccommodationSeason,
    AccommodationRoomType,
    RoomRate,
    AccommodationDescription,
)
from Accommodation.management.commands.accommodation_data import ACCOMMODATION_DATA


def clean_decimal(value):
    if value is None or value == "":  
        return None
    return Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


class Command(BaseCommand):
    help = "Seeds accommodation data with multiple seasons, room types, meal plans, and descriptions."
 
    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("🏨 Starting to seed Accommodations data..."))

        accommodations_data = {
        "Arusha City": [
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
}
],


"Tarangire National Park":[
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
    "name": "Maramboi Tented Lodge",
    "tag_label": "TentedCamp",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": 0.00,
    "concession_fee_child_non_resident": 0.00,
    "concession_fee_adult_resident": 0.00,
    "concession_fee_child_resident": 0.00,
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
  }
],



"Lake Manyara National Park":[
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

],

"Ngorongoro Crater":[
{
    "name": "Ngorongoro Farm House",
    "tag_label": "Lodge",
    "park_status": "OutsidePark",
    "concession_fee_adult_non_resident": 0.00,
    "concession_fee_child_non_resident": 0.00,
    "concession_fee_adult_resident": 0.00,
    "concession_fee_child_resident": 0.00,
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
}
]


}
        total_seeded = 0
        total_skipped = 0
        total_errors = 0

        for dest_name, accs in accommodations_data.items():
            try:

                clean_name = dest_name.strip()
                destination = Destination.objects.filter(name__iexact=clean_name).first()

                if not destination:
                    self.stdout.write(
                        self.style.ERROR(
                            f"❌ Destination '{dest_name}' haijapatikana DB! "
                            f"Hakikisha umeshaseed destinations kwanza."
                        )
                    )
                    continue

                self.stdout.write(f"\n📍 Processing destination: {destination.name}")

                for acc_data in accs:
                    acc_name = acc_data["name"].strip()

                    accommodation, created = Accommodation.objects.get_or_create(
                        destination=destination,
                        name=acc_name,
                        defaults={
                            "tag_label": acc_data.get("tag_label", "Hotel"),
                            "park_status": acc_data.get("park_status", "OutsidePark"),
                            "concession_fee_adult_non_resident": clean_decimal(
                                acc_data.get("concession_fee_adult_non_resident")
                            ),
                            "concession_fee_child_non_resident": clean_decimal(
                                acc_data.get("concession_fee_child_non_resident")
                            ),
                            "concession_fee_adult_resident": clean_decimal(
                                acc_data.get("concession_fee_adult_resident")
                            ),
                            "concession_fee_child_resident": clean_decimal(
                                acc_data.get("concession_fee_child_resident")
                            ),
                            "is_sponsored": acc_data.get("is_sponsored", False),
                            "sponsored_priority": acc_data.get("sponsored_priority", 0),
                            "featured_image": acc_data.get(
                                "featured_image", "accommodation/default.jpg"
                            ),
                        }
                    )

                    if created:
                        total_seeded += 1
                        self.stdout.write(
                            self.style.SUCCESS(f"  ✅ Created: {accommodation.name}")
                        )

                        # 3. Descriptions
                        for desc_text in acc_data.get("descriptions", []):
                            if desc_text and desc_text.strip():
                                AccommodationDescription.objects.get_or_create(
                                    accommodation=accommodation,
                                    description=desc_text.strip(),
                                )

                        # 4. Seasons na Room Rates
                        for season_data in acc_data.get("seasons", []):
                            season, _ = AccommodationSeason.objects.get_or_create(
                                accommodation=accommodation,
                                name=season_data["name"].strip(),
                                defaults={
                                    "start_day": season_data["start_day"],
                                    "start_month": season_data["start_month"],
                                    "end_day": season_data["end_day"],
                                    "end_month": season_data["end_month"],
                                }
                            )

                            # 5. Room Types na Rates
                            for room_info in season_data.get("rooms", []):
                                room_type, _ = AccommodationRoomType.objects.get_or_create(
                                    accommodation=accommodation,
                                    name=room_info["name"].strip(),
                                    defaults={"capacity": room_info.get("capacity")}
                                )

                                # Meal plans
                                for meal_plan, price in room_info.get("rates", {}).items():
                                    clean_meal_plan = meal_plan.strip().upper()
                                    if price is not None:
                                        RoomRate.objects.get_or_create(
                                            room_type=room_type,
                                            season=season,
                                            meal_plan=clean_meal_plan,
                                            defaults={"price_per_night": clean_decimal(price)}
                                        )

                    else:
                        total_skipped += 1
                        self.stdout.write(
                            self.style.WARNING(f"  ℹ️ Already exists: {accommodation.name}")
                        )

            except Exception as e:
                total_errors += 1
                self.stdout.write(
                    self.style.ERROR(f"❌ Error kwenye '{dest_name}': {e}")
                )

        # Summary ya mwisho
        self.stdout.write(
            self.style.SUCCESS(
                f"\n🎉 DONE! Seeded: {total_seeded} | "
                f"Skipped: {total_skipped} | Errors: {total_errors}"
            )
        )
        
