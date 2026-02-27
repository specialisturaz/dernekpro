"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { PageSection, SectionType } from "@/types/page-builder";
import { SECTION_LABELS, SECTION_ICONS } from "@/types/page-builder";
import SectionConfigPanel from "./SectionConfigPanel";
import SectionRendererPreview from "./SectionRendererPreview";

interface SortableItemProps {
  section: PageSection;
  onToggleVisibility: (id: string) => void;
  onRemove: (id: string) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

function SortableItem({ section, onToggleVisibility, onRemove, onSelect, isSelected }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border bg-background hover:border-primary/30"
      } ${!section.visible ? "opacity-50" : ""}`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted hover:text-foreground p-1"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>

      {/* Section info */}
      <button
        onClick={() => onSelect(section.id)}
        className="flex-1 flex items-center gap-2 text-left"
      >
        <span className="text-lg">{SECTION_ICONS[section.type]}</span>
        <span className="font-medium text-sm text-foreground">
          {SECTION_LABELS[section.type]}
        </span>
      </button>

      {/* Visibility toggle */}
      <button
        onClick={() => onToggleVisibility(section.id)}
        className={`p-1.5 rounded transition-colors ${
          section.visible
            ? "text-primary hover:bg-primary/10"
            : "text-muted hover:bg-gray-100"
        }`}
        title={section.visible ? "Gizle" : "Goster"}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {section.visible ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          )}
        </svg>
      </button>

      {/* Remove */}
      <button
        onClick={() => onRemove(section.id)}
        className="p-1.5 rounded text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
        title="Kaldir"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

const AVAILABLE_SECTIONS: SectionType[] = [
  "hero", "stats", "campaign", "news", "events", "gallery",
  "donation-banner", "text", "html", "about", "partners", "child-sponsor",
  "completed-projects", "announcements",
  "activities", "news-announcements", "contact-cta",
];

interface PageBuilderProps {
  sections: PageSection[];
  onChange: (sections: PageSection[]) => void;
  customCss: string;
  onCustomCssChange: (css: string) => void;
}

export default function PageBuilder({ sections, onChange, customCss, onCustomCssChange }: PageBuilderProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [rightPanel, setRightPanel] = useState<"config" | "preview">("config");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = sections.findIndex((s) => s.id === active.id);
        const newIndex = sections.findIndex((s) => s.id === over.id);
        const newSections = arrayMove(sections, oldIndex, newIndex).map((s, i) => ({
          ...s,
          order: i,
        }));
        onChange(newSections);
      }
    },
    [sections, onChange]
  );

  const toggleVisibility = useCallback(
    (id: string) => {
      onChange(sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)));
    },
    [sections, onChange]
  );

  const removeSection = useCallback(
    (id: string) => {
      if (!confirm("Bu bolumu kaldirmak istediginize emin misiniz?")) return;
      onChange(sections.filter((s) => s.id !== id));
      if (selectedId === id) setSelectedId(null);
    },
    [sections, onChange, selectedId]
  );

  const addSection = useCallback(
    (type: SectionType) => {
      const newSection: PageSection = {
        id: `section-${Date.now()}`,
        type,
        visible: true,
        order: sections.length,
        config: type === "text" ? { content: "<p>Metin icerigi...</p>" } : type === "html" ? { rawHtml: "" } : {},
      };
      onChange([...sections, newSection]);
      setShowAddModal(false);
    },
    [sections, onChange]
  );

  const updateConfig = useCallback(
    (id: string, config: Record<string, unknown>) => {
      onChange(sections.map((s) => (s.id === id ? { ...s, config } : s)));
    },
    [sections, onChange]
  );

  const selectedSection = sections.find((s) => s.id === selectedId);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Left: Section list */}
      <div className="lg:col-span-1 space-y-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground text-sm">Bolumler</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              + Bolum Ekle
            </button>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {sections.map((section) => (
                  <SortableItem
                    key={section.id}
                    section={section}
                    onToggleVisibility={toggleVisibility}
                    onRemove={removeSection}
                    onSelect={(id) => {
                      setSelectedId(id);
                      setRightPanel("config");
                    }}
                    isSelected={selectedId === section.id}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {sections.length === 0 && (
            <div className="text-center py-8 text-muted text-sm">
              Henuz bolum eklenmemis.
              <br />
              <button
                onClick={() => setShowAddModal(true)}
                className="text-primary font-semibold mt-2 inline-block"
              >
                Ilk bolumu ekleyin
              </button>
            </div>
          )}
        </div>

        {/* Custom CSS */}
        <div className="card p-4">
          <h3 className="font-bold text-foreground text-sm mb-3">Ozel CSS</h3>
          <textarea
            value={customCss}
            onChange={(e) => onCustomCssChange(e.target.value)}
            placeholder=".my-class { color: red; }"
            rows={6}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>
      </div>

      {/* Right: Config or Preview panel */}
      <div className="lg:col-span-2 space-y-4">
        {/* Panel toggle tabs */}
        <div className="flex rounded-lg border border-border overflow-hidden w-fit">
          <button
            onClick={() => setRightPanel("config")}
            className={`px-4 py-2 text-sm font-medium transition-colors inline-flex items-center gap-2 ${
              rightPanel === "config"
                ? "bg-primary text-white"
                : "bg-background text-muted hover:text-foreground"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Yapilandirma
          </button>
          <button
            onClick={() => setRightPanel("preview")}
            className={`px-4 py-2 text-sm font-medium transition-colors inline-flex items-center gap-2 border-l border-border ${
              rightPanel === "preview"
                ? "bg-primary text-white"
                : "bg-background text-muted hover:text-foreground"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Canli Onizleme
          </button>
        </div>

        {rightPanel === "config" ? (
          selectedSection ? (
            <SectionConfigPanel
              section={selectedSection}
              onConfigChange={(config) => updateConfig(selectedSection.id, config)}
            />
          ) : (
            <div className="card p-12 text-center text-muted">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <p className="font-semibold">Bolum secin</p>
              <p className="text-sm mt-1">
                Duzenlemek icin soldaki listeden bir bolume tiklayin.
              </p>
            </div>
          )
        ) : (
          /* Live Preview */
          <div className="card overflow-hidden">
            <div className="bg-gray-100 border-b border-border px-4 py-2 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-md px-3 py-1 text-xs text-muted text-center border border-border">
                  dernekpro.com
                </div>
              </div>
            </div>
            <div className="max-h-[70vh] overflow-y-auto bg-white">
              {sections.filter((s) => s.visible).length > 0 ? (
                <div className="transform origin-top scale-100">
                  <SectionRendererPreview sections={sections} />
                </div>
              ) : (
                <div className="p-12 text-center text-muted">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  <p className="font-semibold">Onizleme bos</p>
                  <p className="text-sm mt-1">Gorunur bolum ekleyin.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Section Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground text-lg">Bolum Ekle</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-muted hover:text-foreground"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {AVAILABLE_SECTIONS.map((type) => (
                <button
                  key={type}
                  onClick={() => addSection(type)}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
                >
                  <span className="text-2xl">{SECTION_ICONS[type]}</span>
                  <span className="font-medium text-sm text-foreground">
                    {SECTION_LABELS[type]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
