import { CaseDefinition } from '../../types/case';

// Case 1 — free release. Locked-room mystery, single core location (The Study)
// with a close-up drawer state and a hidden second room, exactly as scoped for
// a solo-buildable first case.

export const vanishingHour: CaseDefinition = {
  id: 'vanishing-hour',
  title: 'The Vanishing Hour',
  subtitle: 'Case No. 001 — The Voss Study',
  premise:
    'Edmund Voss, a wealthy recluse, vanished from his locked study at the stroke of midnight. No forced entry. No body. No obvious motive — only the objects he left behind. You are the detective called in before the police, and before the trail goes cold. Piece together what happened in that room.',
  isFree: true,
  estimatedMinutes: 20,
  // Cold open, first playthrough only. Sets up Edmund as a person — and plants why the
  // clock matters — without naming his condition or hinting at the debt/passage/ending.
  intro: [
    {
      id: 'slide1',
      visual: 'deskSilhouette',
      title: 'SIX MONTHS AGO',
      caption:
        'Edmund Voss had spent thirty years building a life that ran on precision — a fortune, a reputation, a study no one entered uninvited. He trusted very little to memory, and even less to other people.',
    },
    {
      id: 'slide2',
      visual: 'worriedSilhouette',
      speaker: 'Edmund',
      speech: 'I keep losing pieces of the day. Just... gone.',
      caption:
        'He told no one. Not even his brother. But Mara had started watching him more closely than a housekeeper should.',
    },
    {
      id: 'slide3',
      visual: 'twoSilhouettesDoor',
      speaker: 'Silas',
      speech: 'You\'re not answering your letters, Edmund.',
      caption:
        'Some doors, once closed, are hard to explain. Silas had his own reasons for wanting this one open.',
    },
    {
      id: 'slide4',
      visual: 'clockCloseup',
      speaker: 'Edmund',
      speech: 'If I forget everything else tonight... let this be the one thing I don\'t.',
      caption: 'He needed a way to remember. He never dreamed anyone else would need to.',
    },
    {
      id: 'slide5',
      visual: 'emptyStudyNight',
      title: 'TONIGHT',
      caption: 'Edmund Voss is gone. The room remembers more than he could.',
    },
  ],
  scenes: [
    {
      id: 'study',
      name: 'The Study',
      description:
        'Heavy curtains. A cold fireplace. The air still smells faintly of pipe smoke, as if he only just stepped out.',
      background: 'study',
      hotspots: [
        {
          id: 'painting',
          kind: 'observation',
          label: 'Crooked Painting',
          x: 0.06,
          y: 0.1,
          w: 0.24,
          h: 0.26,
          clue: {
            id: 'brassKey',
            title: 'Small Brass Key',
            detail:
              'A landscape painting hangs slightly crooked. Behind it, taped to the wall, a small brass key.',
            icon: '🗝️',
          },
        },
        {
          id: 'clock',
          kind: 'observation',
          label: 'Stopped Clock',
          x: 0.4,
          y: 0.04,
          w: 0.2,
          h: 0.18,
          clue: {
            id: 'stoppedClock',
            title: 'Stopped Clock',
            detail:
              "The mantel clock isn't broken — it's stopped on purpose, hour and minute hands held fast at eleven and twenty-three. Not midnight, when he vanished. Earlier. As if he needed to remember something under pressure, and trusted a clock more than his own memory.",
            icon: '🕚',
          },
        },
        {
          id: 'prescription',
          kind: 'observation',
          label: 'Prescription Bottle',
          x: 0.605,
          y: 0.19,
          w: 0.065,
          h: 0.06,
          clue: {
            id: 'prescriptionBottle',
            title: 'Prescription Bottle',
            detail:
              'Tucked behind the clock, half-hidden — a small amber bottle, prescribed three months ago. The label names a drug for memory. Early-onset Alzheimer\'s, though he never once wrote the word himself. Only ever "the trouble."',
            icon: '💊',
          },
        },
        {
          id: 'armchair',
          kind: 'observation',
          label: 'Worn Armchair',
          x: 0.04,
          y: 0.64,
          w: 0.22,
          h: 0.3,
          clue: {
            id: 'chairAshes',
            title: 'Cold Ashes',
            detail:
              'A worn reading chair beside the fireplace. The grate holds cold ashes — bank statements and old letters, by the curl of the scraps, burned before he left. One fragment survives, in a hurried hand: "...tell Silas I tried—" Nothing more.',
            icon: '🪑',
          },
        },
        {
          id: 'desk',
          kind: 'navigate',
          label: 'Locked Desk',
          toSceneId: 'drawer',
          x: 0.28,
          y: 0.56,
          w: 0.42,
          h: 0.32,
          requiresClueId: 'brassKey',
          lockedHint: 'The desk drawer is locked tight. Nothing to turn a key in — yet.',
        },
        {
          id: 'bookshelfPuzzle',
          kind: 'puzzle',
          label: 'Third Shelf',
          puzzleId: 'shelfSymbols',
          x: 0.68,
          y: 0.26,
          w: 0.29,
          h: 0.13,
          requiresClueId: 'cipherSolved',
          lockedHint: 'Just books, spine to spine. Nothing about this shelf asks to be touched — not yet.',
        },
        {
          id: 'passageDoor',
          kind: 'navigate',
          label: 'Hidden Passage',
          toSceneId: 'passage',
          x: 0.68,
          y: 0.04,
          w: 0.28,
          h: 0.58,
          requiresClueId: 'passageRevealed',
          hideWhenLocked: true,
        },
      ],
    },
    {
      id: 'drawer',
      name: 'The Desk Drawer',
      description:
        'The key turns easily, but a second lock waits beneath it — a small dial, four digits.',
      background: 'drawer',
      backTo: 'study',
      hotspots: [
        {
          id: 'deskLockPuzzle',
          kind: 'puzzle',
          label: 'Number Dial',
          puzzleId: 'deskLock',
          x: 0.32,
          y: 0.36,
          w: 0.36,
          h: 0.28,
        },
        {
          id: 'cipherNoteSpot',
          kind: 'puzzle',
          label: 'Coded Note',
          puzzleId: 'cipherNote',
          x: 0.08,
          y: 0.1,
          w: 0.32,
          h: 0.28,
          requiresClueId: 'drawerOpened',
        },
        {
          id: 'familyPhotoSpot',
          kind: 'observation',
          label: 'Family Photograph',
          x: 0.6,
          y: 0.08,
          w: 0.3,
          h: 0.3,
          requiresClueId: 'drawerOpened',
          revealOnce: true,
          clue: {
            id: 'photoSymbols',
            title: 'Family Photograph',
            detail:
              'A photo of Edmund as a boy, standing before this very bookshelf. On the spines behind him, five symbols catch the light, in this order: 🌙 → 🔥 → ⭐ → 🌊 → ☀️',
            icon: '🖼️',
          },
        },
        {
          id: 'lettersSpot',
          kind: 'observation',
          label: 'Personal Letters',
          x: 0.1,
          y: 0.55,
          w: 0.34,
          h: 0.28,
          requiresClueId: 'drawerOpened',
          clue: {
            id: 'oldLetters',
            title: 'Bundle of Letters',
            detail:
              'A solicitor\'s final notice, found among the papers on the desk: settle the outstanding balance by eleven o\'clock tonight, or the property is seized at first light. Scrawled beneath it, in Edmund\'s own hand: 11:23 — the same frozen moment on the mantel clock. Not a memory lapse. A message to himself.',
            icon: '✉️',
          },
        },
      ],
    },
    {
      id: 'passage',
      name: 'Behind the Bookshelf',
      description:
        'The third shelf swings inward on a hidden hinge. A narrow passage, and stairs leading down.',
      background: 'passage',
      backTo: 'study',
      hotspots: [
        {
          id: 'toHiddenRoom',
          kind: 'navigate',
          label: 'Descend the Stairs',
          toSceneId: 'hiddenRoom',
          x: 0.3,
          y: 0.3,
          w: 0.4,
          h: 0.5,
        },
      ],
    },
    {
      id: 'hiddenRoom',
      name: 'The Hidden Room',
      description:
        'A small room, no bigger than a closet. A packed travel case. A second set of clothes. And a train ticket, dated tonight.',
      background: 'hiddenRoom',
      backTo: 'passage',
      hotspots: [
        {
          id: 'travelCase',
          kind: 'observation',
          label: 'Packed Travel Case',
          x: 0.1,
          y: 0.4,
          w: 0.32,
          h: 0.34,
          clue: {
            id: 'ticket',
            title: 'Train Ticket — Tonight',
            detail:
              'A packed case and a one-way ticket, purchased under a false name, departing an hour after he was last seen. He was not taken. He left.',
            icon: '🎫',
          },
        },
        {
          id: 'evidenceBoardEntry',
          kind: 'navigate',
          label: 'Open the Evidence Board',
          toSceneId: 'evidenceBoard',
          x: 0.55,
          y: 0.2,
          w: 0.34,
          h: 0.5,
          requiresClueId: 'ticket',
        },
      ],
    },
  ],
  puzzles: [
    {
      id: 'deskLock',
      type: 'numberLock',
      title: 'The Desk Dial',
      flavorText:
        'Four digits. He wasn\'t a man who trusted his memory under pressure — he trusted objects instead. Mara, the housekeeper, swears she never touched the dial, so whatever he used to remember this combination, he left it somewhere only he\'d think to look.',
      digits: 4,
      solution: '1123',
      successClue: {
        id: 'drawerOpened',
        title: 'Drawer Opened',
        detail: 'The dial clicks. The drawer slides free.',
        icon: '🔓',
      },
    },
    {
      id: 'cipherNote',
      type: 'cipher',
      title: 'The Coded Note',
      flavorText:
        'A note in Edmund\'s own hand, but not in his own words — every letter shifted by the same amount. Find the shift.',
      cipherText: 'VHHN WKH WKLUG VKHOI',
      shift: 3,
      plaintext: 'SEEK THE THIRD SHELF',
      successClue: {
        id: 'cipherSolved',
        title: 'Decoded: "Seek The Third Shelf"',
        detail: 'The note points to the bookshelf — specifically, its third shelf.',
        icon: '🔡',
      },
    },
    {
      id: 'shelfSymbols',
      type: 'symbolMatch',
      title: 'The Third Shelf',
      flavorText:
        'Five books on the third shelf, each spine marked with a symbol. Arrange them to match an order you\'ve seen before.',
      symbols: ['🌙', '☀️', '⭐', '🔥', '🌊'],
      solutionOrder: ['🌙', '🔥', '⭐', '🌊', '☀️'],
      successClue: {
        id: 'passageRevealed',
        title: 'Hidden Passage Revealed',
        detail: 'The shelf swings inward. A passage, where a wall should be.',
        icon: '🚪',
      },
    },
  ],
  deduction: [
    {
      id: 'suspect',
      label: 'Who vanished by their own hand?',
      options: [
        { id: 'edmund', label: 'Edmund Voss himself' },
        { id: 'silas', label: 'Silas Voss, his estranged brother' },
        { id: 'mara', label: 'Mara Quill, the housekeeper' },
        { id: 'noone', label: 'No one — he was taken' },
      ],
      correctOptionId: 'edmund',
    },
    {
      id: 'method',
      label: 'How did they leave the locked study?',
      options: [
        { id: 'passage', label: 'Through the hidden passage behind the bookshelf' },
        { id: 'window', label: 'Through the study window' },
        { id: 'never', label: 'They never left — still hidden in the house' },
        { id: 'accomplice', label: "Smuggled out by an accomplice" },
      ],
      correctOptionId: 'passage',
    },
    {
      id: 'motive',
      label: 'Why stage a disappearance?',
      options: [
        { id: 'debt', label: 'To escape creditors before the house was seized' },
        { id: 'revenge', label: 'Revenge for a family betrayal' },
        { id: 'inheritance', label: 'An inheritance dispute' },
        { id: 'secret', label: 'To protect a secret from the housekeeper' },
      ],
      correctOptionId: 'debt',
    },
  ],
  correctEnding:
    'You lay the letters beside the ticket. Eleven, twenty-three — not a code, a deadline. Edmund Voss was never taken. He built himself a door out of his own house, and walked through it an hour before the creditors would have come to seize it in the morning. The "vanishing" was the only trick he had left, and he played it well enough to fool everyone but you.\n\nBut the debt was only ever the deadline. The real reason was smaller, and sadder — a bottle behind the clock, a word he never let himself say out loud. He wasn\'t just running from creditors. He was running while he could still remember why.\n\nCASE CLOSED — SOLVED',
  incorrectEnding:
    'You present your case, but the pieces don\'t sit right — a detail contradicts itself the moment you say it aloud. Somewhere in that study, you missed something. The trail is still warm. It might be worth walking the room again.\n\nCASE UNRESOLVED',
};

export const allCases = [vanishingHour];
