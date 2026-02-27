"use client";

import type { PageSection } from "@/types/page-builder";
import { SECTION_LABELS, SECTION_ICONS } from "@/types/page-builder";

interface SectionConfigPanelProps {
  section: PageSection;
  onConfigChange: (config: Record<string, unknown>) => void;
}

export default function SectionConfigPanel({ section, onConfigChange }: SectionConfigPanelProps) {
  const updateField = (key: string, value: unknown) => {
    onConfigChange({ ...section.config, [key]: value });
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">{SECTION_ICONS[section.type]}</span>
        <div>
          <h3 className="font-bold text-foreground">
            {SECTION_LABELS[section.type]}
          </h3>
          <p className="text-xs text-muted">Bölüm yapılandırması</p>
        </div>
      </div>

      {/* Text Section Config */}
      {section.type === "text" && (
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            HTML İçerik
          </label>
          <textarea
            value={(section.config.content as string) || ""}
            onChange={(e) => updateField("content", e.target.value)}
            rows={12}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
            placeholder="<h2>Başlık</h2><p>İçerik...</p>"
          />
        </div>
      )}

      {/* HTML Section Config */}
      {section.type === "html" && (
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Ham HTML Kodu
          </label>
          <textarea
            value={(section.config.rawHtml as string) || ""}
            onChange={(e) => updateField("rawHtml", e.target.value)}
            rows={16}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
            placeholder='<div class="my-section">...</div>'
          />
          <p className="text-xs text-muted mt-2">
            HTML, CSS ve inline JavaScript ekleyebilirsiniz. Dikkatli kullanın.
          </p>
        </div>
      )}

      {/* Static sections info */}
      {["hero", "stats", "campaign", "news", "events", "donation-banner", "gallery", "about", "partners"].includes(
        section.type
      ) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
          <p className="font-semibold mb-1">Otomatik Bölüm</p>
          <p>
            Bu bölüm veritabanındaki verilerle otomatik olarak doldurulur.
            Görünürlüğünü açıp kapatabilir veya sırasını değiştirebilirsiniz.
          </p>
        </div>
      )}
    </div>
  );
}
