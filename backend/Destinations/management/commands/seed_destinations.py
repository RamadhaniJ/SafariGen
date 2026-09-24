from django.core.management.base import BaseCommand
from Destinations.models import (  # Badilisha 'destination' kulingana na jina la app yako
    Destination, 
    DestinationSeason, 
    DestinationFee, 
    DestinationDescription
)

class Command(BaseCommand):
    help = 'Seeds 10 authentic Tanzanian destinations with 5 Start, 5 Center, and 5 End descriptions each.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Starting to seed Destinations data..."))

        # Data za ukweli za maeneo 10

        #  missing version 2
        destinations_data = [
            {
                "name": "Zanzibar - Stone Town & Beaches",
                "location": "Zanzibar Urban/West & Coastal Regions, Tanzania",
                "lat": -6.165917,
                "lng": 39.191833,
                "type": "Beach & Culture",
                "start_desc": [
                    "Welcome to the enchanted Spice Island of Zanzibar, where ancient Swahili heritage gracefully meets powdery white sand beaches.",
                    "Your coastal escape begins today as the warm Indian Ocean breeze wraps around you in historic Zanzibar.",
                    "Arriving in Zanzibar! Step into a vibrant world filled with the fragrant scent of cloves, turquoise water, and gentle waves.",
                    "Karibu Zanzibar! Prepare to unwind as soft ocean breezes welcome you to this tropical paradise.",
                    "Welcome to a paradise of contrasting beauties, from labyrinthine historic stone alleyways to idyllic palm-fringed shores."
                ],
                "center_desc": [
                    "Wander through Stone Town's ancient coral-rag alleyways, discovering carved Arabian doors and rich Swahili culture.",
                    "Bask in the golden sun on pristine beaches before sailing out on a traditional wooden dhow into the glowing ocean.",
                    "Dip into crystal-clear turquoise waters teeming with colorful coral reefs and vibrant marine life.",
                    "Indulge your senses with an intoxicating spice tour, tasting fresh exotic fruits, vanilla, and cinnamon straight from the trees.",
                    "Experience breathtaking ocean sunsets while watching traditional dhow boats glide peacefully across a fiery horizon."
                ],
                "end_desc": [
                    "As we wrap up our Zanzibar getaway, we take leave of the serene waves and timeless spice-scented air.",
                    "Goodbye Zanzibar! Leaving behind pristine sandy shores with pure relaxation etched deep into your memory.",
                    "Checking out from Zanzibar - Stone Town & Beaches. The coastal charm and tropical tranquility will stay with you forever.",
                    "Farewell Zanzibar! As we depart this island paradise, you carry home unforgettable memories of sun, sea, and spice.",
                    "Concluding our island escape. One final barefoot stroll along the beach brings your unforgettable coastal retreat to a close."
                ]
            },
            {
                "name": "Arusha City (Safari Capital)",
                "location": "Arusha Region, Tanzania",
                "lat": -3.386925,
                "lng": 36.682993,
                "type": "City",
                "start_desc": [
                    "Welcome to Arusha, the vibrant Safari Capital of Tanzania nestled right at the majestic foot of Mount Meru.",
                    "Your African adventure journey officially sparks to life today in the buzzing, green heart of Arusha City.",
                    "Arriving in Arusha! Feel the exciting pulse of anticipation as travelers gather for world-class safari expeditions.",
                    "Karibu Arusha! Step into a lively bustling hub surrounded by lush coffee plantations and crisp mountain air.",
                    "Welcome to Arusha, the iconic gateway where wild northern circuit adventures and rich cultural charm meet."
                ],
                "center_desc": [
                    "Explore vibrant local craft markets, colorful Maasai curio stalls, and aromatic local coffee estates around the city.",
                    "Soak in stunning panoramas of Mount Meru rising dramatically above the bustling green streets of Arusha.",
                    "Immerse yourself in local Tanzanian culture through culinary tours, art galleries, and warm community interactions.",
                    "Relax in charming garden lodges surrounded by tropical flora as you prepare for your grand wilderness journey.",
                    "Discover hidden gems from sparkling tanzanite gemstone boutiques to quiet, historic colonial landmarks."
                ],
                "end_desc": [
                    "As we depart Arusha City, we gear up to trade urban energy for the untamed wild outer reserves.",
                    "Goodbye Arusha! The city's lively spirit and views of Mount Meru linger as we set off on the open road.",
                    "Checking out from the Safari Capital. A perfect stay that primed your senses for the thrilling nature ahead.",
                    "Farewell Arusha! With cameras ready and hearts excited, we move forward to extraordinary wild destinations.",
                    "Concluding our Arusha stay. The city served as the perfect launching pad for an epic northern Tanzanian journey."
                ]
            },
            {
                "name": "Mikumi National Park",
                "location": "Morogoro Region, Tanzania",
                "lat": -7.377319,
                "lng": 37.004135,
                "type": "Park",
                "start_desc": [
                    "Welcome to Mikumi National Park, an accessible wilderness paradise oft fondly dubbed the 'Little Serengeti'.",
                    "Your southern safari kicks off today as we enter the sprawling, golden floodplains of magnificent Mikumi.",
                    "Arriving at Mikumi National Park! Take in the open savannah vistas dotted with giant baobab trees.",
                    "Karibu Mikumi! Step right into an intimate wildlife haven brimming with sprawling herds and dramatic landscapes.",
                    "Welcome to a land of serene beauty where scenic mountain backdrops frame endless grassy plains."
                ],
                "center_desc": [
                    "Traverse the Mkata Floodplain, where impressive herds of wildebeests, zebras, and buffaloes graze side by side.",
                    "Keep your eyes peeled for Mikumi’s iconic tree-climbing lions resting on lower branches during the heat of the day.",
                    "Observe wallowing hippos and snapping crocodiles sharing vibrant watering holes at the popular hippo pools.",
                    "Marvel at the distinctive 'Simba' towers—granite formations offering sweeping views over predator country.",
                    "Spot graceful giraffes nibbling on acacia tops while magnificent herds of elephants cross the savannah."
                ],
                "end_desc": [
                    "As we wrap up our Mikumi safari, we say goodbye to its peaceful wilderness and rich wildlife encounters.",
                    "Goodbye Mikumi! Leaving behind golden grass horizons and unforgettable elephant sightings.",
                    "Checking out from Mikumi National Park. The raw charm of southern Tanzania has truly captured your heart.",
                    "Farewell Mikumi! Carrying home serene moments from the open floodplains as we journey on.",
                    "Concluding our stay in Mikumi. A rewarding morning game drive completes a remarkable southern safari stop."
                ]
            },
            {
                "name": "Ruaha National Park",
                "location": "Iringa Region, Tanzania",
                "lat": -7.700000,
                "lng": 34.900000,
                "type": "Park",
                "start_desc": [
                    "Welcome to Ruaha National Park, Tanzania’s largest, wildest, and most ruggedly authentic secret wilderness.",
                    "Your remote safari expedition starts today as we enter the untouched, dramatic landscapes of Ruaha.",
                    "Arriving in Ruaha! Feel the exhilarating isolation of an untamed sanctuary teeming with fierce wildlife.",
                    "Karibu Ruaha! Prepare to explore massive ancient baobab forests and the grand Great Ruaha River valley.",
                    "Welcome to a true predator paradise, where vast wilderness offers an unmatched sense of pure adventure."
                ],
                "center_desc": [
                    "Witness massive pride of lions hunting along the dry riverbeds of the majestic Great Ruaha River.",
                    "Track elusive wild dogs, rare sable antelopes, and immense herds of elephants under giant ancient baobabs.",
                    "Experience breathtaking game drives across rugged hills and dense commiphora woodlands teeming with birdlife.",
                    "Watch dramatic wildlife drama unfold at shrinking waterholes during intense golden-hour game tracking.",
                    "Absorb the wild silence of one of Africa’s least disturbed ecosystems on thrilling game drives."
                ],
                "end_desc": [
                    "As we wrap up our Ruaha adventure, we bid farewell to this rugged, untouched wilderness masterpiece.",
                    "Goodbye Ruaha! Leaving behind roaring lions, giant baobabs, and the wild heart of southern Tanzania.",
                    "Checking out from Ruaha National Park. An unforgettable experience in one of Africa's rawest sanctuaries.",
                    "Farewell Ruaha! As we leave the grand river behind, powerful safari memories remain burned in your mind.",
                    "Concluding our stay in Ruaha. A magical final game drive brings our wild wilderness trek to an end."
                ]
            }
        ]

        # destinations_data = [
        #     {
        #         "name": "Serengeti National Park",
        #         "location": "Mara & Simiyu Regions, Tanzania",
        #         "lat": -2.333333,
        #         "lng": 34.833333,
        #         "type": "Park",
        #         "start_desc": [
        #             "Welcome to the iconic Serengeti National Park, home to the world-famous Great Migration and breathtaking wild landscapes.",
        #             "Your safari adventure kicks off today as we journey into the golden, endless plains of the mighty Serengeti.",
        #             "Arriving at Serengeti National Park! Feel the raw wilderness air and get ready for an unforgettable game driving experience.",
        #             "Karibu Serengeti! The journey begins as you step onto the vast savannah where iconic wildlife roams freely.",
        #             "Welcome to the land of endless horizons. Serengeti greets you with vast open plains and pristine natural beauty."
        #         ],
        #         "center_desc": [
        #             "Witness the raw power of nature as thousands of wildebeests and zebras brave the plains during the Great Migration.",
        #             "In the heart of Serengeti, apex predators lounge on ancient granite Kopjes while cheetahs scan the horizon for prey.",
        #             "An thrilling game drive through the Seronera Valley reveals resting leopards on acacia branches and large elephant herds.",
        #             "Ultimate safari action! Experience dramatic predator-prey encounters during full-day tracking across the central plains.",
        #             "Golden hour over the Serengeti turns the sky into deep amber while giraffes glide gracefully past your 4x4 safari vehicle."
        #         ],
        #         "end_desc": [
        #             "As we wrap up our Serengeti experience, we bid farewell to the endless plains and memories that will last a lifetime.",
        #             "Goodbye Serengeti! Leaving behind the lion roars and breathtaking golden sunsets as we transition to our next destination.",
        #             "Checking out from Serengeti National Park. The wildlife encounters here have been nothing short of extraordinary.",
        #             "Farewell Serengeti! As the dust settles behind our 4x4, we carry unforgettable wild moments with us.",
        #             "Concluding our stay in Serengeti. A rewarding final morning game drive brings our epic stay to a perfect close."
        #         ]
        #     },
        #     {
        #         "name": "Ngorongoro Crater",
        #         "location": "Arusha Region, Tanzania",
        #         "lat": -3.244444,
        #         "lng": 35.513889,
        #         "type": "Park",
        #         "start_desc": [
        #             "Welcome to the rim of the Ngorongoro Crater, a magnificent natural amphitheater and UNESCO World Heritage site.",
        #             "Arriving at the Ngorongoro Conservation Area! Prepare to descend into one of the greatest natural wonders of the world.",
        #             "Standing at the crater rim offers a jaw-dropping panoramic view before we drive down into the crater floor.",
        #             "Your Ngorongoro experience begins today—a dense haven for Africa’s Big Five tucked inside a giant volcanic caldera.",
        #             "Welcome to Africa's Eden! Descending 600 meters down into the world's largest intact volcanic caldera."
        #         ],
        #         "center_desc": [
        #             "Exploring the crater floor: spot rare Black Rhinos grazing near Lake Magadi alongside thousands of flamingos.",
        #             "High-density wildlife encounters! Lions, spotted hyenas, hippos, and buffaloes thrive side-by-side in this sheltered caldera.",
        #             "Enjoy a memorable lakeside picnic lunch surrounded by dramatic crater walls and resident hippo pods.",
        #             "Tracking magnificent tusker elephants as they navigate the fever tree acacia forests inside the crater basin.",
        #             "An intense day of game viewing inside the caldera wall—where every turn reveals an extraordinary density of wildlife."
        #         ],
        #         "end_desc": [
        #             "Ascending the crater rim as we bid farewell to this natural sanctuary. Ngorongoro will forever stay in your memory.",
        #             "Goodbye Ngorongoro! Leaving the enchanted crater floor behind as we head toward our next adventure.",
        #             "Farewell Ngorongoro Crater! A truly unique wildlife experience comes to a satisfying close.",
        #             "Wrapping up our crater tour. The breathtaking views from the rim serve as our final farewell to this wonder of nature.",
        #             "Checking out of Ngorongoro Conservation Area with incredible stories and Big Five sightings."
        #         ]
        #     },
        #     {
        #         "name": "Tarangire National Park",
        #         "location": "Manyara Region, Tanzania",
        #         "lat": -3.833333,
        #         "lng": 36.000000,
        #         "type": "Park",
        #         "start_desc": [
        #             "Welcome to Tarangire National Park, celebrated for its giant baobab trees and massive matriarch elephant herds.",
        #             "Arriving in Tarangire! Get ready to explore the elephant kingdom anchored by the life-giving Tarangire River.",
        #             "Ancient, towering baobab trees frame the landscape as your wild safari adventure here officially begins.",
        #             "Welcome to the park of giants. Tarangire offers an authentic, wilderness atmosphere right from the entrance gate.",
        #             "Starting our Tarangire leg! The dry season brings thousands of animals flocking directly to the riverbanks."
        #         ],
        #         "center_desc": [
        #             "Encounter huge elephant families kicking up red dust beneath the shade of ancient baobab trees.",
        #             "Full-day tracking along the Tarangire River: lions lurk in the tall grass waiting for thirsty wildebeests and zebras.",
        #             "Spot tree-climbing lions resting on lower branches along with over 500 species of vibrant birdlife.",
        #             "Navigating near Silale Swamps where leopards hide and large herds of buffalo cool off in the wetlands.",
        #             "Experiencing the remarkable abundance of wildlife drawn to Tarangire's permanent water sources."
        #         ],
        #         "end_desc": [
        #             "Bidding farewell to the land of Baobabs and Elephants as we depart from Tarangire National Park.",
        #             "Goodbye Tarangire! The sights of giant elephant herds crossing riverbeds will linger long after we leave.",
        #             "Farewell Tarangire! Concluding our thrilling game drives among the majestic ancient trees.",
        #             "Checking out from Tarangire and taking a scenic drive toward our next destination.",
        #             "Our Tarangire safari finishes on a high note with lasting impressions of Africa’s iconic gentle giants."
        #         ]
        #     },
        #     {
        #         "name": "Zanzibar - Nungwi & Stone Town",
        #         "location": "Zanzibar Island, Tanzania",
        #         "lat": -6.165000,
        #         "lng": 39.199000,
        #         "type": "Beach",
        #         "start_desc": [
        #             "Welcome to Zanzibar! Feel the warm tropical ocean breeze and fragrance of cloves floating through the air.",
        #             "Welcome to the Spice Island! Your coastal island retreat begins amidst turquoise waters and rich Swahili heritage.",
        #             "Arriving in Zanzibar! From ancient historic stone alleyways to pristine white sandy beaches, pure relaxation awaits.",
        #             "Welcome to tropical paradise! Swahili warmth meets the crystal-clear waters of the warm Indian Ocean.",
        #             "Touchdown in Zanzibar! Time to slow down, unwind, and soak up the relaxing island rhythm."
        #         ],
        #         "center_desc": [
        #             "Explore the labyrinth alleyways of historic Stone Town, discovering carved wooden doors and vibrant spice markets.",
        #             "Sail on a traditional wooden Dhow, snorkel untouched coral reefs, and feast on fresh tropical seafood.",
        #             "Relax on Nungwi and Kendwa beaches, dipping into clear turquoise waters beneath the tropical sun.",
        #             "Take an informative Spice Tour tasting fresh cinnamon, nutmeg, and vanilla directly from local organic farms.",
        #             "Enjoy an unforgettable sunset dhow cruise while gentle Swahili melodies echo across the rolling waves."
        #         ],
        #         "end_desc": [
        #             "Farewell Zanzibar! Pack your bags filled with spice memories and ocean vibes as your island escape ends.",
        #             "Goodbye paradise! Leaving the white sandy shores of Zanzibar behind as you head for your homeward journey.",
        #             "Wrapping up our Zanzibar retreat. May the island peace and tropical warmth stay with you.",
        #             "Bidding farewell to Stone Town and the Indian Ocean—a perfect grand finale to your Tanzanian trip.",
        #             "Checking out of Zanzibar with sun-kissed skin and wonderful coastal memories."
        #         ]
        #     },
        #     {
        #         "name": "Mount Kilimanjaro",
        #         "location": "Kilimanjaro Region, Tanzania",
        #         "lat": -3.067400,
        #         "lng": 37.355600,
        #         "type": "Mountain",
        #         "start_desc": [
        #             "Welcome to the roof of Africa! Mount Kilimanjaro stands majestic, inviting adventurous spirits from around the globe.",
        #             "Arriving at the foot of Mount Kilimanjaro! Prepare yourself for an extraordinary mountain trekking expedition.",
        #             "Step through the rainforest park gate as your trek up the world's tallest free-standing mountain begins today.",
        #             "Welcome to Kilimanjaro National Park! The journey toward Uhuru Peak starts right here.",
        #             "Gear checked and mountain guides ready! Welcome to the starting line of your epic summit challenge."
        #         ],
        #         "center_desc": [
        #             "Trekking through dramatic ecological zones—from lush rainforests to alpine deserts and glacial peaks.",
        #             "Pushing through steep mountain ridges under star-lit skies during the midnight summit push.",
        #             "Standing on the Crater Rim with ancient glaciers glistening under the golden morning sunrise.",
        #             "Reaching Uhuru Peak at 5,895 meters above sea level—an emotional, triumphant victory atop Africa!",
        #             "Navigating giant lobelia plants and rugged alpine paths supported by your expert guide team."
        #         ],
        #         "end_desc": [
        #             "Descending to the park gate to collect your official Kilimanjaro summit certificate. Congratulations!",
        #             "Goodbye Mount Kilimanjaro! You conquered the roof of Africa and created a memory for a lifetime.",
        #             "Farewell Kili! Bidding goodbye to the summit peak with proud hearts and incredible achievements.",
        #             "Concluding your Kilimanjaro trek with a joyful celebration alongside your dedicated crew of porters and guides.",
        #             "Checking out from Mount Kilimanjaro National Park—a bucket-list challenge successfully completed!"
        #         ]
        #     },
        #     {
        #         "name": "Lake Manyara National Park",
        #         "location": "Arusha & Manyara, Tanzania",
        #         "lat": -3.600000,
        #         "lng": 35.800000,
        #         "type": "Park",
        #         "start_desc": [
        #             "Welcome to Lake Manyara National Park, famous for its tree-climbing lions and flamingo-draped alkaline shores.",
        #             "Arriving at Lake Manyara! Nestled dramatically right beneath the steep Great Rift Valley escarpment.",
        #             "The lush groundwater forest greets you with cool shade as you pass through the park entrance gate.",
        #             "Welcome to Lake Manyara! A compact wildlife jewel bursting with diverse habitats and vibrant bird species.",
        #             "Starting our Lake Manyara game drive! Keep your eyes trained on high acacia branches for resting big cats."
        #         ],
        #         "center_desc": [
        #             "Spotting Manyara's famous tree-climbing lions resting high on sturdy acacia branches away from heat.",
        #             "Walk along the high canopy treetop walkway for a unique bird’s-eye perspective of the dense forest.",
        #             "Drive along the lake shores where thousands of pink flamingos gather across the shallow alkaline waters.",
        #             "Encounter large baboon troops playing along the forest tracks and elephants feeding on wild mahogany trees.",
        #             "Exploring Maji Moto natural hot springs at the edge of the lake framed by steep Rift Valley cliffs."
        #         ],
        #         "end_desc": [
        #             "Bidding farewell to Lake Manyara as we exit the groundwater forest onward to our next stop.",
        #             "Goodbye Lake Manyara! Taking away fond memories of flamingos, baboons, and Great Rift Valley vistas.",
        #             "Farewell Manyara! Wrapping up a short but feature-packed safari game drive.",
        #             "Checking out from Lake Manyara National Park with a camera full of beautiful wildlife photos.",
        #             "Concluding our tour of Lake Manyara—a scenic sanctuary where lush forest meets the lake."
        #         ]
        #     }
        # ]
        # # Seed process
        
        for data in destinations_data:
            dest, created = Destination.objects.get_or_create(
                name=data["name"],
                defaults={
                    "location": data["location"],
                    "location_latitude": data["lat"],
                    "location_longitude": data["lng"],
                    "destination_type": data["type"],
                }
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f"Created Destination: {dest.name}"))
            else:
                self.stdout.write(f"Destination {dest.name} already exists. Adding descriptions...")

            # 1. Create Seasons
            high_season, _ = DestinationSeason.objects.get_or_create(
                destination=dest,
                season_name="High Season",
                defaults={"start_day": 1, "start_month": 6, "end_day": 31, "end_month": 10}
            )
            low_season, _ = DestinationSeason.objects.get_or_create(
                destination=dest,
                season_name="Low Season",
                defaults={"start_day": 1, "start_month": 3, "end_day": 31, "end_month": 5}
            )

            # 2. Create Fees
            if dest.destination_type in ["Park", "Mountain"]:
                DestinationFee.objects.get_or_create(
                    destination=dest,
                    seasons=high_season,
                    residency_label="NON_RESIDENT",
                    fee_category="ParkFee",
                    defaults={"adult_fee": 70.00, "child_fee": 20.00}
                )
                DestinationFee.objects.get_or_create(
                    destination=dest,
                    seasons=high_season,
                    residency_label="RESIDENT",
                    fee_category="ParkFee",
                    defaults={"adult_fee": 10000.00, "child_fee": 2000.00}
                )

            # 3. Create 5 START Descriptions
            for desc in data["start_desc"]:
                DestinationDescription.objects.get_or_create(
                    destination=dest,
                    context_type="START",
                    content=desc
                )

            # 4. Create 5 CENTER Descriptions
            for desc in data["center_desc"]:
                DestinationDescription.objects.get_or_create(
                    destination=dest,
                    context_type="CENTER",
                    content=desc
                )

            # 5. Create 5 END Descriptions
            for desc in data["end_desc"]:
                DestinationDescription.objects.get_or_create(
                    destination=dest,
                    context_type="END",
                    content=desc
                )

        self.stdout.write(self.style.SUCCESS("\n🎉 SUCCESS: Seeding completed! 10 Destinations with 15 descriptions each generated."))