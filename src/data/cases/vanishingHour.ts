import { CaseDefinition } from "../../types/case";

// Case 1 — free release. Locked-room mystery, single core location (The Study)
// with a close-up drawer state and a hidden second room, exactly as scoped for
// a solo-buildable first case.

export const vanishingHour: CaseDefinition = {
  id: "vanishing-hour",
  title: "The Vanishing Hour",
  subtitle: "Case No. 001 — The Voss Study",
  premise:
    "Edmund Voss — a recluse whose fortune once outpaced his restraint, and whose precision covered for more than anyone guessed — vanished from his locked study at the stroke of midnight. No forced entry. No body. No obvious motive, only the people who knew him best: a brother he'd stopped answering, a housekeeper who'd started watching him too closely, and the objects he left behind. You are the detective called in before the police, and before the trail goes cold. Piece together what happened in that room.",
  isFree: true,
  estimatedMinutes: 20,
  // Cold open, first playthrough only. Sets up Edmund as a person — and plants why the
  // clock matters — without naming his condition or hinting at the debt/passage/ending.
  intro: [
    {
      id: "slide1",
      visual: "deskSilhouette",
      caption:
        "Edmund Voss had spent thirty years building a life that ran on precision — a fortune, a reputation, a study no one entered uninvited. Then, for reasons he never spoke of, the precision slipped: reckless wagers, a fortune bleeding out one bet at a time. By the end, only two people besides himself held a key to that room — his housekeeper, Mara, and his brother, Silas. He trusted very little to memory, and even less to anyone else.",
    },
    {
      id: "slide2",
      visual: "worriedSilhouette",
      speaker: "Edmund",
      speech: "I keep losing pieces of the day. Just... gone.",
      bubbleOrigin: { x: 0.5, y: 0.5 },
      caption:
        "He told no one. Not even his brother. But Mara had started watching him more closely than a housekeeper should — she'd waited years for the partnership he kept promising her, and lately, waiting was starting to look like all she'd ever get.",
    },
    {
      id: "slide3",
      visual: "twoSilhouettesDoor",
      speaker: "Silas",
      bubbleOrigin: { x: 0.45, y: 0.28 },
      speech: "You're not answering your letters, Edmund.",
      caption:
        "Some doors, once closed, are hard to explain. Edmund had borrowed a small fortune from his brother, back when the wagers still felt like they'd turn around. Silas had his own reasons for wanting this one open.",
    },
    {
      id: "slide4",
      visual: "clockCloseup",
      speaker: "Edmund",
      bubbleOrigin: { x: 0.8, y: 0.9 },
      speech: "If I forget everything else tonight... let this be the one thing I don't.",
      caption: "He needed a way to remember. He never dreamed anyone else would need to.",
    },
    {
      id: "slide5",
      visual: "emptyStudyNight",
      title: "TONIGHT",
      caption:
        "Edmund Voss is gone. The room remembers more than he could. Only two people crossed that threshold tonight — Mara, bringing supper as always, and Silas, come one last time to ask for his money back.",
    },
  ],
  scenes: [
    {
      id: "study",
      name: "The Study",
      description:
        "Heavy curtains. A cold fireplace. The air still smells faintly of pipe smoke, as if he only just stepped out.",
      background: "study",
      hotspots: [
        {
          id: "painting",
          kind: "observation",
          label: "Crooked Painting",
          x: 0.18,
          y: 0.06,
          w: 0.18,
          h: 0.28,
          clue: {
            id: "brassKey",
            title: "Small Brass Key",
            detail:
              "A landscape painting hangs slightly crooked. Behind it, taped to the wall, a small brass key.",
            icon: "🗝️",
          },
        },
        {
          id: "clock",
          kind: "observation",
          label: "Stopped Clock",
          x: 0.49,
          y: 0.26,
          w: 0.07,
          h: 0.15,
          clue: {
            id: "stoppedClock",
            title: "Stopped Clock",
            detail:
              "The mantel clock isn't broken — it's stopped on purpose, hour and minute hands held fast at eleven and twenty-three. Not midnight, when he vanished. Earlier. As if he needed to remember something under pressure, and trusted a clock more than his own memory.",
            icon: "🕚",
          },
        },
        {
          id: "prescription",
          kind: "observation",
          label: "Prescription Bottle",
          x: 0.585,
          y: 0.34,
          w: 0.035,
          h: 0.08,
          clue: {
            id: "prescriptionBottle",
            title: "Prescription Bottle",
            detail:
              'Tucked behind the clock, half-hidden — a small amber bottle, prescribed three months ago. The label names a drug for memory. Early-onset Alzheimer\'s, though he never once wrote the word himself. Only ever "the trouble."',
            icon: "💊",
          },
        },
        {
          id: "armchair",
          kind: "observation",
          label: "Worn Armchair",
          x: 0.27,
          y: 0.48,
          w: 0.2,
          h: 0.47,
          clue: {
            id: "chairAshes",
            title: "Cold Ashes",
            detail:
              'A worn reading chair beside the fireplace. The grate holds cold ashes — bank statements and old letters, by the curl of the scraps, burned before he left. One fragment survives, in a hurried hand: "...tell Silas I tried—" Nothing more.',
            icon: "🪑",
          },
        },
        {
          id: "soupCup",
          kind: "observation",
          label: "Emptied Bowl",
          x: 0.12,
          y: 0.665,
          w: 0.1,
          h: 0.08,
          clue: {
            id: "soupCup",
            title: "Bowl of Soup, Emptied",
            detail:
              "A small side table, and on it, a bowl — Mara's doing, by the faint herbal smell still clinging to it. But it's empty. Wiped clean at the bottom: no film of dried broth, no spoon left resting in a half-finished meal. Not eaten. Poured out somewhere else, and set back down as if untouched.",
            icon: "🥣",
          },
        },
        {
          id: "brandyGlasses",
          kind: "observation",
          label: "Two Glasses",
          x: 0.09,
          y: 0.58,
          w: 0.14,
          h: 0.075,
          clue: {
            id: "brandyGlasses",
            title: "Two Brandy Glasses",
            detail:
              "Two glasses on the same table, not one. Edmund's, barely touched — a finger's width gone. The other, drained to the bottom and set down hard enough to chip the rim. Whatever was said in this room tonight, only one of them stayed calm.",
            icon: "🥃",
          },
        },
        {
          id: "desk",
          kind: "navigate",
          label: "Locked Desk",
          toSceneId: "drawer",
          x: 0.49,
          y: 0.6,
          w: 0.43,
          h: 0.4,
          requiresClueId: "brassKey",
          lockedHint: "The desk drawer is locked tight. Nothing to turn a key in — yet.",
        },
        {
          id: "bookshelfPuzzle",
          kind: "puzzle",
          label: "Third Shelf",
          puzzleId: "shelfSymbols",
          x: 0.69,
          y: 0.37,
          w: 0.31,
          h: 0.14,
          requiresClueId: "cipherSolved",
          lockedHint:
            "Just books, spine to spine. Nothing about this shelf asks to be touched — not yet.",
        },
        {
          id: "passageDoor",
          kind: "navigate",
          label: "Hidden Passage",
          toSceneId: "passage",
          x: 0.69,
          y: 0.05,
          w: 0.31,
          h: 0.54,
          requiresClueId: "passageRevealed",
          hideWhenLocked: true,
        },
      ],
    },
    {
      id: "drawer",
      name: "The Desk Drawer",
      description:
        "The key turns easily, but a second lock waits beneath it — a small dial, four digits.",
      background: "drawer",
      backTo: "study",
      hotspots: [
        {
          id: "deskLockPuzzle",
          kind: "puzzle",
          label: "Number Dial",
          puzzleId: "deskLock",
          x: 0.32,
          y: 0.36,
          w: 0.36,
          h: 0.28,
        },
        {
          id: "cipherNoteSpot",
          kind: "puzzle",
          label: "Coded Note",
          puzzleId: "cipherNote",
          x: 0.08,
          y: 0.1,
          w: 0.32,
          h: 0.28,
          requiresClueId: "drawerOpened",
        },
        {
          id: "familyPhotoSpot",
          kind: "observation",
          label: "Family Photograph",
          x: 0.6,
          y: 0.08,
          w: 0.3,
          h: 0.3,
          requiresClueId: "drawerOpened",
          revealOnce: true,
          clue: {
            id: "photoSymbols",
            title: "Family Photograph",
            detail:
              "A photo of Edmund as a boy, standing before this very bookshelf. On the spines behind him, five symbols catch the light, in this order: 🌙 → 🔥 → ⭐ → 🌊 → ☀️",
            icon: "🖼️",
          },
        },
        {
          id: "lettersSpot",
          kind: "observation",
          label: "Personal Letters",
          x: 0.1,
          y: 0.55,
          w: 0.34,
          h: 0.28,
          requiresClueId: "drawerOpened",
          clue: {
            id: "oldLetters",
            title: "Bundle of Letters",
            detail:
              "A solicitor's final notice, found among the papers on the desk: settle the outstanding balance by eleven o'clock tonight, or the property is seized at first light. Tucked behind it, a betting-house receipt gone brittle with age, dated over a year past, for a sum larger than the house itself was worth — the gambling had stopped by then, but the debt it left behind hadn't. Scrawled beneath the notice, in Edmund's own hand: 11:23 — the same frozen moment on the mantel clock. Not a memory lapse. A message to himself.",
            icon: "✉️",
          },
        },
        {
          id: "diaryPageSpot",
          kind: "observation",
          label: "Torn Diary Page",
          x: 0.5,
          y: 0.55,
          w: 0.34,
          h: 0.3,
          requiresClueId: "drawerOpened",
          clue: {
            id: "maraDiaryPage",
            title: "A Torn Diary Page",
            detail:
              "Not his usual ledger hand — smaller, more private. \"Snapped at Mara again today. Accused her of moving my letters. She hadn't — found them exactly where I'd left them, in my own coat pocket, and still I made her cry over it. She has said nothing since, only leaves the soup and goes. I don't drink it anymore. Not because I think she means harm — I don't, not really — but because some nights I can't trust my own suspicion of her, and pouring it out the scullery window is easier than sitting with that thought.\" The rest of the page is torn away.",
            icon: "📓",
          },
        },
      ],
    },
    {
      id: "passage",
      name: "Behind the Bookshelf",
      description:
        "The third shelf swings inward on a hidden hinge. A narrow passage, and stairs leading down.",
      background: "passage",
      backTo: "study",
      hotspots: [
        {
          id: "toHiddenRoom",
          kind: "navigate",
          label: "Descend the Stairs",
          toSceneId: "hiddenRoom",
          x: 0.3,
          y: 0.3,
          w: 0.4,
          h: 0.5,
        },
      ],
    },
    {
      id: "hiddenRoom",
      name: "The Hidden Room",
      description:
        "A small room, no bigger than a closet. A packed travel case. A second set of clothes. And a train ticket, dated tonight.",
      background: "hiddenRoom",
      backTo: "passage",
      hotspots: [
        {
          id: "travelCase",
          kind: "observation",
          label: "Packed Travel Case",
          x: 0.1,
          y: 0.4,
          w: 0.32,
          h: 0.34,
          clue: {
            id: "ticket",
            title: "Train Ticket — Tonight",
            detail:
              "A packed case and a one-way ticket, purchased under a false name, departing an hour after he was last seen. He was not taken. He left.",
            icon: "🎫",
          },
        },
        {
          id: "silasNoteSpot",
          kind: "observation",
          label: "Note in a Coat Pocket",
          x: 0.43,
          y: 0.28,
          w: 0.11,
          h: 0.22,
          clue: {
            id: "silasNote",
            title: "A Note, Half-Finished",
            detail:
              'Tucked into the pocket of the spare coat on the hook: a note in Edmund\'s hand, abandoned mid-sentence. "Silas came at ten, wanting the money back before I could—" It stops there. But downstairs, the second brandy glass was drained, not thrown, and the front door latch shows no forcing, no struggle. Whatever words passed between them, Silas left the way he came: through the front door, on his own two feet, hours before midnight. Whatever happened to Edmund happened after his brother was already gone.',
            icon: "📝",
          },
        },
        {
          id: "evidenceBoardEntry",
          kind: "navigate",
          label: "Open the Evidence Board",
          toSceneId: "evidenceBoard",
          x: 0.55,
          y: 0.2,
          w: 0.34,
          h: 0.5,
          requiresClueId: "ticket",
        },
      ],
    },
  ],
  puzzles: [
    {
      id: "deskLock",
      type: "numberLock",
      title: "The Desk Dial",
      flavorText:
        "Four digits. He wasn't a man who trusted his memory under pressure — he trusted objects instead. Mara, the housekeeper, swears she never touched the dial, so whatever he used to remember this combination, he left it somewhere only he'd think to look.",
      digits: 4,
      solution: "1123",
      successClue: {
        id: "drawerOpened",
        title: "Drawer Opened",
        detail: "The dial clicks. The drawer slides free.",
        icon: "🔓",
      },
    },
    {
      id: "cipherNote",
      type: "cipher",
      title: "The Coded Note",
      flavorText:
        "A note in Edmund's own hand, but not in his own words — every letter shifted by the same amount. Find the shift.",
      cipherText: "VHHN WKH WKLUG VKHOI",
      shift: 3,
      plaintext: "SEEK THE THIRD SHELF",
      successClue: {
        id: "cipherSolved",
        title: 'Decoded: "Seek The Third Shelf"',
        detail: "The note points to the bookshelf — specifically, its third shelf.",
        icon: "🔡",
      },
    },
    {
      id: "shelfSymbols",
      type: "symbolMatch",
      title: "The Third Shelf",
      flavorText:
        "Five books on the third shelf, each spine marked with a symbol. Arrange them to match an order you've seen before.",
      symbols: ["🌙", "☀️", "⭐", "🔥", "🌊"],
      solutionOrder: ["🌙", "🔥", "⭐", "🌊", "☀️"],
      successClue: {
        id: "passageRevealed",
        title: "Hidden Passage Revealed",
        detail: "The shelf swings inward. A passage, where a wall should be.",
        icon: "🚪",
      },
    },
  ],
  deduction: [
    {
      id: "suspect",
      label: "Who vanished by their own hand?",
      options: [
        { id: "edmund", label: "Edmund Voss himself" },
        { id: "silas", label: "Silas Voss, his estranged brother" },
        { id: "mara", label: "Mara Quill, the housekeeper" },
        { id: "noone", label: "No one — he was taken" },
      ],
      correctOptionId: "edmund",
    },
    {
      id: "method",
      label: "How did they leave the locked study?",
      options: [
        { id: "passage", label: "Through the hidden passage behind the bookshelf" },
        { id: "window", label: "Through the study window" },
        { id: "never", label: "They never left — still hidden in the house" },
        { id: "accomplice", label: "Smuggled out by an accomplice" },
      ],
      correctOptionId: "passage",
    },
    {
      id: "motive",
      label: "Why stage a disappearance?",
      options: [
        { id: "debt", label: "To escape creditors before the house was seized" },
        { id: "revenge", label: "Revenge for a family betrayal" },
        { id: "inheritance", label: "An inheritance dispute" },
        { id: "secret", label: "To protect a secret from the housekeeper" },
      ],
      correctOptionId: "debt",
    },
  ],
  correctEnding:
    "You lay the letters beside the ticket. Eleven, twenty-three — not a code, a deadline. Edmund Voss was never taken. He built himself a door out of his own house, and walked through it an hour before the creditors would have come to seize it in the morning. The \"vanishing\" was the only trick he had left, and he played it well enough to fool everyone but you.\n\nBut the debt was only ever the deadline. The real reason was smaller, and sadder — a bottle behind the clock, a word he never let himself say out loud. He wasn't just running from creditors. He was running while he could still remember why.\n\nSilas got his brandy and his tense words, and left with neither the money nor an answer — a brother shut out, not a brother who struck. Mara got an empty bowl and no explanation, just a man who'd started fearing his own suspicion more than he feared being alone. Neither of them made Edmund Voss vanish. His own arithmetic did that — and his own fear of forgetting made sure it happened before he could forget why.\n\nCASE CLOSED — SOLVED",
  incorrectEnding:
    "You present your case, but the pieces don't sit right — a detail contradicts itself the moment you say it aloud. Somewhere in that study, you missed something. The trail is still warm. It might be worth walking the room again.\n\nCASE UNRESOLVED",
};

export const allCases = [vanishingHour];
