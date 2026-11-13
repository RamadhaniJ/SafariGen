from django.core.management.base import BaseCommand
from Destinations.models import ( 
    Destination, 
    DestinationSeason, 
    DestinationFee, 
    DestinationDescription
)
from decimal import Decimal, ROUND_HALF_UP
from Destinations.management.commands.destinations_data import DESTINATION_DATA
 


def clean_decimal(value):
    if value is None:
        return None
    return Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)



class Command(BaseCommand):
    help = 'Seeds Tanzanian destinations with seasons, fees, and 5 Start, 5 Center, 5 End descriptions each.'


    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Starting to seed Destinations data..."))
        
 
        destinations_data = [
    {
        "name": "Arusha City",
        "location": "Arusha, Tanzania",
        "lat": -3.3667,
        "lng": 36.6833,
        "type": "City",
        "featured_img": "featuredImg/arusha_city.jpg",
        "seasons": [
            {
                "season_name": "Standard Season",
                "start_day": 1,
                "start_month": 1,
                "end_day": 31,
                "end_month": 12,
                "fees": []
            }
        ],
        "start_desc": [
            "Arusha is a vibrant city and a crucial hub for safari experiences in northern Tanzania, making it an essential stop for most travellers. Nestled at the foothills of Mount Meru, it offers a perfect blend of urban comfort and wild anticipation. Don't miss out on this exciting starting point for your unforgettable journey!\n\nMain Destination:\nArusha (City)",
            "Welcome to Arusha, the undisputed safari capital of East Africa and the official gateway to Tanzania's most iconic national parks. As you step into this bustling, sun-drenched city, you can already feel the thrill of the wilderness calling. It is the perfect place to acclimatize, gather your thoughts, and prepare for the epic adventures that lie ahead.\n\nMain Destination:\nArusha (City)",
            "Your Tanzanian expedition officially begins in the lively streets of Arusha, a city pulsing with energy and rich cultural heritage. Surrounded by breathtaking mountain views and endless coffee plantations, this vibrant hub sets the perfect tone for your safari. Take a deep breath, embrace the warm local hospitality, and get ready for the wild wonders to come.\n\nMain Destination:\nArusha (City)",
            "Arriving in Arusha means you have finally reached the launching pad for the adventure of a lifetime. Known for its friendly atmosphere and strategic location, this dynamic city serves as the ultimate meeting point for explorers from around the globe. Settle in, enjoy the mild climate, and let the excitement build as your safari dreams are about to become reality.\n\nMain Destination:\nArusha (City)",
            "Karibu Arusha! This energetic and welcoming city is where the magic of your Tanzanian safari truly begins. With its rich mix of cultures, bustling markets, and stunning views of Mount Meru, it provides a fascinating introduction to the country. Relax, recharge, and prepare your camera, because the ultimate African wilderness experience is just a short drive away.\n\nMain Destination:\nArusha (City)"
        ],
        "center_desc": [
            "While in Arusha, immerse yourself in the local culture by visiting the Cultural Heritage Centre, a stunning complex showcasing exquisite Maasai art, Tingatinga paintings, and Tanzanian antiquities. You can also take a scenic tour of the surrounding coffee plantations to discover the rich agricultural roots of the region and taste freshly roasted Tanzanian coffee. It is a wonderful way to connect with the heart and soul of the country before or after your bush adventures.\n\nMain Destination:\nArusha (City)",
            "Experience the vibrant daily life of the city by wandering through the bustling Central Market, where you will find colorful spices, fresh produce, and authentic local crafts. For a more relaxed afternoon, visit the Arusha National Monument or take a stroll through the serene grounds of the Arusha Coffee Lodge. These urban escapes offer a perfect contrast to the wild landscapes, allowing you to soak in the genuine warmth and rhythm of Tanzanian life.\n\nMain Destination:\nArusha (City)",
            "Arusha is not just a transit hub; it is a destination in its own right, offering unique cultural and historical insights. Explore the fascinating National Natural History Museum to learn about the region's geological and anthropological past, or visit the Shanga glass-bead factory to witness incredible local craftsmanship in action. Engaging with these local attractions adds a rich, meaningful layer to your overall safari experience.\n\nMain Destination:\nArusha (City)",
            "Take some time to enjoy the culinary delights of Arusha, where traditional Swahili dishes blend seamlessly with international flavors. Visit a local restaurant to savor a hearty meal of nyama choma (grilled meat) and ugali, or enjoy a quiet evening at one of the many cozy cafes overlooking the city. This is your chance to unwind, share stories with fellow travelers, and fully appreciate the vibrant social scene of the safari capital.\n\nMain Destination:\nArusha (City)",
            "For those looking for a gentle adventure near the city, a half-day trip to the nearby Shanga village or a visit to a local Maasai market provides an authentic cultural exchange. You can also enjoy a scenic bike ride through the rural outskirts, taking in the breathtaking views of Mount Meru and the surrounding farmlands. These activities offer a beautiful, grounding experience that perfectly complements the high-energy wildlife encounters of your safari.\n\nMain Destination:\nArusha (City)"
        ],
        "end_desc": [
            "As we leave the bustling streets of Arusha behind, we carry with us the warm welcomes and vibrant energy of the safari capital. The city has served as the perfect launchpad, filling us with excitement and a deeper appreciation for Tanzanian culture. Now, with our bags packed and our spirits high, we eagerly transition from urban charm to the raw, untamed beauty of the wild.\n\nMain Destination:\nArusha (City)",
            "Goodbye Arusha! Departing the city limits, we shift our focus from the comfortable, vibrant urban life to the breathtaking, rugged landscapes of the national parks. The memories of the bustling markets, the rich coffee aromas, and the friendly smiles of the locals will stay with us. The engines are running, the road ahead is calling, and the true wilderness adventure is finally about to begin.\n\nMain Destination:\nArusha (City)",
            "Checking out of Arusha City with fond memories, we are ready to trade the city skyline for the endless horizons of the African bush. The time spent here has perfectly prepared us for the wonders ahead, blending cultural immersion with the anticipation of wildlife encounters. As we drive out of the city, the majestic silhouette of Mount Meru watches over us, blessing our journey into the wild.\n\nMain Destination:\nArusha (City)",
            "Farewell to the gateway city! The vibrant energy of Arusha has been the perfect prelude to our safari, and now it is time to answer the call of the wilderness. We leave behind the cozy cafes and cultural centers, carrying the warmth of the Tanzanian people in our hearts. The dusty roads and pristine national parks await, promising an unforgettable chapter of our journey.\n\nMain Destination:\nArusha (City)",
            "Concluding our city stay in Arusha, we head out toward the great outdoors, leaving the friendly town behind for the call of the wild. The transition from the vibrant urban hub to the serene, wildlife-rich landscapes is seamless and thrilling. With our cameras ready and our minds full of anticipation, we embark on the next leg of our epic Tanzanian safari adventure.\n\nMain Destination:\nArusha (City)"
        ]
    },
    {
        "name": "Mount Meru",
        "location": "Arusha National Park, Tanzania",
        "lat": -3.2408,
        "lng": 36.7475,
        "type": "Mountain",
        "featured_img": "featuredImg/mount_meru.jpg",
        "seasons": [
            {
                "season_name": "Peak Season",
                "start_day": 16,
                "start_month": 5,
                "end_day": 14,
                "end_month": 3,
                "fees": [
                    {"residency_label": "NON_RESIDENT", "fee_category": "ParkFee", "adult_fee": 50.00, "child_fee": 15.00},
                    {"residency_label": "NON_RESIDENT", "fee_category": "RescueFee", "adult_fee": 20.00, "child_fee": 20.00},

                    {"residency_label": "EAC_MEMBER", "fee_category": "ParkFee", "adult_fee": 3.78, "child_fee": 0.76},
                    {"residency_label": "EAC_MEMBER", "fee_category": "RescueFee", "adult_fee": 0.76, "child_fee": 0.76},

                    {"residency_label": "RESIDENT", "fee_category": "ParkFee", "adult_fee": 25.00, "child_fee": 15.00},
                    {"residency_label": "RESIDENT", "fee_category": "RescueFee", "adult_fee": 20.00, "child_fee": 20.00},
                ]
            },
              {
                    "season_name": "Low Season",
                    "start_day": 15,
                    "start_month": 3,
                    "end_day": 15,
                    "end_month": 5,
                    "fees": [
                                {"residency_label": "NON_RESIDENT", "fee_category": "ParkFee", "adult_fee": 45.00, "child_fee": 15.00},
                                {"residency_label": "NON_RESIDENT", "fee_category": "RescueFee", "adult_fee": 20.00, "child_fee": 10.00},

                                {"residency_label": "EAC_MEMBER", "fee_category": "ParkFee", "adult_fee": 3.78, "child_fee": 0.76},
                                {"residency_label": "EAC_MEMBER", "fee_category": "RescueFee", "adult_fee": 3.78, "child_fee": 0.76},

                                {"residency_label": "RESIDENT", "fee_category": "ParkFee", "adult_fee": 22.00, "child_fee": 15.00},
                                {"residency_label": "RESIDENT", "fee_category": "RescueFee", "adult_fee": 20.00, "child_fee": 10.00},

                            ]
                        },
        ],
        "start_desc": [
            "Welcome to Mount Meru, Tanzania's second-highest peak and a spectacular, dormant volcano offering an unforgettable trekking adventure. Rising majestically above Arusha National Park, this towering giant promises breathtaking panoramic views and a deeply rewarding physical challenge. As you stand at the base, surrounded by lush rainforest, the thrill of the ascent begins to build.\n\nMain Destination:\nMount Meru (Mountain)",
            "Your ascent of Mount Meru begins! Step into the lush, misty rainforest at the base, ready to conquer this majestic volcanic giant. The trail ahead winds through diverse ecological zones, from dense forests teeming with wildlife to the stark, rocky landscapes near the summit. Every step upward brings you closer to the clouds and the incredible sense of achievement that awaits at the top.\n\nMain Destination:\nMount Meru (Mountain)",
            "Arriving at the foothills of Mount Meru, feel the crisp mountain air and prepare for a thrilling journey to the summit. This ancient volcano offers a more intimate and less crowded trekking experience compared to its famous neighbor, Kilimanjaro. The steep, dramatic slopes and the rich biodiversity of its lower slopes make every moment of this climb truly spectacular.\n\nMain Destination:\nMount Meru (Mountain)",
            "Karibu Mount Meru! A challenging yet incredibly rewarding climb that promises stunning panoramic views and unique volcanic landscapes. As you begin your trek, the dense montane forest envelops you, filled with the calls of exotic birds and the occasional sighting of forest elephants. This is not just a hike; it is an immersion into the raw, geological power of East Africa's Rift Valley.\n\nMain Destination:\nMount Meru (Mountain)",
            "Welcome to the slopes of Mount Meru, where every step upward reveals a new layer of breathtaking natural beauty and wildlife. The trail ascends through a series of distinct climate zones, offering a fascinating visual and physical journey. With the summit of Socialist Peak calling your name, the adventure of a lifetime is about to unfold against the backdrop of the African sky.\n\nMain Destination:\nMount Meru (Mountain)"
        ],
        "center_desc": [
            "Traverse the dramatic volcanic landscapes, passing through the striking Meru Crater and marveling at the towering central ash cone. The sheer scale of the crater, with its sheer cliffs plunging into the depths, is a testament to the raw geological forces that shaped this region. Walking along the rim, you are treated to some of the most awe-inspiring and rugged scenery in all of Tanzania.\n\nMain Destination:\nMount Meru (Mountain)",
            "Reach the saddle camp and be rewarded with spectacular, unobstructed sunrise views of Mount Kilimanjaro glowing in the morning light. The sight of Africa's highest peak, its snow-capped summit catching the first rays of the sun, is a truly magical and humbling experience. This high-altitude vantage point offers a perfect moment to rest, reflect, and take in the vast, sweeping beauty of the landscape.\n\nMain Destination:\nMount Meru (Mountain)",
            "Spot unique high-altitude wildlife, including blue monkeys, bushbucks, and elusive forest elephants, as you hike through the dense montane forest. The lower slopes of Mount Meru are a vital sanctuary for these creatures, and encountering them in their natural habitat is a rare and special privilege. The rich, green canopy provides a cool, shaded respite as you make your steady ascent toward the higher elevations.\n\nMain Destination:\nMount Meru (Mountain)",
            "Navigate the rugged, rocky terrain near the summit, experiencing the raw, geological power of this ancient, dormant volcano up close. The final push to Socialist Peak requires scrambling over loose scree and steep rock faces, testing your endurance and determination. The dramatic, barren landscape at this altitude feels almost lunar, creating a stark and beautiful contrast to the lush forests below.\n\nMain Destination:\nMount Meru (Mountain)",
            "Stand on the dramatic cliffs of Socialist Peak, feeling the thrill of achievement while taking in the vast, sweeping views of the Rift Valley. From this incredible vantage point, you can see for miles across the plains of Tanzania, with the curves of the earth visible on the horizon. The sense of accomplishment, combined with the sheer scale of the natural beauty surrounding you, makes this moment truly unforgettable.\n\nMain Destination:\nMount Meru (Mountain)"
        ],
        "end_desc": [
            "Descending from the majestic summit of Mount Meru, we reflect on the physical triumph and the breathtaking volcanic scenery we conquered. The journey back down through the changing ecological zones feels like a rapid rewind through time, from the barren peaks to the lush, green forests. Our legs may be tired, but our spirits are incredibly high, carrying the pride of having stood on the roof of this magnificent volcano.\n\nMain Destination:\nMount Meru (Mountain)",
            "Goodbye Mount Meru! Leaving the high-altitude trails behind, we carry the pride of reaching Socialist Peak and the stunning crater views. The memories of the crisp mountain air, the elusive forest wildlife, and the spectacular sunrise over Kilimanjaro will stay with us forever. As we return to the lower elevations, we say farewell to this challenging and deeply rewarding mountain giant.\n\nMain Destination:\nMount Meru (Mountain)",
            "Checking out from the mountain's lush forests, our legs tired but our hearts full after an epic trekking adventure. The descent through the montane forest, with its rich birdlife and towering trees, provides a peaceful and reflective end to the climb. We leave Mount Meru with a profound respect for its raw beauty and the incredible physical journey it offered us.\n\nMain Destination:\nMount Meru (Mountain)",
            "Farewell to the towering peak of Mount Meru! The memories of the dramatic ash cone, the rugged crater rim, and the breathtaking views of the Rift Valley will last a lifetime. This dormant volcano has tested our limits and rewarded us with some of the most spectacular high-altitude scenery in East Africa. As we head back to civilization, we carry the spirit of the mountain with us.\n\nMain Destination:\nMount Meru (Mountain)",
            "Concluding our Mount Meru expedition, we descend back to the lower elevations, perfectly acclimatized and ready for the next chapter of our safari. The transition from the stark, rocky summit to the vibrant, green foothills marks the end of an incredible physical challenge. We leave this majestic volcano behind, deeply grateful for the unforgettable adventure and the stunning panoramic views it gifted us.\n\nMain Destination:\nMount Meru (Mountain)"
        ]
    },
    {
        "name": "Tarangire National Park",
        "location": "Manyara, Tanzania",
        "lat": -3.8347,
        "lng": 36.0033,
        "type": "Park",
        "featured_img": "featuredImg/tarangire.jpg",
        "seasons": [
            {
                "season_name": "Peak Season",
                "start_day": 16,
                "start_month": 5,
                "end_day": 14,
                "end_month": 3,
                "fees": [
                    {"residency_label": "NON_RESIDENT", "fee_category": "ParkFee", "adult_fee": 50.00, "child_fee": 15.00},
                    {"residency_label": "RESIDENT", "fee_category": "ParkFee", "adult_fee": 25.00, "child_fee": 7.50},
                    {"residency_label": "EAC_MEMBER", "fee_category": "ParkFee", "adult_fee": 3.78, "child_fee": 0.76}
                ]
            },
            {
                "season_name": "Low Season",
                "start_day": 15,
                "start_month": 3,
                "end_day": 15,
                "end_month": 5,
                "fees": [
                    {"residency_label": "NON_RESIDENT", "fee_category": "ParkFee", "adult_fee": 45.00, "child_fee": 15.00},
                    {"residency_label": "RESIDENT", "fee_category": "ParkFee", "adult_fee": 22.50, "child_fee": 7.50},
                    {"residency_label": "EAC_MEMBER", "fee_category": "ParkFee", "adult_fee": 3.78, "child_fee": 0.76}
                ]
            }
        ],
        "start_desc": [
            "Welcome to Tarangire National Park, the legendary land of giants, famous for its massive elephant herds and iconic, ancient baobab trees. As you enter the park, the landscape opens up into a breathtaking expanse of dusty red earth and sprawling woodlands. The silhouettes of the massive baobabs against the blue sky create a truly magical and unforgettable African scene.\n\nMain Destination:\nTarangire National Park (Park)",
            "Your safari into Tarangire begins! Step into a landscape where the wildlife truly roams free, drawn by the life-giving waters of the Tarangire River. During the dry season, this park becomes a crucial refuge for thousands of animals, offering some of the highest concentrations of wildlife in Tanzania. Get ready for an intimate and thrilling game drive among the ancient giants of the bush.\n\nMain Destination:\nTarangire National Park (Park)",
            "Arriving at Tarangire National Park, feel the magic of the bush as the silhouettes of giant baobabs welcome you to the wild. These ancient, thick-trunked trees seem to hold the secrets of the savannah, providing shade and sustenance for a wide variety of wildlife. The air is filled with the sounds of the bush, and the anticipation of encountering the park's famous elephant herds is palpable.\n\nMain Destination:\nTarangire National Park (Park)",
            "Karibu Tarangire! Prepare for an intimate wildlife experience in a park renowned for its high concentration of elephants and its unique, rugged beauty. Unlike the vast, open plains of the Serengeti, Tarangire offers a more textured landscape of hills, swamps, and dense woodlands. It is a paradise for those seeking authentic, unspoiled African wilderness and spectacular photographic opportunities.\n\nMain Destination:\nTarangire National Park (Park)",
            "Welcome to the breathtaking expanse of Tarangire National Park, where the life-giving Tarangire River draws an incredible array of wildlife. The park's diverse ecosystems, from the seasonal swamps to the dry, rocky terrain, support a rich tapestry of animals and birds. As you drive through the entrance, the promise of seeing massive herds of elephants and majestic baobabs sets the stage for an epic safari.\n\nMain Destination:\nTarangire National Park (Park)"
        ],
        "center_desc": [
            "Track massive herds of elephants as they dig for water in the dry riverbeds and gracefully browse on the leaves of the towering baobab trees. Watching these gentle giants interact, play, and care for their young in their natural habitat is a profoundly moving experience. The sheer number of elephants in Tarangire is staggering, offering endless opportunities for incredible wildlife photography and observation.\n\nMain Destination:\nTarangire National Park (Park)",
            "Keep your eyes peeled in the branches for elusive leopards and massive pythons, both of which are known to seek refuge in the baobabs. The hollow trunks and thick branches of these ancient trees provide the perfect hiding spots for these secretive creatures. Spotting a python draped across a baobab branch or a leopard resting in the shade is a rare and thrilling highlight of any Tarangire safari.\n\nMain Destination:\nTarangire National Park (Park)",
            "Enjoy a thrilling game drive through the seasonal swamp, spotting vibrant flocks of yellow-collared lovebirds and other highly specialized birdlife. Tarangire is a birdwatcher's paradise, boasting over 550 species, many of which are drawn to the diverse habitats of the park. The contrast of the bright, colorful birds against the dry, dusty landscape creates a visually stunning and dynamic safari experience.\n\nMain Destination:\nTarangire National Park (Park)",
            "Witness the dramatic predator-prey dynamics as lions and cheetahs patrol the open plains and dry river courses in search of their next meal. The high density of herbivores in Tarangire supports a healthy population of predators, making for some of the most exciting game drives in northern Tanzania. Watching a pride of lions coordinate a hunt or a cheetah scan the horizon from a termite mound is pure safari magic.\n\nMain Destination:\nTarangire National Park (Park)",
            "Experience the serene beauty of the park's northern section, characterized by rolling hills, rugged terrain, and spectacular, panoramic views of the horizon. This less-visited area offers a sense of true wilderness and isolation, far removed from the crowds. The dramatic landscapes, combined with the abundant wildlife, make exploring this part of Tarangire a deeply rewarding and unforgettable adventure.\n\nMain Destination:\nTarangire National Park (Park)"
        ],
        "end_desc": [
            "Leaving the ancient baobab woodlands of Tarangire behind, we say goodbye to the magnificent elephant herds that made this park so special. The memories of watching these gentle giants roam freely among the towering trees will stay with us forever. As we exit the park gates, the dusty red earth and the rugged beauty of the landscape fade into the distance, leaving us with a deep appreciation for this unique ecosystem.\n\nMain Destination:\nTarangire National Park (Park)",
            "Goodbye Tarangire! As the red dust settles behind our vehicle, we carry with us unforgettable images of giants roaming the African bush. The park has offered us an intimate and thrilling wildlife experience, showcasing the raw beauty and resilience of the dry-season savannah. We leave with our cameras full of spectacular shots and our hearts full of wild African memories.\n\nMain Destination:\nTarangire National Park (Park)",
            "Checking out of Tarangire National Park, our minds are filled with the sights of massive elephants, elusive leopards, and the iconic baobab trees. The diverse landscapes, from the seasonal swamps to the rolling hills, have provided a rich and varied safari experience. Farewell to the life-giving Tarangire River, we head to our next destination, perfectly transitioning from the woodland giants to the next great ecosystem.\n\nMain Destination:\nTarangire National Park (Park)",
            "Farewell to the life-giving Tarangire River! The incredible biodiversity and stunning landscapes of this park have been a true safari highlight. The unique combination of massive elephant herds, ancient baobabs, and rugged terrain makes Tarangire an unforgettable stop on any Tanzanian itinerary. As we drive away, we carry the spirit of the bush and the magic of the giants with us.\n\nMain Destination:\nTarangire National Park (Park)",
            "Concluding our stay in Tarangire, we head out of the park gates, perfectly transitioning from the woodland giants to the next great ecosystem. The park has provided a spectacular introduction to the dry-season wildlife dynamics of northern Tanzania. With the silhouettes of the baobabs still fresh in our minds, we eagerly anticipate the next chapter of our epic safari adventure.\n\nMain Destination:\nTarangire National Park (Park)"
        ]
    },
    {
        "name": "Lake Manyara National Park",
        "location": "Arusha and Manyara, Tanzania",
        "lat": -3.5670,
        "lng": 35.8214,
        "type": "Park",
        "featured_img": "featuredImg/lake_manyara.jpg",
        "seasons": [
            {
                "season_name": "Peak Season",
                "start_day": 16,
                "start_month": 5,
                "end_day":14,
                "end_month": 3,
                "fees": [
                    {"residency_label": "NON_RESIDENT", "fee_category": "ParkFee", "adult_fee": 50.00, "child_fee": 15.00},
                    {"residency_label": "RESIDENT", "fee_category": "ParkFee", "adult_fee": 25.00, "child_fee": 7.50},
                    {"residency_label": "EAC_MEMBER", "fee_category": "ParkFee", "adult_fee": 3.78, "child_fee": 0.76},

                ]
            },
            {
                "season_name": "Low Season",
                "start_day": 1,
                "start_month": 4,
                "end_day": 30,
                "end_month": 6,
                "fees": [
                    {"residency_label": "NON_RESIDENT", "fee_category": "ParkFee", "adult_fee": 45.00, "child_fee": 15.00},
                    {"residency_label": "RESIDENT", "fee_category": "ParkFee", "adult_fee": 22.50, "child_fee": 7.50},
                    {"residency_label": "EAC_MEMBER", "fee_category": "ParkFee", "adult_fee": 3.78, "child_fee": 0.76},

                ]
            }
        ],
        "start_desc": [
            "Lake Manyara National Park is a small but diverse park 120km west of Arusha. Everything you will see here is on a different scale. It is both compact (one of the narrowest parks in Africa) and epic (the Great Rift Escarpment towers over Lake Manyara's western boundary).\n\nThe park's namesake is a shallow salt lake. It covers a large area of the park, flooding and drying with the seasons, and is home to thousands of wading birds (including flamingos and over 500 other bird species).\n\nMain Destination:\nLake Manyara National Park (Park)",
            "Welcome to Lake Manyara National Park, a breathtaking oasis nestled at the base of the Great Rift Valley's towering, dramatic escarpment. This compact but incredibly diverse park offers a stunning contrast of landscapes, from lush groundwater forests to open grasslands and the shimmering alkaline lake. As you enter, the sheer scale of the escarpment wall takes your breath away, setting the stage for an unforgettable safari.\n\nMain Destination:\nLake Manyara National Park (Park)",
            "Your journey into Lake Manyara begins! Enter the lush, emerald-green groundwater forest and prepare for a highly diverse wildlife experience. The dense canopy of giant fig and mahogany trees provides a cool, shaded welcome, filled with the calls of troops of baboons and monkeys. This unique ecosystem is just the beginning of the varied habitats you will explore in this remarkable, narrow park.\n\nMain Destination:\nLake Manyara National Park (Park)",
            "Arriving at Lake Manyara National Park, feel the humidity of the forest and catch your first shimmering glimpse of the alkaline lake. The park is famous for its incredible biomass, supporting a wide variety of wildlife in a relatively small area. The dramatic backdrop of the Rift Valley escarpment creates a visually stunning and awe-inspiring entrance to this natural wonderland.\n\nMain Destination:\nLake Manyara National Park (Park)",
            "Karibu Lake Manyara! A compact but incredibly rich park that famously boasts one of the highest biomasses of large mammals in the world. Despite being one of the narrowest parks in Africa, its diverse microclimates and habitats support an astonishing array of species. Get ready to explore a landscape where everything is on a different scale, offering intimate and spectacular wildlife encounters.\n\nMain Destination:\nLake Manyara National Park (Park)"
        ],
        "center_desc": [
            "Gaze up into the acacia branches to spot the park's famous tree-climbing lions, lounging lazily in the shade away from the buggy ground. This rare behavior, seen in only a few places in Africa, is a major highlight of Lake Manyara. Watching these majestic predators draped across the branches, completely at ease in the trees, is a surreal and unforgettable photographic opportunity.\n\nMain Destination:\nLake Manyara National Park (Park)",
            "Navigate the boardwalks near the hot springs to observe massive pods of hippos wallowing in the pools, constantly blowing water and grunting. The steaming hot springs, which flow continuously from the base of the escarpment, create a unique and fascinating microhabitat. Watching these massive, semi-aquatic mammals interact in the water, just a few meters away, is a thrilling and close-up wildlife experience.\n\nMain Destination:\nLake Manyara National Park (Park)",
            "Marvel at the shimmering pink carpet of thousands of flamingos and pelicans that flock to the alkaline waters of the lake shallows. The lake's rich, mineral-heavy waters support a massive population of these beautiful birds, creating a breathtaking visual spectacle. The sight of the pink flamingos against the blue water and the towering escarpment is one of the most iconic and picturesque scenes in all of Tanzania.\n\nMain Destination:\nLake Manyara National Park (Park)",
            "Drive through the dense groundwater forest to spot troops of olive baboons and agile blue monkeys foraging among the giant fig trees. The forest is alive with activity, and the close canopy provides excellent opportunities to observe these primates in their natural habitat. The rich, green environment is a stark and beautiful contrast to the open plains and the shimmering lake, showcasing the park's incredible ecological diversity.\n\nMain Destination:\nLake Manyara National Park (Park)",
            "Enjoy a scenic game drive along the lake shore, watching large herds of buffaloes, giraffes, and elephants against the backdrop of the blue water. The open grasslands near the lake provide excellent visibility, making it easy to spot these magnificent animals as they graze and drink. The combination of the abundant wildlife, the shimmering lake, and the towering escarpment creates a truly epic and unforgettable safari landscape.\n\nMain Destination:\nLake Manyara National Park (Park)"
        ],
        "end_desc": [
            "Saying goodbye to the shimmering waters of Lake Manyara, we leave behind the stunning escarpment views and the famous tree-climbing lions. The park has offered us an incredibly diverse and intimate wildlife experience, packed into a compact but breathtaking landscape. As we drive away, the memories of the pink flamingos, the steaming hot springs, and the lush groundwater forest will stay with us forever.\n\nMain Destination:\nLake Manyara National Park (Park)",
            "Goodbye Lake Manyara National Park! Departing this lush oasis, we reflect on the incredible density of wildlife and birdlife we witnessed today. The unique combination of the alkaline lake, the dramatic escarpment, and the diverse habitats has provided a truly spectacular safari. We leave with our cameras full of iconic shots and our hearts full of the magic of the Rift Valley.\n\nMain Destination:\nLake Manyara National Park (Park)",
            "Checking out of the groundwater forest, our minds filled with the sights of hippos, flamingos, and the majestic Rift Valley escarpment. The park's compact size belies the sheer variety and abundance of the wildlife it supports, making it a true hidden gem. Farewell to the beautiful shores of Lake Manyara, we head to our next destination, carrying wonderful memories of this unique and vibrant ecosystem.\n\nMain Destination:\nLake Manyara National Park (Park)",
            "Farewell to the beautiful shores of Lake Manyara! The unique ecosystems and vibrant wildlife of this park have been an absolute delight. From the tree-climbing lions to the massive pods of hippos, every moment spent here has been a testament to the rich biodiversity of Tanzania. As we continue our journey along the Rift Valley, we carry the breathtaking beauty of this oasis with us.\n\nMain Destination:\nLake Manyara National Park (Park)",
            "Concluding our visit to Lake Manyara, we drive away from the lake, carrying wonderful memories as we continue our journey along the Rift Valley. The park has provided a perfect blend of intimate forest encounters, spectacular lake views, and abundant wildlife sightings. With the towering escarpment fading in the rearview mirror, we eagerly anticipate the next chapter of our epic Tanzanian safari adventure.\n\nMain Destination:\nLake Manyara National Park (Park)"
        ]
    },
    { 
            "name": "Ngorongoro Crater",
            "location": "Arusha, Tanzania",
            "lat": -3.2333,
            "lng": 35.5833,
            "type": "Park",
            "featured_img": "featuredImg/ngorongoro.jpg",
            "seasons": [
                {
                    "season_name": "Standard Season",
                    "start_day": 1,
                    "start_month": 1,
                    "end_day": 31,
                    "end_month": 12,
                    "fees": [
                        {"residency_label": "NON_RESIDENT", "fee_category": "ParkFee", "adult_fee": 70.80, "child_fee": 23.60},
                        {"residency_label": "RESIDENT", "fee_category": "ParkFee", "adult_fee": 35.40, "child_fee": 11.80},
                        {"residency_label": "EAC_MEMBER", "fee_category": "ParkFee", "adult_fee": 4.47, "child_fee": 0.89}
                    ]
                }
            ],
            "start_desc": [
                "Welcome to the Ngorongoro Crater, often hailed as the Eighth Wonder of the World and the crown jewel of Tanzania's safari circuit. As your 4x4 vehicle begins the steep descent down the crater rim, the sheer scale of this massive volcanic caldera will leave you breathless. Prepare to enter a self-contained ecosystem where an astonishing density of wildlife thrives against a backdrop of stunning, emerald-green grasslands and shimmering soda lakes.\n\nMain Destination:\nNgorongoro Crater (Park)",
                "Your journey into the Ngorongoro Crater begins! Stepping into this UNESCO World Heritage site feels like entering a lost world, untouched by time and teeming with life. The dramatic plunge of 600 meters from the rim to the crater floor reveals a breathtaking amphitheater of natural beauty. Keep your cameras ready, as this incredible microcosm is home to the famous Big Five and some of the most spectacular wildlife viewing on the planet.\n\nMain Destination:\nNgorongoro Crater (Park)",
                "Arriving at the Ngorongoro Crater, you are immediately struck by the majestic, sweeping views from the rim. The air is crisp, and the anticipation of what lies below is palpable. This magnificent volcanic crater is not just a geographical marvel; it is a thriving sanctuary where predators and prey coexist in a delicate, ancient balance. Get ready for a game drive that promises unparalleled encounters in one of Africa's most iconic landscapes.\n\nMain Destination:\nNgorongoro Crater (Park)",
                "Karibu Ngorongoro Crater! Descending into this natural Eden is a surreal experience, transitioning from the cool, misty highlands of the rim down into the warm, vibrant savannah below. The crater floor stretches out before you, a vast, fertile plain dotted with grazing herds and lurking predators. This is the ultimate safari destination, offering a concentrated, high-quality wildlife experience that is simply unmatched anywhere else in the world.\n\nMain Destination:\nNgorongoro Crater (Park)",
                "Welcome to the breathtaking expanse of the Ngorongoro Crater, a geological masterpiece that has captivated explorers and nature lovers for generations. As you navigate the winding road down the crater wall, the diverse habitats unfold beneath you, from dense forests to open grasslands and the shimmering Lake Magadi. This is your gateway to witnessing the raw, unfiltered beauty of the African wild in its most concentrated and spectacular form.\n\nMain Destination:\nNgorongoro Crater (Park)"
            ],
            "center_desc": [
                "Navigate the lush, open grasslands of the crater floor, keeping a keen eye out for the iconic black rhinoceros grazing peacefully in the distance. The Ngorongoro Crater is one of the best places in East Africa to spot this critically endangered species in its natural habitat. Alongside them, massive herds of wildebeest, zebras, and gazelles roam freely, creating a dynamic and ever-changing landscape of wildlife activity that is a photographer's absolute dream.\n\nMain Destination:\nNgorongoro Crater (Park)",
                "Witness the dramatic predator-prey dynamics unfold as prides of lions patrol the golden grasslands and elusive leopards rest in the branches of the Lerai forests. The high density of herbivores within the crater supports a robust population of apex predators, ensuring thrilling sightings of hunts and territorial displays. Watching a lioness coordinate a hunt or a cheetah scan the horizon from a vantage point is pure, unadulterated safari magic.\n\nMain Destination:\nNgorongoro Crater (Park)",
                "Marvel at the shimmering pink carpet of thousands of flamingos and pelicans that flock to the alkaline waters of Lake Magadi. This shallow soda lake, nestled in the heart of the crater, is a vital watering hole for elephants and a stunning visual spectacle. The contrast of the bright pink birds against the blue water and the towering, forested crater walls creates one of the most iconic and picturesque scenes in all of Tanzania.\n\nMain Destination:\nNgorongoro Crater (Park)",
                "Explore the diverse micro-habitats of the crater, from the dense, groundwater-fed Lerai Forest to the open, sweeping plains and the rocky outcrops of the hippo pools. Each zone offers a completely different wildlife experience, allowing you to spot everything from massive bull elephants bathing in the mud to agile jackals darting through the grass. The sheer variety of life contained within this single caldera is a testament to nature's incredible resilience and beauty.\n\nMain Destination:\nNgorongoro Crater (Park)",
                "Enjoy a scenic game drive near the Gorigor Swamp, a lush, green oasis that attracts a wide array of wildlife, especially during the dry season. Here, you can observe elephants using their trunks to dig for water, while lions and hyenas lurk in the tall grass, waiting for an opportunity. The swamp is a vital lifeline within the crater, providing a fascinating glimpse into the survival strategies of the animals that call this unique ecosystem home.\n\nMain Destination:\nNgorongoro Crater (Park)"
            ],
            "end_desc": [
                "As we begin the steep ascent back to the crater rim, we bid farewell to the breathtaking, self-contained world of the Ngorongoro Crater. The memories of the dense wildlife, the shimmering soda lake, and the majestic black rhinos will stay with us forever. Leaving this natural Eden behind, we carry with us a profound appreciation for the raw, unfiltered beauty of this UNESCO World Heritage site.\n\nMain Destination:\nNgorongoro Crater (Park)",
                "Goodbye Ngorongoro Crater! Climbing back up the 600-meter wall, the stunning, panoramic views of the crater floor fade into the distance. We leave behind the roaming herds and the lurking predators, our cameras full of spectacular shots and our hearts full of wild African memories. The Eighth Wonder of the World has truly lived up to its legendary reputation, offering an unforgettable chapter in our Tanzanian safari.\n\nMain Destination:\nNgorongoro Crater (Park)",
                "Checking out of the Ngorongoro Conservation Area, our minds are filled with the sights of the Big Five and the dramatic, sweeping landscapes of the caldera. The concentrated wildlife experience and the sheer scale of the crater have provided a deeply rewarding and visually stunning safari. Farewell to the cool, misty highlands and the vibrant savannah below, we head to our next destination with immense gratitude for this geological masterpiece.\n\nMain Destination:\nNgorongoro Crater (Park)",
                "Farewell to the magnificent Ngorongoro Crater! The unique ecosystem, with its lush forests, open plains, and shimmering lakes, has been an absolute highlight of our journey. Watching the wildlife thrive in this natural amphitheater has been a privilege and a true testament to the wonders of the African wild. As we drive away from the rim, the silhouette of the crater remains etched in our minds, a permanent reminder of this extraordinary place.\n\nMain Destination:\nNgorongoro Crater (Park)",
                "Concluding our visit to the Ngorongoro Crater, we transition from the dense, wildlife-rich caldera floor back to the expansive highlands above. The descent and ascent through the diverse ecological zones have been a thrilling adventure in themselves. With the breathtaking views of the crater still fresh in our minds, we eagerly anticipate the next leg of our epic journey through the untamed landscapes of Tanzania.\n\nMain Destination:\nNgorongoro Crater (Park)"
            ]
        },
         {
                "name": "Zanzibar Island",
                "location": "Zanzibar, Tanzania",
                "lat": -6.1659,
                "lng": 39.2026,
                "type": "Beach",
                "featured_img": "featuredImg/zanzibar.jpg",
                "seasons": [
                    {
                        "season_name": "Standard Season",
                        "start_day": 1,
                        "start_month": 1,
                        "end_day": 31,
                        "end_month": 12,
                        "fees": []
                    }
                ],
                "start_desc": [
                    "Welcome to Zanzibar Island, the legendary 'Spice Island' and a breathtaking tropical paradise that offers the perfect, relaxing conclusion to your Tanzanian safari. As you step off the plane and feel the warm, fragrant breeze from the Indian Ocean, you are immediately transported into a world of pristine, white-sand beaches and crystal-clear, turquoise waters. Prepare to unwind, recharge, and immerse yourself in the rich, fascinating blend of Swahili, Arab, and European cultures that define this unique island.\n\nMain Destination:\nZanzibar Island (Beach)",
                    "Your beach holiday in Zanzibar begins! Stepping onto the soft, powdery sands of the northern and eastern coasts, you are greeted by the gentle lapping of the warm Indian Ocean and the swaying silhouettes of coconut palms. The transition from the dusty, wild savannahs to this serene, tropical haven is seamless and deeply rewarding. Get ready to soak up the sun, explore the historic, winding alleys of Stone Town, and experience the ultimate island relaxation.\n\nMain Destination:\nZanzibar Island (Beach)",
                    "Arriving in Zanzibar, you are immediately captivated by the stunning contrast of the vibrant, turquoise ocean and the lush, green tropical landscapes. The air is thick with the intoxicating scents of cloves, cinnamon, and nutmeg, a constant reminder of the island's rich agricultural heritage. This is a place of profound beauty and deep history, offering a perfect, tranquil escape where the pace of life slows down to the gentle rhythm of the tides.\n\nMain Destination:\nZanzibar Island (Beach)",
                    "Karibu Zanzibar! A world-renowned beach destination that offers an exclusive, luxurious, and deeply relaxing island experience. Whether you are looking to lounge on pristine beaches, explore the UNESCO-listed Stone Town, or dive into the vibrant coral reefs, Zanzibar has it all. Settle in, let the warm ocean breeze wash away the dust of the safari, and prepare for an unforgettable tropical getaway filled with culture, history, and natural beauty.\n\nMain Destination:\nZanzibar Island (Beach)",
                    "Welcome to the breathtaking, sun-drenched shores of Zanzibar Island, a tropical paradise that perfectly captures the magic of the Indian Ocean. As you navigate the coastal roads, the stunning views of the endless, blue ocean and the traditional, wooden dhow boats sailing in the distance create a picture-perfect scene. This is your gateway to experiencing the rich, diverse culture, the delicious coastal cuisine, and the warm, genuine hospitality of this legendary spice island.\n\nMain Destination:\nZanzibar Island (Beach)"
                ],
                "center_desc": [
                    "Immerse yourself in the rich, fascinating history of Stone Town, a UNESCO World Heritage site characterized by its narrow, winding alleys, intricately carved wooden doors, and vibrant, bustling markets. Explore the historic palaces, visit the former slave market memorial, and wander through the labyrinthine streets where the scent of exotic spices mingles with the sound of the call to prayer. This is a deeply cultural and educational experience that connects you directly to the complex, layered history of the Swahili coast.\n\nMain Destination:\nZanzibar Island (Beach)",
                    "Embark on a guided spice tour through the lush, tropical interior of the island, discovering the origins and uses of the cloves, vanilla, cinnamon, and nutmeg that made Zanzibar famous. Your expert guide will show you how these exotic spices are grown, harvested, and used in local cuisine and traditional medicine, offering a fascinating, sensory-rich experience. Tasting the fresh, vibrant flavors of the island's produce is a delightful, unforgettable way to connect with Zanzibar's agricultural heritage.\n\nMain Destination:\nZanzibar Island (Beach)",
                    "Relax and unwind on the pristine, white-sand beaches of the northern coast, where the warm, turquoise waters of the Indian Ocean invite you for a refreshing swim or a peaceful snorkeling adventure. The soft, powdery sand and the swaying coconut palms create the ultimate tropical backdrop for pure, unadulterated relaxation. Whether you are lounging with a good book, enjoying a beachside massage, or watching the spectacular sunset, the serene beauty of the beach is truly captivating.\n\nMain Destination:\nZanzibar Island (Beach)",
                    "Experience the vibrant, magical atmosphere of the Forodhani Gardens night market in Stone Town, where the air is filled with the sizzling sounds and delicious aromas of fresh, local seafood and traditional Zanzibari dishes. Sample the famous Zanzibar pizza, grilled squid, and sweet sugarcane juice while soaking in the lively, communal atmosphere as the sun sets over the ocean. It is a fantastic, authentic way to experience the rich, diverse culinary culture of the island.\n\nMain Destination:\nZanzibar Island (Beach)",
                    "Take a scenic, traditional dhow cruise at sunset, gliding across the calm, golden waters of the Indian Ocean while enjoying the breathtaking, panoramic views of the coastline. The gentle sea breeze, the soft creaking of the wooden boat, and the spectacular, fiery colors of the setting sun create a deeply romantic and unforgettable experience. This peaceful, scenic activity provides the perfect, tranquil conclusion to a day of exploring the island's rich culture and beautiful beaches.\n\nMain Destination:\nZanzibar Island (Beach)"
                ],
                "end_desc": [
                    "As we leave the pristine, sun-drenched shores of Zanzibar behind, we bid farewell to a tropical paradise that offered the perfect, relaxing conclusion to our Tanzanian adventure. The memories of the historic, winding alleys of Stone Town, the fragrant spice tours, and the stunning, turquoise waters of the Indian Ocean will stay with us forever. Leaving this beautiful island behind, we carry with us a deep appreciation for its rich culture, its warm hospitality, and its breathtaking natural beauty.\n\nMain Destination:\nZanzibar Island (Beach)",
                    "Goodbye Zanzibar Island! Departing the soft, white-sand beaches and the lush, tropical landscapes, the stunning, vibrant colors of the island fade into the distance. We leave behind the historic charm of Stone Town, the intoxicating scents of the spice plantations, and the gentle, rhythmic lapping of the ocean waves. Our hearts are full of the warm, genuine hospitality of the Zanzibari people, and our souls are deeply refreshed by the magic of this legendary spice island.\n\nMain Destination:\nZanzibar Island (Beach)",
                    "Checking out of this tropical haven, our minds are filled with the sights of the traditional dhow boats, the vibrant, bustling markets, and the stunning, crystal-clear waters. The island has offered us an incredibly relaxing, culturally rich, and visually spectacular beach experience, providing the perfect, tranquil contrast to the wild adventures of the safari. Farewell to the pristine beaches and the historic streets, we head home with immense gratitude for this unforgettable island paradise.\n\nMain Destination:\nZanzibar Island (Beach)",
                    "Farewell to the life-giving, warm waters of the Indian Ocean and the lush, fragrant spice plantations of Zanzibar! The unique combination of historic Stone Town, vibrant spice tours, and pristine, white-sand beaches has been an absolute delight. As we take off from the island, the stark, breathtaking beauty of the coastline remains etched in our minds, a permanent reminder of the magic, the culture, and the deep relaxation of this legendary tropical paradise.\n\nMain Destination:\nZanzibar Island (Beach)",
                    "Concluding our beach holiday in Zanzibar, we transition from the serene, tropical shores to the journey home, perfectly wrapping up our epic Tanzanian adventure. The island has provided a spectacular, authentic, and deeply relaxing experience, proving that the perfect safari must always be followed by the ultimate beach escape. With the distant sound of the ocean waves and the scent of cloves fading into memory, we leave Zanzibar with hearts full of gratitude and souls fully recharged.\n\nMain Destination:\nZanzibar Island (Beach)"
                ]
            },
            
        ]

        for data in destinations_data:
            # 1. Create or Get Destination
            dest, created = Destination.objects.get_or_create(
                name=data["name"],
                defaults={
                    "location": data.get("location", ""),
                    "location_latitude": data.get("lat"),
                    "location_longitude": data.get("lng"),
                    "destination_type": data.get("type"),
                    "featured_img": data.get("featured_img", "featuredImg/default.jpg"),
                }
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f"✅ Created Destination: {dest.name}"))
            else:
                self.stdout.write(f"⚠️  Destination {dest.name} already exists. Adding related data...")

            # 2. Create Seasons and Fees from data
            seasons_data = data.get("seasons", [])
            for season_data in seasons_data:
                season, season_created = DestinationSeason.objects.get_or_create(
                    destination=dest,
                    season_name=season_data["season_name"],
                    defaults={
                        "start_day": season_data.get("start_day"),
                        "start_month": season_data.get("start_month"),
                        "end_day": season_data.get("end_day"),
                        "end_month": season_data.get("end_month"),
                    }
                )

                if season_created:
                    self.stdout.write(f"   📅 Created Season: {season.season_name}")

                # Create Fees for this Season
                fees_data = season_data.get("fees", [])
                for fee_data in fees_data:
                    fee, fee_created = DestinationFee.objects.get_or_create(
                        destination=dest,
                        seasons=season,
                        residency_label=fee_data["residency_label"],
                        fee_category=fee_data["fee_category"],
                        defaults={
                            "adult_fee": clean_decimal(fee_data.get("adult_fee")),
                            "child_fee": clean_decimal(fee_data.get("child_fee")),
                        }
                    )
                    if fee_created:
                        self.stdout.write(
                            f"      💰 Created Fee: {fee.get_residency_label_display()} - "
                            f"{fee.fee_category} (Adult: {fee.adult_fee})"
                        )

            # 3. Create 5 START Descriptions
            for desc in data.get("start_desc", []):
                DestinationDescription.objects.get_or_create(
                    destination=dest,
                    context_type="START",
                    content=desc
                )

            # 4. Create 5 CENTER Descriptions
            for desc in data.get("center_desc", []):
                DestinationDescription.objects.get_or_create(
                    destination=dest,
                    context_type="CENTER",
                    content=desc
                )

            # 5. Create 5 END Descriptions
            for desc in data.get("end_desc", []):
                DestinationDescription.objects.get_or_create(
                    destination=dest,
                    context_type="END",
                    content=desc
                )

            self.stdout.write(self.style.SUCCESS(f"🎉 Finished processing: {dest.name}\n"))

        self.stdout.write(self.style.SUCCESS("\n🎊 SUCCESS: All destinations seeded with seasons, fees, and descriptions!"))
    


