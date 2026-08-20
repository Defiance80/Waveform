// ============================================================================
// SLAPBOX SEED CATALOG
//
// Twenty FICTIONAL artists. These are invented characters, not real people --
// using a real recording artist's name and likeness on an unclaimed account
// would be impersonation, and the takedown would arrive before launch. Each
// one carries a small "canon": a discography, a producer, a crew, a signature
// ad-lib. Trivia questions are generated from that canon, and wrong answers
// are pulled from OTHER artists' canon, so every distractor is plausible
// rather than obviously filler.
//
// To convert a demo account into a real signed artist: set artists.owner_id
// to the claiming profile and flip is_demo to false. Nothing else changes.
// ============================================================================

export const ARTISTS = [
  // ---- Hip-Hop -------------------------------------------------------------
  {
    slug: 'nyla-frost', name: 'Nyla Frost', genre: 'Hip-Hop', hometown: 'Atlanta, GA',
    accent: '#00C2FF', listeners: 1840000,
    bio: 'Atlanta lyricist who came up trading verses in the Edgewood parking lots. Known for double-time flows over icy, minimal production.',
    canon: {
      mixtape: 'Cold Open', mixtapeYear: 2019, single: 'Frostbite', album: 'Subzero', albumYear: 2022,
      producer: 'Wex Malone', label: 'Peachtree North', crew: 'The Cold Front', adlib: 'brrt-brrt',
      feature: 'Trey Marlo', venue: 'The Tabernacle',
      lyric: 'I turned the ___ into a whole apartment', lyricAnswer: 'trap',
      cover: 'a cracked windshield with breath fogging the glass',
    },
  },
  {
    slug: 'trey-marlo', name: 'Trey Marlo', genre: 'Hip-Hop', hometown: 'Houston, TX',
    accent: '#7B2EFF', listeners: 2310000,
    bio: 'Houston native carrying the slowed-down tradition forward. Screwed hooks, live bass, and a voice built for late-night drives.',
    canon: {
      mixtape: 'Southbound', mixtapeYear: 2018, single: 'Candy Rain', album: 'Third Coast Gospel', albumYear: 2021,
      producer: 'DJ Verdant', label: 'Bayou Gold', crew: 'Slab Society', adlib: 'slow it down',
      feature: 'Nyla Frost', venue: 'White Oak Music Hall',
      lyric: 'Poured the whole city in a ___ cup', lyricAnswer: 'styrofoam',
      cover: 'a slab car parked under orange sodium lights',
    },
  },
  {
    slug: 'kasso-wray', name: 'Kasso Wray', genre: 'Hip-Hop', hometown: 'Detroit, MI',
    accent: '#FFB800', listeners: 970000,
    bio: 'Detroit street-rap technician. Off-beat cadences, sample-flip production, and a reputation for never writing anything down.',
    canon: {
      mixtape: 'Nothing Written', mixtapeYear: 2020, single: 'Eastside Errand', album: 'Paper Route Theory', albumYear: 2023,
      producer: 'Bosley Grand', label: 'Gratiot Ave Records', crew: 'The Errand Boys', adlib: 'you hear me?',
      feature: 'Rico Vandal', venue: 'Saint Andrew’s Hall',
      lyric: 'Momma said the ___ was a phase', lyricAnswer: 'hustle',
      cover: 'a folded paper map of Detroit burning at one corner',
    },
  },
  {
    slug: 'baby-ovid', name: 'Baby Ovid', genre: 'Hip-Hop', hometown: 'Bronx, NY',
    accent: '#00FF9C', listeners: 1420000,
    bio: 'Bronx drill poet who names every project after a Latin text. Menacing sliding 808s under surprisingly literary bars.',
    canon: {
      mixtape: 'Metamorphoses', mixtapeYear: 2021, single: 'Exile', album: 'Ars Amatoria', albumYear: 2024,
      producer: 'Kid Tiber', label: 'Grand Concourse', crew: 'The Latin Quarter', adlib: 'ovid, ovid',
      feature: 'Zae Corbin', venue: 'Webster Hall',
      lyric: 'They exiled me and I built a ___ out here', lyricAnswer: 'kingdom',
      cover: 'a marble bust wearing a puffer hood',
    },
  },
  {
    slug: 'duke-sarita', name: 'Duke Sarita', genre: 'Hip-Hop', hometown: 'Compton, CA',
    accent: '#FF3B3B', listeners: 2650000,
    bio: 'West Coast storyteller. Three-verse narratives, no hooks, live funk instrumentation borrowed from his father’s record collection.',
    canon: {
      mixtape: 'Sarita Blvd', mixtapeYear: 2017, single: 'Long Way Home', album: 'The Ledger', albumYear: 2020,
      producer: 'Marcus Pree', label: 'Rosecrans Sound', crew: 'Ledger Gang', adlib: 'on my mother',
      feature: 'Imani Voss', venue: 'The Novo',
      lyric: 'Every dollar in this ___ got a name on it', lyricAnswer: 'ledger',
      cover: 'a handwritten accounting book with gold leaf edges',
    },
  },
  {
    slug: 'rico-vandal', name: 'Rico Vandal', genre: 'Hip-Hop', hometown: 'Chicago, IL',
    accent: '#C9A86A', listeners: 1130000,
    bio: 'Chicago drill-jazz hybrid. Came out of the South Shore scene playing trumpet before he ever touched a mic.',
    canon: {
      mixtape: 'Brass Knuckles', mixtapeYear: 2019, single: 'South Shore Sunrise', album: 'Horn Section', albumYear: 2023,
      producer: 'Lonnie Fitch', label: 'Wabash Tapes', crew: 'The Brass Era', adlib: 'blow',
      feature: 'Kasso Wray', venue: 'Metro Chicago',
      lyric: 'I play the ___ like I stole it', lyricAnswer: 'horn',
      cover: 'a dented brass trumpet on a snow-covered stoop',
    },
  },
  {
    slug: 'sage-molina', name: 'Sage Molina', genre: 'Hip-Hop', hometown: 'Miami, FL',
    accent: '#00C2FF', listeners: 1580000,
    bio: 'Miami bilingual rapper switching between English and Spanish mid-bar. Built her following entirely on freestyle videos.',
    canon: {
      mixtape: 'Calle Ocho Tapes', mixtapeYear: 2020, single: 'Doble Vida', album: 'Two Tongues', albumYear: 2023,
      producer: 'Elias Prado', label: 'Bal Harbour Music', crew: 'Las Molinas', adlib: 'dale',
      feature: 'Solée Reyn', venue: 'The Fillmore Miami Beach',
      lyric: 'Dos idiomas, one ___, no translation', lyricAnswer: 'truth',
      cover: 'twin neon palm trees reflected in wet asphalt',
    },
  },
  {
    slug: 'yung-perrin', name: 'Yung Perrin', genre: 'Hip-Hop', hometown: 'Memphis, TN',
    accent: '#7B2EFF', listeners: 890000,
    bio: 'Memphis underground revivalist. Lo-fi tape hiss, cavernous reverb, and a deliberate refusal to clean up the mix.',
    canon: {
      mixtape: 'Tape Hiss', mixtapeYear: 2021, single: 'Basement Sermon', album: 'Room Tone', albumYear: 2024,
      producer: 'Grim Vessel', label: 'Beale Street Underground', crew: 'The Hiss', adlib: 'hiss',
      feature: 'Mack Lorraine', venue: 'Minglewood Hall',
      lyric: 'Recorded this one in a ___ with no door', lyricAnswer: 'closet',
      cover: 'a warped cassette tape half-pulled from its shell',
    },
  },
  {
    slug: 'zae-corbin', name: 'Zae Corbin', genre: 'Hip-Hop', hometown: 'Oakland, CA',
    accent: '#00FF9C', listeners: 1260000,
    bio: 'Bay Area rapper and producer. Self-produces everything, mixes on headphones, and has never released a song longer than three minutes.',
    canon: {
      mixtape: 'Under Three', mixtapeYear: 2020, single: 'Fruitvale', album: 'Short Form', albumYear: 2022,
      producer: 'Zae Corbin', label: 'Lake Merritt Co-op', crew: 'The Short Form', adlib: 'quick',
      feature: 'Baby Ovid', venue: 'The Fox Theater',
      lyric: 'Say it in a ___ or don’t say it at all', lyricAnswer: 'minute',
      cover: 'a stopwatch frozen at 2:59',
    },
  },
  {
    slug: 'mack-lorraine', name: 'Mack Lorraine', genre: 'Hip-Hop', hometown: 'New Orleans, LA',
    accent: '#FFB800', listeners: 1040000,
    bio: 'New Orleans bounce-influenced MC. Second-line drums, call-and-response hooks, and a live show that runs closer to a parade.',
    canon: {
      mixtape: 'Second Line', mixtapeYear: 2018, single: 'Parade Route', album: 'Krewe', albumYear: 2021,
      producer: 'Tootie Vance', label: 'Tremé Tapes', crew: 'The Krewe', adlib: 'where dey at',
      feature: 'Yung Perrin', venue: 'Tipitina’s',
      lyric: 'We don’t march, we ___ down the street', lyricAnswer: 'bounce',
      cover: 'a brass band silhouette against a purple and gold sky',
    },
  },

  // ---- R&B -----------------------------------------------------------------
  {
    slug: 'imani-voss', name: 'Imani Voss', genre: 'R&B', hometown: 'Philadelphia, PA',
    accent: '#7B2EFF', listeners: 3120000,
    bio: 'Philly vocalist raised in church choir. Four-octave range she mostly refuses to show off, preferring restraint and space.',
    canon: {
      mixtape: 'Sunday Best', mixtapeYear: 2017, single: 'Quiet Storm', album: 'Restraint', albumYear: 2021,
      producer: 'Andre Sallis', label: 'Broad Street Soul', crew: 'The Choir', adlib: 'mmm',
      feature: 'Duke Sarita', venue: 'The Met Philadelphia',
      lyric: 'I could hit the note but I’d rather let it ___', lyricAnswer: 'breathe',
      cover: 'a single microphone in an empty cathedral',
    },
  },
  {
    slug: 'solee-reyn', name: 'Solée Reyn', genre: 'R&B', hometown: 'Toronto, ON',
    accent: '#00C2FF', listeners: 2470000,
    bio: 'Toronto alt-R&B artist working in cold synths and negative space. Writes exclusively between 2am and sunrise.',
    canon: {
      mixtape: 'Nightshift', mixtapeYear: 2019, single: 'Blue Hour', album: 'After Midnight Rules', albumYear: 2023,
      producer: 'Cain Delacroix', label: 'Lakeshore North', crew: 'The Night Shift', adlib: 'oh oh',
      feature: 'Sage Molina', venue: 'History Toronto',
      lyric: 'Nothing good gets decided after ___', lyricAnswer: 'midnight',
      cover: 'a city skyline dissolving into blue fog',
    },
  },
  {
    slug: 'devon-amari', name: 'Devon Amari', genre: 'R&B', hometown: 'Baltimore, MD',
    accent: '#00FF9C', listeners: 1390000,
    bio: 'Baltimore singer-songwriter who plays every instrument on his records. Neo-soul chord voicings over club-adjacent drums.',
    canon: {
      mixtape: 'One Man Band', mixtapeYear: 2020, single: 'Charm City', album: 'Every Instrument', albumYear: 2023,
      producer: 'Devon Amari', label: 'Harbor East Sound', crew: 'Solo Act', adlib: 'yeah yeah',
      feature: 'Cleo Sunday', venue: 'Rams Head Live',
      lyric: 'Played the bass, the keys, and my own ___', lyricAnswer: 'part',
      cover: 'a dozen instrument cases stacked in a rowhouse hallway',
    },
  },
  {
    slug: 'cleo-sunday', name: 'Cleo Sunday', genre: 'R&B', hometown: 'St. Louis, MO',
    accent: '#C9A86A', listeners: 1720000,
    bio: 'St. Louis vocalist with a retro-soul catalog recorded entirely to tape. No digital editing on any release, by rule.',
    canon: {
      mixtape: 'To Tape', mixtapeYear: 2018, single: 'Gateway', album: 'Analog Heart', albumYear: 2022,
      producer: 'Ruthie Cane', label: 'Delmar Loop Records', crew: 'The Tape Room', adlib: 'sing it',
      feature: 'Devon Amari', venue: 'The Pageant',
      lyric: 'If it ain’t on ___ it didn’t happen', lyricAnswer: 'tape',
      cover: 'a reel-to-reel machine mid-spin, warm lamplight',
    },
  },
  {
    slug: 'jaxon-reed', name: 'Jaxon Reed', genre: 'R&B', hometown: 'Dallas, TX',
    accent: '#FF3B3B', listeners: 2080000,
    bio: 'Dallas falsetto specialist. Started as a songwriter placing cuts for other artists before stepping out front.',
    canon: {
      mixtape: 'Pen for Hire', mixtapeYear: 2019, single: 'Deep Ellum', album: 'Under My Name', albumYear: 2022,
      producer: 'Sable Knox', label: 'Trinity River Music', crew: 'The Pen', adlib: 'ooh',
      feature: 'Nova Beaumont', venue: 'The Bomb Factory',
      lyric: 'Wrote it for somebody else and kept the ___', lyricAnswer: 'best',
      cover: 'a legal pad covered in crossed-out lyrics',
    },
  },
  {
    slug: 'nova-beaumont', name: 'Nova Beaumont', genre: 'R&B', hometown: 'Atlanta, GA',
    accent: '#7B2EFF', listeners: 2890000,
    bio: 'Atlanta R&B with gospel bones and trap drums. Built a following performing at a weekly open mic for four straight years.',
    canon: {
      mixtape: 'Open Mic', mixtapeYear: 2018, single: 'Four Years', album: 'Standing Room', albumYear: 2021,
      producer: 'Kemp Rowland', label: 'Peachtree North', crew: 'The Residency', adlib: 'come on',
      feature: 'Jaxon Reed', venue: 'Center Stage Atlanta',
      lyric: 'Same stage, same ___, four years running', lyricAnswer: 'Tuesday',
      cover: 'a folding chair on an empty stage under one spotlight',
    },
  },
  {
    slug: 'terrence-vale', name: 'Terrence Vale', genre: 'R&B', hometown: 'Newark, NJ',
    accent: '#00C2FF', listeners: 1180000,
    bio: 'Newark crooner working the classic quiet-storm lane. Records live with a full band, one take, no click track.',
    canon: {
      mixtape: 'One Take', mixtapeYear: 2020, single: 'Ironbound', album: 'No Click Track', albumYear: 2024,
      producer: 'Vernon Shaw', label: 'Ironbound Soul', crew: 'The Live Room', adlib: 'listen',
      feature: 'Imani Voss', venue: 'NJPAC',
      lyric: 'We keep the ___ in, that’s how you know it’s real', lyricAnswer: 'mistakes',
      cover: 'a full band mid-performance shot on grainy film',
    },
  },

  // ---- Pop -----------------------------------------------------------------
  {
    slug: 'elle-marchetti', name: 'Elle Marchetti', genre: 'Pop', hometown: 'Los Angeles, CA',
    accent: '#FF3B3B', listeners: 4210000,
    bio: 'LA pop songwriter with a maximalist streak. Layers dozens of vocal stacks and calls the result "a choir of one person."',
    canon: {
      mixtape: 'Demos From The Valley', mixtapeYear: 2019, single: 'Choir of One', album: 'Stacked', albumYear: 2022,
      producer: 'Bly Ashford', label: 'Sunset Vista', crew: 'The Stack', adlib: 'hey!',
      feature: 'Cass Holloway', venue: 'The Greek Theatre',
      lyric: 'Forty of me singing and I’m still ___', lyricAnswer: 'alone',
      cover: 'forty identical silhouettes arranged in a choir formation',
    },
  },
  {
    slug: 'cass-holloway', name: 'Cass Holloway', genre: 'Pop', hometown: 'Nashville, TN',
    accent: '#C9A86A', listeners: 3340000,
    bio: 'Nashville pop artist with country songwriting DNA. Story-first lyrics over synth production that the Row still finds suspicious.',
    canon: {
      mixtape: 'Off Music Row', mixtapeYear: 2018, single: 'Suspicious Minds Of Nashville', album: 'Crossover', albumYear: 2021,
      producer: 'Hal Renner', label: 'Eighth Avenue', crew: 'The Row Rejects', adlib: 'oh well',
      feature: 'Juno Park', venue: 'Ryman Auditorium',
      lyric: 'They said pick a ___ and I picked both', lyricAnswer: 'lane',
      cover: 'a neon guitar sign flickering above a synthesizer',
    },
  },
  {
    slug: 'juno-park', name: 'Juno Park', genre: 'Pop', hometown: 'Seattle, WA',
    accent: '#00FF9C', listeners: 2760000,
    bio: 'Seattle art-pop producer and vocalist. Builds songs from field recordings collected on tour and refuses to use stock drum samples.',
    canon: {
      mixtape: 'Field Notes', mixtapeYear: 2020, single: 'Rain Shadow', album: 'Found Sound', albumYear: 2023,
      producer: 'Juno Park', label: 'Puget Audio', crew: 'The Field Team', adlib: 'listen close',
      feature: 'Elle Marchetti', venue: 'The Showbox',
      lyric: 'That snare is a ___ door from a motel in Boise', lyricAnswer: 'screen',
      cover: 'a handheld recorder held up to falling rain',
    },
  },
];

// ── Reward templates ────────────────────────────────────────────────────────
// Every artist gets the same six-slot shelf, laddered across the rank tiers.
// There is no price: `level` IS the price. Tuned against the XP curve so that
// each tier is a real step rather than a formality --
//   L1  Listener     immediately
//   L5  Supporter    ~6 rounds
//   L10 Regular      ~22 rounds
//   L20 Real One     ~65 rounds
//   L50 Inner Circle a genuine long haul
export const REWARD_TEMPLATES = [
  {
    kind: 'exclusive_audio', tier: 'common', level: 1, stock: null, sub: true,
    title: (a) => `"${a.canon.single}" — unreleased demo`,
    desc:  (a) => `The original bedroom demo of "${a.canon.single}", before ${a.canon.producer} touched it. Streamable in your Vault, never released publicly.`,
  },
  {
    kind: 'discount_code', tier: 'common', level: 5, stock: null, sub: false,
    title: (a) => `25% off the ${a.name} store`,
    desc:  (a) => `A single-use code for 25% off anything in the official ${a.name} merch store. Opens at Supporter.`,
  },
  {
    kind: 'exclusive_video', tier: 'rare', level: 10, stock: null, sub: true,
    title: (a) => `${a.canon.album} studio session footage`,
    desc:  (a) => `Twenty-two minutes from inside the ${a.canon.album} sessions at ${a.canon.label}. Subscriber-only, unlocked at Regular.`,
  },
  {
    kind: 'swag', tier: 'rare', level: 20, stock: 200, sub: false,
    title: (a) => `${a.canon.crew} tour tee`,
    desc:  (a) => `Heavyweight cotton tee with the ${a.canon.crew} crest. Reach Real One to claim one. Ships free in the US.`,
  },
  {
    kind: 'vinyl', tier: 'epic', level: 50, stock: 25, sub: false,
    title: (a) => `${a.canon.album} — signed vinyl`,
    desc:  (a) => `Limited pressing of ${a.canon.album} (${a.canon.albumYear}), hand-signed. Twenty-five copies, and only Inner Circle can reach it.`,
  },
  // High-ticket: not claimable at any rank. Awarded through the monthly draw,
  // where rank sets your odds instead of your access.
  {
    kind: 'private_event', tier: 'legendary', level: 20, stock: 2, sub: true,
    highTicket: true,
    title: (a) => `Soundcheck + private set at ${a.canon.venue}`,
    desc:  (a) => `Two spots. Doors before doors: watch soundcheck, then a four-song private set and a photo with ${a.name}. Entry is rank-weighted — the higher your rank, the more tickets you hold.`,
  },
];

// ── Question generators ─────────────────────────────────────────────────────
// Each generator returns { kind, prompt, answer, wrong: [...], difficulty,
// explanation }. Distractors are drawn from the shared pools below, which are
// built from every OTHER artist's canon -- that is what keeps a wrong answer
// from being obviously wrong.
export const QUESTION_BUILDERS = [
  {
    kind: 'trivia', difficulty: 1, pool: 'mixtape',
    prompt: (a) => `What was ${a.name}'s debut mixtape?`,
    answer: (a) => a.canon.mixtape,
    explanation: (a) => `${a.canon.mixtape} dropped in ${a.canon.mixtapeYear} and put ${a.name} on the map.`,
  },
  {
    kind: 'trivia', difficulty: 1, pool: 'hometown',
    prompt: (a) => `Where is ${a.name} from?`,
    answer: (a) => a.canon.hometownOverride ?? a.hometown,
    explanation: (a) => `${a.name} came up in ${a.hometown}.`,
  },
  {
    kind: 'trivia', difficulty: 1, pool: 'single',
    prompt: (a) => `Which single was ${a.name}'s breakout?`,
    answer: (a) => a.canon.single,
    explanation: (a) => `"${a.canon.single}" was the track that broke ${a.name} to a wider audience.`,
  },
  {
    kind: 'trivia', difficulty: 2, pool: 'album',
    prompt: (a) => `What is the name of ${a.name}'s studio album?`,
    answer: (a) => a.canon.album,
    explanation: (a) => `${a.canon.album} arrived in ${a.canon.albumYear}.`,
  },
  {
    kind: 'trivia', difficulty: 2, pool: 'label',
    prompt: (a) => `Which label does ${a.name} record for?`,
    answer: (a) => a.canon.label,
    explanation: (a) => `${a.name} has been with ${a.canon.label} since the start.`,
  },
  {
    kind: 'speed_round', difficulty: 1, pool: 'adlib',
    prompt: (a) => `Quick — what is ${a.name}'s signature ad-lib?`,
    answer: (a) => `"${a.canon.adlib}"`,
    explanation: (a) => `You hear "${a.canon.adlib}" all over the ${a.canon.album} run.`,
  },
  {
    kind: 'speed_round', difficulty: 1, pool: 'crew',
    prompt: (a) => `Fast one: what does ${a.name} call the crew?`,
    answer: (a) => a.canon.crew,
    explanation: (a) => `${a.canon.crew} — the day ones.`,
  },
  {
    kind: 'speed_round', difficulty: 2, pool: 'year',
    prompt: (a) => `What year did ${a.canon.album} drop?`,
    answer: (a) => String(a.canon.albumYear),
    explanation: (a) => `${a.canon.album} released in ${a.canon.albumYear}.`,
  },
  {
    kind: 'lyric_gap', difficulty: 2, pool: 'lyric',
    prompt: (a) => `Fill the gap — ${a.name}: "${a.canon.lyric}"`,
    answer: (a) => a.canon.lyricAnswer,
    explanation: (a) => `The line lands as "${a.canon.lyric.replace('___', a.canon.lyricAnswer)}".`,
  },
  {
    kind: 'cover_art', difficulty: 2, pool: 'album',
    prompt: (a) => `Which ${a.name} project has cover art showing ${a.canon.cover}?`,
    answer: (a) => a.canon.album,
    explanation: (a) => `That is the ${a.canon.album} cover — ${a.canon.cover}.`,
  },
  {
    kind: 'cover_art', difficulty: 1, pool: 'mixtape',
    prompt: (a) => `${a.name}'s first tape cover is often described as raw and unpolished. Which project is it?`,
    answer: (a) => a.canon.mixtape,
    explanation: (a) => `${a.canon.mixtape}, ${a.canon.mixtapeYear}.`,
  },
  {
    kind: 'deep_cut', difficulty: 3, pool: 'producer',
    prompt: (a) => `Who produced the bulk of ${a.canon.album}?`,
    answer: (a) => a.canon.producer,
    explanation: (a) => `${a.canon.producer} handled the majority of ${a.canon.album}.`,
  },
  {
    kind: 'deep_cut', difficulty: 3, pool: 'feature',
    prompt: (a) => `Which artist appears on ${a.name}'s most-streamed feature?`,
    answer: (a) => a.canon.feature,
    explanation: (a) => `${a.canon.feature} and ${a.name} have the collaboration fans keep asking to be repeated.`,
  },
  {
    kind: 'deep_cut', difficulty: 3, pool: 'venue',
    prompt: (a) => `Where did ${a.name} play their first sold-out headline show?`,
    answer: (a) => a.canon.venue,
    explanation: (a) => `${a.canon.venue} — the room that marked the turn.`,
  },
  {
    kind: 'daily_drop', difficulty: 2, pool: 'mixtapeYear',
    prompt: (a) => `Today's drop: what year did ${a.name} release ${a.canon.mixtape}?`,
    answer: (a) => String(a.canon.mixtapeYear),
    explanation: (a) => `${a.canon.mixtape} arrived in ${a.canon.mixtapeYear}.`,
  },
];

// Extra flavor answers so small pools (years, lyric words) still have four
// credible options.
export const FILLER = {
  lyric: ['corner', 'record', 'promise', 'silence', 'money', 'city', 'morning', 'engine', 'window', 'reason'],
  adlib: ['"woo"', '"okay okay"', '"let’s go"', '"uh huh"', '"talk to ’em"', '"say less"'],
};
