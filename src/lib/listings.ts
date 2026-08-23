export type Review = {
  name: string;
  date: string;
  text: string;
};

export type Listing = {
  id: string;
  name: string;
  image: string;
  images: string[];
  rating: string;
  reviewCount?: number;
  guests: number;
  beds: number;
  baths: number;
  tag?: string;
  city?: string;
  description: string[];
  amenities: string[];
  totalAmenities?: number;
  checkIn: string;
  checkOut: string;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  cancellationPolicy: string[];
  reviews: Review[];
};

export const listings: Listing[] = [
  {
    id: "273132",
    name: "All American Cottage",
    city: "Wichita Falls",
    image: "/images/cottage1-b.jpg",
    images: [
      "/images/cottage1-b.jpg",
      "/images/cottage1-a.jpg",
      "/images/cottage1-c.jpg",
      "/images/cottage1-d.jpg",
      "/images/cottage1-e.jpg",
    ],
    rating: "4.85",
    reviewCount: 13,
    guests: 8,
    beds: 3,
    baths: 2,
    description: [
      "Keep it simple at this peaceful and cozy centrally-located home. This home works well for the business traveler, work crews or here visiting friends and family.",
      "The home has been renovated and ready to entertain you and your guests.",
    ],
    amenities: ["Free WiFi", "Kitchen", "Air conditioning", "Washing Machine", "Pets allowed", "Suitable for children"],
    totalAmenities: 48,
    checkIn: "4:00 PM",
    checkOut: "11:00 AM",
    petsAllowed: true,
    smokingAllowed: false,
    cancellationPolicy: [
      "100% refund up to 30 days before arrival",
      "50% refund up to 14 days before arrival",
    ],
    reviews: [
      { name: "Lenna Richardson", date: "March 2026", text: "We love the location of this little house!! So easy to get to food and coffee!!" },
      { name: "Dustin Frazier", date: "December 2025", text: "Overall a great little place to stay. House was very clean, nice yard for pets, and plenty spacious to host our family Christmas." },
      { name: "Andrea Hyde", date: "November 2025", text: "Such a cute place! Perfect location to everything." },
      { name: "Dana and Scott Shipley", date: "November 2025", text: "Everything was great and there was plenty of space." },
      { name: "Kevin Conklin", date: "October 2025", text: "Very good stay and good location to the surrounding area." },
    ],
  },
  {
    id: "264828",
    name: "All American Cottage",
    image: "/images/cottage2-a.jpg",
    images: [
      "/images/cottage2-a.jpg",
      "/images/cottage2-b.jpg",
      "/images/cottage2-c.jpg",
      "/images/cottage2-d.jpg",
      "/images/cottage2-e.jpg",
    ],
    rating: "4.90",
    reviewCount: 6,
    guests: 8,
    beds: 3,
    baths: 2,
    description: [
      "Keep it simple at this peaceful and cozy centrally-located home. This home works well for the business traveler, work crews or here visiting friends and family.",
    ],
    amenities: ["Free WiFi", "Kitchen", "Air conditioning", "Washing Machine", "Suitable for children", "Internet"],
    checkIn: "4:00 PM",
    checkOut: "11:00 AM",
    petsAllowed: false,
    smokingAllowed: false,
    cancellationPolicy: [
      "100% refund up to 30 days before arrival",
      "50% refund up to 14 days before arrival",
    ],
    reviews: [
      { name: "Ray Green", date: "March 2026", text: "Great stay!! Had 3 grand kids with us and the park behind the house was awesome." },
      { name: "Thomas Attaway", date: "January 2026", text: "Location was excellent. Everything was just like we needed it." },
      { name: "Phillip Smith", date: "January 2026", text: "The house very nice. We enjoyed the quiet neighborhood." },
    ],
  },
  {
    id: "368868",
    name: "All American Paso Del Norte",
    city: "El Paso",
    image: "/images/pasodelnorte-a.jpg",
    images: [
      "/images/pasodelnorte-a.jpg",
      "/images/pasodelnorte-b.jpg",
      "/images/pasodelnorte-c.jpg",
      "/images/pasodelnorte-d.jpg",
      "/images/pasodelnorte-e.jpg",
    ],
    rating: "4.95",
    reviewCount: 1,
    guests: 8,
    beds: 4,
    baths: 2,
    description: [
      "Bring the whole family to this beautiful and spacious Spanish-style home. The home is fully equipped with hi-speed WiFi, 3 bedrooms, and a master bedroom with a jetted tub for you to enjoy and relax.",
      "This place is your home away from home — perfect for families visiting, business travelers, and first responders.",
    ],
    amenities: ["Kitchen", "Air conditioning", "Washing Machine", "Pets allowed", "Internet", "Wireless"],
    totalAmenities: 48,
    checkIn: "4:00 PM",
    checkOut: "10:00 AM",
    petsAllowed: true,
    smokingAllowed: false,
    cancellationPolicy: [
      "100% refund up to 30 days before arrival",
      "50% refund up to 14 days before arrival",
    ],
    reviews: [
      { name: "Tommy Seale", date: "April 2026", text: "Everything was great, thanks!" },
    ],
  },
  {
    id: "576036",
    name: "The Lucile",
    city: "Wichita Falls",
    image: "/images/lucile-a.jpg",
    images: [
      "/images/lucile-a.jpg",
      "/images/lucile-c.jpg",
      "/images/lucile-d.jpg",
      "/images/lucile-e.jpg",
    ],
    rating: "5.00",
    guests: 10,
    beds: 4,
    baths: 2,
    tag: "Extended-stay friendly",
    description: [
      "Welcome to Lucile House — a fully furnished 4-bedroom, 2-bath home designed with comfort, convenience, and long-term stays in mind.",
    ],
    amenities: ["Free WiFi", "Kitchen", "Air conditioning", "Washing Machine", "Street parking", "Suitable for children"],
    totalAmenities: 65,
    checkIn: "4:00 PM",
    checkOut: "10:00 AM",
    petsAllowed: false,
    smokingAllowed: false,
    cancellationPolicy: [
      "100% refund up to 30 days before arrival",
      "50% refund up to 14 days before arrival",
    ],
    reviews: [],
  },
];

export const averageRating = (
  listings.reduce((sum, l) => sum + parseFloat(l.rating), 0) / listings.length
).toFixed(1);

export function getListing(id: string): Listing | undefined {
  return listings.find((l) => l.id === id);
}
