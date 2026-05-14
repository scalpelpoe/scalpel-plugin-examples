# scalpel-plugin-examples

A showcase plugin for [Scalpel](https://github.com/scalpelpoe/scalpel) demonstrating every visual component shipped by the `@filterscalpel/plugin-sdk`. Use the source as a copy-paste reference when building your own plugin.

## What it shows

- Item display: parses the clipboard item via `ctx.copyAndEvaluateItem()`, renders the icon (`getItemIcon`), name in rarity color (`RARITY_COLORS`), class, and identity flags (`isClusterJewel`, `isSkillGem`).
- Inputs: `Button` (all variants and sizes, including `iconOnly`), `Label`, `TextInput`, `Textarea`, `Slider`, `StepInput`.
- Surfaces: `Toggle`, `Notice`, `ErrorBanner` (error + warn tones).
- Items and links: `ItemChip` (base + Divination Cards), `ExternalLinkButton` (wired to `externalLinkUrl`), `RemoveButton`.
- Settings rows: `SettingToggleBox`, `SettingSelectBox`, `LeagueDropdown`.
- Hotkey inputs: `HotkeyField` (full width), `HotkeyRecorder` (compact 200px).
- Helpers: `formatPrice`, `formatDust`, `useCurrentZone`.

## Build

```
npm install
npm run build
```

Outputs `dist/plugin.js` and `dist/manifest.json`.

## Local install

1. In Scalpel, open Settings &gt; Developer and toggle Developer mode on.
2. Click "Load unpacked plugin..." and pick this folder's `dist/`.
3. Restart Scalpel.
4. (Optional) In Settings &gt; Macros &gt; Plugin Hotkeys, bind a key for "Plugin Examples: Inspect item". Hover an item in PoE and press it to populate the panel.

Alternatively, copy `dist/plugin.js` and `dist/manifest.json` into `%APPDATA%\Scalpel\plugins\plugin-examples\` and add `"plugin-examples"` to `installed.json` in that same `plugins/` directory.

## License

MIT
