"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { nanoid } from "nanoid";
import type { GiftPackLayer, GiftPackNode, GiftPackProject } from "@/types/gift-pack";
import {
  createPackNode,
  defaultPackProject,
  defaultTextLayer,
} from "@/lib/gift-pack/defaults";
import { PACK_TEMPLATES } from "@/lib/gift-pack/templates";
import {
  duplicateNodeDeep,
  findNode,
  removeNodeFromTree,
  updateNodeInTree,
} from "@/lib/gift-pack/tree";
import type { GiftBoxTemplateId } from "@/types/gift-pack";
import { applySequenceNumbers, getSequenceRoots } from "@/lib/gift-pack/sequence";

const MAX_HISTORY = 40;

type Ctx = {
  project: GiftPackProject;
  selectedNodeId: string | null;
  selectNode: (id: string | null) => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  setProject: (p: GiftPackProject) => void;
  patchProject: (patch: Partial<GiftPackProject>) => void;
  createBoxCount: (count: number, template?: GiftBoxTemplateId) => void;
  addRootBox: (template?: GiftBoxTemplateId) => void;
  addChildBox: (parentId: string, template?: GiftBoxTemplateId) => void;
  duplicateSelected: () => void;
  deleteSelected: () => void;
  updateSelectedNode: (patch: Partial<GiftPackNode>) => void;
  addLayerToSelected: (type: GiftPackLayer["type"]) => void;
  addMediaLayers: (type: "image" | "video", srcs: string[]) => void;
  removeLayer: (layerId: string) => void;
  duplicateLayer: (layerId: string) => void;
  splitLayerAtPlayhead: (layerId: string, playheadMs: number) => void;
  moveLayerZ: (layerId: string, direction: "up" | "down") => void;
  reorderSequenceRoot: (fromIndex: number, toIndex: number) => void;
  selectedLayerId: string | null;
  selectLayer: (id: string | null) => void;
  playheadMs: number;
  setPlayheadMs: (ms: number) => void;
  updateLayer: (
    layerId: string,
    patch: Partial<GiftPackLayer>,
    opts?: { recordHistory?: boolean }
  ) => void;
  applyTemplate: (templateId: string) => void;
  finishSequence: () => void;
  selectBySequenceNumber: (n: number) => void;
  sequenceRoots: GiftPackNode[];
  selectedNode: GiftPackNode | null;
};

const PackEditorContext = createContext<Ctx | null>(null);

function cloneProject(p: GiftPackProject): GiftPackProject {
  return structuredClone(p);
}

export function PackEditorProvider({ children }: { children: ReactNode }) {
  const [project, setProjectState] = useState<GiftPackProject>(defaultPackProject);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    defaultPackProject().roots[0]?.id ?? null
  );
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [playheadMs, setPlayheadMs] = useState(0);
  const history = useRef<GiftPackProject[]>([]);
  const future = useRef<GiftPackProject[]>([]);
  const [, setHistTick] = useState(0);
  const bumpHist = useCallback(() => setHistTick((n) => n + 1), []);

  const pushHistory = useCallback(() => {
    history.current.push(cloneProject(project));
    if (history.current.length > MAX_HISTORY) history.current.shift();
    future.current = [];
    bumpHist();
  }, [project, bumpHist]);

  const setProject = useCallback((p: GiftPackProject) => {
    pushHistory();
    setProjectState(p);
    if (p.roots[0] && !findNode(p.roots, selectedNodeId ?? "")) {
      setSelectedNodeId(p.roots[0].id);
    }
  }, [pushHistory, selectedNodeId]);

  const applyProject = useCallback((p: GiftPackProject) => {
    setProjectState(p);
  }, []);

  const undo = useCallback(() => {
    const prev = history.current.pop();
    if (!prev) return;
    future.current.push(cloneProject(project));
    setProjectState(prev);
    bumpHist();
  }, [project, bumpHist]);

  const redo = useCallback(() => {
    const next = future.current.pop();
    if (!next) return;
    history.current.push(cloneProject(project));
    setProjectState(next);
    bumpHist();
  }, [project, bumpHist]);

  const patchProject = useCallback(
    (patch: Partial<GiftPackProject>) => {
      pushHistory();
      setProjectState((p) => ({ ...p, ...patch }));
    },
    [pushHistory]
  );

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return findNode(project.roots, selectedNodeId)?.node ?? null;
  }, [project.roots, selectedNodeId]);

  const updateRoots = useCallback(
    (roots: GiftPackNode[]) => {
      pushHistory();
      setProjectState((p) => ({ ...p, roots }));
    },
    [pushHistory]
  );

  const createBoxCount = useCallback(
    (count: number, template: GiftBoxTemplateId = "classic") => {
      const n = Math.min(Math.max(count, 1), 50);
      const roots = Array.from({ length: n }, (_, i) => {
        const node = createPackNode(template, i);
        return {
          ...node,
          sequenceNumber: undefined,
          name: `খসড়া বক্স ${i + 1}`,
        };
      });
      pushHistory();
      setProjectState((p) => ({
        ...p,
        roots,
        sequenceReady: false,
      }));
      setSelectedNodeId(roots[0].id);
    },
    [pushHistory]
  );

  const finishSequence = useCallback(() => {
    pushHistory();
    setProjectState((p) => ({
      ...p,
      roots: applySequenceNumbers(p.roots),
      sequenceReady: true,
    }));
  }, [pushHistory]);

  const sequenceRoots = useMemo(
    () => getSequenceRoots(project.roots),
    [project.roots]
  );

  const selectBySequenceNumber = useCallback(
    (num: number) => {
      const node = sequenceRoots[num - 1];
      if (node) setSelectedNodeId(node.id);
    },
    [sequenceRoots]
  );

  const addRootBox = useCallback(
    (template: GiftBoxTemplateId = "classic") => {
      const node = createPackNode(template, project.roots.length);
      updateRoots([...project.roots, node]);
      setSelectedNodeId(node.id);
    },
    [project.roots, updateRoots]
  );

  const addChildBox = useCallback(
    (parentId: string, template: GiftBoxTemplateId = "nested") => {
      const ref = findNode(project.roots, parentId);
      if (!ref) return;
      const child = createPackNode(template, ref.node.children.length);
      const roots = updateNodeInTree(project.roots, parentId, {
        children: [...ref.node.children, child],
      });
      updateRoots(roots);
      setSelectedNodeId(child.id);
    },
    [project.roots, updateRoots]
  );

  const duplicateSelected = useCallback(() => {
    if (!selectedNodeId) return;
    const ref = findNode(project.roots, selectedNodeId);
    if (!ref) return;
    const dup = duplicateNodeDeep(ref.node, () => nanoid(8));
    if (ref.parentList === project.roots && !ref.parent) {
      updateRoots([...project.roots, dup]);
    } else if (ref.parent) {
      const parentId = ref.parent.id;
      const parent = findNode(project.roots, parentId)?.node;
      if (!parent) return;
      updateRoots(
        updateNodeInTree(project.roots, parentId, {
          children: [...parent.children, dup],
        })
      );
    } else {
      const idx = ref.parentList.findIndex((n) => n.id === ref.node.id);
      const next = [...project.roots];
      next.splice(idx + 1, 0, dup);
      updateRoots(next);
    }
    setSelectedNodeId(dup.id);
  }, [project.roots, selectedNodeId, updateRoots]);

  const deleteSelected = useCallback(() => {
    if (!selectedNodeId) return;
    const roots = removeNodeFromTree(project.roots, selectedNodeId);
    if (roots.length === 0) {
      const n = createPackNode("classic", 0);
      updateRoots([n]);
      setSelectedNodeId(n.id);
      return;
    }
    updateRoots(roots);
    setSelectedNodeId(roots[0]?.id ?? null);
  }, [project.roots, selectedNodeId, updateRoots]);

  const updateSelectedNode = useCallback(
    (patch: Partial<GiftPackNode>) => {
      if (!selectedNodeId) return;
      pushHistory();
      setProjectState((p) => ({
        ...p,
        roots: updateNodeInTree(p.roots, selectedNodeId, patch),
      }));
    },
    [pushHistory, selectedNodeId]
  );

  const mutateSelectedLayers = useCallback(
    (fn: (layers: GiftPackLayer[]) => GiftPackLayer[], recordHistory = true) => {
      if (!selectedNodeId) return;
      const ref = findNode(project.roots, selectedNodeId);
      if (!ref) return;
      if (recordHistory) pushHistory();
      setProjectState((p) => ({
        ...p,
        roots: updateNodeInTree(p.roots, selectedNodeId, {
          layers: fn(ref.node.layers),
        }),
      }));
    },
    [project.roots, pushHistory, selectedNodeId]
  );

  const addLayerToSelected = useCallback(
    (type: GiftPackLayer["type"]) => {
      mutateSelectedLayers((layers) => {
        const base = defaultTextLayer();
        if (type === "image") {
          return [
            ...layers,
            {
              ...base,
              id: nanoid(8),
              type: "image",
              track: "image",
              name: "ছবি",
              data: {
                src: "",
                x: 0,
                y: 0,
                width: 240,
                height: 180,
                rotation: 0,
                scale: 1,
                opacity: 1,
                flipX: false,
                flipY: false,
                borderWidth: 0,
                borderRadius: 12,
                shadow: true,
                transition: "fade",
                crop: { x: 0, y: 0, w: 1, h: 1 },
              },
            },
          ];
        }
        if (type === "video") {
          return [
            ...layers,
            {
              ...base,
              id: nanoid(8),
              type: "video",
              track: "video",
              name: "ভিডিও",
              durationMs: 8000,
              data: { src: "", x: 0, y: 0, width: 320, height: 180, muted: false },
            },
          ];
        }
        if (type === "audio") {
          return [
            ...layers,
            {
              ...base,
              id: nanoid(8),
              type: "audio",
              track: "audio",
              name: "অডিও",
              data: {
                src: "",
                volume: 0.8,
                startMs: 0,
                endMs: 60000,
                fadeInMs: 300,
                fadeOutMs: 500,
                loop: false,
                playbackRate: 1,
                trigger: "on_open",
              },
            },
          ];
        }
        return [...layers, { ...defaultTextLayer(), id: nanoid(8) }];
      });
    },
    [mutateSelectedLayers]
  );

  const addMediaLayers = useCallback(
    (type: "image" | "video", srcs: string[]) => {
      if (!srcs.length) return;
      mutateSelectedLayers((layers) => {
        const added: GiftPackLayer[] = srcs.map((src, i) => {
          const base = defaultTextLayer();
          const startMs = Math.min(layers.length * 400 + i * 800, 60000);
          if (type === "video") {
            return {
              ...base,
              id: nanoid(8),
              type: "video",
              track: "video",
              name: `ভিডিও ${layers.length + i + 1}`,
              startMs,
              durationMs: 8000,
              data: { src, x: 0, y: 0, width: 320, height: 180, muted: false, playbackRate: 1 },
            };
          }
          return {
            ...base,
            id: nanoid(8),
            type: "image",
            track: "image",
            name: `ছবি ${layers.length + i + 1}`,
            startMs,
            durationMs: 5000,
            data: {
              src,
              x: 0,
              y: 0,
              width: 240,
              height: 180,
              rotation: 0,
              scale: 1,
              opacity: 1,
              flipX: false,
              flipY: false,
              borderWidth: 0,
              borderRadius: 12,
              shadow: true,
              transition: "fade",
              crop: { x: 0, y: 0, w: 1, h: 1 },
            },
          };
        });
        return [...layers, ...added];
      });
    },
    [mutateSelectedLayers]
  );

  const updateLayer = useCallback(
    (layerId: string, patch: Partial<GiftPackLayer>, opts?: { recordHistory?: boolean }) => {
      mutateSelectedLayers(
        (layers) =>
          layers.map((l) =>
            l.id === layerId ? { ...l, ...patch, data: { ...l.data, ...(patch.data as object) } } : l
          ),
        opts?.recordHistory !== false
      );
    },
    [mutateSelectedLayers]
  );

  const removeLayer = useCallback(
    (layerId: string) => {
      mutateSelectedLayers((layers) => layers.filter((l) => l.id !== layerId));
      setSelectedLayerId((id) => (id === layerId ? null : id));
    },
    [mutateSelectedLayers]
  );

  const duplicateLayer = useCallback(
    (layerId: string) => {
      mutateSelectedLayers((layers) => {
        const src = layers.find((l) => l.id === layerId);
        if (!src) return layers;
        const dup: GiftPackLayer = {
          ...structuredClone(src),
          id: nanoid(8),
          name: `${src.name} (copy)`,
          startMs: src.startMs + src.durationMs + 100,
        };
        return [...layers, dup];
      });
    },
    [mutateSelectedLayers]
  );

  const splitLayerAtPlayhead = useCallback(
    (layerId: string, atMs: number) => {
      mutateSelectedLayers((layers) => {
        const src = layers.find((l) => l.id === layerId);
        if (!src) return layers;
        if (atMs <= src.startMs || atMs >= src.startMs + src.durationMs) return layers;
        const firstDur = atMs - src.startMs;
        const secondStart = atMs;
        const secondDur = src.durationMs - firstDur;
        const tail: GiftPackLayer = {
          ...structuredClone(src),
          id: nanoid(8),
          name: `${src.name} (2)`,
          startMs: secondStart,
          durationMs: secondDur,
        };
        const head = { ...src, durationMs: firstDur };
        return layers.map((l) => (l.id === layerId ? head : l)).concat(tail);
      });
    },
    [mutateSelectedLayers]
  );

  const moveLayerZ = useCallback(
    (layerId: string, direction: "up" | "down") => {
      mutateSelectedLayers((layers) => {
        const sorted = [...layers].sort((a, b) => a.zIndex - b.zIndex);
        const idx = sorted.findIndex((l) => l.id === layerId);
        if (idx < 0) return layers;
        const swap = direction === "up" ? idx + 1 : idx - 1;
        if (swap < 0 || swap >= sorted.length) return layers;
        const a = sorted[idx];
        const b = sorted[swap];
        return layers.map((l) => {
          if (l.id === a.id) return { ...l, zIndex: b.zIndex };
          if (l.id === b.id) return { ...l, zIndex: a.zIndex };
          return l;
        });
      });
    },
    [mutateSelectedLayers]
  );

  const reorderSequenceRoot = useCallback(
    (fromIndex: number, toIndex: number) => {
      pushHistory();
      setProjectState((p) => {
        const sorted = getSequenceRoots(p.roots);
        const order = sorted.map((r) => r.id);
        const [id] = order.splice(fromIndex, 1);
        order.splice(toIndex, 0, id);
        const rank = new Map(order.map((rid, i) => [rid, i]));
        const roots = [...p.roots].sort(
          (a, b) => (rank.get(a.id) ?? 999) - (rank.get(b.id) ?? 999)
        );
        return {
          ...p,
          roots: p.sequenceReady ? applySequenceNumbers(roots) : roots,
        };
      });
    },
    [pushHistory]
  );

  const applyTemplate = useCallback(
    (templateId: string) => {
      const t = PACK_TEMPLATES.find((x) => x.id === templateId);
      if (!t) return;
      const built = t.build();
      setProject(built);
      setSelectedNodeId(built.roots[0]?.id ?? null);
    },
    [setProject]
  );

  const value: Ctx = {
    project,
    selectedNodeId,
    selectNode: setSelectedNodeId,
    pushHistory,
    undo,
    redo,
    canUndo: history.current.length > 0,
    canRedo: future.current.length > 0,
    setProject,
    patchProject,
    createBoxCount,
    addRootBox,
    addChildBox,
    duplicateSelected,
    deleteSelected,
    updateSelectedNode,
    addLayerToSelected,
    addMediaLayers,
    updateLayer,
    removeLayer,
    duplicateLayer,
    splitLayerAtPlayhead,
    moveLayerZ,
    reorderSequenceRoot,
    selectedLayerId,
    selectLayer: setSelectedLayerId,
    playheadMs,
    setPlayheadMs,
    applyTemplate,
    finishSequence,
    selectBySequenceNumber,
    sequenceRoots,
    selectedNode,
  };

  return <PackEditorContext.Provider value={value}>{children}</PackEditorContext.Provider>;
}

export function usePackEditor() {
  const ctx = useContext(PackEditorContext);
  if (!ctx) throw new Error("usePackEditor");
  return ctx;
}
