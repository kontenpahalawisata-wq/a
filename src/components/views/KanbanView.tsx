import React, { useState } from 'react';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContentItem, ProductionStatus } from '../../types/content';

interface KanbanViewProps {
  onOpenNewContentModal: () => void;
  onEditContent: (item: ContentItem) => void;
}

const STAGES: { id: ProductionStatus; title: string; subtitle: string; color: string }[] = [
  { id: 'Ideation', title: 'Ideation', subtitle: 'Pencetus Ide', color: 'border-sky-500/50' },
  { id: 'Scripting', title: 'Scripting', subtitle: 'Penulisan Naskah', color: 'border-violet-500/50' },
  { id: 'Take Konten', title: 'Take Konten', subtitle: 'Proses Syuting', color: 'border-amber-500/50' },
  { id: 'Editing', title: 'Editing', subtitle: 'Penyuntingan Video', color: 'border-cyan-500/50' },
  { id: 'Scheduled', title: 'Scheduled', subtitle: 'Jadwal Tayang', color: 'border-indigo-500/50' },
  { id: 'Published', title: 'Published', subtitle: 'Sudah Tayang', color: 'border-emerald-500/50' },
];

export const KanbanView: React.FC<KanbanViewProps> = ({
  onOpenNewContentModal,
  onEditContent,
}) => {
  const { brandContents, updateContent, activeBrand, showNotification } = useApp();

  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<ProductionStatus | null>(null);

  const stageOrder: ProductionStatus[] = [
    'Ideation',
    'Scripting',
    'Take Konten',
    'Editing',
    'Scheduled',
    'Published',
  ];

  const moveStage = (contentId: string, currentStatus: ProductionStatus, direction: 'prev' | 'next') => {
    const currentIndex = stageOrder.indexOf(currentStatus);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < stageOrder.length) {
      updateContent(contentId, { status: stageOrder[newIndex] });
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: ContentItem) => {
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItemId(item.id);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDragOverStageId(null);
  };

  const handleDragOverColumn = (e: React.DragEvent<HTMLDivElement>, stageId: ProductionStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStageId !== stageId) {
      setDragOverStageId(stageId);
    }
  };

  const handleDragLeaveColumn = (e: React.DragEvent<HTMLDivElement>) => {
    // Check if leaving the current target container completely
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragOverStageId(null);
  };

  const handleDropOnColumn = (e: React.DragEvent<HTMLDivElement>, targetStage: ProductionStatus) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain') || draggedItemId;
    if (itemId) {
      const item = brandContents.find((c) => c.id === itemId);
      if (item && item.status !== targetStage) {
        updateContent(itemId, { status: targetStage });
        showNotification(`Konten "${item.title || item.hookText.slice(0, 20)}" dipindahkan ke ${targetStage}`);
      }
    }
    setDraggedItemId(null);
    setDragOverStageId(null);
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Produksi Konten</h2>
          <p className="text-xs text-slate-400">
            Alur pipeline dari ideasi, syuting, editing hingga tayang untuk {activeBrand.name}. Tarik dan geser kartu dengan kursor untuk memindahkan status.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenNewContentModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Kartu</span>
        </button>
      </div>

      {/* Kanban Columns (Horizontal Scrollable Grid with Drag and Drop) */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const items = brandContents.filter((c) => c.status === stage.id);
          const stageIndex = stageOrder.indexOf(stage.id);
          const isDropTarget = dragOverStageId === stage.id;

          return (
            <div
              key={stage.id}
              onDragOver={(e) => handleDragOverColumn(e, stage.id)}
              onDragLeave={handleDragLeaveColumn}
              onDrop={(e) => handleDropOnColumn(e, stage.id)}
              className={`w-72 shrink-0 flex flex-col bg-[#0F172A] border rounded-xl overflow-hidden shadow-xs transition-all duration-200 ${
                isDropTarget
                  ? 'border-indigo-500 ring-2 ring-indigo-500/50 bg-indigo-950/20 shadow-lg scale-[1.01]'
                  : 'border-slate-800/80'
              }`}
            >
              {/* Column Header */}
              <div className={`p-3 border-b border-slate-800 bg-slate-950/70 border-t-2 ${stage.color}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white">{stage.title}</h3>
                    <p className="text-[10px] text-slate-400">{stage.subtitle}</p>
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {items.length}
                  </span>
                </div>
              </div>

              {/* Cards Container (Drop Zone) */}
              <div
                className={`p-2.5 flex-1 space-y-2.5 overflow-y-auto max-h-[calc(100vh-250px)] min-h-[320px] transition-colors ${
                  isDropTarget ? 'bg-indigo-950/10' : ''
                }`}
              >
                {items.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs border-2 border-dashed border-slate-800/60 rounded-lg">
                    Tarik kartu ke sini
                  </div>
                ) : (
                  items.map((item) => {
                    const isDragging = draggedItemId === item.id;

                    return (
                      <div
                        key={item.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragEnd={handleDragEnd}
                        className={`p-3 rounded-lg bg-slate-900 border transition-all shadow-xs space-y-2 group cursor-grab active:cursor-grabbing select-none ${
                          isDragging
                            ? 'opacity-40 border-indigo-500 scale-[0.98] ring-1 ring-indigo-500'
                            : 'border-slate-800/90 hover:border-slate-700 hover:shadow-md'
                        }`}
                      >
                        {/* Platform, Grip handle & Funnel Badges */}
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 group-hover:text-slate-300 transition-colors">
                              <GripVertical className="w-3.5 h-3.5" />
                            </span>
                            <span className="px-1.5 py-0.5 rounded font-medium bg-slate-800 text-slate-300">
                              {item.platform}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-slate-400">
                            <span
                              className={`font-semibold ${
                                item.funnel === 'TOFU'
                                  ? 'text-sky-400'
                                  : item.funnel === 'MOFU'
                                  ? 'text-amber-400'
                                  : 'text-emerald-400'
                              }`}
                            >
                              {item.funnel}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{item.format}</span>
                          </div>
                        </div>

                        {/* Title & Hook */}
                        <div
                          onClick={() => onEditContent(item)}
                          className="cursor-pointer"
                        >
                          <h4 className="text-xs font-semibold text-slate-100 hover:text-indigo-400 transition-colors line-clamp-2">
                            {item.title}
                          </h4>
                          {item.hookText && (
                            <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                              "{item.hookText}"
                            </p>
                          )}
                        </div>

                        {/* Footer: Date, PIC, and Move Controls */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                          <div className="truncate max-w-[130px]">
                            <span>PIC: </span>
                            <strong className="text-slate-300">
                              {item.pic?.name.split(' ')[0] || 'Unassigned'}
                            </strong>
                          </div>

                          {/* Quick pipeline movement controls */}
                          <div className="flex items-center gap-1">
                            {stageIndex > 0 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveStage(item.id, item.status, 'prev');
                                }}
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                title="Kembalikan ke status sebelumnya"
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                            )}
                            {stageIndex < stageOrder.length - 1 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveStage(item.id, item.status, 'next');
                                }}
                                className="p-1 rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white transition-colors"
                                title="Majukan ke status berikutnya"
                              >
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
