import React, { useState } from "react";
import { InviteStrip } from "@/components/InviteStrip";
import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Play, Menu, X, Home, Tv, Wrench as FixIt,
  Users, Radio, HomeIcon, Navigation, BookOpen, Hammer,
  Code, Globe, Coins, Briefcase, Heart, Smile, Share2,
  ListChecks, Award, Target, ShieldCheck, UsersRound, AlertTriangle,
  Download, MessageSquare, Send, RotateCcw, Sparkles,
  Puzzle, Gift, Rss, Repeat, Library, Flame, CalendarClock, Newspaper,
} from "lucide-react";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();
const BASE = import.meta.env.BASE_URL;
const APP_URL = "https://app.chargingthefuture.com";
const GUIDE_URL = `${APP_URL}/guide`;
const TERMS_URL = `${APP_URL}/terms`;
const INVITES_URL = "https://chargingthefuture.github.io/chargingthefuture/feed";
const CLICKLOG_URL = `${APP_URL}/apps/click-log`;
// Filtered to mobile-v* releases so the newest APK sits at the top (the page also carries wallpaper releases).
const ANDROID_URL = "https://github.com/chargingthefuture/chargingthefuture/releases?q=mobile";
// Wallpapers download from the same GitHub Releases page as the APK, pre-filtered to wallpapers-v* releases.
const WALLPAPERS_URL = "https://github.com/chargingthefuture/chargingthefuture/releases?q=wallpapers";
const HERO_IMG = `${BASE}hero-image.png`;

// Plugin accent (color) and background (bg) values match the canonical
// App | Accent | Background table in the design repo's DESIGN_GUIDE.md
// (artifacts/mockup-sandbox/DESIGN_GUIDE.md), not the mockup Desktop.tsx
// MINI_APPS values (which are deprecated where they differ). The bg is the
// accent RGB channel × 0.11 per that table. Hub uses #7C3AED (resolved from a
// prior #38BDF8 collision with TrustTransport). Plugins not featured here
// (Unlock, SkillsTaxonomy, Account & Data) live only in the design table.
//
// SOURCE OF TRUTH NOTE (read before editing this array):
//   • Demo links (youtubeId / protonLink) and plugin descriptions (desc) live HERE,
//     in this file — NOT in the design repo (github.com/chargingthefuture/design).
//   • The design mocks are intentionally out of date on demo links (they change
//     frequently) and on copy. Do NOT sync demo links or descriptions from design.
//   • Plugin descriptions are owned by the maintainer and edited directly in code.
//     Do NOT modify any existing `desc` without explicit approval.
const FEATURES: {
  id: string; name: string; emoji: string; icon: React.ElementType;
  color: string; bg: string; desc: string;
  youtubeId?: string; protonLink?: string;
}[] = [
  { id: "hub",           name: "Commons",         emoji: "🏠", icon: Users,      color: "#7C3AED", bg: "#0E061A", desc: "Ask a question and get AI-powered answers from our community. Your base camp.", youtubeId: "Z9Gw3Jz0ids" },
  { id: "chyme",         name: "Chyme",            emoji: "🎙️", icon: Radio,      color: "#22C55E", bg: "#04160A", desc: "Live social audio rooms. Broadcast, listen, and connect in real time.", youtubeId: "oVESU60zbPg" },
  { id: "lighthouse",    name: "LightHouse",       emoji: "🏠", icon: HomeIcon,   color: "#3B82F6", bg: "#060E1B", desc: "Find housing, list a place you own, and connect with hosts or seekers. Owners list their own places with no approval step.", youtubeId: "KfyZsemVU8A" },
  { id: "trusttransport",name: "TrustTransport",   emoji: "📦", icon: Navigation, color: "#67E8F9", bg: "#0B1A1B", desc: "Request and offer rides, package delivery, and food orders between members. Each trip has a private chat that closes when it is done.", youtubeId: "myHI3xB-fMQ" },
  { id: "directory",     name: "Directory",        emoji: "📇", icon: BookOpen,   color: "#93C5FD", bg: "#10161C", desc: "Browse skills across the survivor community.", youtubeId: "W1cZm9F0D78" },
  { id: "foundation",    name: "Foundation",       emoji: "🪛", icon: Hammer,     color: "#F59E0B", bg: "#1B1101", desc: "Find talent, tools, repairs, and infrastructure support in real time.", youtubeId: "n4Tkw01PmX8" },
  { id: "peerprog",      name: "PeerProgramming",  emoji: "🏘️", icon: Code,       color: "#16A34A", bg: "#021208", desc: "Weekly global mastermind sessions.", youtubeId: "ReJ-HjM4dvo" },
  { id: "gdp",           name: "GDP",              emoji: "🗺️", icon: Globe,      color: "#06B6D4", bg: "#011417", desc: "The Community Value Index: value actually exchanged and settled in the community, counted since launch. A relative index, never money.", youtubeId: "cBdspGWldE4" },
  { id: "credits",       name: "ServiceCredits",   emoji: "⚙️", icon: Coins,      color: "#A855F7", bg: "#12091B", desc: "Alternative economy and credits exchange. Trade value inside the network — no outside systems needed.", youtubeId: "KytNHghNtQ8" },
  { id: "workforce",     name: "Workforce",        emoji: "💼", icon: Briefcase,  color: "#F97316", bg: "#1B0D02", desc: "A live simulation of individual and community potential: the jobs an economy of five million survivors needs, set against the skills members list, with the gaps in view.", protonLink: "https://drive.proton.me/urls/2C3V6KQZDC#IPmuHxdRmzOh" },
  { id: "mood",          name: "Mood",             emoji: "😁", icon: Smile,      color: "#BEF264", bg: "#151B0B", desc: "Anonymous mood tracking and pattern awareness. Know yourself. See patterns. Take back control.", youtubeId: "BtUp06iEXTc" },
  { id: "socketrelay",   name: "SocketRelay",      emoji: "🔂", icon: Share2,     color: "#FDBA74", bg: "#1C140D", desc: "Real-time resource sharing across the network.", youtubeId: "WTXpioRV2Bw" },
  { id: "whatworks",     name: "WhatWorks",        emoji: "✅", icon: ListChecks, color: "#84CC16", bg: "#0F1602", desc: "One shared, survivor-verified list of tools — organized by the exact problems survivors face. No ads, no affiliates.", youtubeId: "No968A18v6Q" },
  { id: "skillshunt",    name: "SkillsHunt",       emoji: "🎓", icon: Award,      color: "#FACC15", bg: "#1C1602", desc: "Nominate survivors to build the Directory and grow the economy.", youtubeId: "OfojmleoDEc" },
  { id: "skillup",       name: "SkillUp",          emoji: "🎯", icon: Target,     color: "#10B981", bg: "#02140E", desc: "Skills-training cohorts — learn a skill with a trainer and receive credits as you reach each milestone.", youtubeId: "sZZMyDVdEvA" },
  { id: "trust",         name: "Trust",            emoji: "🛡️", icon: ShieldCheck,color: "#0EA5E9", bg: "#02121A", desc: "What you have actually done in the app, written as plain lines other members can read. No score, no badge, and no identity check.", youtubeId: "OuPnVsQ4PnE" },
  { id: "clicklog",      name: "ClickLog",         emoji: "🚨", icon: AlertTriangle, color: "#EC4899", bg: "#1A0811", desc: "Incident logging — privately for your own pattern-spotting, or, if you choose, as shared trend data. Your notes are never shared." },
  { id: "skillstaxonomy",name: "Skills Taxonomy",  emoji: "🧩", icon: Puzzle,     color: "#8B5CF6", bg: "#0F0A1B", desc: "Browse the shared catalog of sectors, job titles, and skills." },
  { id: "contributions", name: "Contributions",    emoji: "🎁", icon: Gift,       color: "#FB7185", bg: "#1C0C0F", desc: "Voluntary fundraiser drives — gift-card, Quora-comment, and GitHub-star contributions with service-credit thank-you grants." },
  { id: "beacon",        name: "Beacon",           emoji: "📡", icon: Rss,        color: "#B91C1C", bg: "#140303", desc: "Live one-way broadcasts from Farah. Watch publicly with just a link; sign in to chat and react." },
  { id: "recurringactivity", name: "Recurring Activity", emoji: "🔁", icon: Repeat, color: "#14B8A6", bg: "#021412", desc: "Acknowledge an ongoing activity with another member — one tap, no amounts to report. Recognition of your everyday ties, never a bill." },
  { id: "knowledge",     name: "Knowledge Library", emoji: "📚", icon: Library,  color: "#D946EF", bg: "#17061A", desc: "Lend your own public Quora writing to the assistant, so it can answer from more than one person's experience. You can take it back." },
  { id: "fireside",      name: "Fireside",         emoji: "🔥", icon: Flame,      color: "#EF4444", bg: "#1A0505", desc: "The conversation under each post on the blog. Reading it needs no account; what you write becomes publicly visible once you are approved." },
  { id: "tiradio",       name: "TI Radio",         emoji: "📻", icon: CalendarClock, color: "#6366F1", bg: "#0A0A1C", desc: "A published schedule of live discussions members host in Chyme. Reading it needs no account; taking a slot needs an approved one." },
  { id: "reader",        name: "Reader",           emoji: "📰", icon: Newspaper,  color: "#94A3B8", bg: "#0E1114", desc: "A feed reader on a server this project pays for. Sign in with the account you already have; what you subscribe to is yours alone." },
];

const LOOK_MA_ITEMS: { q: string; solutions: string[] }[] = [
  { q: "Do idiots constantly try to get close to you physically, while aiming their cell phones at you and/or staring at their cell phones while invading your personal space?", solutions: ["SocketRelay", "Chyme"] },
  { q: "Do your co-workers that you have always been friendly with, suddenly start acting strange towards you and distancing themselves from you? Or they begin to lie about your work performance, try to get you to quit or begin bumping shoulders with you?", solutions: ["Workforce", "SkillUp"] },
  { q: "Do idiots sit parked in their cars outside your home all the time?", solutions: ["LightHouse", "Chyme"] },
  { q: "Do morons constantly get in your way and block you from where you are going out in public? / cut you in line? / hold up the line?", solutions: ["SocketRelay", "TrustTransport"] },
  { q: "Did all your neighbors suddenly move, have their houses quickly sold and construction work done on them, then quickly have 'new neighbors' (who don't seem to live there) move in?", solutions: ["LightHouse", "Chyme"] },
  { q: "Have any new street lamps/antennas been installed around your home/work recently?", solutions: ["LightHouse", "WhatWorks"] },
  { q: "Do drones hover around you/your home/work all the time?", solutions: ["WhatWorks", "LightHouse"] },
  { q: "Do you experience tinnitus/ringing in ears?", solutions: ["Directory", "WhatWorks"] },
  { q: "Do police officers follow/harass you for no good reason?", solutions: ["TrustTransport", "Chyme"] },
  { q: "Do your neighbors always seem to come outside when you are there, then go inside when you do?", solutions: ["LightHouse", "Chyme"] },
  { q: "Do different people seem to be coming and going from neighbors houses around you all the time?", solutions: ["LightHouse", "Chyme"] },
  { q: "Do several of your neighbors have strange colored lights coming out their windows at night?", solutions: ["LightHouse", "WhatWorks"] },
  { q: "Do people you don't know stare at you strangely/treat you bad for no reason?", solutions: ["Chyme", "PeerProgramming"] },
  { q: "Are new people pushing hard for you to be their new friend/roommate/romantic partner?", solutions: ["Trust", "LightHouse"] },
  { q: "Do people seem to know things about you that you have never told them before?", solutions: ["Trust", "WhatWorks"] },
  { q: "Do people you don't know constantly try to talk to you/befriend you while you are out in public?", solutions: ["Trust", "Chyme"] },
  { q: "Do strange things happen around you a lot? People fighting/arguing in the streets/causing scenes that are scripted/staged? With occasional onlookers smirking or re-enacting the scripted scenes?", solutions: ["Chyme", "PeerProgramming"] },
  { q: "Do you get denied jobs/housing for no good reason?", solutions: ["Workforce", "LightHouse"] },
  { q: "Do you live close to a freemason lodge? Or know someone who is a freemason?", solutions: ["Chyme"] },
  { q: "Does trying to do simple things like fill out an online job application become an ordeal due to endless clicking that brings you nowhere? Or website conveniently won't load when you try to submit applications or important documents?", solutions: ["Workforce", "ServiceCredits"] },
  { q: "Do doctors deny you proper care? / ghost you? / tell you you are fine when you know something is wrong? / not get back to you with test results, then claim to have never received them, or have 'no record' of them?", solutions: ["Directory", "WhatWorks"] },
  { q: "Do you hear strange humming/buzzing noises/sound of a machine running around you a lot, but can't pinpoint exactly where it's coming from?", solutions: ["WhatWorks", "LightHouse"] },
  { q: "Does your mail get lost/tampered with a lot?", solutions: ["SocketRelay", "ServiceCredits"] },
  { q: "Do you get tired more than you should?", solutions: ["Directory", "WhatWorks"] },
  { q: "Do people try to bait you into doing drugs? Buying a gun? Buying self-defense gear? Drinking? Committing illegal acts?", solutions: ["Trust", "PeerProgramming"] },
  { q: "If you are a woman, do perverted guys you don't know or just met straight up ask you for sex?", solutions: ["TrustTransport", "Trust"] },
  { q: "If you are sitting in your car minding your own business do idiots come and park right by/next to you and sit there too? Usually buried in their phone? Even if you are parked in an isolated area?", solutions: ["TrustTransport", "Chyme"] },
  { q: "Do idiots constantly shine their bright headlights/flashlights/DEWs on you?", solutions: ["WhatWorks", "LightHouse"] },
  { q: "Do you often pull up to an empty store, and then it suddenly becomes busy after you go in? Even at non busy business hours?", solutions: ["SocketRelay", "TrustTransport"] },
  { q: "Do weirdos try to get you to say bad things about other people? Or force a conversation about sex, politics or celebrities as if they are recording you?", solutions: ["Trust", "Chyme"] },
  { q: "Have you been falsely accused of shoplifting, then still treated like a criminal after you have proven you did not steal anything?", solutions: ["SocketRelay", "WhatWorks"] },
  { q: "Do you notice strange flashes of light wherever you go? Or at home/work?", solutions: ["WhatWorks", "LightHouse"] },
  { q: "Does everyone around you seem to be keeping some sort of a secret?", solutions: ["Chyme", "PeerProgramming"] },
  { q: "Do weirdos offer you rides/solicit you for prostitution when you are just trying to walk down the street? Even during the day?", solutions: ["TrustTransport", "Trust"] },
  { q: "Do you get strange phone calls/texts from numbers you don't know a lot?", solutions: ["WhatWorks"] },
  { q: "Do your pets seem to sense that something is off/someone you don't know is near?", solutions: ["LightHouse", "Chyme"] },
  { q: "Do people seem like they are only pretending to be your friend/partner?", solutions: ["Trust", "Chyme"] },
  { q: "Do store/hotel clerks suddenly act strangely when you give your name/id?", solutions: ["SocketRelay", "ServiceCredits"] },
  { q: "If you go to Walmart/Target do the theft detectors beep once quickly when you walk in?", solutions: ["SocketRelay"] },
  { q: "Do people like to waste your time, sending you on wild goose chases to accomplish simple tasks/appointments?", solutions: ["Foundation", "WhatWorks"] },
  { q: "Anytime you have to call a customer service you are put on hold forever only to be hung up on and start the cycle again and again?", solutions: ["WhatWorks", "Foundation"] },
  { q: "Do you have an unusually large amount of car problems?", solutions: ["TrustTransport", "Foundation"] },
  { q: "Do items disappear, then reappear weeks/months later?", solutions: ["SocketRelay"] },
  { q: "Do people you've never introduced yourself to somehow already know your name?", solutions: ["Trust", "WhatWorks"] },
  { q: "Do you experience unexplained bruising/cuts/pain/injuries?", solutions: ["Directory", "Foundation"] },
  { q: "Do you notice Jehovah Witnesses following you and/or lurking in your neighborhood that were not there previously?", solutions: ["LightHouse", "Chyme"] },
  { q: "Do motorcycles, fire trucks and police cars with sirens circle around you?", solutions: ["Chyme", "TrustTransport"] },
  { q: "Do idiots mirror your behavior and how you dress and follow you around in public?", solutions: ["Chyme", "Trust"] },
  { q: "Do idiot acquaintances/family you have not seen in decades, or family members you never met, try to force their way into your life?", solutions: ["Trust", "LightHouse"] },
  { q: "Do weirdos issue attack or guard commands to have dogs bark or whimper at your presence?", solutions: ["LightHouse", "Chyme"] },
  { q: "Do your banking (i.e. checking accounts) and finanical accounts (i.e. Cashapp) stop working, transactions canceled or declined when you have funds or are closed with false reports of fraud?", solutions: ["ServiceCredits", "SocketRelay"] },
  { q: "Do your trips get sabotaged? Drivers taking 'breaks' so you miss your connection, extra legs added to your route, tickets canceled behind your back, or your contact email changed so you never get the updated ticket?", solutions: ["TrustTransport", "Foundation"] },
  { q: "Are you deliberately exposed or sexually humiliated? Facilities where showers and doors can't lock, and the door 'happens' to be opened the moment you undress — to laughter?", solutions: ["LightHouse", "Chyme"] },
  { q: "Are you written off as mentally ill or dangerous — a label that follows you to doctors, landlords, family and police — for reacting to things they set up?", solutions: ["Trust", "Directory"] },
  { q: "Do idiots falsely accuse you of assault or crimes in front of everyone — complete with a 'witness' backing up something that never happened — to get you kicked out or denied service?", solutions: ["SocketRelay", "WhatWorks"] },
];

// SOURCE OF TRUTH NOTE (schemes):
//   • Scheme NAMES are canonical in the app repo:
//     chargingthefuture/chargingthefuture → ctf/packages/web/lib/click-log/tags.ts
//     (CLICK_LOG_SCHEME_TAGS). ClickLog validates incident tags against that list.
//   • This page must list the SAME names, one-for-one. When tags.ts gains a scheme,
//     add it here in the same order; never rename or drop one that shipped.
//   • The names started from the Discourse thread "A post for each gang stalker game",
//     which is deprecated (still valid, no longer updated) — the app list is the living one.
//   • Descriptions below are owned here, written from the founder's archived posts.
const SCHEMES: { name: string; desc: string }[] = [
  { name: "The Scapegoating by Proxy", desc: "They sync their location to yours and create chaos wherever you are — so it looks like you are the source of the problem, and getting rid of you 'solves' it for everyone." },
  { name: "The Mail Mirage", desc: "Your mail is never quite delivered: delayed, lost, opened, damaged, or 'attempted' precisely when you are not there — timed to a Friday or Saturday so you can't recover it for days." },
  { name: "The Conspiracy Carousel", desc: "Falsely labeling a survivor with mental-health issues — their favorite is schizophrenia — and playing every side, including your own family, to push you toward involuntary commitment." },
  { name: "The \"That's a nice ____\"", desc: "Strangers keep complimenting what you own or wear, to sensitize you to it. The goal is that you second-guess your reality and fixate all day on who is 'in on it'." },
  { name: "Honey Pot", desc: "A fake friend, roommate, or romantic partner pushed hard into your life — to entrap you, extract information, or attach themselves to the people around you." },
  { name: "Entrapment / Bait", desc: "Baiting you into drugs, a gun purchase, spending, or anything illegal or discrediting. The default answer to whatever they ask: don't do it." },
  { name: "Staged \"Needing Help\"", desc: "Theater of someone needing rescue — a fall, a crisis, a fight — staged near you to provoke a reaction they can film, frame, or use." },
  { name: "Good Cop, Bad Cop", desc: "One harasses you while another plays your friend. Both are the same setup — the friendly one is collecting what the hostile one couldn't." },
  { name: "Fake Counselor / Fake Help", desc: "A 'counselor', advocate, or helper who is really a paid vigilante — building a case to set you up for an institution or slander instead of helping." },
  { name: "Lure to a Location", desc: "Pushing you to go somewhere specific — a shelter, an office, a meetup — where a setup is already waiting for you." },
  { name: "Staged Narratives / Loud \"Podcasts\"", desc: "Loud pre-recorded 'podcasts' or scripted conversations played near you, carrying handler-approved messages meant to provoke you or steer your decisions." },
  { name: "The Fabricated Flaw", desc: "They invent a flaw and hammer it with staged criticism timed to be absurd — told \"you stink\" on your way to the shower after hours in 100-degree heat. The goal is to make you overly self-critical, and to record the remark so operatives who know nothing believe the \"problem\" is real and recurring." },
  { name: "The Pot and Kettle", desc: "The insult comes from someone who visibly is the thing they are accusing you of — a fat person calling you fat, a disabled person mocking your disability. The mismatch is deliberate and obnoxious: it forces the operative to live a lie while still aiming at your self-esteem." },
  { name: "Staged Road Rage", desc: "A cyclist or pedestrian steps in front of your car at the last second — usually a pump fake, sometimes a real strike — to provoke a reaction someone is already filming. Footage of a survivor \"raging\" is what they show people to recruit them." },
  { name: "The Insurance Bleed", desc: "Your car gets hit again and again. Every claim raises your premium until you are bleeding money or cannot stay insured at all. The damage is the point, not the accident." },
  { name: "Road Sensitization", desc: "High beams flashed in your mirror, brake checks, cars pacing you or boxing you in — repeated until every drive is something you have to read and second-guess." },
  { name: "The Poisoned Well", desc: "Someone new is steered into your orbit, and gossip about them is staged where they can hear it — set up to read as if it came from you. Then another operative asks you something loaded about that same person, hoping you will say something they can carry back. You are disliked before you ever really meet, and that dislike is what they recruit from." },
  { name: "The Windfall", desc: "Someone around you suddenly gets lucky — a scholarship, a job, a whirlwind marriage or baby. It lifts them above you so they read you as the incompetent one when it is often the reverse, surrounds them with new \"friends\" who are there to use them, and leaves you second-guessing yourself. A flattered person is easy to recruit." },
  { name: "The Jinx", desc: "Someone around you gets hit — a costly ticket, a crash, stolen items, a repair bill — and is then told that you are the reason it happened. They cut you off, which was the point. They cause the problem, then sell the story that explains it." },
  { name: "The Fake Job", desc: "An offer good enough to leave your current job for, and then you are let go shortly after. The old job is gone, the next one is harder to reach, and you are worse off than before you moved." },
  { name: "The Warm Spell", desc: "Weeks or months of them acting friendly, then the harassment resumes — the name-calling, the violence, all of it. The kind stretch is not a break, it is part of it. It lowers your guard so someone can collect new information, it keeps you swinging between relief and dread, and it hands everyone else a reason to doubt you: they were nice to you last month." },
  { name: "Color Sensitization", desc: "The people around you all start wearing the same color, and it changes on a schedule. The cover story is that it is a trend. What gives it away is that survivors in different cities notice the same color in the same week — a real trend does not work that way, and no one person can see it happening. This is one worth logging: it only becomes visible when enough of us record it." },
  { name: "Psyop Marketing", desc: "A company you're only a customer of starts running marketing that reads like a personal message to you — built so you can't miss it and everyone else can dismiss it as coincidence. The business relationship itself becomes the harassment channel." },
  { name: "The Acquire and Fold", desc: "A business you rely on — a meal-kit service, a product you reorder — gets bought and then shut down. Nothing is said to you; your option simply disappears. Buying and closing a company is what the money is for: controlling the resources around you, and removing choices from you and from their own people alike." },
  { name: "The Engineered Delay", desc: "A driver or employee stalls on purpose — a long 'break' at a rest stop — so you miss your connection and wait hours for the next one. Nothing dramatic happens. The play is pure stolen time, and it stacks with the ticket tampering below to stretch a two-day trip toward a week." },
  { name: "The Altered Ticket", desc: "Someone with inside access rewrites your booking: extra legs added, your ticket canceled mid-route, and the email on the ticket changed so the updated itinerary never reaches you. The company's record says you called in the change yourself — so now you're arguing against your own file." },
  { name: "The Pretext Search", desc: "An ordinary precaution gets declared evidence of a crime. Locks on your luggage — TSA-approved locks — become 'a sign of drug trafficking,' and a public search or dog sniff is demanded in front of everyone. Nothing is found, and the loud story continues anyway. The absurdity is the point: it's built to trigger you and the bystanders at once." },
  { name: "The Planted Witness", desc: "Someone approaches with scripted talk and won't back off while you retreat — then tells staff you assaulted them, and a second person confirms it as a 'witness.' You're denied service over something that never happened, and the police get called on a false report. Ask for the security footage; they'll say they can't release it." },
  { name: "The Replay", desc: "Strangers reenact words from a private incident in your past — a dispute that was already resolved, even one where the other person admitted lying. It proves they know your history, and it recasts a settled matter as if you had been the problem all along." },
  { name: "The Sensitization Skit", desc: "First they prime you: an ordinary item, mannerism, or question is repeated around you until it reads as a signal. Then comes the skit — someone forces a public confrontation about that exact thing, won't disengage while you back away, and escalates until you react. A second person then tells everyone you're overreacting, or worse, that you got violent. Your reaction to the setup — not the setup — becomes the story, and bystanders who aren't in on it repeat it in good faith as proof you're unstable." },
  { name: "The Staged Run-In", desc: "Your trip gets delayed, rebooked, or rerouted — and somehow the same strangers keep crossing your path, with a meet-cute here and a small altercation there. The crossings are engineered: your logistics are bent so you run into them, and later those same people can claim they know you. A manufactured stranger becomes a credible 'witness' or 'acquaintance' — and your world fills with familiar faces you never actually met." },
  { name: "The Staged Exposure", desc: "When the honey pot is refused, they go for exposure instead. The setup leans on rules that sound reasonable on their own — shelters and transitional housing where showers and doors can't lock, staff who hold the keys — plus timing: you're keyed in, and the moment you've undressed the door opens, exposing you to a stranger. The laughter is the tell that the 'accident' was the point. Many report the worst end of this: assault and rape. The honey pot is the lure version; this one needs nothing from you but presence." },
  { name: "The Good Day, Bad Day", desc: "Your days get scheduled, then graded. A fixed weekday made reliably bad, weekends a favorite target — so the dread shows up before anything happens. Then comes the polling: was it a good day, a bad day, a bad weekend? And the echo, in phrases nobody else can catch: 'have a good day,' 'hope you had a good weekend' — delivered pointedly after a day they made bad. Any scheme can fill a bad day; this one names the layer above them all, where your harm is the raw material and the grading is the entertainment. Multiple survivors report the same weekday structure independently — which is exactly what shared trend data can prove." },
  { name: "The Forced Homecoming", desc: "They make you destitute until the only roof left belongs to family who abuse you — and now you depend on them for money. Then they saturate the address: the neighborhood bought up, full-timers circling all day, and the family itself paid in perks, jobs, friends and sex to run the harassment from inside the house. It hands them two things. Grading your days gets easy when one of them lives with you. And it is the cheapest way to get you labeled mentally ill or dangerous, because you are isolated with your abusers and there is no witness who isn't on their payroll. Farah has had this tried on her repeatedly for over a decade and strongly discourages the arrangement: it is where the worst outcomes happen, because the harassment never stops and there is nowhere in the house to go." },
  { name: "Not listed", desc: "A scheme that doesn't fit the named list yet. Weavers of the Commons can pick it in ClickLog and describe what happened — that description goes to the owner, and it's how new schemes earn a name." },
];

// Map feature names to their colors for the solution badges
const FEATURE_COLOR_MAP: Record<string, string> = {
  "Commons":        "#7C3AED",
  "Chyme":          "#22C55E",
  "LightHouse":     "#3B82F6",
  "Lighthouse":     "#3B82F6",
  "TrustTransport": "#67E8F9",
  "Directory":      "#93C5FD",
  "Foundation":     "#F59E0B",
  "PeerProgramming": "#16A34A",
  "GDP":            "#06B6D4",
  "ServiceCredits": "#A855F7",
  "Workforce":      "#F97316",
  "Mood":           "#BEF264",
  "SocketRelay":    "#FDBA74",
  "WhatWorks":      "#84CC16",
  "SkillsHunt":     "#FACC15",
  "SkillUp":        "#10B981",
  "Trust":          "#0EA5E9",
  "ClickLog":       "#EC4899",
  "Skills Taxonomy": "#8B5CF6",
  "Contributions":  "#FB7185",
  "Beacon":         "#B91C1C",
  "Recurring Activity": "#14B8A6",
};

// Map feature names to their live app URLs for the solution badges. Signed-out
// visitors on the Look Ma page tap a badge to open that feature in the app.
// Only features that appear in LOOK_MA_ITEMS solutions are mapped.
const FEATURE_URL_MAP: Record<string, string> = {
  "Chyme":          `${APP_URL}/apps/chyme`,
  "LightHouse":     `${APP_URL}/apps/lighthouse`,
  "Lighthouse":     `${APP_URL}/apps/lighthouse`,
  "TrustTransport": `${APP_URL}/apps/trust-transport`,
  "Directory":      `${APP_URL}/apps/directory`,
  "Foundation":     `${APP_URL}/apps/foundation`,
  "PeerProgramming": `${APP_URL}/apps/peer-programming`,
  "ServiceCredits": `${APP_URL}/apps/service-credits`,
  "Workforce":      `${APP_URL}/apps/workforce`,
  "SocketRelay":    `${APP_URL}/apps/socket-relay`,
  "WhatWorks":      `${APP_URL}/apps/what-works`,
  "SkillUp":        `${APP_URL}/apps/skill-up`,
  "Trust":          `${APP_URL}/apps/trust`,
};

// Lookup feature metadata by id (color, icon, name) for the chat variant.
const FEATURE_BY_ID: Record<string, (typeof FEATURES)[number]> = Object.fromEntries(
  FEATURES.map((f) => [f.id, f]),
);

// Chat variant data. ONE app (the Hub chat) that quietly does the work of the
// other 24 features. Each entry is a "random" question a survivor might type on
// mobile, paired with an actionable answer that demonstrates one feature WITHOUT
// naming or pitching it. Order mirrors FEATURES (excluding Hub). The `id` links
// each answer to its feature for color + an optional "open it" handoff.
const HUB_QA: { id: string; q: string; a: string }[] = [
  { id: "chyme",         q: "I feel really isolated tonight and just want to hear another human voice.", a: "There's a live audio room going right now — 14 people listening, no pressure to talk. You can just listen, or take the mic whenever you're ready. Want me to drop you in?" },
  { id: "lighthouse",    q: "I need to leave my place fast. Where's somewhere safe I can actually stay?", a: "Found 3 listings within 20 miles, each posted by the owner. The closest has a private entrance and is open this week. Want me to flag your interest?" },
  { id: "trusttransport",q: "My car broke down and I start work at 8 tomorrow — I don't trust rideshare apps with a stranger.", a: "Two members are offering rides near you tomorrow morning. I can request a 7:15 pickup to get you there by 8, with a private chat between the two of you. Book it?" },
  { id: "directory",     q: "My laptop keeps overheating and I can't afford a repair shop.", a: "Three people near you list hardware repair — one is 6 miles out and handles overheating specifically. Here's their availability this week." },
  { id: "foundation",    q: "I need a drill and someone who can mount a security camera by tomorrow.", a: "There's a loanable drill 2 blocks away and a member who's done 40+ camera installs. They're open tomorrow afternoon. Want the intro?" },
  { id: "peerprog",      q: "I keep starting things and never finishing them. I do better around other people.", a: "There's a weekly small-group session — same time, every week, global. Next one is Sunday. I can save you a seat." },
  { id: "gdp",           q: "Does any of the work we all do here actually add up to anything?", a: "It does. Everything exchanged and settled here adds up in the Community Value Index, counted since launch. It's an index, not money. Here's the live dashboard." },
  { id: "credits",       q: "I'm broke but I can fix bikes. Any way to get groceries without cash?", a: "Yes — log your repairs and you earn credits you can exchange inside the network. A member nearby will do a grocery run for 40 credits. Two repairs covers it." },
  { id: "workforce",     q: "I lost my job last week. I need a way to earn a living that nobody can take away.", a: "Here's where the community is short — three sectors with open gaps, and one lines up with what you do. Two members already work in it. Want to see their profiles and team up, or start something of your own?" },
  { id: "mood",          q: "I've felt off for weeks. I can't tell if it's getting worse or I'm imagining it.", a: "You're not imagining it. Your last 30 private check-ins show a clear dip every Sunday night. Here's the pattern — naming it is how you start to take control." },
  { id: "socketrelay",   q: "Someone gave me 200 masks. I don't need them all and don't want them wasted.", a: "Three members within 5 miles need exactly these right now. I can relay it — pickup or drop-off. Post it to the live share board?" },
  { id: "whatworks",     q: "What actually works for blocking unknown numbers that keep harassing me?", a: "Verified by people who faced the same thing — no ads, no affiliates. 4 tools, ranked. The top one is free and works on your phone. Here's the short list." },
  { id: "skillshunt",    q: "I want to learn something new but I don't even know what's out there.", a: "Members teach everything from welding to grant-writing. Based on what you've asked before, here are 5 skills you could start this week — free, peer-taught." },
  { id: "skillup",       q: "I got pushed out of my job and need new skills I can actually trade inside the network.", a: "Done — a 90-day plan to build a skill the network needs, broken into weekly milestones. I'll check in and keep score. Day 1 of 90 starts now." },
  { id: "trust",         q: "Someone offered to help me move but I just met them. How do I know they're real?", a: "Their trust card lists what they have actually done here: two years of sign-ins, finished cohorts, connections with members. Plain lines, no score, and nothing on it says anyone checked them out. Here's the card, so you can judge for yourself." },
  { id: "clicklog",      q: "Something happened on my walk home. I want a record, but I don't want to call police.", a: "Logged — time-stamped and private to you, and your notes are never shared. Kept untagged, it needs no location. Want to add it to the trend map too?" },
  { id: "skillstaxonomy",q: "I want to find work but I don't even know what job titles fit what I can do.", a: "Here's the shared catalog — sectors, roles, and the skills each one needs, all mapped. Three roles line up with what you've told me. Want to see the paths?" },
  { id: "contributions", q: "I've gotten a lot from this network. Is there a way to give something back?", a: "There's an open drive right now — chip in a gift card, a Quora comment, or a GitHub star. Every contribution earns a service-credit thank-you. Want the current list?" },
  { id: "beacon",        q: "Is there any way to hear directly from whoever's running this?", a: "Farah's broadcasting live right now — watch with just a link, no account needed. Sign in if you want to chat or react. Want me to open it?" },
  { id: "recurringactivity", q: "Someone's been checking on me every week and I want them to know it matters.", a: "One tap acknowledges it — no amounts, no bill, just recognition of an ongoing tie. I can log this week's. Want to confirm?" },
  { id: "knowledge",     q: "I've written a lot about this on Quora over the years. Could any of it help somebody else?", a: "It can. Lend your public posts to the Knowledge Library and I can answer from your experience as well as other people's. You can take them back whenever you like. Want to pick a few posts?" },
  { id: "fireside",      q: "I just read a post on the blog and I have something to add.", a: "Every post has a conversation underneath it, and anyone can read it. Write yours here; it shows publicly once you're approved. Want me to open that post's conversation?" },
  { id: "tiradio",       q: "Is anybody talking about this live tonight?", a: "Here's the TI Radio schedule for the next seven days, in your own time zone. One discussion is on air in Chyme right now. Want to listen in, or take a slot of your own?" },
  { id: "reader",        q: "I follow a few sites, but I don't want an algorithm deciding what I see.", a: "Reader shows what those sites publish, in the order they published it, and nothing decides what you see first. You sign in with the account you already have. Want me to open it?" },
];

function NavBar() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/look-ma", label: "Look Ma, I Fixed It", icon: FixIt },
    { href: "/schemes", label: "The Schemes", icon: Target },
    { href: "/demos", label: `${FEATURES.length} Demos`, icon: Tv },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b-4 border-foreground">
      <div className="flex justify-between items-center px-6 py-4">
        <Link href="/" className="text-2xl md:text-3xl font-display uppercase tracking-wider hover:opacity-80 transition-opacity">
          <span className="text-primary">Charging</span> The Future
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`font-bold uppercase tracking-widest text-sm px-4 py-2 border-2 transition-all ${
                location === href
                  ? "border-primary bg-primary text-black"
                  : "border-transparent hover:border-foreground text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
          <a
            href={APP_URL}
            className="ml-4 brutal-border brutal-shadow-primary brutal-shadow-hover bg-primary text-black font-bold py-2 px-5 uppercase tracking-widest text-sm flex items-center gap-2"
          >
            Open App <ArrowRight size={16} strokeWidth={3} />
          </a>
        </div>
        <button className="md:hidden p-2 brutal-border" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t-4 border-foreground bg-background overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-3">
              {links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`font-bold uppercase tracking-widest flex items-center gap-3 p-3 border-2 ${
                    location === href ? "border-primary bg-primary text-black" : "border-foreground text-foreground"
                  }`}
                >
                  <Icon size={18} /> {label}
                </Link>
              ))}
              <a
                href={APP_URL}
                className="brutal-border brutal-shadow-primary bg-primary text-black font-bold py-3 px-5 uppercase tracking-widest text-center flex items-center justify-center gap-2 mt-2"
              >
                Open App <ArrowRight size={16} strokeWidth={3} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

const DEFAULT_STATS = ["5M Survivors", "300B Economy", "127 Countries", `${FEATURES.length} Apps, One Account`, "Free to join", "Reviewed One at a Time"];

function StatMarquee({ stats = DEFAULT_STATS }: { stats?: string[] } = {}) {
  const doubled = [...stats, ...stats];
  return (
    <div className="border-y-4 border-foreground bg-secondary py-5 overflow-hidden flex whitespace-nowrap">
      <motion.div
        className="flex gap-12 items-center text-secondary-foreground font-display text-3xl md:text-4xl uppercase tracking-wider"
        animate={{ x: [0, "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
      >
        {doubled.map((s, i) => (
          <span key={i} className="flex-shrink-0">{s} <span className="text-background/50 mx-2">★</span></span>
        ))}
      </motion.div>
    </div>
  );
}

function YouTubeFacade({ youtubeId, name, color }: { youtubeId: string; name: string; color: string }) {
  const [active, setActive] = useState(false);
  const thumb = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  if (active) {
    return (
      <div className="relative w-full aspect-video border-4 border-foreground overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&playsinline=1`}
          title={`${name} Demo`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="relative w-full aspect-video border-4 border-foreground overflow-hidden cursor-pointer group focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
      onClick={() => setActive(true)}
      aria-label={`Play ${name} demo`}
    >
      <img
        src={thumb}
        alt={`${name} demo thumbnail`}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div
          className="w-16 h-16 border-4 border-black flex items-center justify-center brutal-shadow transition-transform group-hover:scale-110 group-focus-visible:scale-110"
          style={{ background: color }}
        >
          <Play size={24} fill="black" className="text-black ml-1" />
        </div>
        <span className="font-bold text-xs uppercase tracking-widest text-white/80">{name} Demo</span>
      </div>
    </button>
  );
}

function VideoPlaceholder({ name, color }: { name: string; color: string }) {
  return (
    <div className="relative w-full aspect-video border-4 border-foreground bg-zinc-900 overflow-hidden group cursor-pointer">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
        <div
          className="w-16 h-16 border-4 border-black flex items-center justify-center brutal-shadow transition-transform group-hover:scale-110"
          style={{ background: color }}
        >
          <Play size={24} fill="black" className="text-black ml-1" />
        </div>
        <span className="font-bold text-xs uppercase tracking-widest text-white/60">{name} Demo</span>
      </div>
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${color}18 0%, #000 100%)` }} />
      <div className="absolute bottom-2 left-3 right-3 flex justify-between text-xs font-bold uppercase text-white/25">
        <span>YouTube Demo</span>
        <span>Coming Soon</span>
      </div>
    </div>
  );
}

function ServiceCreditsBounty() {
  return (
    <a
      href={APP_URL}
      className="flex items-stretch border-4 border-foreground overflow-hidden group transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
      style={{ boxShadow: "4px 4px 0px 0px #F59E0B", textDecoration: "none" }}
      aria-label="Sign up and receive 100 ServiceCredits"
    >
      {/* Token stamp — left */}
      <div
        className="flex flex-col items-center justify-center px-5 py-4 border-r-4 border-foreground flex-shrink-0 group-hover:brightness-110 transition-all"
        style={{ background: "#F59E0B", minWidth: 80 }}
      >
        <span className="font-display text-5xl leading-none text-black select-none">100</span>
        <div className="flex items-center gap-1 mt-1">
          <Coins size={13} strokeWidth={2.5} className="text-black/60" />
          <span className="font-black text-xs uppercase tracking-widest text-black/60">SC</span>
        </div>
      </div>

      {/* Copy — right */}
      <div className="flex-1 px-5 py-4" style={{ background: "#1c1200" }}>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-black text-xs uppercase tracking-widest" style={{ color: "#F59E0B" }}>
            Sign-Up Reward
          </span>
          <span
            className="font-bold text-[10px] px-1.5 py-0.5 uppercase tracking-wider border"
            style={{ color: "#F59E0B", borderColor: "rgba(245,158,11,0.35)" }}
          >
            Free
          </span>
        </div>
        <p className="font-display text-base uppercase text-foreground leading-tight mb-1.5 tracking-widest">
          100 ServiceCredits — Yours On Day One
        </p>
        <p className="text-sm leading-snug" style={{ color: "rgba(245,158,11,0.6)" }}>
          The community's psyop-free credits unit. Exchange for housing, rides, repairs, or skills inside the network. Not money. No bank. No cash-out.
        </p>
      </div>
    </a>
  );
}

function Footer() {
  return (
    <footer className="bg-background py-12 px-6 border-t-4 border-foreground">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-display text-3xl uppercase tracking-wider">
          <span className="text-primary">Charging</span> The Future
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/demos" className="hover:text-foreground transition-colors">{FEATURES.length} Demos</Link>
          <Link href="/look-ma" className="hover:text-foreground transition-colors">Look Ma, I Fixed It</Link>
          <Link href="/schemes" className="hover:text-foreground transition-colors">The Schemes</Link>
          <a href={INVITES_URL} className="hover:text-foreground transition-colors">People on the list</a>
          <a href="https://github.com/chargingthefuture/chargingthefuture" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub ↗</a>
          <a href="https://chargingthefuture.github.io/chargingthefuture/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Blog ↗</a>
          <a href={GUIDE_URL} className="hover:text-foreground transition-colors">Guide</a>
          <a href={TERMS_URL} className="hover:text-foreground transition-colors">Terms</a>
          <a href={ANDROID_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1.5"><Download size={13} /> Android APK</a>
          <a href={WALLPAPERS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1.5"><Download size={13} /> Wallpapers</a>
          <a href={APP_URL} className="hover:text-primary transition-colors text-primary">Open App →</a>
        </div>
        <p className="text-muted-foreground uppercase font-bold tracking-widest text-xs">
          Built by us. For us. © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      <NavBar />

      {/* HERO — split screen */}
      <section className="pt-20 min-h-screen flex flex-col md:flex-row">
        <div className="relative w-full md:w-1/2 min-h-[50vh] md:min-h-screen overflow-hidden">
          <img
            src={HERO_IMG}
            alt="Chapter One — Survivor community rising"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute top-6 left-6 bg-white text-black border-4 border-black p-3 max-w-[200px] brutal-shadow">
            <p className="font-bold text-xs uppercase leading-tight">CHAPTER ONE:</p>
            <p className="text-xs leading-tight mt-1">The people around us changed. And we survived.</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background hidden md:block" />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-12 lg:px-16 py-16 bg-background relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 right-0 w-[40vw] h-[40vw] rounded-full bg-primary/15 blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] rounded-full bg-secondary/15 blur-[80px]" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 max-w-2xl"
          >
            <div className="inline-block border-4 border-accent bg-accent/10 text-accent font-bold px-4 py-2 uppercase tracking-widest mb-8 brutal-shadow text-sm">
              World's First Psyop-Free TI Economy
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display leading-[0.88] uppercase text-white mb-6 md:mb-8">
              The Next<br />
              <span className="text-primary">Shield</span><br />
              In Your<br />
              Corner.
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl mb-8 md:mb-10 leading-relaxed">
              Not a charity. Not a support group. A circular economy that turns survivors into active participants in a 300B opportunity — built from the ground up with {FEATURES.length} features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <a
                href={APP_URL}
                className="brutal-border brutal-shadow-primary brutal-shadow-hover bg-primary text-black font-bold py-4 px-8 text-lg uppercase tracking-widest text-center flex items-center justify-center gap-3"
              >
                Claim Your Access <ArrowRight strokeWidth={3} size={20} />
              </a>
              <Link
                href="/demos"
                className="brutal-border brutal-shadow brutal-shadow-hover bg-transparent text-foreground font-bold py-4 px-8 text-lg uppercase tracking-widest text-center flex items-center justify-center gap-3"
              >
                See All {FEATURES.length} Apps
              </Link>
            </div>
            <div className="mb-6">
              <ServiceCreditsBounty />
            </div>
            <div className="flex flex-wrap gap-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-2"><span className="text-primary">✓</span> Reviewed One at a Time</span>
              <span className="flex items-center gap-2"><span className="text-primary">✓</span> WCAG 2.2 AA</span>
              <span className="flex items-center gap-2"><span className="text-primary">✓</span> 5M Survivors</span>
            </div>
          </motion.div>
        </div>
      </section>

      <StatMarquee />

      {/* The blog's invite cards: who is already listed, written up one at a time. */}
      <InviteStrip />

      {/* Apps teaser */}
      <section className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 mb-16"
        >
          <div className="max-w-2xl">
            <div className="inline-block border-4 border-primary bg-primary/10 text-primary font-bold px-4 py-2 uppercase tracking-widest mb-6 brutal-shadow text-sm">
              The Arsenal
            </div>
            <h2 className="text-5xl md:text-6xl font-display uppercase mb-6 leading-[0.9]">
              {FEATURES.length} Apps.<br /><span className="text-secondary">One</span> Account.
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We don't need another forum. We need infrastructure. Every feature is a shield against isolation, financial drain, and exploitation. We built all {FEATURES.length}. Watch them in action.
            </p>
          </div>
          <Link
            href="/demos"
            className="w-full lg:w-auto flex-shrink-0 brutal-border brutal-shadow-secondary brutal-shadow-hover bg-secondary text-white font-bold py-4 px-8 text-lg uppercase tracking-widest flex items-center justify-center gap-3"
          >
            Watch All {FEATURES.length} Demos <ArrowRight strokeWidth={3} size={20} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {FEATURES.slice(0, 8).map((feat, i) => (
            <motion.div
              key={feat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={`/demos#${feat.id}`}
                className="block border-4 border-foreground group hover:-translate-y-1 transition-transform duration-200"
                style={{ background: feat.bg, boxShadow: `4px 4px 0px 0px ${feat.color}` }}
              >
                {feat.youtubeId && (
                  <div className="relative w-full aspect-video overflow-hidden border-b-4 border-foreground">
                    <img
                      src={`https://img.youtube.com/vi/${feat.youtubeId}/mqdefault.jpg`}
                      alt={`${feat.name} demo`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div
                        className="w-10 h-10 border-2 border-white flex items-center justify-center"
                        style={{ background: feat.color }}
                      >
                        <Play size={16} fill="black" color="black" strokeWidth={0} />
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-3 flex items-center gap-3">
                  <div
                    className="w-8 h-8 border-2 border-foreground flex items-center justify-center flex-shrink-0"
                    style={{ background: `${feat.color}25` }}
                  >
                    <feat.icon size={16} style={{ color: feat.color }} />
                  </div>
                  <span className="font-display text-base uppercase leading-tight">{feat.name}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/demos" className="text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-sm underline decoration-2 underline-offset-4 inline-flex items-center gap-2">
            + {FEATURES.length - 8} more apps — see all {FEATURES.length} demos<ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Look Ma teaser */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-card/40 border-y-4 border-foreground">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          <div className="max-w-2xl">
            <div className="inline-block border-4 border-accent bg-accent/10 text-accent font-bold px-4 py-2 uppercase tracking-widest mb-6 brutal-shadow text-sm">
              You Know The Patterns
            </div>
            <h2 className="text-5xl md:text-6xl font-display uppercase mb-6 leading-[0.9]">
              <span className="text-accent">Look Ma,</span><br />I Fixed It!
            </h2>
            <p className="text-xl text-muted-foreground mb-4 leading-relaxed">
              50+ real problems survivors experience — strange cars, workplace sabotage, new antennas on your block, dogs being commanded to bark at you. You've noticed. We've built the answer for every single one.
            </p>
            <p className="text-lg font-bold text-foreground/80">
              Click each problem. See exactly which feature of the app solves it.
            </p>
          </div>
          <Link
            href="/look-ma"
            className="w-full lg:w-auto flex-shrink-0 brutal-border brutal-shadow-accent brutal-shadow-hover bg-accent text-black font-bold py-4 px-8 text-lg uppercase tracking-widest flex items-center justify-center gap-3"
          >
            See All 50+ Fixes <ArrowRight strokeWidth={3} size={20} />
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 md:px-12 bg-primary border-t-4 border-foreground text-black text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-display uppercase mb-6 md:mb-8 leading-[0.9]">
            Stop Surviving.<br />Start Thriving.
          </h2>
          <p className="text-lg md:text-2xl font-bold mb-8 md:mb-12 max-w-2xl mx-auto">
            The platform is live. The community is waiting. You've already fought the hard battles — now it's time to build.
          </p>
          <a
            href={APP_URL}
            className="inline-flex items-center gap-3 border-4 border-black bg-white text-black font-bold py-4 px-8 md:py-6 md:px-12 text-lg md:text-2xl uppercase tracking-widest hover:bg-black hover:text-white transition-colors brutal-shadow"
          >
            Enter The App <ArrowRight strokeWidth={3} size={22} />
          </a>
          <div className="mt-6">
            <a
              href={ANDROID_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-black/40 text-black/70 font-bold py-2 px-5 text-sm uppercase tracking-widest hover:border-black hover:text-black transition-colors"
            >
              <Download size={15} strokeWidth={2.5} /> Download for Android (APK)
            </a>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 2px, transparent 2px)", backgroundSize: "30px 30px" }} />
      </section>

      <Footer />
    </div>
  );
}

function DemosPage() {
  const [location] = useLocation();

  React.useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const attempt = (tries: number) => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (tries > 0) {
        requestAnimationFrame(() => attempt(tries - 1));
      }
    };
    requestAnimationFrame(() => attempt(10));
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      <NavBar />

      <div className="pt-32 pb-8 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-block border-4 border-secondary bg-secondary/10 text-secondary font-bold px-4 py-2 uppercase tracking-widest mb-6 brutal-shadow text-sm">
            The Arsenal — All {FEATURES.length}
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-display uppercase mb-6 leading-[0.9]">
            {FEATURES.length} Apps.<br /><span className="text-secondary">One</span> Account.<br />All Demos.
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mb-4 leading-relaxed">
            Every feature of Skills Economy has its own walkthrough demo. Watch how each tool works — built by survivors, for survivors.
          </p>
          <a href={APP_URL} className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm underline decoration-2 underline-offset-4 hover:text-white transition-colors">
            Ready? Open the App <ArrowRight size={14} />
          </a>
        </motion.div>
      </div>

      <div className="px-6 md:px-12 lg:px-24 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.id}
              id={feat.id}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08 }}
              className="border-4 border-foreground flex flex-col h-full hover:-translate-y-1 hover:-translate-x-[2px] transition-all duration-200"
              style={{ background: feat.bg, boxShadow: `6px 6px 0px 0px ${feat.color}` }}
            >
              <div className="p-6 flex items-center gap-4 border-b-4 border-foreground">
                <div
                  className="w-12 h-12 border-4 border-foreground flex items-center justify-center flex-shrink-0"
                  style={{ background: `${feat.color}25` }}
                >
                  <feat.icon size={24} style={{ color: feat.color }} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    App {String(i + 1).padStart(2, "0")} of {FEATURES.length}
                  </div>
                  <h3 className="text-2xl font-display uppercase leading-none" style={{ color: feat.color }}>
                    {feat.emoji} {feat.name}
                  </h3>
                </div>
              </div>
              <div className="p-6 flex-grow">
                <p className="text-muted-foreground text-base leading-relaxed">{feat.desc}</p>
              </div>
              <div className="px-6 pb-6">
                {feat.youtubeId ? (
                  <YouTubeFacade youtubeId={feat.youtubeId} name={feat.name} color={feat.color} />
                ) : feat.protonLink ? (
                  <div className="relative w-full aspect-video border-4 border-foreground bg-zinc-900 overflow-hidden flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${feat.color}18 0%, #000 100%)` }}>
                    <a
                      href={feat.protonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 border-4 border-foreground font-bold uppercase tracking-widest px-6 py-4 text-base transition-all hover:-translate-y-1"
                      style={{ background: feat.color, color: "#000", boxShadow: `4px 4px 0px 0px #fff` }}
                    >
                      Watch Demo <ArrowRight size={18} strokeWidth={3} />
                    </a>
                  </div>
                ) : (
                  <VideoPlaceholder name={feat.name} color={feat.color} />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <section className="py-20 px-6 md:px-12 bg-secondary border-t-4 border-foreground text-white text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-display uppercase mb-6 leading-[0.9]">
            Seen enough?<br /><span className="text-primary">Join us.</span>
          </h2>
          <a
            href={APP_URL}
            className="inline-flex items-center gap-3 brutal-border bg-primary text-black font-bold py-4 px-8 md:py-5 md:px-10 text-lg md:text-xl uppercase tracking-widest brutal-shadow hover:-translate-y-1 transition-transform"
          >
            Claim Your Access <ArrowRight strokeWidth={3} size={22} />
          </a>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
      </section>

      <Footer />
    </div>
  );
}

function LookMaPage() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      <NavBar />

      <section className="pt-32 pb-12 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-block border-4 border-accent bg-accent/10 text-accent font-bold px-4 py-2 uppercase tracking-widest mb-6 brutal-shadow text-sm">
              You're Not Imagining It
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-display uppercase mb-6 md:mb-8 leading-[0.88]">
              <span className="text-accent">Look Ma,</span><br />I Fixed It!
            </h1>
            <p className="text-base md:text-xl lg:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
              50+ problems. 50+ answers. Everything you've experienced — the stalking, the workplace sabotage, the neighbors, the lights, the vehicles — we built a feature in Skills Economy for every single one. Click any problem to see the fix.
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl leading-relaxed mt-4">
              This list is what you notice, and each item points to the feature that answers it. For
              the play behind the problem — what they were running and why — every one of those has a
              name on{" "}
              <Link href="/schemes" className="text-accent underline underline-offset-4 hover:opacity-80">
                The Schemes
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 pb-20 max-w-7xl mx-auto">
        <div className="flex flex-col gap-3">
          {LOOK_MA_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.03, 0.4) }}
              className="border-4 border-foreground bg-card cursor-pointer transition-all duration-200"
              style={active === i ? { boxShadow: `6px 6px 0px 0px hsl(var(--accent))` } : { boxShadow: `4px 4px 0px 0px hsl(var(--foreground))` }}
              onClick={() => setActive(active === i ? null : i)}
            >
              <div className="p-5 md:p-6 flex justify-between items-center gap-4">
                <div className="flex items-start gap-4">
                  <span className="font-display text-3xl text-accent flex-shrink-0 leading-none mt-1 min-w-[2rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-bold text-base md:text-lg leading-snug">
                    {item.q}
                  </h3>
                </div>
                <div
                  className="w-9 h-9 flex-shrink-0 flex items-center justify-center border-4 border-foreground text-xl font-bold transition-all duration-300"
                  style={active === i ? { background: "hsl(var(--accent))", color: "black", transform: "rotate(45deg)" } : {}}
                >
                  +
                </div>
              </div>

              <AnimatePresence>
                {active === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t-4 border-foreground bg-accent/10 p-5 md:p-6">
                      <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Fixed by:</p>
                      <div className="flex flex-wrap gap-2">
                        {item.solutions.map((sol) => {
                          const c = FEATURE_COLOR_MAP[sol] || "#9CA3AF";
                          const url = FEATURE_URL_MAP[sol];
                          if (url) {
                            return (
                              <a
                                key={sol}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="font-bold px-3 py-1 text-sm uppercase tracking-widest border-2 transition-transform hover:-translate-y-0.5"
                                style={{ borderColor: c, color: c, background: `${c}18` }}
                              >
                                {sol}
                              </a>
                            );
                          }
                          return (
                            <span
                              key={sol}
                              className="font-bold px-3 py-1 text-sm uppercase tracking-widest border-2"
                              style={{ borderColor: c, color: c, background: `${c}18` }}
                            >
                              {sol}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 lg:px-24 border-t-4 border-foreground bg-card/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-display uppercase mb-4 leading-[0.9]">
              Want to see<br /><span className="text-primary">all {FEATURES.length} apps</span> in action?
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg">
              Every feature above has a full walkthrough demo. Watch how it works before you join.
            </p>
          </div>
          <div className="flex flex-col gap-4 flex-shrink-0">
            <Link
              href="/demos"
              className="brutal-border brutal-shadow-primary brutal-shadow-hover bg-primary text-black font-bold py-4 px-8 text-lg uppercase tracking-widest flex items-center justify-center gap-3"
            >
              Watch All {FEATURES.length} Demos <ArrowRight strokeWidth={3} />
            </Link>
            <a
              href={APP_URL}
              className="brutal-border brutal-shadow brutal-shadow-hover bg-transparent text-foreground font-bold py-4 px-8 text-lg uppercase tracking-widest flex items-center justify-center gap-3"
            >
              Join The App <ArrowRight strokeWidth={3} />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function SchemesPage() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      <NavBar />

      <section className="pt-32 pb-12 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-block border-4 border-accent bg-accent/10 text-accent font-bold px-4 py-2 uppercase tracking-widest mb-6 brutal-shadow text-sm">
              Know Their Playbook
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-display uppercase mb-6 md:mb-8 leading-[0.88]">
              <span className="text-accent">The</span> Schemes
            </h1>
            <p className="text-base md:text-xl lg:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
              Every scheme has a name. These are the plays run on survivors — cataloged so you can
              recognize them, name them, and log them. The names below match the scheme tags in
              ClickLog, the incident log inside Skills Economy: tag an incident with the scheme
              used (and the problem it caused) and it feeds the trend reporting. Click a scheme to
              see how it works.
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl leading-relaxed mt-4">
              These are the plays behind the problems on{" "}
              <Link href="/look-ma" className="text-accent underline underline-offset-4 hover:opacity-80">
                Look Ma, I Fixed It
              </Link>
              : that list is what you notice, this one is what they are doing and why. Logging them
              in ClickLog is what turns single incidents into a picture of what is happening, and
              where.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 pb-20 max-w-7xl mx-auto">
        <div className="flex flex-col gap-3">
          {SCHEMES.map((scheme, i) => (
            <motion.div
              key={scheme.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.03, 0.4) }}
              className="border-4 border-foreground bg-card cursor-pointer transition-all duration-200"
              style={active === i ? { boxShadow: `6px 6px 0px 0px hsl(var(--accent))` } : { boxShadow: `4px 4px 0px 0px hsl(var(--foreground))` }}
              onClick={() => setActive(active === i ? null : i)}
            >
              <div className="p-5 md:p-6 flex justify-between items-center gap-4">
                <div className="flex items-start gap-4">
                  <span className="font-display text-3xl text-accent flex-shrink-0 leading-none mt-1 min-w-[2rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-bold text-base md:text-lg leading-snug">
                    {scheme.name}
                  </h3>
                </div>
                <div
                  className="w-9 h-9 flex-shrink-0 flex items-center justify-center border-4 border-foreground text-xl font-bold transition-all duration-300"
                  style={active === i ? { background: "hsl(var(--accent))", color: "black", transform: "rotate(45deg)" } : {}}
                >
                  +
                </div>
              </div>

              <AnimatePresence>
                {active === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t-4 border-foreground bg-accent/10 p-5 md:p-6">
                      <p className="text-sm md:text-base leading-relaxed mb-4">{scheme.desc}</p>
                      <a
                        href={CLICKLOG_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="font-bold px-3 py-1 text-sm uppercase tracking-widest border-2 inline-flex items-center gap-2 transition-transform hover:-translate-y-0.5"
                        style={{ borderColor: "#EC4899", color: "#EC4899", background: "#EC489918" }}
                      >
                        <AlertTriangle size={14} /> Log it in ClickLog
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-6 leading-relaxed">
          This list grows as new schemes get named. The in-app ClickLog tag list is the canonical
          version — this page mirrors it one-for-one.
        </p>
      </section>

      <section className="py-20 px-6 md:px-12 lg:px-24 border-t-4 border-foreground bg-card/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-display uppercase mb-4 leading-[0.9]">
              Schemes cause<br /><span className="text-primary">problems.</span> We fixed those too.
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg">
              50+ problems survivors experience — and the feature built to answer every single one.
            </p>
          </div>
          <div className="flex flex-col gap-4 flex-shrink-0">
            <Link
              href="/look-ma"
              className="brutal-border brutal-shadow-primary brutal-shadow-hover bg-primary text-black font-bold py-4 px-8 text-lg uppercase tracking-widest flex items-center justify-center gap-3"
            >
              See The 50+ Problems <ArrowRight strokeWidth={3} />
            </Link>
            <a
              href={APP_URL}
              className="brutal-border brutal-shadow brutal-shadow-hover bg-transparent text-foreground font-bold py-4 px-8 text-lg uppercase tracking-widest flex items-center justify-center gap-3"
            >
              Join The App <ArrowRight strokeWidth={3} />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

type ChatMessage = { role: "user" | "bot"; text: string; id?: string };

const HUB_INTRO: ChatMessage = {
  role: "bot",
  text: "Hey. I'm the Commons. Don't worry about learning the app — just tell me what's going on. Housing, a ride, paid work, or someone to talk to at 2am. Tap a question below to see how this works.",
};

function HubChatDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([HUB_INTRO]);
  const [asked, setAsked] = useState<Set<string>>(new Set());
  const [thinking, setThinking] = useState(false);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [draft, setDraft] = useState("");

  const askedRef = React.useRef<Set<string>>(new Set());
  const thinkingRef = React.useRef(false);
  const autoRef = React.useRef(false);
  const threadRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  const askedCount = asked.size;
  const suggestions = HUB_QA.filter((qa) => !asked.has(qa.id)).slice(0, 3);

  const ask = (id: string) =>
    new Promise<void>((resolve) => {
      const qa = HUB_QA.find((x) => x.id === id);
      if (!qa || thinkingRef.current || askedRef.current.has(id)) {
        resolve();
        return;
      }
      askedRef.current.add(id);
      setAsked(new Set(askedRef.current));
      setMessages((prev) => [...prev, { role: "user", text: qa.q, id }]);
      thinkingRef.current = true;
      setThinking(true);
      window.setTimeout(() => {
        setMessages((prev) => [...prev, { role: "bot", text: qa.a, id }]);
        thinkingRef.current = false;
        setThinking(false);
        resolve();
      }, 850);
    });

  const sleep = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

  const autoPlay = async () => {
    if (autoRef.current) return;
    autoRef.current = true;
    setAutoPlaying(true);
    for (const qa of HUB_QA) {
      if (!autoRef.current) break;
      if (askedRef.current.has(qa.id)) continue;
      await ask(qa.id);
      await sleep(650);
    }
    autoRef.current = false;
    setAutoPlaying(false);
  };

  const reset = () => {
    autoRef.current = false;
    thinkingRef.current = false;
    askedRef.current = new Set();
    setAutoPlaying(false);
    setThinking(false);
    setAsked(new Set());
    setMessages([HUB_INTRO]);
    setDraft("");
  };

  const sendDraft = () => {
    if (thinkingRef.current) return;
    const next = HUB_QA.find((qa) => !askedRef.current.has(qa.id));
    if (next) ask(next.id);
    setDraft("");
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Phone frame */}
      <div className="border-4 border-foreground bg-background overflow-hidden" style={{ boxShadow: "8px 8px 0px 0px #7C3AED" }}>
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#0E061A] border-b-4 border-foreground text-[10px] font-bold uppercase tracking-widest text-white/50">
          <span>9:41</span>
          <span className="text-primary">●●●●● Skills Economy</span>
          <span>100%</span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#0E061A] border-b-4 border-foreground">
          <div className="w-9 h-9 border-2 border-foreground flex items-center justify-center flex-shrink-0" style={{ background: "#7C3AED25" }}>
            <Users size={18} style={{ color: "#7C3AED" }} />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg uppercase tracking-wide text-white">Commons</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> Online · always
            </div>
          </div>
        </div>

        {/* Thread */}
        <div ref={threadRef} className="h-[360px] overflow-y-auto px-3 py-4 flex flex-col gap-3 bg-background scroll-smooth">
          {messages.map((m, i) => {
            if (m.role === "user") {
              return (
                <div key={i} className="self-end max-w-[80%]">
                  <div className="border-2 border-foreground bg-primary text-black px-3 py-2 text-sm leading-snug" style={{ boxShadow: "3px 3px 0px 0px #000" }}>
                    {m.text}
                  </div>
                </div>
              );
            }
            const feat = m.id ? FEATURE_BY_ID[m.id] : undefined;
            const accent = feat?.color ?? "#7C3AED";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="self-start max-w-[85%]"
              >
                <div className="border-2 border-foreground bg-card text-foreground px-3 py-2 text-sm leading-snug" style={{ boxShadow: `3px 3px 0px 0px ${accent}` }}>
                  {m.text}
                  {feat && (
                    <Link
                      href={`/demos#${feat.id}`}
                      className="mt-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest hover:underline"
                      style={{ color: accent }}
                    >
                      <feat.icon size={12} /> Open it directly ↗
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
          {thinking && (
            <div className="self-start">
              <div className="border-2 border-foreground bg-card px-3 py-2.5 flex items-center gap-1" style={{ boxShadow: "3px 3px 0px 0px #7C3AED" }}>
                <motion.span className="w-1.5 h-1.5 rounded-full bg-primary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} />
                <motion.span className="w-1.5 h-1.5 rounded-full bg-primary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} />
                <motion.span className="w-1.5 h-1.5 rounded-full bg-primary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} />
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="border-t-4 border-foreground bg-[#0E061A] px-3 py-3">
          {suggestions.length > 0 ? (
            <div className="flex flex-col gap-2">
              {suggestions.map((qa) => (
                <button
                  key={qa.id}
                  type="button"
                  onClick={() => ask(qa.id)}
                  disabled={thinking || autoPlaying}
                  className="text-left border-2 border-foreground bg-background px-3 py-2 text-xs leading-snug text-muted-foreground hover:text-foreground hover:border-primary transition-colors disabled:opacity-40"
                >
                  {qa.q}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center text-xs font-bold uppercase tracking-widest text-primary py-2">
              That was 20 different tools — one chat ✓
            </div>
          )}

          {/* Input row (visual) */}
          <div className="flex items-center gap-2 mt-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendDraft(); }}
              placeholder="Ask the Commons anything…"
              disabled={thinking || autoPlaying}
              className="flex-1 border-2 border-foreground bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary disabled:opacity-40"
            />
            <button
              type="button"
              onClick={sendDraft}
              disabled={thinking || autoPlaying}
              aria-label="Send"
              className="w-9 h-9 flex-shrink-0 border-2 border-foreground bg-primary text-black flex items-center justify-center disabled:opacity-40"
            >
              <Send size={15} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Demo controls + progress */}
      <div className="mt-5 flex flex-col items-center gap-3">
        <div className="w-full h-3 border-2 border-foreground bg-background overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${(askedCount / HUB_QA.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {askedCount} of {HUB_QA.length} tools reached — without ever leaving the chat
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={autoPlay}
            disabled={autoPlaying || askedCount === HUB_QA.length}
            className="brutal-border brutal-shadow-primary bg-primary text-black font-bold py-2.5 px-5 text-sm uppercase tracking-widest flex items-center gap-2 disabled:opacity-40"
          >
            <Play size={15} fill="black" /> {autoPlaying ? "Playing…" : "Watch full demo"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="brutal-border brutal-shadow bg-transparent text-foreground font-bold py-2.5 px-5 text-sm uppercase tracking-widest flex items-center gap-2"
          >
            <RotateCcw size={15} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      <NavBar />

      {/* HERO */}
      <section className="pt-28 md:pt-32 pb-12 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[45vw] h-[45vw] rounded-full bg-primary/15 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-block border-4 border-primary bg-primary/10 text-primary font-bold px-4 py-2 uppercase tracking-widest mb-6 brutal-shadow text-sm">
              New · Chat-First Experience
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display uppercase leading-[0.9] mb-6">
              Don't learn<br />{FEATURES.length} apps.<br /><span className="text-primary">Just ask.</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
              {FEATURES.length} features is a lot to face when you're already overwhelmed. So we put one chat in front of all of them. Tell the Commons what's wrong — a ride, a safe place, paid work, a panic at 2am — and it quietly pulls the right tool. No menus. No choosing. And anytime you want, you can skip the chat and open a feature directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={APP_URL}
                className="brutal-border brutal-shadow-primary brutal-shadow-hover bg-primary text-black font-bold py-4 px-8 text-lg uppercase tracking-widest text-center flex items-center justify-center gap-3"
              >
                Open The Commons <ArrowRight strokeWidth={3} size={20} />
              </a>
              <Link
                href="/demos"
                className="brutal-border brutal-shadow brutal-shadow-hover bg-transparent text-foreground font-bold py-4 px-8 text-lg uppercase tracking-widest text-center flex items-center justify-center gap-3"
              >
                Prefer the full menu?
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <HubChatDemo />
          </motion.div>
        </div>
      </section>

      <StatMarquee />

      {/* The reveal */}
      <section className="py-24 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 border-4 border-secondary bg-secondary/10 text-secondary font-bold px-4 py-2 uppercase tracking-widest mb-6 brutal-shadow text-sm">
            <Sparkles size={15} /> The trick
          </div>
          <h2 className="text-4xl md:text-6xl font-display uppercase leading-[0.9] mb-6">
            One chat.<br /><span className="text-primary">Seventeen</span> tools doing the work.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Every "random" question in the demo above quietly reached a different part of the platform — housing, transport, paid work, repairs, breathing, mood patterns, safety logging — without ever asking you to learn its name. The Commons does the navigating. You just talk.
          </p>
        </motion.div>
      </section>

      {/* What's behind the chat */}
      <section className="pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {HUB_QA.map((qa, i) => {
            const feat = FEATURE_BY_ID[qa.id];
            if (!feat) return null;
            return (
              <motion.div
                key={qa.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.05 }}
              >
                <Link
                  href={`/demos#${feat.id}`}
                  className="flex items-center gap-3 border-4 border-foreground p-3 group hover:-translate-y-1 transition-transform duration-200 h-full"
                  style={{ background: feat.bg, boxShadow: `4px 4px 0px 0px ${feat.color}` }}
                >
                  <div className="w-9 h-9 border-2 border-foreground flex items-center justify-center flex-shrink-0" style={{ background: `${feat.color}25` }}>
                    <feat.icon size={18} style={{ color: feat.color }} />
                  </div>
                  <span className="font-display text-sm uppercase leading-tight">{feat.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-sm font-bold uppercase tracking-widest text-muted-foreground">
          {HUB_QA.length} features, reachable through one conversation — or opened directly, your call.
        </p>
      </section>

      {/* Final CTA */}
      <section className="py-28 px-6 md:px-12 bg-primary border-t-4 border-foreground text-black text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display uppercase mb-6 leading-[0.9]">
            Less to learn.<br />More that helps.
          </h2>
          <p className="text-lg md:text-2xl font-bold mb-10 max-w-2xl mx-auto">
            Start with a single question. The Commons handles the rest.
          </p>
          <a
            href={APP_URL}
            className="inline-flex items-center gap-3 border-4 border-black bg-white text-black font-bold py-4 px-8 md:py-6 md:px-12 text-lg md:text-2xl uppercase tracking-widest hover:bg-black hover:text-white transition-colors brutal-shadow"
          >
            Ask The Commons <ArrowRight strokeWidth={3} size={22} />
          </a>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 2px, transparent 2px)", backgroundSize: "30px 30px" }} />
      </section>

      <Footer />
    </div>
  );
}

// Variant 3 chat demo. Same conversation engine as HubChatDemo, but the chat
// IS the app (the place you land on sign-up) — so: no "Hub" name label on the
// thread, no per-answer "open the feature" handoffs, and no counts or
// references to the underlying services. The focal point is purely the chat.
const ASK_INTRO: ChatMessage = {
  role: "bot",
  text: "Hey. Whatever's going on, just say it the way you'd say it out loud. I'll find you something you can actually use right now. Tap one below to see how it works.",
};

function AskHubDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([ASK_INTRO]);
  const [asked, setAsked] = useState<Set<string>>(new Set());
  const [thinking, setThinking] = useState(false);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [draft, setDraft] = useState("");

  const askedRef = React.useRef<Set<string>>(new Set());
  const thinkingRef = React.useRef(false);
  const autoRef = React.useRef(false);
  const threadRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  const askedCount = asked.size;
  const suggestions = HUB_QA.filter((qa) => !asked.has(qa.id)).slice(0, 3);

  // Auto-play pacing: a longer "thinking" beat, then a long pause so each
  // answer is readable before the next question scrolls in.
  const THINK_MS = 6000;
  const PAUSE_MS = 7000;

  const ask = (id: string) =>
    new Promise<void>((resolve) => {
      const qa = HUB_QA.find((x) => x.id === id);
      if (!qa || thinkingRef.current || askedRef.current.has(id)) {
        resolve();
        return;
      }
      askedRef.current.add(id);
      setAsked(new Set(askedRef.current));
      setMessages((prev) => [...prev, { role: "user", text: qa.q, id }]);
      thinkingRef.current = true;
      setThinking(true);
      window.setTimeout(() => {
        setMessages((prev) => [...prev, { role: "bot", text: qa.a, id }]);
        thinkingRef.current = false;
        setThinking(false);
        resolve();
      }, THINK_MS);
    });

  const sleep = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

  const autoPlay = async () => {
    if (autoRef.current) return;
    autoRef.current = true;
    setAutoPlaying(true);
    for (const qa of HUB_QA) {
      if (!autoRef.current) break;
      if (askedRef.current.has(qa.id)) continue;
      await ask(qa.id);
      await sleep(PAUSE_MS);
    }
    autoRef.current = false;
    setAutoPlaying(false);
  };

  const reset = () => {
    autoRef.current = false;
    thinkingRef.current = false;
    askedRef.current = new Set();
    setAutoPlaying(false);
    setThinking(false);
    setAsked(new Set());
    setMessages([ASK_INTRO]);
    setDraft("");
  };

  const sendDraft = () => {
    if (thinkingRef.current) return;
    const next = HUB_QA.find((qa) => !askedRef.current.has(qa.id));
    if (next) ask(next.id);
    setDraft("");
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Phone frame */}
      <div className="border-4 border-foreground bg-background overflow-hidden" style={{ boxShadow: "8px 8px 0px 0px #7C3AED" }}>
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#0E061A] border-b-4 border-foreground text-[10px] font-bold uppercase tracking-widest text-white/50">
          <span>9:41</span>
          <span className="text-primary">●●●●● Skills Economy</span>
          <span>100%</span>
        </div>

        {/* Header — no app name; the chat is simply where you land */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#0E061A] border-b-4 border-foreground">
          <div className="w-9 h-9 border-2 border-foreground flex items-center justify-center flex-shrink-0" style={{ background: "#7C3AED25" }}>
            <Sparkles size={18} style={{ color: "#7C3AED" }} />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> Online · always here
            </div>
            <div className="text-xs text-muted-foreground">Ask anything. Get something you can use.</div>
          </div>
        </div>

        {/* Thread */}
        <div ref={threadRef} className="h-[360px] overflow-y-auto px-3 py-4 flex flex-col gap-3 bg-background scroll-smooth">
          {messages.map((m, i) => {
            if (m.role === "user") {
              return (
                <div key={i} className="self-end max-w-[80%]">
                  <div className="border-2 border-foreground bg-primary text-black px-3 py-2 text-sm leading-snug" style={{ boxShadow: "3px 3px 0px 0px #000" }}>
                    {m.text}
                  </div>
                </div>
              );
            }
            const accent = m.id ? FEATURE_BY_ID[m.id]?.color ?? "#7C3AED" : "#7C3AED";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="self-start max-w-[85%]"
              >
                <div className="border-2 border-foreground bg-card text-foreground px-3 py-2 text-sm leading-snug" style={{ boxShadow: `3px 3px 0px 0px ${accent}` }}>
                  {m.text}
                </div>
              </motion.div>
            );
          })}
          {thinking && (
            <div className="self-start">
              <div className="border-2 border-foreground bg-card px-3 py-2.5 flex items-center gap-1" style={{ boxShadow: "3px 3px 0px 0px #7C3AED" }}>
                <motion.span className="w-1.5 h-1.5 rounded-full bg-primary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} />
                <motion.span className="w-1.5 h-1.5 rounded-full bg-primary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} />
                <motion.span className="w-1.5 h-1.5 rounded-full bg-primary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} />
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="border-t-4 border-foreground bg-[#0E061A] px-3 py-3">
          {suggestions.length > 0 ? (
            <div className="flex flex-col gap-2">
              {suggestions.map((qa) => (
                <button
                  key={qa.id}
                  type="button"
                  onClick={() => ask(qa.id)}
                  disabled={thinking || autoPlaying}
                  className="text-left border-2 border-foreground bg-background px-3 py-2 text-xs leading-snug text-muted-foreground hover:text-foreground hover:border-primary transition-colors disabled:opacity-40"
                >
                  {qa.q}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center text-xs font-bold uppercase tracking-widest text-primary py-2">
              Ask it anything — it's all one conversation ✓
            </div>
          )}

          {/* Input row */}
          <div className="flex items-center gap-2 mt-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendDraft(); }}
              placeholder="Say what's going on…"
              disabled={thinking || autoPlaying}
              className="flex-1 border-2 border-foreground bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary disabled:opacity-40"
            />
            <button
              type="button"
              onClick={sendDraft}
              disabled={thinking || autoPlaying}
              aria-label="Send"
              className="w-9 h-9 flex-shrink-0 border-2 border-foreground bg-primary text-black flex items-center justify-center disabled:opacity-40"
            >
              <Send size={15} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Demo controls */}
      <div className="mt-5 flex flex-col items-center gap-3">
        <div className="w-full h-3 border-2 border-foreground bg-background overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${(askedCount / HUB_QA.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={autoPlay}
            disabled={autoPlaying || askedCount === HUB_QA.length}
            className="brutal-border brutal-shadow-primary bg-primary text-black font-bold py-2.5 px-5 text-sm uppercase tracking-widest flex items-center gap-2 disabled:opacity-40"
          >
            <Play size={15} fill="black" /> {autoPlaying ? "Playing…" : "Watch it work"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="brutal-border brutal-shadow bg-transparent text-foreground font-bold py-2.5 px-5 text-sm uppercase tracking-widest flex items-center gap-2"
          >
            <RotateCcw size={15} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function HubLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      <NavBar />

      {/* HERO — split screen (same comic-book header as variant 1) */}
      <section className="pt-20 min-h-screen flex flex-col md:flex-row">
        <div className="relative w-full md:w-1/2 min-h-[50vh] md:min-h-screen overflow-hidden">
          <img
            src={HERO_IMG}
            alt="Chapter One — Survivor community rising"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute top-6 left-6 bg-white text-black border-4 border-black p-3 max-w-[200px] brutal-shadow">
            <p className="font-bold text-xs uppercase leading-tight">CHAPTER ONE:</p>
            <p className="text-xs leading-tight mt-1">The people around us changed. And we survived.</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background hidden md:block" />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-12 lg:px-16 py-16 bg-background relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 right-0 w-[40vw] h-[40vw] rounded-full bg-primary/15 blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] rounded-full bg-secondary/15 blur-[80px]" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 max-w-2xl"
          >
            <div className="inline-block border-4 border-accent bg-accent/10 text-accent font-bold px-4 py-2 uppercase tracking-widest mb-8 brutal-shadow text-sm">
              World's First Psyop-Free TI Economy
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display leading-[0.88] uppercase text-white mb-6 md:mb-8">
              The Next<br />
              <span className="text-primary">Shield</span><br />
              In Your<br />
              Corner.
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl mb-8 md:mb-10 leading-relaxed">
              Not a charity. Not a support group. A circular economy that turns survivors into active participants in a 300B opportunity — built from the ground up with {FEATURES.length} features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <a
                href={APP_URL}
                className="brutal-border brutal-shadow-primary brutal-shadow-hover bg-primary text-black font-bold py-4 px-8 text-lg uppercase tracking-widest text-center flex items-center justify-center gap-3"
              >
                Claim Your Access <ArrowRight strokeWidth={3} size={20} />
              </a>
              {/* Hidden per request — preserved, not deleted.
              <Link
                href="/demos"
                className="brutal-border brutal-shadow brutal-shadow-hover bg-transparent text-foreground font-bold py-4 px-8 text-lg uppercase tracking-widest text-center flex items-center justify-center gap-3"
              >
                See All {FEATURES.length} Apps
              </Link>
              */}
            </div>
            <div className="mb-6">
              <ServiceCreditsBounty />
            </div>
            <div className="flex flex-wrap gap-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-2"><span className="text-primary">✓</span> Reviewed One at a Time</span>
              <span className="flex items-center gap-2"><span className="text-primary">✓</span> WCAG 2.2 AA</span>
              <span className="flex items-center gap-2"><span className="text-primary">✓</span> 5M Survivors</span>
            </div>
          </motion.div>
        </div>
      </section>

      <StatMarquee stats={["5M Survivors", "300B Economy", "127 Countries", "Free to join", "Reviewed One at a Time"]} />

      {/* The Arsenal — replaced with the hub chat as the single focal point */}
      <section className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-14"
        >
          <div className="inline-block border-4 border-primary bg-primary/10 text-primary font-bold px-4 py-2 uppercase tracking-widest mb-6 brutal-shadow text-sm">
            The Arsenal
          </div>
          <h2 className="text-5xl md:text-6xl font-display uppercase mb-6 leading-[0.9]">
            Just<br /><span className="text-secondary">Ask.</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            However you'd say it out loud — type it. Whatever you're facing, you get something you can act on, right now. No menus to learn. No choosing where to start. You just talk.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <AskHubDemo />
        </motion.div>
      </section>

      {/* Look Ma teaser — kept from variant 1 (plain-language inspiration for what to ask) */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-card/40 border-y-4 border-foreground">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          <div className="max-w-2xl">
            <div className="inline-block border-4 border-accent bg-accent/10 text-accent font-bold px-4 py-2 uppercase tracking-widest mb-6 brutal-shadow text-sm">
              You Know The Patterns
            </div>
            <h2 className="text-5xl md:text-6xl font-display uppercase mb-6 leading-[0.9]">
              <span className="text-accent">Look Ma,</span><br />I Fixed It!
            </h2>
            <p className="text-xl text-muted-foreground mb-4 leading-relaxed">
              50+ real problems survivors experience — strange cars, workplace sabotage, new antennas on your block, dogs being commanded to bark at you. You've noticed. We've built the answer for every single one.
            </p>
            <p className="text-lg font-bold text-foreground/80">
              Click each problem. See exactly which feature of the app solves it.
            </p>
          </div>
          <Link
            href="/look-ma"
            className="w-full lg:w-auto flex-shrink-0 brutal-border brutal-shadow-accent brutal-shadow-hover bg-accent text-black font-bold py-4 px-8 text-lg uppercase tracking-widest flex items-center justify-center gap-3"
          >
            See All 50+ Fixes <ArrowRight strokeWidth={3} size={20} />
          </Link>
        </div>
      </section>

      {/* Final CTA — kept from variant 1 */}
      <section className="py-32 px-6 md:px-12 bg-primary border-t-4 border-foreground text-black text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-display uppercase mb-6 md:mb-8 leading-[0.9]">
            Stop Surviving.<br />Start Thriving.
          </h2>
          <p className="text-lg md:text-2xl font-bold mb-8 md:mb-12 max-w-2xl mx-auto">
            The platform is live. The community is waiting. You've already fought the hard battles — now it's time to build.
          </p>
          <a
            href={APP_URL}
            className="inline-flex items-center gap-3 border-4 border-black bg-white text-black font-bold py-4 px-8 md:py-6 md:px-12 text-lg md:text-2xl uppercase tracking-widest hover:bg-black hover:text-white transition-colors brutal-shadow"
          >
            Enter The App <ArrowRight strokeWidth={3} size={22} />
          </a>
          <div className="mt-6">
            <a
              href={ANDROID_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-black/40 text-black/70 font-bold py-2 px-5 text-sm uppercase tracking-widest hover:border-black hover:text-black transition-colors"
            >
              <Download size={15} strokeWidth={2.5} /> Download for Android (APK)
            </a>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 2px, transparent 2px)", backgroundSize: "30px 30px" }} />
      </section>

      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HubLandingPage} />
      <Route path="/classic" component={LandingPage} />
      <Route path="/commons" component={HubLandingPage} />
      <Route path="/chat" component={ChatLandingPage} />
      <Route path="/demos" component={DemosPage} />
      <Route path="/look-ma" component={LookMaPage} />
      <Route path="/schemes" component={SchemesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
