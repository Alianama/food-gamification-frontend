import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeId = 'default' | 'forest' | 'ocean' | 'sunset' | 'candy' | 'night';
export type CharacterId = 'orange' | 'cat' | 'dog' | 'fish' | 'dragon' | 'bunny';

interface ThemeState {
  themeId: ThemeId;
  characterId: CharacterId;
  loaded: boolean;
}

const initialState: ThemeState = {
  themeId: 'default',
  characterId: 'orange',
  loaded: false,
};

const STORAGE_KEY = '@foodify_theme';

export const loadThemeSettings = createAsyncThunk('theme/load', async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) return JSON.parse(json) as { themeId: ThemeId; characterId: CharacterId };
  } catch {}
  return null;
});

export const saveThemeSettings = createAsyncThunk(
  'theme/save',
  async (settings: { themeId: ThemeId; characterId: CharacterId }) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return settings;
  },
);

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeId>) {
      state.themeId = action.payload;
      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ themeId: action.payload, characterId: state.characterId }),
      ).catch(() => {});
    },
    setCharacter(state, action: PayloadAction<CharacterId>) {
      state.characterId = action.payload;
      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ themeId: state.themeId, characterId: action.payload }),
      ).catch(() => {});
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadThemeSettings.fulfilled, (state, action) => {
        if (action.payload) {
          state.themeId = action.payload.themeId;
          state.characterId = action.payload.characterId;
        }
        state.loaded = true;
      })
      .addCase(saveThemeSettings.fulfilled, (state, action) => {
        state.themeId = action.payload.themeId;
        state.characterId = action.payload.characterId;
      });
  },
});

export const { setTheme, setCharacter } = themeSlice.actions;
export default themeSlice.reducer;

// ─── Theme Definitions ───────────────────────────────────────────────────────

export interface ThemeDef {
  id: ThemeId;
  name: string;
  label: string;
  sky: [string, string, string];
  ground: string;
  particle: string;
  accent: string;
  sickModifier: [string, string, string]; // overlay when HP low
}

export const THEMES: Record<ThemeId, ThemeDef> = {
  default: {
    id: 'default', name: 'Orange Dawn', label: '☀️',
    sky: ['#FFF8E1', '#FFD54F', '#FFB300'],
    ground: '#FF9800',
    particle: '#FFE082',
    accent: '#E65100',
    sickModifier: ['#B0BEC5', '#90A4AE', '#78909C'],
  },
  forest: {
    id: 'forest', name: 'Deep Forest', label: '🌲',
    sky: ['#C8E6C9', '#81C784', '#388E3C'],
    ground: '#2E7D32',
    particle: '#AED581',
    accent: '#33691E',
    sickModifier: ['#78909C', '#546E7A', '#455A64'],
  },
  ocean: {
    id: 'ocean', name: 'Ocean Blue', label: '🌊',
    sky: ['#E3F2FD', '#64B5F6', '#1565C0'],
    ground: '#0277BD',
    particle: '#81D4FA',
    accent: '#01579B',
    sickModifier: ['#90A4AE', '#78909C', '#607D8B'],
  },
  sunset: {
    id: 'sunset', name: 'Sunset', label: '🌅',
    sky: ['#FFF8E1', '#FFAB40', '#E64A19'],
    ground: '#BF360C',
    particle: '#FFD180',
    accent: '#DD2C00',
    sickModifier: ['#9E9E9E', '#757575', '#616161'],
  },
  candy: {
    id: 'candy', name: 'Candy Land', label: '🍭',
    sky: ['#FCE4EC', '#F48FB1', '#E91E63'],
    ground: '#AD1457',
    particle: '#F8BBD9',
    accent: '#880E4F',
    sickModifier: ['#B0BEC5', '#90A4AE', '#78909C'],
  },
  night: {
    id: 'night', name: 'Night Sky', label: '🌙',
    sky: ['#1A237E', '#283593', '#0D47A1'],
    ground: '#311B92',
    particle: '#B39DDB',
    accent: '#FFD740',
    sickModifier: ['#212121', '#1A1A2E', '#16213E'],
  },
};

// ─── Character Definitions ────────────────────────────────────────────────────

export interface CharacterDef {
  id: CharacterId;
  name: string;
  emoji: string;
  color: string;          // primary body color
  accentColor: string;    // secondary
  eyeColor: string;
  tapReactions: string[];
  longPressReactions: string[];
  doubleTapReactions: string[];
  hungryReactions: string[];
  happyReactions: string[];
  sickReactions: string[];
  idleSound: string;      // descriptive (not actual sound)
}

export const CHARACTERS: Record<CharacterId, CharacterDef> = {
  orange: {
    id: 'orange', name: 'Orange', emoji: '🍊',
    color: '#FF9800', accentColor: '#FF6D00', eyeColor: '#1A1A1A',
    tapReactions:       ["Au! Geli deh~", "Hei jangan cubit!", "Kyaa~!", "Aduh sakit tau!"],
    longPressReactions: ["Sayang kamu...", "Makasih jagain aku!", "Uwuu... nyaman~"],
    doubleTapReactions: ["Hahaha stop~!", "Wah wah wah!", "Kamu gila ya?!"],
    hungryReactions:    ["Laperr... makan dong!", "Perut ku krucuk-krucuk~", "Scan makanan dulu!"],
    happyReactions:     ["Yay! Aku sehat!", "Level naik nih!", "Hari ini menyenangkan!"],
    sickReactions:      ["Badanku ngga enak...", "Tolong kasih aku makan sehat...", "Ugh..."],
    idleSound:          'bounce',
  },
  cat: {
    id: 'cat', name: 'Cat', emoji: '🐱',
    color: '#FF8A65', accentColor: '#FFCCBC', eyeColor: '#1A237E',
    tapReactions:       ["Purrr~", "Mrrrow!", "Hmph, manusia iseng!", "Hssss!"],
    longPressReactions: ["...purrr... zzz...", "Boleh deh, tapi sekali aja~", "Purrr purr~"],
    doubleTapReactions: ["MREOW!!", "Apa-apaan?!", "Jangan lebay!"],
    hungryReactions:    ["Meow? Makan dulu dong~", "Ngga dikasih makan nih?", "*menggosok kaki*"],
    happyReactions:     ["Purrr~", "Mrrrow! Enak~", "Ini hari bagus!"],
    sickReactions:      ["Meow...", "...mau tiduran aja", "Ngga mood..."],
    idleSound:          'purr',
  },
  dog: {
    id: 'dog', name: 'Dog', emoji: '🐶',
    color: '#8D6E63', accentColor: '#D7CCC8', eyeColor: '#4E342E',
    tapReactions:       ["Woof! Woof!", "Hehe! Asik~", "AaWoo~!", "Mau main?!"],
    longPressReactions: ["*ngibas ekor*", "Makasih makasih makasih!", "Aku sayaang kamu!"],
    doubleTapReactions: ["WOOFwoof WOOF!", "YAY YAY YAY!", "AaAaAa~!"],
    hungryReactions:    ["Woof... laper nih...", "Scan makanannya dong!", "*lirik-lirik mangkuk*"],
    happyReactions:     ["Woof woof! Hore!", "Sehat hari ini! *ngibas ekor*", "Main yuk!"],
    sickReactions:      ["Whimper...", "Ngga enak badan...", "*rebahan*"],
    idleSound:          'wag',
  },
  fish: {
    id: 'fish', name: 'Fish', emoji: '🐟',
    color: '#29B6F6', accentColor: '#B3E5FC', eyeColor: '#01579B',
    tapReactions:       ["*blup blup*", "Glub~!", "Hei! Air ku tumpah!", "*berenang menjauh*"],
    longPressReactions: ["blup... blup...", "*berenang pelan-pelan*", "Glub~ nyaman~"],
    doubleTapReactions: ["BLUP BLUP BLUP!", "*berputar cepat*", "Glub glub!"],
    hungryReactions:    ["blup... laper...", "Kasih makan dong~ *blup*", "Perlu nutrisi nih!"],
    happyReactions:     ["*blup blup blup*", "Renang yuuk~!", "Air hari ini segar!"],
    sickReactions:      ["blup...", "*terapung pelan*", "Air... ngga segar..."],
    idleSound:          'swim',
  },
  dragon: {
    id: 'dragon', name: 'Dragon', emoji: '🐉',
    color: '#66BB6A', accentColor: '#EF9A9A', eyeColor: '#BF360C',
    tapReactions:       ["*mendesis*", "GRAAWR!", "Jangan usik aku!", "Berani kamu!"],
    longPressReactions: ["Hmm... kamu berani...", "*mendengkur*", "Aku kagumi keberanianmu~"],
    doubleTapReactions: ["GRAAAAWR!!", "*semburkan api kecil*", "RAWR RAWR!"],
    hungryReactions:    ["Grr... laper...", "Butuh makan untuk terbang!", "*api mengecil*"],
    happyReactions:     ["RAWR! Mantap!", "Hari ini aku kuat!", "*semburkan api selebrasi*"],
    sickReactions:      ["Grr...", "*sayap terkulai*", "Api ku... meredup..."],
    idleSound:          'flap',
  },
  bunny: {
    id: 'bunny', name: 'Bunny', emoji: '🐰',
    color: '#F8BBD9', accentColor: '#FCE4EC', eyeColor: '#E91E63',
    tapReactions:       ["Kya~!", "Eek!", "*telinga tegak*", "J-jangan kejutkan aku!"],
    longPressReactions: ["...nyaman~", "*digendong*", "Tapi... jangan lama-lama ya..."],
    doubleTapReactions: ["KYAAAA!", "*melompat*", "Kaget tau!"],
    hungryReactions:    ["...laper...", "Wortel... mana wortelnya...", "*hidung berkedut*"],
    happyReactions:     ["*hop hop hop*", "Senaaaang!", "Lalala~"],
    sickReactions:      ["...ugh...", "*telinga lemas*", "Ngga mau gerak..."],
    idleSound:          'hop',
  },
};
