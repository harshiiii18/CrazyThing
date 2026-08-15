// /**
//  * server/seed/seedMoreProducts.js
//  * -----------------------------------------------------------------
//  * seed.js se ALAG file hai — ye kuch delete NAHI karti.
//  * Sirf existing seller (Aarav Mehta) aur existing categories ko
//  * dhoondh kar, har category me 10-10 naye products ADD karti hai.
//  *
//  * RUN (server folder ke andar se):
//  *   node seed/seedMoreProducts.js
//  * -----------------------------------------------------------------
//  */

// require("dotenv").config();
// const mongoose = require("mongoose");
// const User = require("../models/User");
// const Category = require("../models/Category");
// const Product = require("../models/Product");

// const SELLER_EMAIL = "seller@crazything.dev"; // seed.js me isi email se seller bana tha

// // -----------------------------------------------------------------
// // Category-wise 10 products har ek — title, description, price,
// // condition, image (high quality Unsplash)
// // -----------------------------------------------------------------
// const CATEGORY_DATA = {
//   "Electronics": [
//     ["JBL Flip 6 Bluetooth Speaker", "Waterproof, punchy bass, comes with charger.", 5500, "GOOD", "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80"],
//     ["Amazon Echo Dot 5th Gen", "Smart speaker, box included, 3 months use.", 2800, "LIKE_NEW", "https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&q=80"],
//     ["Canon EOS 1500D DSLR Camera", "18-55mm lens, low shutter count, bag included.", 24999, "GOOD", "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80"],
//     ["Mi Power Bank 20000mAh", "Fast charging, original box and cable.", 1200, "LIKE_NEW", "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80"],
//     ["Boat Rockerz 450 Headphones", "Wired-free, 15hr battery, minor scratches.", 999, "FAIR", "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80"],
//     ["Logitech MX Master 3 Mouse", "Ergonomic wireless mouse, works perfectly.", 4500, "GOOD", "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80"],
//     ["Samsung 27-inch Monitor", "Full HD, 75Hz, no dead pixels.", 9500, "GOOD", "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80"],
//     ["Apple AirPods Pro 2", "ANC works great, case has minor wear.", 15999, "GOOD", "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80"],
//     ["GoPro Hero 10 Black", "4K action camera with 2 extra batteries.", 22000, "LIKE_NEW", "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80"],
//     ["Apple Watch Series 9", "GPS, 45mm, minor scratch on band.", 21999, "GOOD", "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&q=80"]
//   ],
//   "Mobiles": [
//     ["Samsung Galaxy S22", "5G, 8/128GB, with box and charger.", 27999, "GOOD", "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80"],
//     ["OnePlus 11R 5G", "16/256GB, screen guard applied since day 1.", 26500, "LIKE_NEW", "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80"],
//     ["Redmi Note 12 Pro", "6/128GB, minor back panel scratch.", 13500, "FAIR", "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=600&q=80"],
//     ["Apple iPhone 15", "256GB, still under Apple warranty.", 62000, "LIKE_NEW", "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80"],
//     ["Google Pixel 7a", "Clean camera, stock Android, 128GB.", 24999, "GOOD", "https://images.unsplash.com/photo-1666815503002-5f07a44ac8fb?w=600&q=80"],
//     ["Realme Narzo 60", "Used for 6 months, all accessories included.", 10999, "GOOD", "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80"],
//     ["Vivo V27", "Curved AMOLED display, 8/128GB.", 19999, "GOOD", "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&q=80"],
//     ["Nothing Phone 2", "Glyph interface, 12/256GB, box included.", 34999, "LIKE_NEW", "https://images.unsplash.com/photo-1610792516286-524726503fb2?w=600&q=80"],
//     ["iPhone SE 2022", "64GB, compact size, minor wear on edges.", 17999, "FAIR", "https://images.unsplash.com/photo-1611791484670-ce2ac8c4a8f1?w=600&q=80"],
//     ["Motorola Edge 40", "12/256GB, curved display, near mint.", 21999, "LIKE_NEW", "https://images.unsplash.com/photo-1592286927505-1def25115481?w=600&q=80"]
//   ],
//   "Laptops": [
//     ["Apple MacBook Air M1", "8/256GB, battery cycle count 120.", 58000, "LIKE_NEW", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"],
//     ["Dell XPS 13", "i5 11th gen, 16GB RAM, minor lid scuff.", 45000, "GOOD", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80"],
//     ["HP Pavilion Gaming Laptop", "GTX 1650, i5, good for casual gaming.", 39999, "GOOD", "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80"],
//     ["Lenovo ThinkPad E14", "Ryzen 5, 8GB, business laptop, sturdy build.", 32000, "FAIR", "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=600&q=80"],
//     ["Asus ROG Strix G15", "RTX 3060, 16GB, gaming beast, well maintained.", 68000, "GOOD", "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80"],
//     ["Apple MacBook Pro 13 M2", "512GB SSD, AppleCare till 2026.", 89999, "LIKE_NEW", "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80"],
//     ["Acer Aspire 5", "Ryzen 7, 16GB, light use, student laptop.", 34999, "GOOD", "https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=600&q=80"],
//     ["Microsoft Surface Laptop 4", "Touchscreen, i5, 8GB, clean condition.", 42000, "GOOD", "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80"],
//     ["MSI Modern 14", "i7 11th gen, 512GB SSD, lightweight.", 36500, "GOOD", "https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=600&q=80"],
//     ["Dell Inspiron 15", "i3, 8GB, everyday use laptop.", 21999, "FAIR", "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600&q=80"]
//   ],
//   "Gaming": [
//     ["Sony PS5 Console", "Disc edition, 2 controllers included.", 42000, "GOOD", "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80"],
//     ["Xbox Series S", "512GB, well maintained, box included.", 25000, "GOOD", "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&q=80"],
//     ["Nintendo Switch OLED", "With Zelda cartridge, minor joystick drift.", 24000, "FAIR", "https://images.unsplash.com/photo-1662027522373-31f26ea3d4e0?w=600&q=80"],
//     ["Logitech G29 Racing Wheel", "Force feedback, pedals included.", 15000, "GOOD", "https://images.unsplash.com/photo-1592840331665-cc03cc27f5da?w=600&q=80"],
//     ["Razer DeathAdder Mouse", "Gaming mouse, RGB, works perfectly.", 2200, "LIKE_NEW", "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80"],
//     ["HyperX Cloud II Headset", "7.1 surround, minor cable fray.", 3000, "FAIR", "https://images.unsplash.com/photo-1599669454699-248893623440?w=600&q=80"],
//     ["PS4 Slim 500GB", "2 controllers, 3 games included.", 18000, "GOOD", "https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=600&q=80"],
//     ["Gaming Chair RGB", "Reclining, lumbar support, sturdy.", 6500, "GOOD", "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&q=80"],
//     ["Mechanical Gaming Keyboard", "Blue switches, RGB backlight.", 3200, "LIKE_NEW", "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80"],
//     ["VR Headset Meta Quest 2", "128GB, 2 controllers, box included.", 22000, "GOOD", "https://images.unsplash.com/photo-1622979135240-11d70a99a2ec?w=600&q=80"]
//   ],
//   "Fashion": [
//     ["Levi's 511 Slim Fit Jeans", "Size 32, worn twice, like new.", 1200, "LIKE_NEW", "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80"],
//     ["Nike Air Max 270", "Size UK 9, minor sole wear.", 3500, "GOOD", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"],
//     ["Zara Formal Blazer", "Size M, dry cleaned, one-time wear.", 1800, "LIKE_NEW", "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80"],
//     ["Ray-Ban Aviator Sunglasses", "Original case included, no scratches.", 2500, "GOOD", "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80"],
//     ["Fossil Leather Wallet", "Genuine leather, gifted but unused.", 900, "LIKE_NEW", "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80"],
//     ["Adidas Track Jacket", "Size L, faded slightly with wash.", 1100, "FAIR", "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80"],
//     ["H&M Cotton Kurta Set", "Size 40, worn once for a function.", 700, "LIKE_NEW", "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80"],
//     ["Puma Running Shoes", "Size UK 8, used for a few runs.", 1600, "GOOD", "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80"],
//     ["Titan Analog Watch", "Steel strap, working perfectly, minor scratches.", 2200, "GOOD", "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80"],
//     ["Woodland Leather Boots", "Size 9, waterproof, lightly used.", 2400, "GOOD", "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80"]
//   ],
//   "Furniture": [
//     ["3-Seater Fabric Sofa", "Grey color, minor wear on armrest.", 12000, "GOOD", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"],
//     ["Wooden Study Table", "Sheesham wood, sturdy, 2 years old.", 4500, "FAIR", "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80"],
//     ["Queen Size Bed with Storage", "Engineered wood, hydraulic storage.", 15000, "GOOD", "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80"],
//     ["Office Chair Ergonomic", "Adjustable height, mesh back, comfortable.", 3500, "GOOD", "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&q=80"],
//     ["Bookshelf 5-Tier", "Metal frame, wooden shelves, stable.", 2200, "GOOD", "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&q=80"],
//     ["Dining Table Set 4-Seater", "Glass top, minor scratch on surface.", 8500, "FAIR", "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=600&q=80"],
//     ["Wardrobe 3-Door", "Plywood, mirror attached, good condition.", 9500, "GOOD", "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&q=80"],
//     ["TV Unit Modern Design", "Engineered wood, cable management built-in.", 3200, "LIKE_NEW", "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80"],
//     ["Recliner Chair Single", "Manual recline, leatherette, very comfy.", 6500, "GOOD", "https://images.unsplash.com/photo-1550254478-ead40cc54513?w=600&q=80"],
//     ["Shoe Rack 4-Layer", "Compact, foldable, unused still in box.", 1200, "LIKE_NEW", "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=600&q=80"]
//   ],
//   "Home & Kitchen": [
//     ["Prestige Induction Cooktop", "1200W, barely used, works fine.", 1800, "LIKE_NEW", "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=600&q=80"],
//     ["Philips Air Fryer", "4.1L, used for 2 months, no dents.", 4500, "GOOD", "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&q=80"],
//     ["Wonderchef Mixer Grinder", "3 jars included, working condition.", 1500, "GOOD", "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80"],
//     ["Milton Thermosteel Flask Set", "Set of 3, unused, gifted extra.", 900, "LIKE_NEW", "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80"],
//     ["IFB Microwave Oven 20L", "Convection, minor exterior scratch.", 6500, "FAIR", "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=600&q=80"],
//     ["Non-stick Cookware Set", "5 pieces, used but well maintained.", 1200, "GOOD", "https://images.unsplash.com/photo-1584990347449-a5d9f800a783?w=600&q=80"],
//     ["Bedsheet King Size Cotton", "Brand new, unused, still packed.", 600, "LIKE_NEW", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80"],
//     ["LED Table Lamp", "Adjustable brightness, wooden base.", 750, "GOOD", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80"],
//     ["Cello Water Bottle Set", "Set of 4, 1L each, unused.", 500, "LIKE_NEW", "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80"],
//     ["Kent RO Water Purifier", "8L tank, serviced recently, works great.", 5500, "GOOD", "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80"]
//   ],
//   "Books": [
//     ["Atomic Habits by James Clear", "Paperback, like new, no markings.", 300, "LIKE_NEW", "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80"],
//     ["Harry Potter Complete Set", "All 7 books, some cover wear.", 1800, "GOOD", "https://images.unsplash.com/photo-1509266272358-7701da638078?w=600&q=80"],
//     ["NCERT Class 12 Science Set", "All subjects, minor highlighting.", 500, "FAIR", "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80"],
//     ["Rich Dad Poor Dad", "Paperback, single read, clean pages.", 200, "LIKE_NEW", "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80"],
//     ["The Alchemist by Paulo Coelho", "Well kept, no torn pages.", 180, "GOOD", "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&q=80"],
//     ["GATE CS Preparation Books", "Set of 5, used for one attempt.", 1200, "FAIR", "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600&q=80"],
//     ["Sapiens by Yuval Noah Harari", "Hardcover, excellent condition.", 450, "LIKE_NEW", "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80"],
//     ["Wren and Martin Grammar Book", "School reference, some pencil marks.", 150, "FAIR", "https://images.unsplash.com/photo-1528208079124-a2fb7b8b7bd7?w=600&q=80"],
//     ["Chanakya Niti Book", "Hindi edition, gently used.", 120, "GOOD", "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80"],
//     ["Competitive Exam GK Digest", "Latest edition, unused, still sealed.", 350, "LIKE_NEW", "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&q=80"]
//   ],
//   "Sports": [
//     ["Yonex Badminton Racket", "Carbon fiber, strung recently.", 1800, "GOOD", "https://images.unsplash.com/photo-1613918431703-aa50889fddf3?w=600&q=80"],
//     ["SG Cricket Kit Bag", "Bat, pads, gloves included.", 3500, "GOOD", "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80"],
//     ["Nivia Football Size 5", "Used a few times, good bounce.", 600, "GOOD", "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=600&q=80"],
//     ["Adjustable Dumbbell Set", "10kg pair, rubber coated, no rust.", 2500, "GOOD", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"],
//     ["Yoga Mat with Bag", "6mm thick, non-slip, barely used.", 500, "LIKE_NEW", "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&q=80"],
//     ["Table Tennis Kit", "2 rackets, net, and balls included.", 800, "GOOD", "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=600&q=80"],
//     ["Cosco Basketball", "Size 7, good grip, indoor/outdoor use.", 700, "GOOD", "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600&q=80"],
//     ["Resistance Bands Set", "5 bands, different resistance levels.", 450, "LIKE_NEW", "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&q=80"],
//     ["Skipping Rope Premium", "Ball bearing rope, adjustable length.", 250, "LIKE_NEW", "https://images.unsplash.com/photo-1517637382994-f02da38c6728?w=600&q=80"],
//     ["Cycling Helmet", "Size M, ventilated, minor scuff.", 900, "FAIR", "https://images.unsplash.com/photo-1557803175-cb63acbbdc2c?w=600&q=80"]
//   ],
//   "Beauty": [
//     ["Dyson Airwrap Styler", "Used a few times, all attachments included.", 25000, "LIKE_NEW", "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80"],
//     ["MAC Lipstick Set", "5 shades, gently used, hygienic.", 1500, "GOOD", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80"],
//     ["Philips Hair Straightener", "Ceramic plates, works perfectly.", 1200, "GOOD", "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80"],
//     ["Nykaa Skincare Combo", "Unused, sealed, gift set.", 800, "LIKE_NEW", "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80"],
//     ["Perfume Gift Set", "3 bottles, 60% remaining each.", 1800, "GOOD", "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80"],
//     ["Electric Trimmer for Men", "Cordless, new blades, works great.", 900, "GOOD", "https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&q=80"],
//     ["Makeup Vanity Box", "Wooden, mirror included, spacious.", 1400, "GOOD", "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80"],
//     ["Facial Steamer Machine", "Used twice, works like new.", 1100, "LIKE_NEW", "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80"],
//     ["Hair Dryer 2000W", "Foldable, dual speed setting.", 700, "GOOD", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80"],
//     ["Manicure Pedicure Kit", "Stainless steel, unused set.", 400, "LIKE_NEW", "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&q=80"]
//   ],
//   "Vehicles": [
//     ["Honda Activa 6G", "2021 model, 8000km driven, single owner.", 65000, "GOOD", "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80"],
//     ["Royal Enfield Classic 350", "2019 model, well maintained, new tyres.", 145000, "GOOD", "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&q=80"],
//     ["Maruti Suzuki Swift VXI", "2018, 45000km, single owner, insured.", 450000, "GOOD", "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80"],
//     ["Bajaj Pulsar 150", "2020 model, minor scratches, good engine.", 78000, "FAIR", "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&q=80"],
//     ["Hero Splendor Plus", "2022, 5000km, showroom condition.", 58000, "LIKE_NEW", "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=600&q=80"],
//     ["Hyundai i10 Grand", "2017, 60000km, AC and music system fine.", 380000, "GOOD", "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&q=80"],
//     ["TVS Jupiter Scooter", "2021 model, comfortable, low maintenance.", 55000, "GOOD", "https://images.unsplash.com/photo-1609866616858-4462a1a08f26?w=600&q=80"],
//     ["Mahindra Bolero", "2016, sturdy SUV, all papers clear.", 550000, "FAIR", "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80"],
//     ["Yamaha FZ-S", "2020, good mileage, recently serviced.", 82000, "GOOD", "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=600&q=80"],
//     ["Bicycle Hero Sprint", "Gear cycle, lightly used, well maintained.", 4500, "GOOD", "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80"]
//   ],
//   "Collectibles": [
//     ["Vintage Coin Collection", "20 coins from different eras.", 3500, "GOOD", "https://images.unsplash.com/photo-1610375461369-d613b564f4c5?w=600&q=80"],
//     ["Marvel Action Figures Set", "5 figures, minor paint wear.", 2500, "GOOD", "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=600&q=80"],
//     ["Antique Pocket Watch", "Working condition, brass finish.", 4500, "FAIR", "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&q=80"],
//     ["Vintage Vinyl Records", "Set of 10, classic rock albums.", 3000, "GOOD", "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&q=80"],
//     ["Rare Postage Stamps Album", "50+ stamps from different countries.", 1800, "GOOD", "https://images.unsplash.com/photo-1579532536935-619928decd08?w=600&q=80"],
//     ["Old Indian Currency Notes", "Pre-independence era notes, collector's item.", 5500, "FAIR", "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=600&q=80"],
//     ["Miniature Model Cars Set", "10 diecast cars, 1:64 scale.", 1200, "LIKE_NEW", "https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=600&q=80"],
//     ["Vintage Camera Collection", "Non-working but great for display.", 2800, "FAIR", "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=600&q=80"],
//     ["Comic Book Collection", "20 issues, bagged and boarded.", 2200, "GOOD", "https://images.unsplash.com/photo-1608889175638-9322300c46e8?w=600&q=80"],
//     ["Handcrafted Wooden Chess Set", "Antique style, all pieces intact.", 1600, "GOOD", "https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=600&q=80"]
//   ],
//   "Pets": [
//     ["Dog Crate Large", "Foldable, used for 6 months.", 2500, "GOOD", "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80"],
//     ["Cat Tree Tower", "3-tier, scratching posts included.", 1800, "GOOD", "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&q=80"],
//     ["Aquarium Fish Tank 20L", "With filter and light, no leaks.", 1500, "GOOD", "https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?w=600&q=80"],
//     ["Dog Bed Extra Large", "Washable cover, well cushioned.", 900, "LIKE_NEW", "https://images.unsplash.com/photo-1550697851-920b181d8ca8?w=600&q=80"],
//     ["Bird Cage with Stand", "Spacious, includes feeder and perches.", 1200, "GOOD", "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=600&q=80"],
//     ["Pet Carrier Bag", "Airline approved, ventilated, like new.", 1100, "LIKE_NEW", "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&q=80"],
//     ["Automatic Pet Feeder", "Timer based, works perfectly.", 1600, "GOOD", "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=600&q=80"],
//     ["Dog Leash and Collar Set", "Genuine leather, unused.", 500, "LIKE_NEW", "https://images.unsplash.com/photo-1601758125946-6ac8ea9c0d1e?w=600&q=80"],
//     ["Cat Litter Box with Scoop", "Covered, easy to clean.", 700, "GOOD", "https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=600&q=80"],
//     ["Puppy Training Pads Pack", "Unopened pack of 50.", 400, "LIKE_NEW", "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&q=80"]
//   ],
//   "Accessories": [
//     ["Fossil Analog Watch", "Leather strap, minor scratches on glass.", 3200, "GOOD", "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80"],
//     ["Leather Laptop Bag", "Fits up to 15-inch laptop, sturdy.", 1800, "GOOD", "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&q=80"],
//     ["Ray-Ban Sunglasses", "Polarized lenses, case included.", 2800, "GOOD", "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80"],
//     ["Titan Leather Belt", "Genuine leather, gifted but unused.", 600, "LIKE_NEW", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80"],
//     ["Backpack Wildcraft 30L", "Water resistant, laptop compartment.", 1500, "GOOD", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80"],
//     ["Silver Necklace Set", "Oxidized silver, worn once.", 1200, "LIKE_NEW", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80"],
//     ["Wireless Charging Stand", "Fast charge, compact design.", 700, "LIKE_NEW", "https://images.unsplash.com/photo-1591290619762-c8f9ad9de79c?w=600&q=80"],
//     ["Travel Duffel Bag", "Large capacity, minor zipper wear.", 1400, "FAIR", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80"],
//     ["Cap and Cufflinks Combo", "Formal wear accessories, unused.", 500, "LIKE_NEW", "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&q=80"],
//     ["Fashion Handbag", "Faux leather, spacious, gently used.", 1600, "GOOD", "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80"]
//   ],
//   "Services": [
//     ["Home Cleaning Service (One-time)", "Full home deep clean, 2 workers, 4 hours.", 1500, "GOOD", "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80"],
//     ["Bike Repair & Servicing", "Doorstep service, all tools included.", 500, "GOOD", "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80"],
//     ["Home Tutoring — Maths & Science", "Class 9-10, experienced tutor, per month.", 2000, "GOOD", "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80"],
//     ["AC Repair and Gas Refill", "Split AC service, includes gas top-up.", 1800, "GOOD", "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80"],
//     ["Photography for Events", "4 hours coverage, edited photos delivered.", 5000, "GOOD", "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80"],
//     ["Plumbing Service Home Visit", "Leak fixing, pipe fitting, per visit.", 400, "GOOD", "https://images.unsplash.com/photo-1607472829760-9a3494b47c85?w=600&q=80"],
//     ["Personal Fitness Trainer", "Home visits, customized workout plan.", 3000, "GOOD", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"],
//     ["Interior Painting Service", "2BHK flat, materials extra.", 12000, "GOOD", "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&q=80"],
//     ["Car Detailing Service", "Full interior and exterior cleaning.", 2500, "GOOD", "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&q=80"],
//     ["Mehendi Artist for Events", "Bridal and party mehendi designs.", 3500, "GOOD", "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80"]
//   ],
//   "Other": [
//     ["Guitar Acoustic Yamaha", "F310 model, strings recently changed.", 4500, "GOOD", "https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&q=80"],
//     ["Study Table Lamp with USB", "Adjustable, minor scratch on base.", 600, "FAIR", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80"],
//     ["Second-hand Textbooks Bundle", "Engineering 2nd year, all subjects.", 1500, "FAIR", "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80"],
//     ["Portable Projector Mini", "1080p support, HDMI included.", 3500, "GOOD", "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80"],
//     ["Camping Tent 4-Person", "Waterproof, used twice, no tears.", 2800, "LIKE_NEW", "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80"],
//     ["Electric Guitar Amp", "20W, works perfectly, minor dust.", 2200, "GOOD", "https://images.unsplash.com/photo-1558098329-a11cff621064?w=600&q=80"],
//     ["Handmade Wall Art Set", "3 canvas pieces, brand new.", 1200, "LIKE_NEW", "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80"],
//     ["Sewing Machine Manual", "Usha brand, works well, portable.", 2500, "GOOD", "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80"],
//     ["Board Games Bundle", "Monopoly, Uno, Chess included.", 900, "GOOD", "https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=600&q=80"],
//     ["Wall Clock Wooden", "Silent movement, minor edge chip.", 500, "FAIR", "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600&q=80"]
//   ]
// };

// async function seedMoreProducts() {
//   await mongoose.connect(process.env.MONGO_URI);
//   console.log("Connected for seeding more products...");

//   // Existing seller dhoondo (delete NAHI karte, seed.js wale se add karte hain)
//   const seller = await User.findOne({ email: SELLER_EMAIL });
//   if (!seller) {
//     console.error(
//       `❌ Seller "${SELLER_EMAIL}" nahi mila. Pehle server/seed/seed.js run kar lein, phir isse run karein.`
//     );
//     await mongoose.disconnect();
//     process.exit(1);
//   }

//   const allDocs = [];
//   const skipped = [];

//   for (const [categoryName, items] of Object.entries(CATEGORY_DATA)) {
//     const categoryDoc = await Category.findOne({
//       name: { $regex: `^${categoryName}$`, $options: "i" },
//     });

//     if (!categoryDoc) {
//       skipped.push(categoryName);
//       continue;
//     }

//     for (const [title, description, price, condition, imageUrl] of items) {
//       allDocs.push({
//         seller: seller._id,
//         title,
//         description,
//         price,
//         category: categoryDoc._id,
//         condition,
//         location: "Jaipur, RJ",
//         images: [{ url: imageUrl }],
//       });
//     }
//   }

//   if (allDocs.length > 0) {
//     const result = await Product.insertMany(allDocs);
//     console.log(`✅ ${result.length} products inserted successfully.`);
//   }

//   if (skipped.length > 0) {
//     console.warn(
//       `⚠️  Ye categories nahi mili (pehle seed.js run kiya tha?): ${skipped.join(", ")}`
//     );
//   }

//   await mongoose.disconnect();
//   process.exit(0);
// }

// seedMoreProducts().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });