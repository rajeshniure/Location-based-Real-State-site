// // Assets
// import image1 from "../image1.jpg";
// import image2 from "../image2.jpg";
// import image3 from "../image3.jpg";
// import image4 from "../image4.jpg";
// import image5 from "../image5.jpg";
// import image6 from "../image6.jpg";
// import image7 from "../image7.jpg";
// import image8 from "../image8.jpg";
// import image9 from "../image9.jpg";
// import image10 from "../image10.jpg";
// import image11 from "../image11.jpg";
// import image12 from "../image12.jpg";
// import image13 from "../image13.jpg";
// import image14 from "../image14.jpg";
// import image15 from "../image15.jpg";
// import image16 from "../image16.jpg";

// const myListings = [
// 	{
// 		id: 1,
// 		title: "Apartment for rent in Camden",
// 		listing_type: "Apartment",
// 		description:
// 			"Table content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
// 		division: "Inner London",
// 		borough: "Camden",
// 		property_status: "Rent",
// 		price: 410000,
// 		rental_frequency: "Day",
// 		rooms: 4,
// 		furnished: false,
// 		pool: false,
// 		elevator: true,
// 		cctv: true,
// 		parking: true,
// 		location: {
// 			type: "Point",
// 			coordinates: [51.541078280085614, -0.15871891189601836],
// 		},
// 		picture1: image3,
// 	},
// 	{
// 		id: 2,
// 		title: "House for sale in Islington",
// 		listing_type: "House",
// 		description:
// 			"Table content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
// 		division: "Inner London",
// 		borough: "Islington",
// 		property_status: "Sale",
// 		price: 35000,
// 		rental_frequency: null,
// 		rooms: 4,
// 		furnished: true,
// 		pool: true,
// 		elevator: false,
// 		cctv: true,
// 		parking: true,
// 		location: {
// 			type: "Point",
// 			coordinates: [51.53796304347224, -0.10189113898462315],
// 		},
// 		picture1: image1,
// 	},
// 	{
// 		id: 3,
// 		title: "House for sale in Ealing",
// 		listing_type: "House",
// 		description:
// 			"Table content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
// 		division: "Outer London",
// 		borough: "Ealing",
// 		property_status: "Sale",
// 		price: 35000000,
// 		rental_frequency: null,
// 		rooms: 4,
// 		furnished: true,
// 		pool: false,
// 		elevator: false,
// 		cctv: true,
// 		parking: false,
// 		location: {
// 			type: "Point",
// 			coordinates: [51.5117212390057, -0.30023786193990754],
// 		},
// 		picture1: image5,
// 	},
// 	{
// 		id: 4,
// 		title: "Office for sale in Lambeth",
// 		listing_type: "Office",
// 		description:
// 			"Table content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
// 		division: "Inner London",
// 		borough: "Lambeth",
// 		property_status: "Sale",
// 		price: 2000000,
// 		rental_frequency: null,
// 		rooms: 4,
// 		furnished: true,
// 		pool: false,
// 		elevator: true,
// 		cctv: true,
// 		parking: false,
// 		location: {
// 			type: "Point",
// 			coordinates: [51.49463731028351, -0.11398489688921488],
// 		},
// 		picture1: image4,
// 	},

// 	{
// 		id: 5,
// 		title: "House for sale in Enfield",
// 		listing_type: "House",
// 		description:
// 			"Table content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
// 		division: "Outer London",
// 		borough: "Enfield",
// 		property_status: "Sale",
// 		price: 5000000,
// 		rental_frequency: null,
// 		rooms: 4,
// 		furnished: true,
// 		pool: true,
// 		elevator: false,
// 		cctv: false,
// 		parking: true,
// 		location: {
// 			type: "Point",
// 			coordinates: [51.6538576327809, -0.07420868326088129],
// 		},
// 		picture1: image7,
// 	},

// 	{
// 		id: 6,
// 		title: "Apartment for rent in Barnet",
// 		listing_type: "Apartment",
// 		description:
// 			"Table content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
// 		division: "Outer London",
// 		borough: "Barnet",
// 		property_status: "Rent",
// 		price: 150,
// 		rental_frequency: "Day",
// 		rooms: 4,
// 		furnished: false,
// 		pool: true,
// 		elevator: true,
// 		cctv: true,
// 		parking: false,
// 		location: {
// 			type: "Point",
// 			coordinates: [51.650243284477725, -0.19749483373918514],
// 		},
// 		picture1: image12,
// 	},

// 	{
// 		id: 7,
// 		title: "Apartment for rent in Bexley",
// 		listing_type: "Apartment",
// 		description:
// 			"Table content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
// 		division: "Outer London",
// 		borough: "Bexley",
// 		property_status: "Rent",
// 		price: 3600,
// 		rental_frequency: "Month",
// 		rooms: 4,
// 		furnished: true,
// 		pool: true,
// 		elevator: true,
// 		cctv: true,
// 		parking: false,
// 		location: {
// 			type: "Point",
// 			coordinates: [51.443269130828206, 0.15064128781893238],
// 		},
// 		picture1: image15,
// 	},

// 	{
// 		id: 8,
// 		title: "Office for rent in Croydon",
// 		listing_type: "Office",
// 		description:
// 			"Table content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
// 		division: "Outer London",
// 		borough: "Croydon",
// 		property_status: "Rent",
// 		price: 750,
// 		rental_frequency: "Week",
// 		rooms: 4,
// 		furnished: true,
// 		pool: false,
// 		elevator: true,
// 		cctv: false,
// 		parking: true,
// 		location: {
// 			type: "Point",
// 			coordinates: [51.381870798317266, -0.10379988107433152],
// 		},
// 		picture1: image2,
// 	},

// 	{
// 		id: 9,
// 		title: "House for sale in Hounslow",
// 		listing_type: "House",
// 		description:
// 			"Table content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
// 		division: "Outer London",
// 		borough: "Hounslow",
// 		property_status: "Sale",
// 		price: 650000,
// 		rental_frequency: null,
// 		rooms: 4,
// 		furnished: true,
// 		pool: true,
// 		elevator: false,
// 		cctv: true,
// 		parking: true,
// 		location: {
// 			type: "Point",
// 			coordinates: [51.462524898313, -0.37050279898417415],
// 		},
// 		picture1: image8,
// 	},

// 	{
// 		id: 10,
// 		title: "Apartment for sale in Hackney",
// 		listing_type: "Apartment",
// 		description:
// 			"Table content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
// 		division: "Inner London",
// 		borough: "Hackney",
// 		property_status: "Sale",
// 		price: 150000,
// 		rental_frequency: null,
// 		rooms: 4,
// 		furnished: true,
// 		pool: true,
// 		elevator: false,
// 		cctv: false,
// 		parking: true,
// 		location: {
// 			type: "Point",
// 			coordinates: [51.552498305814616, -0.047976472350245256],
// 		},
// 		picture1: image16,
// 	},

// 	{
// 		id: 11,
// 		title: "House for rent in Bromley",
// 		listing_type: "House",
// 		description:
// 			"Table content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
// 		division: "Outer London",
// 		borough: "Bromley",
// 		property_status: "Rent",
// 		price: 500,
// 		rental_frequency: "Day",
// 		rooms: 4,
// 		furnished: true,
// 		pool: false,
// 		elevator: false,
// 		cctv: true,
// 		parking: true,
// 		location: {
// 			type: "Point",
// 			coordinates: [51.41817844947587, 0.010381344327546399],
// 		},
// 		picture1: image10,
// 	},

// 	{
// 		id: 12,
// 		title: "Office for sale in Merton",
// 		listing_type: "Office",
// 		description:
// 			"Table content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
// 		division: "Outer London",
// 		borough: "Merton",
// 		property_status: "Sale",
// 		price: 25000000,
// 		rental_frequency: null,
// 		rooms: 4,
// 		furnished: true,
// 		pool: true,
// 		elevator: false,
// 		cctv: false,
// 		parking: true,
// 		location: {
// 			type: "Point",
// 			coordinates: [51.417642743624164, -0.18389246063474793],
// 		},
// 		picture1: image14,
// 	},

// 	{
// 		id: 13,
// 		title: "House for sale in Havering",
// 		listing_type: "House",
// 		description:
// 			"Table content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
// 		division: "Outer London",
// 		borough: "Havering",
// 		property_status: "Sale",
// 		price: 1000000,
// 		rental_frequency: null,
// 		rooms: 4,
// 		furnished: false,
// 		pool: true,
// 		elevator: false,
// 		cctv: true,
// 		parking: true,
// 		location: {
// 			type: "Point",
// 			coordinates: [51.5523192864514, 0.25604463764059254],
// 		},
// 		picture1: image9,
// 	},

// 	{
// 		id: 14,
// 		title: "Apartment for rent in Wandsworth",
// 		listing_type: "Apartment",
// 		description:
// 			"Table content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
// 		division: "Inner London",
// 		borough: "Wandsworth",
// 		property_status: "Rent",
// 		price: 2500,
// 		rental_frequency: "Week",
// 		rooms: 4,
// 		furnished: true,
// 		pool: true,
// 		elevator: false,
// 		cctv: true,
// 		parking: false,
// 		location: {
// 			type: "Point",
// 			coordinates: [51.458244987751215, -0.18861599281323665],
// 		},
// 		picture1: image1,
// 	},

// 	{
// 		id: 15,
// 		title: "Office for rent in Redbridge",
// 		listing_type: "Office",
// 		description:
// 			"Table content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
// 		division: "Outer London",
// 		borough: "Redbridge",
// 		property_status: "Rent",
// 		price: 5000,
// 		rental_frequency: "Month",
// 		rooms: 4,
// 		furnished: true,
// 		pool: true,
// 		elevator: true,
// 		cctv: false,
// 		parking: true,
// 		location: {
// 			type: "Point",
// 			coordinates: [51.58701995760913, 0.05893467157444739],
// 		},
// 		picture1: image6,
// 	},
// ];

// export default myListings;





// Assets
import image1 from "../image1.jpg";
import image2 from "../image2.jpg";
import image3 from "../image3.jpg";
import image4 from "../image4.jpg";
import image5 from "../image5.jpg";
import image6 from "../image6.jpg";
import image7 from "../image7.jpg";
import image8 from "../image8.jpg";
import image9 from "../image9.jpg";
import image10 from "../image10.jpg";
import image11 from "../image11.jpg"; 
import image12 from "../image12.jpg";
import image13 from "../image13.jpg"; 
import image14 from "../image14.jpg";
import image15 from "../image15.jpg";
import image16 from "../image16.jpg";

interface Location {
	type: "Point";
	coordinates: [number, number]; // [latitude, longitude]
}

interface PropertyListing {
	id: number;
	title: string;
	listing_type: "Apartment" | "House" | "Office";
	description: string;
	division: "Kathmandu Metropolitan City (KMC)" | "Kathmandu Valley Suburbs";
	borough: string; // Specific neighborhood/municipality (e.g., Thamel, Sanepa)
	property_status: "Rent" | "Sale";
	price: number; // Price in Nepalese Rupees (NPR)
	rental_frequency: "Day" | "Week" | "Month" | null;
	rooms: number;
	furnished: boolean;
	pool: boolean;
	elevator: boolean;
	cctv: boolean;
	parking: boolean;
	location: Location;
	picture1: string;
}

const myListings: PropertyListing[] = [
	{
		id: 1,
		title: "Apartment for rent in Thamel",
		listing_type: "Apartment",
		description:
			"Prime location in the heart of Kathmandu for travelers or long-term stays. Close to all amenities and tourist attractions. Has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here'.",
		division: "Kathmandu Metropolitan City (KMC)",
		borough: "Thamel", // Central, Tourist Area
		property_status: "Rent",
		price: 35000, // NPR, Per Day rate (High-end short-term/tourist)
		rental_frequency: "Day",
		rooms: 4,
		furnished: false,
		pool: false,
		elevator: true,
		cctv: true,
		parking: true,
		location: {
			type: "Point",
			coordinates: [27.7161, 85.3138], // Thamel area
		},
		picture1: image3,
	},
	{
		id: 2,
		title: "House for sale in Baneshwor",
		listing_type: "House",
		description:
			"A prestigious property in one of Kathmandu's key commercial and residential hubs. Close to major business centers and schools. Has a more-or-less normal distribution of letters.",
		division: "Kathmandu Metropolitan City (KMC)",
		borough: "New Baneshwor", // High-value Commercial/Residential
		property_status: "Sale",
		price: 35000000, // NPR (3.5 Crore)
		rental_frequency: null,
		rooms: 4,
		furnished: true,
		pool: true,
		elevator: false,
		cctv: true,
		parking: true,
		location: {
			type: "Point",
			coordinates: [27.6976, 85.3340], // New Baneshwor
		},
		picture1: image1, 
	},
	{
		id: 3,
		title: "House for sale in Hattiban, Lalitpur",
		listing_type: "House",
		description:
			"Luxury house located in the quiet, upscale southern belt of Lalitpur. Excellent for large families seeking tranquility and space. Has a more-or-less normal distribution of letters.",
		division: "Kathmandu Valley Suburbs",
		borough: "Hattiban (Lalitpur)", // Upscale/Suburban Lalitpur
		property_status: "Sale",
		price: 95000000, // NPR (9.5 Crore - Very High-end)
		rental_frequency: null,
		rooms: 4,
		furnished: true,
		pool: false,
		elevator: false,
		cctv: true,
		parking: false,
		location: {
			type: "Point",
			coordinates: [27.6534, 85.3308], // Hattiban, Lalitpur
		},
		picture1: image5,
	},
	{
		id: 4,
		title: "Office for sale in Durbar Marg",
		listing_type: "Office",
		description:
			"Premium commercial space in the city's most prestigious and high-traffic business district. Ideal for corporate headquarters. Has a more-or-less normal distribution of letters.",
		division: "Kathmandu Metropolitan City (KMC)",
		borough: "Durbar Marg", // Prime Commercial/Central
		property_status: "Sale",
		price: 200000000, // NPR (20 Crore - Prime Commercial Price)
		rental_frequency: null,
		rooms: 4,
		furnished: true,
		pool: false,
		elevator: true,
		cctv: true,
		parking: false,
		location: {
			type: "Point",
			coordinates: [27.7088, 85.3175], // Durbar Marg
		},
		picture1: image4,
	},
	{
		id: 5,
		title: "House for sale in Budhanilkantha",
		listing_type: "House",
		description:
			"A serene house in the northern part of the valley, known for its green environment and large properties. Ideal for a peaceful residential life. Has a more-or-less normal distribution of letters.",
		division: "Kathmandu Valley Suburbs",
		borough: "Budhanilkantha", // North Suburb, Scenic/Residential
		property_status: "Sale",
		price: 50000000, // NPR (5 Crore)
		rental_frequency: null,
		rooms: 4,
		furnished: true,
		pool: true,
		elevator: false,
		cctv: false,
		parking: true,
		location: {
			type: "Point",
			coordinates: [27.7761, 85.3524], // Budhanilkantha
		},
		picture1: image7,
	},
	{
		id: 6,
		title: "Apartment for rent in Balaju",
		listing_type: "Apartment",
		description:
			"A small, budget-friendly flat, likely suitable for students or short-term workers. Located in a busy, well-connected area of Kathmandu. Has a more-or-less normal distribution of letters.",
		division: "Kathmandu Metropolitan City (KMC)",
		borough: "Balaju", // Busy, Well-connected area
		property_status: "Rent",
		price: 1500, // NPR, Per Day (Budget short-term)
		rental_frequency: "Day",
		rooms: 4,
		furnished: false,
		pool: true,
		elevator: true,
		cctv: true,
		parking: false,
		location: {
			type: "Point",
			coordinates: [27.7317, 85.3023], // Balaju
		},
		picture1: image12,
	},
	{
		id: 7,
		title: "Apartment for rent in Balkumari, Lalitpur",
		listing_type: "Apartment",
		description:
			"Modern apartment near the Ring Road with easy access to both Kathmandu and Bhaktapur. Good for families or professionals. Has a more-or-less normal distribution of letters.",
		division: "Kathmandu Valley Suburbs",
		borough: "Balkumari (Lalitpur)", // Ring Road area
		property_status: "Rent",
		price: 36000, // NPR, Per Month (Standard Apartment Rent)
		rental_frequency: "Month",
		rooms: 4,
		furnished: true,
		pool: true,
		elevator: true,
		cctv: true,
		parking: false,
		location: {
			type: "Point",
			coordinates: [27.6698, 85.3490], // Balkumari
		},
		picture1: image15,
	},
	{
		id: 8,
		title: "Office for rent in Putalisadak",
		listing_type: "Office",
		description:
			"Commercial office space in Putalisadak, a major education and commercial hub. Suitable for consultancies or training institutes. Has a more-or-less normal distribution of letters.",
		division: "Kathmandu Metropolitan City (KMC)",
		borough: "Putalisadak", // Commercial/Education Hub
		property_status: "Rent",
		price: 7500, // NPR, Per Week (Commercial weekly rental)
		rental_frequency: "Week",
		rooms: 4,
		furnished: true,
		pool: false,
		elevator: true,
		cctv: false,
		parking: true,
		location: {
			type: "Point",
			coordinates: [27.7027, 85.3259], // Putalisadak
		},
		picture1: image2,
	},
	{
		id: 9,
		title: "House for sale in Kirtipur",
		listing_type: "House",
		description:
			"House located in the historic and academic town of Kirtipur. Offers a blend of traditional Newari culture and modern amenities. Has a more-or-less normal distribution of letters.",
		division: "Kathmandu Valley Suburbs",
		borough: "Kirtipur", // Historic/Academic Town
		property_status: "Sale",
		price: 65000000, // NPR (6.5 Crore)
		rental_frequency: null,
		rooms: 4,
		furnished: true,
		pool: true,
		elevator: false,
		cctv: true,
		parking: true,
		location: {
			type: "Point",
			coordinates: [27.6830, 85.2750], // Kirtipur
		},
		picture1: image8,
	},
	{
		id: 10,
		title: "Apartment for sale in Lazimpat",
		listing_type: "Apartment",
		description:
			"An apartment in Lazimpat, an upscale area known for embassies and international organizations. Highly desirable, secure neighborhood. Has a more-or-less normal distribution of letters.",
		division: "Kathmandu Metropolitan City (KMC)",
		borough: "Lazimpat", // Diplomatic/Upscale
		property_status: "Sale",
		price: 15000000, // NPR (1.5 Crore)
		rental_frequency: null,
		rooms: 4,
		furnished: true,
		pool: true,
		elevator: false,
		cctv: false,
		parking: true,
		location: {
			type: "Point",
			coordinates: [27.7208, 85.3218], // Lazimpat
		},
		picture1: image16,
	},
	{
		id: 11,
		title: "House for rent in Bhaktapur (Suryabinayak)",
		listing_type: "House",
		description:
			"A rental property in the quieter, eastern part of the valley (Bhaktapur), offering a break from the KMC city rush. Has a more-or-less normal distribution of letters.",
		division: "Kathmandu Valley Suburbs",
		borough: "Suryabinayak (Bhaktapur)", // Eastern Valley, Residential
		property_status: "Rent",
		price: 5000, // NPR, Per Day (Mid-range short-term)
		rental_frequency: "Day",
		rooms: 4,
		furnished: true,
		pool: false,
		elevator: false,
		cctv: true,
		parking: true,
		location: {
			type: "Point",
			coordinates: [27.6749, 85.4267], // Suryabinayak
		},
		picture1: image10,
	},
	{
		id: 12,
		title: "Office for sale in Tripureshwor",
		listing_type: "Office",
		description:
			"Large office building in the old commercial district of Tripureshwor, close to government offices and major financial institutions. Has a more-or-less normal distribution of letters.",
		division: "Kathmandu Metropolitan City (KMC)",
		borough: "Tripureshwor", // Old Commercial/Government area
		property_status: "Sale",
		price: 250000000, // NPR (25 Crore - High Commercial)
		rental_frequency: null,
		rooms: 4,
		furnished: true,
		pool: true,
		elevator: false,
		cctv: false,
		parking: true,
		location: {
			type: "Point",
			coordinates: [27.6976, 85.3130], // Tripureshwor
		},
		picture1: image14,
	},
	{
		id: 13,
		title: "House for sale in Chabahil",
		listing_type: "House",
		description:
			"Family home in a busy, central transit and commercial zone near Pashupatinath Temple. A mix of commercial access and residential utility. Has a more-or-less normal distribution of letters.",
		division: "Kathmandu Metropolitan City (KMC)",
		borough: "Chabahil", // Busy Transit/Residential
		property_status: "Sale",
		price: 10000000, // NPR (1 Crore)
		rental_frequency: null,
		rooms: 4,
		furnished: false,
		pool: true,
		elevator: false,
		cctv: true,
		parking: true,
		location: {
			type: "Point",
			coordinates: [27.7225, 85.3444], // Chabahil
		},
		picture1: image9,
	},
	{
		id: 14,
		title: "Apartment for rent in Sanepa, Lalitpur",
		listing_type: "Apartment",
		description:
			"High-end furnished apartment in Sanepa, one of the most sought-after residential areas in Lalitpur, favored by expatriates. Has a more-or-less normal distribution of letters.",
		division: "Kathmandu Valley Suburbs",
		borough: "Sanepa (Lalitpur)", // High-end Residential/Expat area
		property_status: "Rent",
		price: 25000, // NPR, Per Week (Luxury weekly rate)
		rental_frequency: "Week",
		rooms: 4,
		furnished: true,
		pool: true,
		elevator: false,
		cctv: true,
		parking: false,
		location: {
			type: "Point",
			coordinates: [27.6806, 85.3129], // Sanepa
		},
		picture1: image13, // **UPDATED to image13**
	},
	{
		id: 15,
		title: "Office for rent in Koteshwor",
		listing_type: "Office",
		description:
			"Commercial office space at Koteshwor, a major intersection and gateway into the city. High visibility for business. Has a more-or-less normal distribution of letters.",
		division: "Kathmandu Metropolitan City (KMC)",
		borough: "Koteshwor", // Major Transit/Commercial area
		property_status: "Rent",
		price: 50000, // NPR, Per Month (Standard Office Rent)
		rental_frequency: "Month",
		rooms: 4,
		furnished: true,
		pool: true,
		elevator: true,
		cctv: false,
		parking: true,
		location: {
			type: "Point",
			coordinates: [27.6835, 85.3516], // Koteshwor
		},
		picture1: image6,
	},
	{
		id: 16,
		title: "House for sale in Tinkune",
		listing_type: "House",
		description:
			"A well-located property at the major Tinkune intersection, offering excellent access to the airport and Ring Road. Suitable for both residential and commercial use. Has a more-or-less normal distribution of letters.",
		division: "Kathmandu Metropolitan City (KMC)",
		borough: "Tinkune", // Major Intersection/Commercial
		property_status: "Sale",
		price: 52000000, // NPR (5.2 Crore - Based on search data)
		rental_frequency: null,
		rooms: 4,
		furnished: false,
		pool: false,
		elevator: true,
		cctv: true,
		parking: true,
		location: {
			type: "Point",
			coordinates: [27.6881, 85.3475], // Tinkune area
		},
		picture1: image11, // Used the last remaining unused image placeholder
	},
];

export default myListings;