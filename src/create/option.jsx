import { Banknote, Gem, Heart, PartyPopper, User, UsersRound, Wallet } from "lucide-react";

// NOTE: `mtitle` / `people` are persisted to Firestore on each trip, so changing
// them would alter how already-saved trips display. Treat them as stable IDs.
// `icon` is a UI-only lucide component (never persisted).
export const SelectTravelList = [
    { id: 1, mtitle: "Just Me", desc: "A solo exploration", icon: User, people: "1 people" },
    { id: 2, mtitle: "Couple", desc: "A romantic getaway for two", icon: Heart, people: "2 people" },
    { id: 3, mtitle: "Family", desc: "An all-inclusive family vacation", icon: UsersRound, people: "4 to 6 people" },
    { id: 4, mtitle: "Friends", desc: "An adventurous trip with friends", icon: PartyPopper, people: "3+ people" },
];

export const BudgetCategories = [
    { id: 1, mtitle: "Low Budget", desc: "Keep costs low", icon: Wallet, budget: "Low" },
    { id: 2, mtitle: "Medium Budget", desc: "Balanced comfort and cost", icon: Banknote, budget: "Medium" },
    { id: 3, mtitle: "High Budget", desc: "Luxury and premium stays", icon: Gem, budget: "High" },
];

export const MIN_DAYS = 1;
export const MAX_DAYS = 6;
