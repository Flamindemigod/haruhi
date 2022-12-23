"use client";

import _ from "lodash";
import React, { Fragment, useContext, useState } from "react";
import { userContext } from "../../../../app/UserContext";
import Checkbox from "../../../../primitives/Checkbox";
import Drawer from "../../../../primitives/Drawer";
import Select from "../../../../primitives/SelectBetter";
import Slider from "../../../../primitives/Slider";
import ThreeToggleChip from "../../../../primitives/ThreeToggleChip";

type Tag = {
  name: string;
  category: string;
  description: string;
  isAdult: boolean;
};

const MediaTags: Tag[] = [
  {
    name: "4-koma",
    category: "Technical",
    description:
      "A manga in the 'yonkoma' format, which consists of four equal-sized panels arranged in a vertical strip.",
    isAdult: false,
  },
  {
    name: "Achromatic",
    category: "Technical",
    description: "Contains animation that is primarily done in black and white",
    isAdult: false,
  },
  {
    name: "Achronological Order",
    category: "Setting-Time",
    description: "Chapters or episodes do not occur in chronological order.",
    isAdult: false,
  },
  {
    name: "Acting",
    category: "Theme-Arts",
    description: "Centers around actors or the acting industry.",
    isAdult: false,
  },
  {
    name: "Adoption",
    category: "Theme-Other",
    description:
      "Features a character who has been adopted by someone who is neither of their biological parents.",
    isAdult: false,
  },
  {
    name: "Advertisement",
    category: "Technical",
    description:
      "Produced in order to promote the products of a certain company.",
    isAdult: false,
  },
  {
    name: "Afterlife",
    category: "Setting-Universe",
    description: "Partly or completely set in the afterlife.",
    isAdult: false,
  },
  {
    name: "Age Gap",
    category: "Theme-Romance",
    description:
      "Prominently features romantic relations between people with a significant age difference.",
    isAdult: false,
  },
  {
    name: "Age Regression",
    category: "Cast-Traits",
    description:
      "Prominently features a character who was returned to a younger state.",
    isAdult: false,
  },
  {
    name: "Agender",
    category: "Cast-Traits",
    description: "Prominently features agender characters.",
    isAdult: false,
  },
  {
    name: "Agriculture",
    category: "Theme-Slice of Life",
    description: "Prominently features agriculture practices.",
    isAdult: false,
  },
  {
    name: "Ahegao",
    category: "Sexual Content",
    description: "Features a character making an exaggerated orgasm face.",
    isAdult: true,
  },
  {
    name: "Airsoft",
    category: "Theme-Game-Sport",
    description: "Centers around the sport of airsoft.",
    isAdult: false,
  },
  {
    name: "Alchemy",
    category: "Theme-Fantasy",
    description: "Features character(s) who practice alchemy. ",
    isAdult: false,
  },
  {
    name: "Aliens",
    category: "Cast-Traits",
    description: "Prominently features extraterrestrial lifeforms.",
    isAdult: false,
  },
  {
    name: "Alternate Universe",
    category: "Setting-Universe",
    description: "Features multiple alternate universes in the same series.",
    isAdult: false,
  },
  {
    name: "American Football",
    category: "Theme-Game-Sport",
    description: "Centers around the sport of American football.",
    isAdult: false,
  },
  {
    name: "Amnesia",
    category: "Cast-Traits",
    description: "Prominently features a character(s) with memory loss.",
    isAdult: false,
  },
  {
    name: "Amputation",
    category: "Sexual Content",
    description: "Features amputation or amputees.",
    isAdult: true,
  },
  {
    name: "Anachronism",
    category: "Setting-Time",
    description:
      "Prominently features elements that are out of place in the historical period the work takes place in, particularly modern elements in a historical setting.",
    isAdult: false,
  },
  {
    name: "Anal Sex",
    category: "Sexual Content",
    description: "Features sexual penetration of the anal cavity.",
    isAdult: true,
  },
  {
    name: "Angels",
    category: "Cast-Traits",
    description:
      "Prominently features spiritual beings usually represented with wings and halos and believed to be attendants of God.",
    isAdult: false,
  },
  {
    name: "Animals",
    category: "Theme-Other",
    description: "Prominently features animal characters in a leading role.",
    isAdult: false,
  },
  {
    name: "Anthology",
    category: "Technical",
    description:
      "A collection of separate works collated into a single release.",
    isAdult: false,
  },
  {
    name: "Anthropomorphism",
    category: "Cast-Traits",
    description:
      "Contains non-human character(s) that have attributes or characteristics of a human being.",
    isAdult: false,
  },
  {
    name: "Anti-Hero",
    category: "Cast-Main Cast",
    description:
      "Features a protagonist who lacks conventional heroic attributes and may be considered a borderline villain.",
    isAdult: false,
  },
  {
    name: "Archery",
    category: "Theme-Action",
    description:
      "Centers around the sport of archery, or prominently features the use of archery in combat.",
    isAdult: false,
  },
  {
    name: "Armpits",
    category: "Sexual Content",
    description:
      "Features the sexual depiction or stimulation of a character's armpits.",
    isAdult: true,
  },
  {
    name: "Artificial Intelligence",
    category: "Cast-Traits",
    description:
      "Intelligent non-organic machines that work and react similarly to humans.",
    isAdult: false,
  },
  {
    name: "Asexual",
    category: "Cast-Traits",
    description:
      "Features a character who isn't sexually attracted to people of any sex or gender.",
    isAdult: false,
  },
  {
    name: "Ashikoki",
    category: "Sexual Content",
    description: "Footjob; features stimulation of genitalia by feet.",
    isAdult: true,
  },
  {
    name: "Asphyxiation",
    category: "Sexual Content",
    description: "Features breath play. ",
    isAdult: true,
  },
  {
    name: "Assassins",
    category: "Theme-Other-Organisations",
    description: "Centers around characters who murder people as a profession.",
    isAdult: false,
  },
  {
    name: "Astronomy",
    category: "Theme-Other",
    description:
      "Relating or centered around the study of celestial objects and phenomena, space, or the universe.",
    isAdult: false,
  },
  {
    name: "Athletics",
    category: "Theme-Game-Sport",
    description:
      "Centers around sporting events that involve competitive running, jumping, throwing, or walking.",
    isAdult: false,
  },
  {
    name: "Augmented Reality",
    category: "Setting-Universe",
    description:
      "Prominently features events with augmented reality as the main setting.",
    isAdult: false,
  },
  {
    name: "Autobiographical",
    category: "Theme-Other",
    description:
      "Real stories and anecdotes written by the author about their own life.",
    isAdult: false,
  },
  {
    name: "Aviation",
    category: "Theme-Other-Vehicle",
    description: "Regarding the flying or operation of aircraft.",
    isAdult: false,
  },
  {
    name: "Badminton",
    category: "Theme-Game-Sport",
    description: "Centers around the sport of badminton.",
    isAdult: false,
  },
  {
    name: "Band",
    category: "Theme-Arts-Music",
    description: "Main cast is a group of musicians.",
    isAdult: false,
  },
  {
    name: "Bar",
    category: "Setting-Scene",
    description: "Partly or completely set in a bar.",
    isAdult: false,
  },
  {
    name: "Baseball",
    category: "Theme-Game-Sport",
    description: "Centers around the sport of baseball.",
    isAdult: false,
  },
  {
    name: "Basketball",
    category: "Theme-Game-Sport",
    description: "Centers around the sport of basketball.",
    isAdult: false,
  },
  {
    name: "Battle Royale",
    category: "Theme-Action",
    description:
      "Centers around a fierce group competition, often violent and with only one winner.",
    isAdult: false,
  },
  {
    name: "Biographical",
    category: "Theme-Other",
    description:
      "Based on true stories of real persons living or dead, written by another.",
    isAdult: false,
  },
  {
    name: "Bisexual",
    category: "Theme-Romance",
    description:
      "Features a character who is romantically or sexually attracted to people of more than one sex or gender.",
    isAdult: false,
  },
  {
    name: "Blackmail",
    category: "Sexual Content",
    description:
      "Features a character blackmailing another into performing sexual acts.",
    isAdult: true,
  },
  {
    name: "Body Horror",
    category: "Theme-Other",
    description:
      "Features characters who undergo horrific transformations or disfigurement, often to their own detriment.",
    isAdult: false,
  },
  {
    name: "Body Swapping",
    category: "Theme-Fantasy",
    description: "Centers around individuals swapping bodies with one another.",
    isAdult: false,
  },
  {
    name: "Bondage",
    category: "Sexual Content",
    description: "Features BDSM, with or without the use of accessories.",
    isAdult: true,
  },
  {
    name: "Boobjob",
    category: "Sexual Content",
    description: "Features the stimulation of male genitalia by breasts.",
    isAdult: true,
  },
  {
    name: "Boxing",
    category: "Theme-Game-Sport",
    description: "Centers around the sport of boxing.",
    isAdult: false,
  },
  {
    name: "Boys' Love",
    category: "Theme-Romance",
    description:
      "Prominently features romance between two males, not inherently sexual.",
    isAdult: false,
  },
  {
    name: "Bullying",
    category: "Theme-Drama",
    description:
      "Prominently features the use of force for intimidation, often in a school setting.",
    isAdult: false,
  },
  {
    name: "Butler",
    category: "Cast-Traits",
    description: "Prominently features a character who is a butler.",
    isAdult: false,
  },
  {
    name: "Calligraphy",
    category: "Theme-Arts",
    description: "Centers around the art of calligraphy.",
    isAdult: false,
  },
  {
    name: "Cannibalism",
    category: "Theme-Other",
    description:
      "Prominently features the act of consuming another member of the same species as food.",
    isAdult: false,
  },
  {
    name: "Card Battle",
    category: "Theme-Game-Card & Board Game",
    description: "Centers around individuals competing in card games.",
    isAdult: false,
  },
  {
    name: "Cars",
    category: "Theme-Other-Vehicle",
    description: "Centers around the use of automotive vehicles.",
    isAdult: false,
  },
  {
    name: "Centaur",
    category: "Cast-Traits",
    description:
      "Prominently features a character with a human upper body and the lower body of a horse.",
    isAdult: false,
  },
  {
    name: "CGI",
    category: "Technical",
    description:
      "Prominently features scenes created with computer-generated imagery.",
    isAdult: false,
  },
  {
    name: "Cheerleading",
    category: "Theme-Game-Sport",
    description: "Centers around the activity of cheerleading. ",
    isAdult: false,
  },
  {
    name: "Chibi",
    category: "Theme-Other",
    description:
      'Features "super deformed" character designs with smaller, rounder proportions and a cute look.',
    isAdult: false,
  },
  {
    name: "Chimera",
    category: "Cast-Traits",
    description:
      "Features a beast made by combining animals, usually with humans",
    isAdult: false,
  },
  {
    name: "Chuunibyou",
    category: "Cast-Traits",
    description:
      'Prominently features a character with "Middle School 2nd Year Syndrome", who either acts like a know-it-all adult or falsely believes they have special powers.',
    isAdult: false,
  },
  {
    name: "Circus",
    category: "Setting-Scene",
    description: "Prominently features a circus.",
    isAdult: false,
  },
  {
    name: "Classic Literature",
    category: "Theme-Arts",
    description: "Discusses or adapts a work of classic world literature.",
    isAdult: false,
  },
  {
    name: "Clone",
    category: "Cast-Traits",
    description:
      "Prominently features a character who is an artificial exact copy of another organism",
    isAdult: false,
  },
  {
    name: "College",
    category: "Setting-Scene",
    description: "Partly or completely set in a college or university.",
    isAdult: false,
  },
  {
    name: "Coming of Age",
    category: "Theme-Drama",
    description:
      "Centers around a character's transition from childhood to adulthood.",
    isAdult: false,
  },
  {
    name: "Conspiracy",
    category: "Theme-Drama",
    description:
      "Contains one or more factions controlling or attempting to control the world from the shadows.",
    isAdult: false,
  },
  {
    name: "Cosmic Horror",
    category: "Theme-Other",
    description:
      "A type of horror that emphasizes human insignificance in the grand scope of cosmic reality; fearing the unknown and being powerless to fight it.",
    isAdult: false,
  },
  {
    name: "Cosplay",
    category: "Cast-Traits",
    description: "Features dressing up as a different character or profession.",
    isAdult: false,
  },
  {
    name: "Crime",
    category: "Theme-Other",
    description:
      "Centers around unlawful activities punishable by the state or other authority.",
    isAdult: false,
  },
  {
    name: "Crossdressing",
    category: "Cast-Traits",
    description:
      "Prominently features a character dressing up as the opposite sex.",
    isAdult: false,
  },
  {
    name: "Crossover",
    category: "Theme-Other",
    description:
      "Centers around the placement of two or more otherwise discrete fictional characters, settings, or universes into the context of a single story.",
    isAdult: false,
  },
  {
    name: "Cult",
    category: "Theme-Other-Organisations",
    description:
      "Features a social group with unorthodox religious, spiritual, or philosophical beliefs and practices.",
    isAdult: false,
  },
  {
    name: "Cultivation",
    category: "Theme-Fantasy",
    description:
      "Features characters using training, often martial arts-related, and other special methods to cultivate life force and gain strength or immortality.",
    isAdult: false,
  },
  {
    name: "Cumflation",
    category: "Sexual Content",
    description:
      "The stomach area expands outward like a balloon due to being filled specifically with semen.",
    isAdult: true,
  },
  {
    name: "Cunnilingus",
    category: "Sexual Content",
    description: "Features oral sex performed on female genitalia.",
    isAdult: true,
  },
  {
    name: "Cute Boys Doing Cute Things",
    category: "Theme-Slice of Life",
    description:
      "Centers around male characters doing cute activities, usually with little to no emphasis on drama and conflict.",
    isAdult: false,
  },
  {
    name: "Cute Girls Doing Cute Things",
    category: "Theme-Slice of Life",
    description:
      "Centers around female characters doing cute activities, usually with little to no emphasis on drama and conflict.\n",
    isAdult: false,
  },
  {
    name: "Cyberpunk",
    category: "Theme-Sci-Fi",
    description:
      "Set in a future of advanced technological and scientific achievements that have resulted in social disorder.",
    isAdult: false,
  },
  {
    name: "Cyborg",
    category: "Cast-Traits",
    description:
      "Prominently features a human character whose physiological functions are aided or enhanced by artificial means.",
    isAdult: false,
  },
  {
    name: "Cycling",
    category: "Theme-Game-Sport",
    description: "Centers around the sport of cycling.",
    isAdult: false,
  },
  {
    name: "Dancing",
    category: "Theme-Arts-Music",
    description: "Centers around the art of dance.",
    isAdult: false,
  },
  {
    name: "Death Game",
    category: "Theme-Other",
    description:
      "Features characters participating in a game, where failure results in death.",
    isAdult: false,
  },
  {
    name: "Deepthroat",
    category: "Sexual Content",
    description:
      "Features oral sex where the majority of the erect male genitalia is inside another person's mouth, usually stimulating some gagging in the back of their throat.",
    isAdult: true,
  },
  {
    name: "Defloration",
    category: "Sexual Content",
    description:
      "Features a female character who has never had sexual relations (until now).",
    isAdult: true,
  },
  {
    name: "Delinquents",
    category: "Cast-Traits",
    description:
      'Features characters with a notorious image and attitude, sometimes referred to as "yankees".',
    isAdult: false,
  },
  {
    name: "Demons",
    category: "Cast-Traits",
    description: "Prominently features malevolent otherworldly creatures.",
    isAdult: false,
  },
  {
    name: "Denpa",
    category: "Theme-Other",
    description:
      "Works that feature themes of social dissociation, delusions, and other issues like suicide, bullying, self-isolation, paranoia, and technological necessity in daily lives. Classic iconography: telephone poles, rooftops, and trains.",
    isAdult: false,
  },
  {
    name: "Detective",
    category: "Cast-Traits",
    description: "Features a character who investigates and solves crimes.",
    isAdult: false,
  },
  {
    name: "DILF",
    category: "Sexual Content",
    description: "Features sexual intercourse with older men.",
    isAdult: true,
  },
  {
    name: "Dinosaurs",
    category: "Cast-Traits",
    description:
      "Prominently features Dinosaurs, prehistoric reptiles that went extinct millions of years ago.",
    isAdult: false,
  },
  {
    name: "Disability",
    category: "Cast-Traits",
    description:
      "A work that features one or more characters with a physical, mental, cognitive, or developmental condition that impairs, interferes with, or limits the person's ability to engage in certain tasks or actions.",
    isAdult: false,
  },
  {
    name: "Dissociative Identities",
    category: "Cast-Traits",
    description: "A case where one or more people share the same body.",
    isAdult: false,
  },
  {
    name: "Dragons",
    category: "Cast-Traits",
    description:
      "Prominently features mythical reptiles which generally have wings and can breathe fire.",
    isAdult: false,
  },
  {
    name: "Drawing",
    category: "Theme-Arts",
    description:
      "Centers around the art of drawing, including manga and doujinshi.",
    isAdult: false,
  },
  {
    name: "Drugs",
    category: "Theme-Other",
    description:
      "Prominently features the usage of drugs such as opioids, stimulants, hallucinogens etc.",
    isAdult: false,
  },
  {
    name: "Dullahan",
    category: "Cast-Traits",
    description:
      "Prominently features a character who is a Dullahan, a creature from Irish Folklore with a head that can be detached from its main body.",
    isAdult: false,
  },
  {
    name: "Dungeon",
    category: "Setting-Scene",
    description: "Prominently features a dungeon environment. ",
    isAdult: false,
  },
  {
    name: "Dystopian",
    category: "Setting-Time",
    description:
      "Partly or completely set in a society characterized by poverty, squalor or oppression",
    isAdult: false,
  },
  {
    name: "E-Sports",
    category: "Theme-Game",
    description:
      "Prominently features professional video game competitions, tournaments, players, etc.",
    isAdult: false,
  },
  {
    name: "Economics",
    category: "Theme-Other",
    description: "Centers around the field of economics.",
    isAdult: false,
  },
  {
    name: "Educational",
    category: "Theme-Other",
    description: "Primary aim is to educate the audience.",
    isAdult: false,
  },
  {
    name: "Elf",
    category: "Cast-Traits",
    description: "Prominently features a character who is an elf.",
    isAdult: false,
  },
  {
    name: "Ensemble Cast",
    category: "Cast-Main Cast",
    description:
      "Features a large cast of characters with (almost) equal screen time and importance to the plot.",
    isAdult: false,
  },
  {
    name: "Environmental",
    category: "Theme-Other",
    description:
      "Concern with the state of the natural world and how humans interact with it.",
    isAdult: false,
  },
  {
    name: "Episodic",
    category: "Technical",
    description:
      "Features story arcs that are loosely tied or lack an overarching plot.",
    isAdult: false,
  },
  {
    name: "Ero Guro",
    category: "Theme-Other",
    description:
      "Japanese literary and artistic movement originating in the 1930's. Works have a focus on grotesque eroticism, sexual corruption, and decadence.",
    isAdult: false,
  },
  {
    name: "Espionage",
    category: "Theme-Action",
    description:
      "Prominently features characters infiltrating an organization in order to steal sensitive information.",
    isAdult: false,
  },
  {
    name: "Exhibitionism",
    category: "Sexual Content",
    description:
      "Features the act of exposing oneself in public for sexual pleasure.",
    isAdult: true,
  },
  {
    name: "Facial",
    category: "Sexual Content",
    description: "Features sexual ejaculation onto an individual's face.",
    isAdult: true,
  },
  {
    name: "Fairy Tale",
    category: "Theme-Fantasy",
    description:
      "This work tells a fairy tale, centers around fairy tales, or is based on a classic fairy tale.",
    isAdult: false,
  },
  {
    name: "Family Life",
    category: "Theme-Slice of Life",
    description: "Centers around the activities of a family unit.",
    isAdult: false,
  },
  {
    name: "Fashion",
    category: "Theme-Arts",
    description: "Centers around the fashion industry.",
    isAdult: false,
  },
  {
    name: "Feet",
    category: "Sexual Content",
    description:
      "Features the sexual depiction or stimulation of a character's feet.",
    isAdult: true,
  },
  {
    name: "Fellatio",
    category: "Sexual Content",
    description: "Blowjob; features oral sex performed on male genitalia.",
    isAdult: true,
  },
  {
    name: "Female Harem",
    category: "Theme-Romance",
    description:
      "Main cast features the protagonist plus several female characters who are romantically interested in them.",
    isAdult: false,
  },
  {
    name: "Female Protagonist",
    category: "Cast-Main Cast",
    description: "Main character is female.",
    isAdult: false,
  },
  {
    name: "Femdom",
    category: "Sexual Content",
    description:
      "Female Dominance. Features sexual acts with a woman in a dominant position.",
    isAdult: true,
  },
  {
    name: "Fencing",
    category: "Theme-Game-Sport",
    description: "Centers around the sport of fencing.",
    isAdult: false,
  },
  {
    name: "Firefighters",
    category: "Theme-Other-Organisations",
    description:
      "Centered around the life and activities of rescuers specialised in firefighting. ",
    isAdult: false,
  },
  {
    name: "Fishing",
    category: "Theme-Game-Sport",
    description: "Centers around the sport of fishing.",
    isAdult: false,
  },
  {
    name: "Fitness",
    category: "Theme-Game-Sport",
    description:
      "Centers around exercise with the aim of improving physical health.",
    isAdult: false,
  },
  {
    name: "Flash",
    category: "Technical",
    description: "Created using Flash animation techniques.",
    isAdult: false,
  },
  {
    name: "Flat Chest",
    category: "Sexual Content",
    description:
      "Features a female character with smaller-than-average breasts.",
    isAdult: true,
  },
  {
    name: "Food",
    category: "Theme-Arts",
    description: "Centers around cooking or food appraisal.",
    isAdult: false,
  },
  {
    name: "Football",
    category: "Theme-Game-Sport",
    description:
      'Centers around the sport of football (known in the USA as "soccer").',
    isAdult: false,
  },
  {
    name: "Foreign",
    category: "Setting-Scene",
    description:
      "Partly or completely set in a country outside the country of origin. ",
    isAdult: false,
  },
  {
    name: "Found Family",
    category: "Theme-Other",
    description:
      "Features a group of characters with no biological relations that are united in a group providing social support.",
    isAdult: false,
  },
  {
    name: "Fugitive",
    category: "Theme-Action",
    description:
      "Prominently features a character evading capture by an individual or organization.",
    isAdult: false,
  },
  {
    name: "Full CGI",
    category: "Technical",
    description: "Almost entirely created with computer-generated imagery.",
    isAdult: false,
  },
  {
    name: "Full Color",
    category: "Technical",
    description: "Manga fully colored or drawn in color.",
    isAdult: false,
  },
  {
    name: "Futanari",
    category: "Sexual Content",
    description: "Features female characters with male genitalia.",
    isAdult: true,
  },
  {
    name: "Gambling",
    category: "Theme-Other",
    description: "Centers around the act of gambling.",
    isAdult: false,
  },
  {
    name: "Gangs",
    category: "Theme-Other-Organisations",
    description: "Centers around gang organizations.",
    isAdult: false,
  },
  {
    name: "Gender Bending",
    category: "Theme-Other",
    description:
      "Prominently features a character who dresses and behaves in a way characteristic of another gender, or has been transformed into a person of another gender.",
    isAdult: false,
  },
  {
    name: "Ghost",
    category: "Cast-Traits",
    description: "Prominently features a character who is a ghost.",
    isAdult: false,
  },
  {
    name: "Go",
    category: "Theme-Game-Card & Board Game",
    description: "Centered around the game of Go.",
    isAdult: false,
  },
  {
    name: "Goblin",
    category: "Cast-Traits",
    description:
      "A goblin is a monstrous creature from European folklore. They are almost always small and grotesque, mischievous or outright malicious, and greedy. Sometimes with magical abilities.",
    isAdult: false,
  },
  {
    name: "Gods",
    category: "Cast-Traits",
    description:
      "Prominently features a character of divine or religious nature.",
    isAdult: false,
  },
  {
    name: "Golf",
    category: "Theme-Game-Sport",
    description: "Centers around the sport of golf.",
    isAdult: false,
  },
  {
    name: "Gore",
    category: "Theme-Other",
    description: "Prominently features graphic bloodshed and violence.",
    isAdult: false,
  },
  {
    name: "Group Sex",
    category: "Sexual Content",
    description:
      "Features more than two participants engaged in sex simultaneously.",
    isAdult: true,
  },
  {
    name: "Guns",
    category: "Theme-Action",
    description: "Prominently features the use of guns in combat.",
    isAdult: false,
  },
  {
    name: "Gyaru",
    category: "Cast-Traits",
    description:
      "Prominently features a female character who has a distinct American-emulated fashion style, such as tanned skin, bleached hair, and excessive makeup. Also known as gal.",
    isAdult: false,
  },
  {
    name: "Handball",
    category: "Theme-Game-Sport",
    description: "Centers around the sport of handball.",
    isAdult: false,
  },
  {
    name: "Handjob",
    category: "Sexual Content",
    description: "Features the stimulation of genitalia by another's hands.",
    isAdult: true,
  },
  {
    name: "Henshin",
    category: "Theme-Fantasy",
    description:
      "Prominently features character or costume transformations which often grant special abilities.",
    isAdult: false,
  },
  {
    name: "Heterosexual",
    category: "Theme-Romance",
    description:
      "Prominently features a romance between a man and a woman, not inherently sexual.",
    isAdult: false,
  },
  {
    name: "Hikikomori",
    category: "Cast-Traits",
    description:
      "Prominently features a character who withdraws from social life, often seeking extreme isolation.",
    isAdult: false,
  },
  {
    name: "Historical",
    category: "Setting-Time",
    description:
      "Partly or completely set during a real period of world history.",
    isAdult: false,
  },
  {
    name: "Homeless",
    category: "Cast-Traits",
    description: "Prominently features a character that is homeless.",
    isAdult: false,
  },
  {
    name: "Human Pet",
    category: "Sexual Content",
    description:
      'Features characters in a master-slave relationship where one is the "owner" and the other is a "pet."',
    isAdult: true,
  },
  {
    name: "Hypersexuality",
    category: "Sexual Content",
    description:
      "Portrays a character with a hypersexuality disorder, compulsive sexual behavior, or sex addiction.",
    isAdult: true,
  },
  {
    name: "Ice Skating",
    category: "Theme-Game-Sport",
    description: "Centers around the sport of ice skating.",
    isAdult: false,
  },
  {
    name: "Idol",
    category: "Cast-Traits",
    description: "Centers around the life and activities of an idol.",
    isAdult: false,
  },
  {
    name: "Incest",
    category: "Sexual Content",
    description:
      "Features sexual relations between characters who are related by blood.",
    isAdult: true,
  },
  {
    name: "Inseki",
    category: "Sexual Content",
    description:
      "Features sexual relations among step, adopted, and other non-blood related family members.",
    isAdult: true,
  },
  {
    name: "Irrumatio",
    category: "Sexual Content",
    description:
      "Oral rape; features a character thrusting their genitalia or a phallic object into the mouth of another character.",
    isAdult: true,
  },
  {
    name: "Isekai",
    category: "Theme-Fantasy",
    description:
      "Features characters being transported into an alternate world setting and having to adapt to their new surroundings.",
    isAdult: false,
  },
  {
    name: "Iyashikei",
    category: "Theme-Slice of Life",
    description:
      "Primary aim is to heal the audience through serene depictions of characters' daily lives.",
    isAdult: false,
  },
  {
    name: "Josei",
    category: "Demographic",
    description: "Target demographic is adult females.",
    isAdult: false,
  },
  {
    name: "Judo",
    category: "Theme-Game-Sport",
    description: "Centers around the sport of judo. ",
    isAdult: false,
  },
  {
    name: "Kaiju",
    category: "Theme-Fantasy",
    description: "Prominently features giant monsters.",
    isAdult: false,
  },
  {
    name: "Karuta",
    category: "Theme-Game-Card & Board Game",
    description: "Centers around the game of karuta.",
    isAdult: false,
  },
  {
    name: "Kemonomimi",
    category: "Cast-Traits",
    description: "Prominently features humanoid characters with animal ears.",
    isAdult: false,
  },
  {
    name: "Kids",
    category: "Demographic",
    description: "Target demographic is young children.",
    isAdult: false,
  },
  {
    name: "Kuudere",
    category: "Cast-Traits",
    description:
      "Prominently features a character who generally retains a cold, blunt and cynical exterior, but once one gets to know them, they have a very warm and loving interior.",
    isAdult: false,
  },
  {
    name: "Lacrosse",
    category: "Theme-Game-Sport",
    description: "A team game played with a ball and lacrosse sticks.",
    isAdult: false,
  },
  {
    name: "Lactation",
    category: "Sexual Content",
    description: "Features breast milk play and production.",
    isAdult: true,
  },
  {
    name: "Language Barrier",
    category: "Setting-Scene",
    description:
      "A barrier to communication between people who are unable to speak a common language.",
    isAdult: false,
  },
  {
    name: "Large Breasts",
    category: "Sexual Content",
    description: "Features a character with larger-than-average breasts.",
    isAdult: true,
  },
  {
    name: "LGBTQ+ Themes",
    category: "Theme-Other",
    description:
      "Prominently features characters or themes associated with the LGBTQ+ community, such as sexuality or gender identity.",
    isAdult: false,
  },
  {
    name: "Lost Civilization",
    category: "Theme-Other",
    description:
      "Featuring a civilization with few ruins or records that exist in present day knowledge.",
    isAdult: false,
  },
  {
    name: "Love Triangle",
    category: "Theme-Romance",
    description:
      "Centered around romantic feelings between more than two people. Includes all love polygons.",
    isAdult: false,
  },
  {
    name: "Mafia",
    category: "Theme-Other-Organisations",
    description: "Centered around Italian organised crime syndicates.",
    isAdult: false,
  },
  {
    name: "Magic",
    category: "Theme-Fantasy",
    description: "Prominently features magical elements or the use of magic.",
    isAdult: false,
  },
  {
    name: "Mahjong",
    category: "Theme-Game-Card & Board Game",
    description: "Centered around the game of mahjong.",
    isAdult: false,
  },
  {
    name: "Maids",
    category: "Cast-Traits",
    description: "Prominently features a character who is a maid.",
    isAdult: false,
  },
  {
    name: "Makeup",
    category: "Theme-Arts",
    description: "Centers around the makeup industry.",
    isAdult: false,
  },
  {
    name: "Male Harem",
    category: "Theme-Romance",
    description:
      "Main cast features the protagonist plus several male characters who are romantically interested in them.",
    isAdult: false,
  },
  {
    name: "Male Protagonist",
    category: "Cast-Main Cast",
    description: "Main character is male.",
    isAdult: false,
  },
  {
    name: "Martial Arts",
    category: "Theme-Action",
    description: "Centers around the use of traditional hand-to-hand combat.",
    isAdult: false,
  },
  {
    name: "Masochism",
    category: "Sexual Content",
    description:
      "Prominently features characters who get sexual pleasure from being hurt or controlled by others.",
    isAdult: true,
  },
  {
    name: "Masturbation",
    category: "Sexual Content",
    description:
      "Features erotic stimulation of one's own genitalia or other erogenous regions.",
    isAdult: true,
  },
  {
    name: "Medicine",
    category: "Theme-Other",
    description:
      "Centered around the activities of people working in the field of medicine.",
    isAdult: false,
  },
  {
    name: "Memory Manipulation",
    category: "Theme-Other",
    description:
      "Prominently features a character(s) who has had their memories altered.",
    isAdult: false,
  },
  {
    name: "Mermaid",
    category: "Cast-Traits",
    description:
      "A mythological creature with the body of a human and the tail of a fish",
    isAdult: false,
  },
  {
    name: "Meta",
    category: "Theme-Other",
    description:
      "Features fourth wall-breaking references to itself or genre tropes.",
    isAdult: false,
  },
  {
    name: "MILF",
    category: "Sexual Content",
    description: "Features sexual intercourse with older women.",
    isAdult: true,
  },
  {
    name: "Military",
    category: "Theme-Other-Organisations",
    description:
      "Centered around the life and activities of military personnel.",
    isAdult: false,
  },
  {
    name: "Mixed Gender Harem",
    category: "Theme-Romance",
    description:
      "Main cast features the protagonist plus several people, regardless of gender, who are romantically interested in them.",
    isAdult: false,
  },
  {
    name: "Monster Boy",
    category: "Cast-Traits",
    description: "Prominently features a male character who is a part-monster.",
    isAdult: false,
  },
  {
    name: "Monster Girl",
    category: "Cast-Traits",
    description: "Prominently features a female character who is part-monster.",
    isAdult: false,
  },
  {
    name: "Mopeds",
    category: "Theme-Other-Vehicle",
    description: "Prominently features mopeds.",
    isAdult: false,
  },
  {
    name: "Motorcycles",
    category: "Theme-Other-Vehicle",
    description: "Prominently features the use of motorcycles.",
    isAdult: false,
  },
  {
    name: "Musical",
    category: "Theme-Arts-Music",
    description:
      "Features a performance that combines songs, spoken dialogue, acting, and dance.",
    isAdult: false,
  },
  {
    name: "Mythology",
    category: "Theme-Fantasy",
    description:
      "Prominently features mythological elements, especially those from religious or cultural tradition.",
    isAdult: false,
  },
  {
    name: "Nakadashi",
    category: "Sexual Content",
    description: "Creampie; features sexual ejaculation inside of a character.",
    isAdult: true,
  },
  {
    name: "Necromancy",
    category: "Theme-Fantasy",
    description:
      "When the dead are summoned as spirits, skeletons, or the undead, usually for the purpose of gaining information or to be used as a weapon.",
    isAdult: false,
  },
  {
    name: "Nekomimi",
    category: "Cast-Traits",
    description:
      "Humanoid characters with cat-like features such as cat ears and a tail.",
    isAdult: false,
  },
  {
    name: "Netorare",
    category: "Sexual Content",
    description:
      "NTR; features a character with a partner shown being intimate with someone else.",
    isAdult: true,
  },
  {
    name: "Netorase",
    category: "Sexual Content",
    description:
      "Features characters in a romantic relationship who agree to be sexually intimate with others.",
    isAdult: true,
  },
  {
    name: "Netori",
    category: "Sexual Content",
    description:
      "Features a character shown being intimate with the partner of another character. The opposite of netorare.",
    isAdult: true,
  },
  {
    name: "Ninja",
    category: "Cast-Traits",
    description:
      "Prominently features Japanese warriors traditionally trained in espionage, sabotage and assasination.",
    isAdult: false,
  },
  {
    name: "No Dialogue",
    category: "Technical",
    description: "This work contains no dialogue.",
    isAdult: false,
  },
  {
    name: "Noir",
    category: "Theme-Other",
    description: "Stylized as a cynical crime drama with low-key visuals.",
    isAdult: false,
  },
  {
    name: "Non-fiction",
    category: "Technical",
    description:
      "A work that provides information regarding a real world topic and does not focus on an imaginary narrative. ",
    isAdult: false,
  },
  {
    name: "Nudity",
    category: "Cast-Traits",
    description:
      "Features a character wearing no clothing or exposing intimate body parts.",
    isAdult: false,
  },
  {
    name: "Nun",
    category: "Cast-Traits",
    description: "Prominently features a character who is a nun.",
    isAdult: false,
  },
  {
    name: "Office Lady",
    category: "Cast-Traits",
    description: "Prominently features a female office worker or OL.",
    isAdult: false,
  },
  {
    name: "Oiran",
    category: "Cast-Traits",
    description:
      "Prominently features a courtesan character of the Japanese Edo Period.",
    isAdult: false,
  },
  {
    name: "Ojou-sama",
    category: "Cast-Traits",
    description:
      "Features a wealthy, high-class, oftentimes stuck up and demanding female character.",
    isAdult: false,
  },
  {
    name: "Omegaverse",
    category: "Setting-Universe",
    description:
      "Alternative universe that prominently features dynamics modeled after wolves in which there are alphas, betas, and omegas and heat cycles as well as impregnation, regardless of gender.",
    isAdult: true,
  },
  {
    name: "Orphan",
    category: "Cast-Traits",
    description: "Prominently features a character that is an orphan.",
    isAdult: false,
  },
  {
    name: "Otaku Culture",
    category: "Theme-Other",
    description: "Centers around the culture of a fanatical fan-base.",
    isAdult: false,
  },
  {
    name: "Outdoor",
    category: "Setting-Scene",
    description: "Centers around hiking, camping or other outdoor activities.",
    isAdult: false,
  },
  {
    name: "Pandemic",
    category: "Theme-Other",
    description:
      "Prominently features a disease prevalent over a whole country or the world.",
    isAdult: false,
  },
  {
    name: "Parkour",
    category: "Theme-Game-Sport",
    description: "Centers around the sport of parkour.",
    isAdult: false,
  },
  {
    name: "Parody",
    category: "Theme-Comedy",
    description:
      "Features deliberate exaggeration of popular tropes or a particular genre to comedic effect.",
    isAdult: false,
  },
  {
    name: "Philosophy",
    category: "Theme-Other",
    description:
      "Relating or devoted to the study of the fundamental nature of knowledge, reality, and existence.",
    isAdult: false,
  },
  {
    name: "Photography",
    category: "Theme-Arts",
    description: "Centers around the use of cameras to capture photos.",
    isAdult: false,
  },
  {
    name: "Pirates",
    category: "Cast-Traits",
    description:
      "Prominently features sea-faring adventurers branded as criminals by the law.",
    isAdult: false,
  },
  {
    name: "Poker",
    category: "Theme-Game-Card & Board Game",
    description: "Centers around the game of poker or its variations.",
    isAdult: false,
  },
  {
    name: "Police",
    category: "Theme-Other-Organisations",
    description:
      "Centers around the life and activities of law enforcement officers.",
    isAdult: false,
  },
  {
    name: "Politics",
    category: "Theme-Other",
    description:
      "Centers around politics, politicians, or government activities.",
    isAdult: false,
  },
  {
    name: "Post-Apocalyptic",
    category: "Setting-Universe",
    description:
      "Partly or completely set in a world or civilization after a global disaster.",
    isAdult: false,
  },
  {
    name: "POV",
    category: "Technical",
    description:
      "Point of View; features scenes shown from the perspective of the series protagonist.",
    isAdult: false,
  },
  {
    name: "Pregnant",
    category: "Sexual Content",
    description: "Features pregnant female characters in a sexual context.",
    isAdult: true,
  },
  {
    name: "Primarily Adult Cast",
    category: "Cast-Main Cast",
    description:
      "Main cast is mostly composed of characters above a high school age.",
    isAdult: false,
  },
  {
    name: "Primarily Child Cast",
    category: "Cast-Main Cast",
    description:
      "Main cast is mostly composed of characters below a high school age.",
    isAdult: false,
  },
  {
    name: "Primarily Female Cast",
    category: "Cast-Main Cast",
    description: "Main cast is mostly composed of female characters.",
    isAdult: false,
  },
  {
    name: "Primarily Male Cast",
    category: "Cast-Main Cast",
    description: "Main cast is mostly composed of male characters.",
    isAdult: false,
  },
  {
    name: "Primarily Teen Cast",
    category: "Cast-Main Cast",
    description: "Main cast is mostly composed of teen characters.",
    isAdult: false,
  },
  {
    name: "Prostitution",
    category: "Sexual Content",
    description: "Features characters who are paid for sexual favors.",
    isAdult: true,
  },
  {
    name: "Public Sex",
    category: "Sexual Content",
    description: "Features sexual acts performed in public settings.",
    isAdult: true,
  },
  {
    name: "Puppetry",
    category: "Technical",
    description:
      "Animation style involving the manipulation of puppets to act out scenes.",
    isAdult: false,
  },
  {
    name: "Rakugo",
    category: "Theme-Arts",
    description:
      "Rakugo is the traditional Japanese performance art of comic storytelling.",
    isAdult: false,
  },
  {
    name: "Rape",
    category: "Sexual Content",
    description: "Features non-consensual sexual penetration.",
    isAdult: true,
  },
  {
    name: "Real Robot",
    category: "Theme-Sci-Fi-Mecha",
    description:
      "Prominently features mechanical designs loosely influenced by real-world robotics.",
    isAdult: false,
  },
  {
    name: "Rehabilitation",
    category: "Theme-Drama",
    description:
      "Prominently features the recovery of a character who became incapable of social life or work.",
    isAdult: false,
  },
  {
    name: "Reincarnation",
    category: "Theme-Other",
    description:
      "Features a character being born again after death, typically as another person or in another world.",
    isAdult: false,
  },
  {
    name: "Religion",
    category: "Theme-Other",
    description:
      "Centers on the belief that humanity is related to supernatural, transcendental, and spiritual elements.",
    isAdult: false,
  },
  {
    name: "Revenge",
    category: "Theme-Drama",
    description:
      "Prominently features a character who aims to exact punishment in a resentful or vindictive manner.",
    isAdult: false,
  },
  {
    name: "Rimjob",
    category: "Sexual Content",
    description: "Features oral sex performed on the anus.",
    isAdult: true,
  },
  {
    name: "Robots",
    category: "Cast-Traits",
    description: "Prominently features humanoid machines.",
    isAdult: false,
  },
  {
    name: "Rotoscoping",
    category: "Technical",
    description:
      "Animation technique that animators use to trace over motion picture footage, frame by frame, to produce realistic action.",
    isAdult: false,
  },
  {
    name: "Rugby",
    category: "Theme-Game-Sport",
    description: "Centers around the sport of rugby.",
    isAdult: false,
  },
  {
    name: "Rural",
    category: "Setting-Scene",
    description: "Partly or completely set in the countryside.",
    isAdult: false,
  },
  {
    name: "Sadism",
    category: "Sexual Content",
    description:
      "Prominently features characters deriving pleasure, especially sexual gratification, from inflicting pain, suffering, or humiliation on others.",
    isAdult: true,
  },
  {
    name: "Samurai",
    category: "Cast-Traits",
    description:
      "Prominently features warriors of medieval Japanese nobility bound by a code of honor.",
    isAdult: false,
  },
  {
    name: "Satire",
    category: "Theme-Comedy",
    description:
      "Prominently features the use of comedy or ridicule to expose and criticise social phenomena.",
    isAdult: false,
  },
  {
    name: "Scat",
    category: "Sexual Content",
    description: "Lots of feces.",
    isAdult: true,
  },
  {
    name: "School",
    category: "Setting-Scene",
    description:
      "Partly or completely set in a primary or secondary educational institution.",
    isAdult: false,
  },
  {
    name: "School Club",
    category: "Setting-Scene",
    description: "Partly or completely set in a school club scene.",
    isAdult: false,
  },
  {
    name: "Scissoring",
    category: "Sexual Content",
    description:
      "A form of sexual activity between women in which the genitals are stimulated by being rubbed against one another.",
    isAdult: true,
  },
  {
    name: "Scuba Diving",
    category: "Theme-Game-Sport",
    description:
      "Prominently features characters diving with the aid of special breathing equipment.",
    isAdult: false,
  },
  {
    name: "Seinen",
    category: "Demographic",
    description: "Target demographic is adult males.",
    isAdult: false,
  },
  {
    name: "Sex Toys",
    category: "Sexual Content",
    description:
      "Features objects that are designed to stimulate sexual pleasure.",
    isAdult: true,
  },
  {
    name: "Shapeshifting",
    category: "Theme-Fantasy",
    description: "Features character(s) who changes one's appearance or form.",
    isAdult: false,
  },
  {
    name: "Ships",
    category: "Theme-Other-Vehicle",
    description:
      "Prominently features the use of sea-based transportation vessels.",
    isAdult: false,
  },
  {
    name: "Shogi",
    category: "Theme-Game-Card & Board Game",
    description: "Centers around the game of shogi.",
    isAdult: false,
  },
  {
    name: "Shoujo",
    category: "Demographic",
    description: "Target demographic is teenage and young adult females.",
    isAdult: false,
  },
  {
    name: "Shounen",
    category: "Demographic",
    description: "Target demographic is teenage and young adult males.",
    isAdult: false,
  },
  {
    name: "Shrine Maiden",
    category: "Cast-Traits",
    description: "Prominently features a character who is a shrine maiden.",
    isAdult: false,
  },
  {
    name: "Skateboarding",
    category: "Theme-Game-Sport",
    description:
      "Centers around or prominently features skateboarding as a sport.",
    isAdult: false,
  },
  {
    name: "Skeleton",
    category: "Cast-Traits",
    description: "Prominently features skeleton(s) as a character.",
    isAdult: false,
  },
  {
    name: "Slapstick",
    category: "Theme-Comedy",
    description:
      "Prominently features comedy based on deliberately clumsy actions or embarrassing events.",
    isAdult: false,
  },
  {
    name: "Slavery",
    category: "Theme-Other",
    description: "Prominently features slaves, slavery, or slave trade.",
    isAdult: false,
  },
  {
    name: "Software Development",
    category: "Theme-Other",
    description:
      "Centers around characters developing or programming a piece of technology, software, gaming, etc.",
    isAdult: false,
  },
  {
    name: "Space",
    category: "Setting-Universe",
    description: "Partly or completely set in outer space.",
    isAdult: false,
  },
  {
    name: "Space Opera",
    category: "Theme-Sci-Fi",
    description:
      "Centers around space warfare, advanced technology, chivalric romance and adventure.",
    isAdult: false,
  },
  {
    name: "Spearplay",
    category: "Theme-Action",
    description: "Prominently features the use of spears in combat.",
    isAdult: false,
  },
  {
    name: "Squirting",
    category: "Sexual Content",
    description:
      "Female ejaculation; features the expulsion of liquid from the female genitalia.",
    isAdult: true,
  },
  {
    name: "Steampunk",
    category: "Theme-Fantasy",
    description:
      "Prominently features technology and designs inspired by 19th-century industrial steam-powered machinery.",
    isAdult: false,
  },
  {
    name: "Stop Motion",
    category: "Technical",
    description:
      "Animation style characterized by physical objects being moved incrementally between frames to create the illusion of movement.",
    isAdult: false,
  },
  {
    name: "Succubus",
    category: "Cast-Traits",
    description:
      "Prominently features a character who is a succubus, a creature in medieval folklore that typically uses their sexual prowess to trap and seduce people to feed off them.",
    isAdult: false,
  },
  {
    name: "Suicide",
    category: "Theme-Drama",
    description:
      "The act or an instance of taking or attempting to take one's own life voluntarily and intentionally.",
    isAdult: false,
  },
  {
    name: "Sumata",
    category: "Sexual Content",
    description:
      "Pussyjob; features the stimulation of male genitalia by the thighs and labia majora of a female character.",
    isAdult: true,
  },
  {
    name: "Sumo",
    category: "Theme-Game-Sport",
    description: "Centers around the sport of sumo.",
    isAdult: false,
  },
  {
    name: "Super Power",
    category: "Theme-Fantasy",
    description:
      "Prominently features characters with special abilities that allow them to do what would normally be physically or logically impossible.",
    isAdult: false,
  },
  {
    name: "Super Robot",
    category: "Theme-Sci-Fi-Mecha",
    description:
      "Prominently features large robots often piloted by hot-blooded protagonists.",
    isAdult: false,
  },
  {
    name: "Superhero",
    category: "Theme-Fantasy",
    description:
      "Prominently features super-powered humans who aim to serve the greater good.",
    isAdult: false,
  },
  {
    name: "Surfing",
    category: "Theme-Game-Sport",
    description: "Centers around surfing as a sport.",
    isAdult: false,
  },
  {
    name: "Surreal Comedy",
    category: "Theme-Comedy",
    description:
      "Prominently features comedic moments that defy casual reasoning, resulting in illogical events.",
    isAdult: false,
  },
  {
    name: "Survival",
    category: "Theme-Other",
    description:
      "Centers around the struggle to live in spite of extreme obstacles.",
    isAdult: false,
  },
  {
    name: "Sweat",
    category: "Sexual Content",
    description: "Lots of sweat. ",
    isAdult: true,
  },
  {
    name: "Swimming",
    category: "Theme-Game-Sport",
    description: "Centers around the sport of swimming.",
    isAdult: false,
  },
  {
    name: "Swordplay",
    category: "Theme-Action",
    description: "Prominently features the use of swords in combat.",
    isAdult: false,
  },
  {
    name: "Table Tennis",
    category: "Theme-Game-Sport",
    description:
      'Centers around the sport of table tennis (also known as "ping pong").',
    isAdult: false,
  },
  {
    name: "Tanks",
    category: "Theme-Other-Vehicle",
    description:
      "Prominently features the use of tanks or other armoured vehicles.",
    isAdult: false,
  },
  {
    name: "Tanned Skin",
    category: "Cast-Traits",
    description: "Prominently features characters with tanned skin.",
    isAdult: false,
  },
  {
    name: "Teacher",
    category: "Cast-Traits",
    description: "Protagonist is an educator, usually in a school setting.",
    isAdult: false,
  },
  {
    name: "Teens' Love",
    category: "Theme-Romance",
    description:
      "Sexually explicit love-story between individuals of the opposite sex, specifically targeting females of teens and young adult age.",
    isAdult: false,
  },
  {
    name: "Tennis",
    category: "Theme-Game-Sport",
    description: "Centers around the sport of tennis.",
    isAdult: false,
  },
  {
    name: "Tentacles",
    category: "Sexual Content",
    description:
      "Features the long appendages most commonly associated with octopuses or squid, often sexually penetrating a character.",
    isAdult: true,
  },
  {
    name: "Terrorism",
    category: "Theme-Other",
    description:
      "Centers around the activities of a terrorist or terrorist organization.",
    isAdult: false,
  },
  {
    name: "Threesome",
    category: "Sexual Content",
    description: "Features sexual acts between three people.",
    isAdult: true,
  },
  {
    name: "Time Manipulation",
    category: "Theme-Sci-Fi",
    description:
      "Prominently features time-traveling or other time-warping phenomena.",
    isAdult: false,
  },
  {
    name: "Time Skip",
    category: "Setting-Time",
    description: "Features a gap in time used to advance the story.",
    isAdult: false,
  },
  {
    name: "Tokusatsu",
    category: "Theme-Sci-Fi",
    description:
      "Prominently features the elements, which resemble Japanese special effects live-action shows",
    isAdult: false,
  },
  {
    name: "Tomboy",
    category: "Cast-Traits",
    description:
      "Features a girl who exhibits characteristics or behaviors considered in many cultures to be typical of boys.",
    isAdult: false,
  },
  {
    name: "Torture",
    category: "Theme-Other",
    description:
      "The act of deliberately inflicting severe pain or suffering upon another individual or oneself as a punishment or with a specific purpose.",
    isAdult: false,
  },
  {
    name: "Tragedy",
    category: "Theme-Drama",
    description: "Centers around tragic events and unhappy endings.",
    isAdult: false,
  },
  {
    name: "Trains",
    category: "Theme-Other-Vehicle",
    description: "Prominently features trains.",
    isAdult: false,
  },
  {
    name: "Transgender",
    category: "Cast-Traits",
    description:
      "Features a character whose gender identity differs from the sex they were assigned at birth.",
    isAdult: false,
  },
  {
    name: "Travel",
    category: "Theme",
    description:
      "Centers around character(s) moving between places a significant distance apart.",
    isAdult: false,
  },
  {
    name: "Triads",
    category: "Theme-Other-Organisations",
    description: "Centered around Chinese organised crime syndicates.",
    isAdult: false,
  },
  {
    name: "Tsundere",
    category: "Cast-Traits",
    description:
      "Prominently features a character who acts cold and hostile in order to mask warmer emotions.",
    isAdult: false,
  },
  {
    name: "Twins",
    category: "Cast-Traits",
    description:
      "Prominently features two or more siblings that were born at one birth.",
    isAdult: false,
  },
  {
    name: "Urban",
    category: "Setting-Scene",
    description: "Partly or completely set in a city.",
    isAdult: false,
  },
  {
    name: "Urban Fantasy",
    category: "Setting-Universe",
    description:
      "Set in a world similar to the real world, but with the existence of magic or other supernatural elements.",
    isAdult: false,
  },
  {
    name: "Vampire",
    category: "Cast-Traits",
    description: "Prominently features a character who is a vampire.",
    isAdult: false,
  },
  {
    name: "Video Games",
    category: "Theme-Game",
    description: "Centers around characters playing video games.",
    isAdult: false,
  },
  {
    name: "Vikings",
    category: "Cast-Traits",
    description:
      "Prominently features Scandinavian seafaring pirates and warriors.",
    isAdult: false,
  },
  {
    name: "Villainess",
    category: "Cast-Traits",
    description:
      "Centers around or prominently features a villainous noble lady.",
    isAdult: false,
  },
  {
    name: "Virginity",
    category: "Sexual Content",
    description:
      "Features a male character who has never had sexual relations (until now).",
    isAdult: true,
  },
  {
    name: "Virtual World",
    category: "Setting-Universe",
    description: "Partly or completely set in the world inside a video game.",
    isAdult: false,
  },
  {
    name: "Volleyball",
    category: "Theme-Game-Sport",
    description: "Centers around the sport of volleyball.",
    isAdult: false,
  },
  {
    name: "Vore",
    category: "Sexual Content",
    description:
      "Features a character being swallowed or swallowing another creature whole.",
    isAdult: true,
  },
  {
    name: "Voyeur",
    category: "Sexual Content",
    description:
      "Features a character who enjoys seeing the sex acts or sex organs of others.",
    isAdult: true,
  },
  {
    name: "VTuber",
    category: "Cast-Traits",
    description:
      "Prominently features a character who is either an actual or fictive VTuber.",
    isAdult: false,
  },
  {
    name: "War",
    category: "Theme-Other",
    description: "Partly or completely set during wartime.",
    isAdult: false,
  },
  {
    name: "Watersports",
    category: "Sexual Content",
    description: "Features sexual situations involving urine.",
    isAdult: true,
  },
  {
    name: "Werewolf",
    category: "Cast-Traits",
    description: "Prominently features a character who is a werewolf.",
    isAdult: false,
  },
  {
    name: "Witch",
    category: "Cast-Traits",
    description: "Prominently features a character who is a witch.",
    isAdult: false,
  },
  {
    name: "Work",
    category: "Setting-Scene",
    description: "Centers around the activities of a certain occupation.",
    isAdult: false,
  },
  {
    name: "Wrestling",
    category: "Theme-Game-Sport",
    description: "Centers around the sport of wrestling.",
    isAdult: false,
  },
  {
    name: "Writing",
    category: "Theme-Arts",
    description: "Centers around the profession of writing books or novels.",
    isAdult: false,
  },
  {
    name: "Wuxia",
    category: "Theme-Fantasy",
    description:
      "Chinese fiction concerning the adventures of martial artists in Ancient China.",
    isAdult: false,
  },
  {
    name: "Yakuza",
    category: "Theme-Other-Organisations",
    description: "Centered around Japanese organised crime syndicates.",
    isAdult: false,
  },
  {
    name: "Yandere",
    category: "Cast-Traits",
    description:
      "Prominently features a character who is obsessively in love with another, to the point of acting deranged or violent.",
    isAdult: false,
  },
  {
    name: "Youkai",
    category: "Theme-Fantasy",
    description:
      "Prominently features supernatural creatures from Japanese folklore.",
    isAdult: false,
  },
  {
    name: "Yuri",
    category: "Theme-Romance",
    description:
      "Prominently features romance between two females, not inherently sexual. Also known as Girls' Love.",
    isAdult: false,
  },
  {
    name: "Zombie",
    category: "Cast-Traits",
    description:
      "Prominently features reanimated corpses which often prey on live humans and turn them into zombies.",
    isAdult: false,
  },
];

const MediaGenres: string[] = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Hentai",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];

type Props = {
  type: string;
  filters: any;
  setFilter: (filter: any) => void;
};

const Filter = (props: Props) => {
  const user = useContext(userContext);
  const [resetGenres, setResetGenres] = useState<boolean>(false);
  const [resetTags, setResetTags] = useState<boolean>(false);
  let category = "";

  const getInitialState = (type: "genre" | "tag", value: string) => {
    let includeList = [];
    let excludeList = [];
    switch (type) {
      case "genre":
        includeList = props.filters.genres;
        excludeList = props.filters.excludedGenres;
        break;
      case "tag":
        includeList = props.filters.tags;
        excludeList = props.filters.excludedTags;
        break;
      default:
        break;
    }
    if (includeList.filter((el: string) => el === value).length) {
      return "Enabled";
    }
    if (excludeList.filter((el: string) => el === value).length) {
      return "Disabled";
    }
    return null;
  };
  return (
    <>
      {props.type === "ANIME" && (
        <>
          <div className="">
            <label>Season:</label>
            <Select
              defaultValue=""
              value={String(props.filters.season)}
              onValueChange={(value: string) => {
                props.setFilter((state: any) => ({
                  ...state,
                  season: value,
                }));
              }}
              triggerAriaLabel={"Country of Origin Selector"}
              buttonClass={"w-full border border-black dark:border-white    "}
              values={[
                { displayTitle: "Any", value: "" },
                { displayTitle: "Winter", value: "WINTER" },
                { displayTitle: "Spring", value: "SPRING" },
                { displayTitle: "Summer", value: "SUMMER" },
                { displayTitle: "Fall", value: "FALL" },
              ]}
            />
          </div>
          <div className="">
            <label>Season Year:</label>
            <Select
              defaultValue=""
              value={String(props.filters.seasonYear || "")}
              onValueChange={(value: string) => {
                props.setFilter((state: any) => ({
                  ...state,
                  seasonYear: parseInt(value),
                }));
              }}
              triggerAriaLabel={"Season Year Selector"}
              buttonClass={"w-full border border-black dark:border-white"}
              values={[
                { displayTitle: "Any", value: "" },
                ..._.range(1970, new Date().getFullYear() + 2)
                  .reverse()
                  .map((year: number) => ({
                    displayTitle: `${year}`,
                    value: `${year}`,
                  })),
              ]}
            />
          </div>
        </>
      )}
      <div className="">
        <label>
          {props.type === "ANIME" ? "Airing Status:" : "Publishing Status:"}
        </label>
        <Select
          defaultValue=""
          value={String(props.filters.status)}
          onValueChange={(value: string) => {
            props.setFilter((state: any) => ({
              ...state,
              status: value,
            }));
          }}
          triggerAriaLabel={"Media Status Selector"}
          buttonClass={"w-full border border-black dark:border-white"}
          values={[
            { displayTitle: "Any", value: "" },
            {
              displayTitle: props.type === "ANIME" ? "Airing" : "Releasing",
              value: "RELEASING",
            },
            { displayTitle: "Finished", value: "FINISHED" },
            {
              displayTitle:
                props.type === "ANIME" ? "Not Yet Aired" : "Not Yet Released",
              value: "NOT_YET_RELEASED",
            },
            { displayTitle: "Cancelled", value: "CANCELLED" },
          ]}
        />
      </div>
      <div className="">
        <label>Format:</label>
        <Select
          defaultValue=""
          value={String(props.filters.format)}
          onValueChange={(value: string) => {
            props.setFilter((state: any) => ({
              ...state,
              format: value,
            }));
          }}
          triggerAriaLabel={"Media Format Selector"}
          buttonClass={"w-full border border-black dark:border-white"}
          values={
            props.type === "ANIME"
              ? [
                  { displayTitle: "Any", value: "" },
                  { displayTitle: "TV", value: "TV" },
                  { displayTitle: "TV Short", value: "TV_SHORT" },
                  { displayTitle: "Movie", value: "MOVIE" },
                  { displayTitle: "Special", value: "SPECIAL" },
                  { displayTitle: "OVA", value: "OVA" },
                  { displayTitle: "ONA", value: "ONA" },
                  { displayTitle: "Music", value: "MUSIC" },
                ]
              : [
                  { displayTitle: "Any", value: "" },
                  { displayTitle: "Manga", value: "MANGA" },
                  { displayTitle: "Novel", value: "NOVEL" },
                  { displayTitle: "One Shot", value: "ONE_SHOT" },
                ]
          }
        />
      </div>
      <div className="">
        <label>Country of Origin:</label>
        <Select
          defaultValue=""
          value={String(props.filters.countryOfOrigin)}
          onValueChange={(value: string) => {
            props.setFilter((state: any) => ({
              ...state,
              countryOfOrigin: value,
            }));
          }}
          triggerAriaLabel={"Country of Origin Selector"}
          buttonClass={"w-full border border-black dark:border-white"}
          values={[
            { displayTitle: "Any", value: "" },
            { displayTitle: "Japan", value: "JP" },
            { displayTitle: "South Korea", value: "KR" },
            { displayTitle: "China", value: "CN" },
            { displayTitle: "Taiwan", value: "TW" },
          ]}
        />
      </div>
      <div>
        <label>Year Range</label>
        <Slider
          defaultValue={[1970, new Date().getFullYear() + 1]}
          min={1970}
          max={new Date().getFullYear() + 1}
          step={1}
          ariaLabel={"Year Range Slider"}
          value={[props.filters.yearGreater, props.filters.yearLesser]}
          onChange={(value) => {
            props.setFilter((state: any) => ({
              ...state,
              yearLesser: value[1],
              yearGreater: value[0],
            }));
          }}
        />
      </div>
      {props.type === "MANGA" ? (
        <div>
          <label>Chapters</label>
          <Slider
            key={"chapter slider"}
            defaultValue={[0, 500]}
            min={0}
            max={500}
            step={1}
            ariaLabel={"Chapter Slider"}
            value={[props.filters.chapterGreater, props.filters.chapterLesser]}
            onChange={(value) => {
              props.setFilter((state: any) => ({
                ...state,
                chapterLesser: value[1],
                chapterGreater: value[0],
              }));
            }}
          />
        </div>
      ) : (
        <div>
          <label>Episodes</label>
          <Slider
            key={"episode slider"}
            defaultValue={[0, 150]}
            min={0}
            max={150}
            step={1}
            ariaLabel={"Episode Slider"}
            value={[props.filters.episodeGreater, props.filters.episodeLesser]}
            onChange={(value) => {
              props.setFilter((state: any) => ({
                ...state,
                episodeLesser: value[1],
                episodeGreater: value[0],
              }));
            }}
          />
        </div>
      )}
      {props.type === "MANGA" ? (
        <div>
          <label>Volumes</label>
          <Slider
            key={"volume slider"}
            defaultValue={[0, 50]}
            min={0}
            max={50}
            step={1}
            ariaLabel={"Volumes Slider"}
            value={[props.filters.volumeGreater, props.filters.volumeLesser]}
            onChange={(value) => {
              props.setFilter((state: any) => ({
                ...state,
                volumeLesser: value[1],
                volumeGreater: value[0],
              }));
            }}
          />
        </div>
      ) : (
        <div>
          <label>Duration</label>
          <Slider
            key={"duration slider"}
            defaultValue={[0, 170]}
            min={0}
            max={170}
            step={1}
            ariaLabel={"Episode Duration Slider"}
            value={[
              props.filters.durationGreater,
              props.filters.durationLesser,
            ]}
            onChange={(value) => {
              props.setFilter((state: any) => ({
                ...state,
                durationLesser: value[1],
                durationGreater: value[0],
              }));
            }}
          />
        </div>
      )}
      <div className="">
        <Drawer
          trigger={
            <button className="btn | w-full bg-primary-500 flex justify-center items-center">
              Genres and Tags
            </button>
          }
          content={
            <div>
              <div className="text-xl dark:text-white flex justify-between mt-12">
                <div>Genres</div>
                <button
                  className="btn | flex justify-center items-center bg-primary-500 text-base"
                  onClick={() => {
                    props.setFilter((state: any) => ({
                      ...state,
                      genres: [],
                      excludedGenres: [],
                    }));
                    setResetGenres(true);
                  }}
                >
                  Reset All
                </button>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                {MediaGenres.map((genre, index) => (
                  <ThreeToggleChip
                    key={index}
                    reset={resetGenres}
                    onReset={() => {
                      setResetGenres(false);
                    }}
                    initState={getInitialState("genre", genre)}
                    text={genre}
                    onChange={(state) => {
                      switch (state) {
                        case "Enabled":
                          props.setFilter((state: any) => ({
                            ...state,
                            genres: [...state.genres, genre],
                            excludedGenres: state.excludedGenres.filter(
                              (stateGenre: string) => stateGenre !== genre
                            ),
                          }));
                          break;
                        case "Disabled":
                          props.setFilter((state: any) => ({
                            ...state,
                            excludedGenres: [...state.excludedGenres, genre],
                            genres: state.genres.filter(
                              (stateGenre: string) => stateGenre !== genre
                            ),
                          }));
                          break;
                        case null:
                          props.setFilter((state: any) => ({
                            ...state,
                            excludedGenres: state.excludedGenres.filter(
                              (stateGenre: string) => stateGenre !== genre
                            ),
                            genres: state.genres.map(
                              (stateGenre: string) => stateGenre !== genre
                            ),
                          }));
                        default:
                          break;
                      }
                    }}
                  />
                ))}
              </div>
              <div className="text-xl dark:text-white mt-8 flex justify-between items-center">
                <div>Tags</div>
                <button
                  className="btn | flex justify-center items-center bg-primary-500 text-base"
                  onClick={() => {
                    props.setFilter((state: any) => ({
                      ...state,
                      tags: [],
                      excludedTags: [],
                    }));
                    setResetTags(true);
                  }}
                >
                  Reset All
                </button>
              </div>
              <div
                className="flex flex-wrap gap-4 mt-4"
                style={{ gridTemplateColumns: "masonry" }}
              >
                {MediaTags.filter((tag) =>
                  user.userShowAdult ? true : !tag.isAdult
                )
                  .sort((a, b) => a.category.localeCompare(b.category))
                  .map((tag) => {
                    const showCategorySeperator = category !== tag.category;
                    if (showCategorySeperator) {
                      category = tag.category;
                    }
                    return (
                      <Fragment key={tag.name}>
                        {showCategorySeperator && (
                          <div className="w-full dark:text-white">
                            {tag.category}
                          </div>
                        )}
                        <ThreeToggleChip
                          reset={resetTags}
                          onReset={() => {
                            setResetTags(false);
                          }}
                          initState={getInitialState("tag", tag.name)}
                          text={tag.name}
                          onChange={(state) => {
                            switch (state) {
                              case "Enabled":
                                props.setFilter((state: any) => ({
                                  ...state,
                                  tags: [...state.tags, tag.name],
                                  excludedTags: state.excludedTags.filter(
                                    (stateTag: string) => stateTag !== tag.name
                                  ),
                                }));
                                break;
                              case "Disabled":
                                props.setFilter((state: any) => ({
                                  ...state,
                                  excludedTags: [
                                    ...state.excludedTags,
                                    tag.name,
                                  ],
                                  tags: state.tags.filter(
                                    (stateTag: string) => stateTag !== tag.name
                                  ),
                                }));
                                break;
                              case null:
                                props.setFilter((state: any) => ({
                                  ...state,
                                  excludedTags: state.excludedTags.filter(
                                    (stateTag: string) => stateTag !== tag.name
                                  ),
                                  tags: state.tags.map(
                                    (stateTag: string) => stateTag !== tag.name
                                  ),
                                }));
                              default:
                                break;
                            }
                          }}
                        />
                      </Fragment>
                    );
                  })}
              </div>
            </div>
          }
        />
      </div>
      {props.filters.onList !== true && (
        <div className="flex justify-end items-center gap-2">
          <label>Hide My {props.type === "ANIME" ? "Anime" : "Manga"}</label>
          <Checkbox
            checked={props.filters.onList === false}
            onChecked={(checked) => {
              if (checked) {
                props.setFilter((state: any) => ({ ...state, onList: false }));
              } else {
                props.setFilter((state: any) => ({
                  ...state,
                  onList: undefined,
                }));
              }
            }}
            ariaLabel={`Hide My ${props.type === "ANIME" ? "Anime" : "Manga"}`}
          />
        </div>
      )}
      {props.filters.onList !== false && (
        <div className="flex justify-end items-center gap-2">
          <label>Show My {props.type === "ANIME" ? "Anime" : "Manga"}</label>
          <Checkbox
            checked={props.filters.onList === true}
            onChecked={(checked) => {
              if (checked) {
                props.setFilter((state: any) => ({ ...state, onList: true }));
              } else {
                props.setFilter((state: any) => ({
                  ...state,
                  onList: undefined,
                }));
              }
            }}
            ariaLabel={`Show My ${props.type === "ANIME" ? "Anime" : "Manga"}`}
          />
        </div>
      )}
      {user.userShowAdult && props.filters.isAdult !== true && (
        <div className="flex justify-end items-center gap-2">
          <label>No Adult Shows</label>
          <Checkbox
            checked={props.filters.isAdult === false}
            onChecked={(checked) => {
              if (checked) {
                props.setFilter((state: any) => ({ ...state, isAdult: false }));
              } else {
                props.setFilter((state: any) => ({
                  ...state,
                  isAdult: undefined,
                }));
              }
            }}
            ariaLabel={"No Adult Shows"}
          />
        </div>
      )}
      {user.userShowAdult && props.filters.isAdult !== false && (
        <div className="flex justify-end items-center gap-2">
          <label>Show Only Adult</label>
          <Checkbox
            checked={props.filters.isAdult === true}
            onChecked={(checked) => {
              if (checked) {
                props.setFilter((state: any) => ({ ...state, isAdult: true }));
              } else {
                props.setFilter((state: any) => ({
                  ...state,
                  isAdult: undefined,
                }));
              }
            }}
            ariaLabel={"Show Only Adult"}
          />
        </div>
      )}
    </>
  );
};

export default Filter;
