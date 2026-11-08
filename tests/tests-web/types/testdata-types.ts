export interface FlightSearch {
  originAirport: string;
  destinationAirport: string;
  countryOrigin: string;
  countryDestination: string;
  departureDate: string;
  totalAdult: number;
  totalInfant?: number;
  totalChildren?: string[];
  cabinClass: "First" | "Economy" | "Premium Economy" | "Business" ;
  returnDate?:string
}