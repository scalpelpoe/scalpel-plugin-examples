import { createRoot, type Root } from 'react-dom/client'
import { useEffect, useState } from 'react'
import {
  // Identity / data helpers
  isClusterJewel,
  isSkillGem,
  RARITY_COLORS,
  // Formatters
  formatPrice,
  formatDust,
  // URL builders
  externalLinkUrl,
  // Hooks
  useCurrentZone,
  // Runtime helpers
  getItemIcon,
  // Stateless surfaces
  Toggle,
  Notice,
  ErrorBanner,
  // Form primitives
  Button,
  TextInput,
  Textarea,
  Slider,
  Label,
  // Specialised inputs
  StepInput,
  ItemChip,
  // Settings rows
  SettingToggleBox,
  SettingSelectBox,
  LeagueDropdown,
  // Hotkey inputs
  HotkeyField,
  HotkeyRecorder,
  // Misc
  RemoveButton,
  ExternalLinkButton,
  type ScalpelPluginContext,
  type PoeItem,
} from '@filterscalpel/plugin-sdk'

const ICON_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`

function Section({ title, children }: { title: string; children: React.ReactNode }): JSX.Element {
  return (
    <section
      style={{
        marginTop: 16,
        padding: 12,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid var(--border, rgba(255,255,255,0.08))',
        borderRadius: 6,
      }}
    >
      <h3
        style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          color: 'var(--text-dim, #888)',
          marginBottom: 10,
        }}
      >
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }): JSX.Element {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 110, fontSize: 11, color: 'var(--text-dim, #888)' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>{children}</div>
    </div>
  )
}

function rarityColor(rarity: string | undefined): string {
  if (!rarity) return 'var(--text, #eee)'
  const key = rarity as keyof typeof RARITY_COLORS
  return RARITY_COLORS[key] ?? 'var(--text, #eee)'
}

function ItemHero({ item }: { item: PoeItem | null }): JSX.Element {
  if (!item) {
    return (
      <div
        style={{
          padding: 16,
          textAlign: 'center',
          background: 'rgba(255,255,255,0.03)',
          border: '1px dashed var(--border, rgba(255,255,255,0.12))',
          borderRadius: 6,
          color: 'var(--text-dim, #888)',
          fontSize: 12,
        }}
      >
        Bind a hotkey for <strong>Plugin Examples: Inspect item</strong> in Settings &gt; Macros, hover an item in
        PoE, and press it. The item will be parsed and shown here.
      </div>
    )
  }
  const icon = getItemIcon(item)
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid var(--border, rgba(255,255,255,0.08))',
        borderRadius: 6,
      }}
    >
      {icon ? (
        <img src={icon} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
      ) : (
        <div
          style={{
            width: 40,
            height: 40,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-dim, #888)',
            fontSize: 10,
          }}
        >
          no icon
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: rarityColor(item.rarity), fontWeight: 600, fontSize: 14 }}>
          {item.name || item.baseType}
        </div>
        {item.name && item.baseType !== item.name && (
          <div style={{ color: rarityColor(item.rarity), opacity: 0.7, fontSize: 11 }}>{item.baseType}</div>
        )}
        <div style={{ fontSize: 10, color: 'var(--text-dim, #888)', marginTop: 4 }}>
          {item.itemClass} - {item.rarity}
          {isClusterJewel(item) ? ' - cluster' : ''}
          {isSkillGem(item) ? ' - gem' : ''}
        </div>
      </div>
    </div>
  )
}

function ExamplesPanel({ ctx }: { ctx: ScalpelPluginContext }): JSX.Element {
  const [item, setItem] = useState<PoeItem | null>(ctx.getCurrentItem())
  const zone = useCurrentZone()

  useEffect(() => ctx.onCurrentItem((i) => setItem(i)), [ctx])

  // Local state per control so the components are actually live, not static screenshots.
  const [toggle1, setToggle1] = useState(true)
  const [toggle2, setToggle2] = useState(false)
  const [showError, setShowError] = useState(false)
  const [textValue, setTextValue] = useState('Bow of the Mists')
  const [textareaValue, setTextareaValue] = useState('Multi-line notes\nLine two')
  const [slider, setSlider] = useState(35)
  const [stepValue, setStepValue] = useState<number | null>(120)
  const [settingToggle, setSettingToggle] = useState(true)
  const [settingSelect, setSettingSelect] = useState<'a' | 'b' | 'c'>('b')
  const [league, setLeague] = useState('Standard')
  const [hotkeyA, setHotkeyA] = useState('CommandOrControl+Shift+E')
  const [hotkeyB, setHotkeyB] = useState('')
  const [removed, setRemoved] = useState(false)

  return (
    <div
      style={{
        padding: 16,
        color: 'var(--text, #eee)',
        fontSize: 12,
        maxWidth: 720,
        margin: '0 auto',
      }}
    >
      <header style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Plugin Examples</h2>
        <p style={{ fontSize: 11, color: 'var(--text-dim, #888)', margin: 0 }}>
          Every visual component the Scalpel plugin SDK ships, one of each. Use the source as a copy-paste
          reference.
        </p>
      </header>

      <ItemHero item={item} />

      <Section title="Inputs">
        <Row label="Button variants">
          <Button variant="primary" onClick={() => ctx.log('primary')}>Primary</Button>
          <Button variant="secondary" onClick={() => ctx.log('secondary')}>Secondary</Button>
          <Button variant="danger" onClick={() => ctx.log('danger')}>Danger</Button>
          <Button variant="ghost" onClick={() => ctx.log('ghost')}>Ghost</Button>
        </Row>
        <Row label="Button sizes">
          <Button variant="primary" size="sm">sm</Button>
          <Button variant="primary" size="md">md</Button>
          <Button variant="ghost" size="sm" iconOnly aria-label="icon">
            <span style={{ fontSize: 12 }}>+</span>
          </Button>
        </Row>
        <Row label="Label + TextInput">
          <div>
            <Label htmlFor="px-name">Filter name</Label>
            <TextInput
              id="px-name"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Type something..."
            />
          </div>
        </Row>
        <Row label="Textarea">
          <Textarea
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            rows={3}
            fullWidth
          />
        </Row>
        <Row label="Slider">
          <Slider
            min={0}
            max={100}
            value={slider}
            onChange={(e) => setSlider(Number(e.target.value))}
            fullWidth
          />
          <span style={{ fontSize: 11, color: 'var(--text-dim, #888)' }}>{slider}</span>
        </Row>
        <Row label="StepInput">
          <StepInput
            value={stepValue}
            placeholder="0"
            onChange={(v) => setStepValue(v === '' ? null : Number(v))}
          />
          <span style={{ fontSize: 11, color: 'var(--text-dim, #888)' }}>
            hover for +/- ticks
          </span>
        </Row>
      </Section>

      <Section title="Surfaces">
        <Row label="Toggle">
          <Toggle checked={toggle1} onChange={setToggle1} />
          <span style={{ fontSize: 11 }}>on/off</span>
          <Toggle checked={toggle2} onChange={setToggle2} disabled />
          <span style={{ fontSize: 11, opacity: 0.6 }}>disabled</span>
        </Row>
        <Row label="Notice">
          <div style={{ width: '100%', background: 'rgba(0,0,0,0.2)', borderRadius: 4 }}>
            <Notice icon={<span>i</span>} title="Heads up" body="Notice renders a centred title and body." />
          </div>
        </Row>
        <Row label="ErrorBanner">
          <div style={{ position: 'relative', width: '100%' }}>
            <Button variant="secondary" size="sm" onClick={() => setShowError((v) => !v)}>
              {showError ? 'Hide' : 'Show'}
            </Button>
            <div style={{ position: 'relative', marginTop: 6 }}>
              <ErrorBanner message={showError ? 'Something went wrong' : null} inline />
            </div>
            <div style={{ position: 'relative', marginTop: 2 }}>
              <ErrorBanner message="Warning tone" tone="warn" inline />
            </div>
          </div>
        </Row>
      </Section>

      <Section title="Items and links">
        <Row label="ItemChip">
          <ItemChip name="Mirror of Kalandra" onClick={() => ctx.log('chip click')} />
          <ItemChip name="The Doctor" itemClass="Divination Cards" />
        </Row>
        <Row label="ExternalLinkButton">
          <ExternalLinkButton
            label="Wiki"
            title="Open on the wiki"
            onClick={() => {
              if (!item) return
              ctx.openExternal(externalLinkUrl('wiki', item, ctx.getPoeVersion()))
            }}
          />
          <ExternalLinkButton
            label="PoEDB"
            title="Open on PoEDB"
            onClick={() => {
              if (!item) return
              ctx.openExternal(externalLinkUrl('poedb', item, ctx.getPoeVersion()))
            }}
          />
          <span style={{ fontSize: 10, color: 'var(--text-dim, #888)' }}>
            {item ? 'targets the current item' : 'inspect an item first'}
          </span>
        </Row>
        <Row label="RemoveButton">
          {removed ? (
            <span style={{ fontSize: 11, color: 'var(--text-dim, #888)' }}>
              removed - <button
                onClick={() => setRemoved(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent, #8af)',
                  cursor: 'pointer',
                  fontSize: 11,
                  padding: 0,
                }}
              >
                restore
              </button>
            </span>
          ) : (
            <>
              <span style={{ fontSize: 11 }}>Click X to remove:</span>
              <RemoveButton onClick={() => setRemoved(true)} />
            </>
          )}
        </Row>
      </Section>

      <Section title="Settings rows">
        <SettingToggleBox label="Enable feature" checked={settingToggle} onChange={setSettingToggle} />
        <SettingSelectBox
          label="Mode"
          value={settingSelect}
          options={[
            { value: 'a', label: 'Option A' },
            { value: 'b', label: 'Option B' },
            { value: 'c', label: 'Option C' },
          ]}
          onChange={setSettingSelect}
        />
        <LeagueDropdown
          id="px-league"
          label="League"
          value={league}
          options={['Standard', 'Hardcore', 'Settlers', 'Necropolis']}
          onChange={setLeague}
        />
      </Section>

      <Section title="Hotkey inputs">
        <Row label="HotkeyField">
          <div style={{ flex: 1, minWidth: 240 }}>
            <HotkeyField value={hotkeyA} onChange={setHotkeyA} />
          </div>
        </Row>
        <Row label="HotkeyRecorder">
          <HotkeyRecorder value={hotkeyB} onChange={setHotkeyB} />
          <span style={{ fontSize: 10, color: 'var(--text-dim, #888)' }}>compact 200px variant</span>
        </Row>
      </Section>

      <Section title="Helpers">
        <Row label="formatPrice">
          <code style={{ fontSize: 11 }}>formatPrice(1500) = {formatPrice(1500)}</code>
        </Row>
        <Row label="formatDust">
          <code style={{ fontSize: 11 }}>formatDust(2500000) = {formatDust(2_500_000)}</code>
        </Row>
        <Row label="useCurrentZone">
          <code style={{ fontSize: 11 }}>{zone?.areaCode ?? '(no zone yet)'}</code>
        </Row>
        <Row label="Game">
          <code style={{ fontSize: 11 }}>
            PoE {ctx.getPoeVersion()} - league {ctx.getLeague()}
          </code>
        </Row>
      </Section>
    </div>
  )
}

let root: Root | null = null

export default function activate(ctx: ScalpelPluginContext): void {
  ctx.log('plugin-examples activated')

  ctx.registerHotkey({ label: 'Inspect item' }, async () => {
    ctx.openTab()
    await ctx.copyAndEvaluateItem()
  })

  ctx.registerTab({
    label: 'Plugin Examples',
    icon: ICON_SVG,
    render: (container) => {
      root = createRoot(container)
      root.render(<ExamplesPanel ctx={ctx} />)
      return () => {
        root?.unmount()
        root = null
      }
    },
  })
}
