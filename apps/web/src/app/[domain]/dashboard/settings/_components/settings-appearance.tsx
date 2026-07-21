import { Label } from "@cykani/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@cykani/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@cykani/ui/toggle-group";
import { type FontKey, fontOptions } from "@cykani/lib/fonts/registry";
import type { ContentLayout, NavbarStyle, SidebarCollapsible, SidebarVariant } from "@cykani/lib/preferences/layout";
import {
  applyContentLayout,
  applyFont,
  applyNavbarStyle,
  applySidebarCollapsible,
  applySidebarVariant,
} from "@cykani/lib/preferences/layout-utils";
import { PREFERENCE_DEFAULTS } from "@cykani/lib/preferences/preferences-config";
import { persistPreference } from "@cykani/lib/preferences/preferences-storage";
import { THEME_PRESET_OPTIONS, type ThemeMode, type ThemePreset } from "@cykani/lib/preferences/theme";
import { applyThemePreset } from "@cykani/lib/preferences/theme-utils";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

export function SettingsAppearance() {
  const themePreset = usePreferencesStore((s) => s.themePreset);
  const setThemePreset = usePreferencesStore((s) => s.setThemePreset);
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);
  const contentLayout = usePreferencesStore((s) => s.contentLayout);
  const setContentLayout = usePreferencesStore((s) => s.setContentLayout);
  const navbarStyle = usePreferencesStore((s) => s.navbarStyle);
  const setNavbarStyle = usePreferencesStore((s) => s.setNavbarStyle);
  const sidebarVariant = usePreferencesStore((s) => s.sidebarVariant);
  const setSidebarVariant = usePreferencesStore((s) => s.setSidebarVariant);
  const sidebarCollapsible = usePreferencesStore((s) => s.sidebarCollapsible);
  const setSidebarCollapsible = usePreferencesStore((s) => s.setSidebarCollapsible);
  const font = usePreferencesStore((s) => s.font);
  const setFont = usePreferencesStore((s) => s.setFont);

  const onThemePresetChange = (preset: ThemePreset) => {
    applyThemePreset(preset);
    setThemePreset(preset);
    void persistPreference("theme_preset", preset);
  };

  const onThemeModeChange = (mode: ThemeMode | "") => {
    if (!mode) return;
    setThemeMode(mode);
    void persistPreference("theme_mode", mode);
  };

  const onContentLayoutChange = (layout: ContentLayout | "") => {
    if (!layout) return;
    applyContentLayout(layout);
    setContentLayout(layout);
    void persistPreference("content_layout", layout);
  };

  const onNavbarStyleChange = (style: NavbarStyle | "") => {
    if (!style) return;
    applyNavbarStyle(style);
    setNavbarStyle(style);
    void persistPreference("navbar_style", style);
  };

  const onSidebarStyleChange = (value: SidebarVariant | "") => {
    if (!value) return;
    setSidebarVariant(value);
    applySidebarVariant(value);
    void persistPreference("sidebar_variant", value);
  };

  const onSidebarCollapseModeChange = (value: SidebarCollapsible | "") => {
    if (!value) return;
    setSidebarCollapsible(value);
    applySidebarCollapsible(value);
    void persistPreference("sidebar_collapsible", value);
  };

  const onFontChange = (value: FontKey | "") => {
    if (!value) return;
    applyFont(value);
    setFont(value);
    void persistPreference("font", value);
  };

  const handleRestore = () => {
    onThemePresetChange(PREFERENCE_DEFAULTS.theme_preset);
    onThemeModeChange(PREFERENCE_DEFAULTS.theme_mode);
    onContentLayoutChange(PREFERENCE_DEFAULTS.content_layout);
    onNavbarStyleChange(PREFERENCE_DEFAULTS.navbar_style);
    onSidebarStyleChange(PREFERENCE_DEFAULTS.sidebar_variant);
    onSidebarCollapseModeChange(PREFERENCE_DEFAULTS.sidebar_collapsible);
    onFontChange(PREFERENCE_DEFAULTS.font);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-1.5">
        <h4 className="font-medium text-sm leading-none">Appearance</h4>
        <p className="text-muted-foreground text-xs">Customize your dashboard layout preferences.</p>
      </div>

      <div className="grid gap-4">
        <div className="space-y-1">
          <Label className="font-medium text-xs">Theme Preset</Label>
          <Select value={themePreset} onValueChange={onThemePresetChange}>
            <SelectTrigger size="sm" className="w-full text-xs">
              <SelectValue placeholder="Preset" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {THEME_PRESET_OPTIONS.map((preset) => (
                  <SelectItem key={preset.value} className="text-xs" value={preset.value}>
                    <span
                      className="size-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          (themeMode ?? "light") === "dark" ? preset.primary.dark : preset.primary.light,
                      }}
                    />
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="font-medium text-xs">Fonts</Label>
          <Select value={font} onValueChange={onFontChange}>
            <SelectTrigger size="sm" className="w-full text-xs">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {fontOptions.map((font) => (
                  <SelectItem key={font.key} className="text-xs" value={font.key}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="font-medium text-xs">Theme Mode</Label>
          <ToggleGroup
            size="sm"
            spacing={0}
            variant="outline"
            type="single"
            value={themeMode}
            onValueChange={onThemeModeChange}
          >
            <ToggleGroupItem value="light" aria-label="Toggle light">
              Light
            </ToggleGroupItem>
            <ToggleGroupItem value="dark" aria-label="Toggle dark">
              Dark
            </ToggleGroupItem>
            <ToggleGroupItem value="system" aria-label="Toggle system">
              System
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="space-y-1">
          <Label className="font-medium text-xs">Page Layout</Label>
          <ToggleGroup
            size="sm"
            spacing={0}
            variant="outline"
            type="single"
            value={contentLayout}
            onValueChange={onContentLayoutChange}
          >
            <ToggleGroupItem value="centered" aria-label="Toggle centered">
              Centered
            </ToggleGroupItem>
            <ToggleGroupItem value="full-width" aria-label="Toggle full-width">
              Full Width
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="space-y-1">
          <Label className="font-medium text-xs">Navbar Behavior</Label>
          <ToggleGroup
            size="sm"
            spacing={0}
            variant="outline"
            type="single"
            value={navbarStyle}
            onValueChange={onNavbarStyleChange}
          >
            <ToggleGroupItem value="sticky" aria-label="Toggle sticky">
              Sticky
            </ToggleGroupItem>
            <ToggleGroupItem value="scroll" aria-label="Toggle scroll">
              Scroll
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="space-y-1">
          <Label className="font-medium text-xs">Sidebar Style</Label>
          <ToggleGroup
            size="sm"
            spacing={0}
            variant="outline"
            type="single"
            value={sidebarVariant}
            onValueChange={onSidebarStyleChange}
          >
            <ToggleGroupItem value="inset" aria-label="Toggle inset">
              Inset
            </ToggleGroupItem>
            <ToggleGroupItem value="sidebar" aria-label="Toggle sidebar">
              Sidebar
            </ToggleGroupItem>
            <ToggleGroupItem value="floating" aria-label="Toggle floating">
              Floating
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="space-y-1">
          <Label className="font-medium text-xs">Sidebar Collapse Mode</Label>
          <ToggleGroup
            size="sm"
            spacing={0}
            variant="outline"
            type="single"
            value={sidebarCollapsible}
            onValueChange={onSidebarCollapseModeChange}
          >
            <ToggleGroupItem value="icon" aria-label="Toggle icon">
              Icon
            </ToggleGroupItem>
            <ToggleGroupItem value="offcanvas" aria-label="Toggle offcanvas">
              OffCanvas
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <button
          type="button"
          onClick={handleRestore}
          className="inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-xs font-medium shadow-sm transition-colors hover:bg-muted"
        >
          Restore Defaults
        </button>
      </div>
    </div>
  );
}
