import type { GiftPackNode } from "@/types/gift-pack";

export type NodeRef = {
  node: GiftPackNode;
  parent: GiftPackNode | null;
  parentList: GiftPackNode[];
};

export function findNode(roots: GiftPackNode[], id: string): NodeRef | null {
  const search = (list: GiftPackNode[], parent: GiftPackNode | null): NodeRef | null => {
    for (const node of list) {
      if (node.id === id) return { node, parent, parentList: list };
      const inChild = search(node.children, node);
      if (inChild) return inChild;
    }
    return null;
  };
  return search(roots, null);
}

export function mapTree(roots: GiftPackNode[], fn: (n: GiftPackNode) => GiftPackNode): GiftPackNode[] {
  return roots.map((n) => ({
    ...fn(n),
    children: mapTree(n.children, fn),
  }));
}

export function updateNodeInTree(
  roots: GiftPackNode[],
  id: string,
  patch: Partial<GiftPackNode>
): GiftPackNode[] {
  return mapTree(roots, (n) => (n.id === id ? { ...n, ...patch } : n));
}

export function removeNodeFromTree(roots: GiftPackNode[], id: string): GiftPackNode[] {
  const filter = (list: GiftPackNode[]): GiftPackNode[] =>
    list
      .filter((n) => n.id !== id)
      .map((n) => ({ ...n, children: filter(n.children) }));
  return filter(roots);
}

export function duplicateNodeDeep(node: GiftPackNode, idGen: () => string): GiftPackNode {
  const dupLayer = (layers: GiftPackNode["layers"]) =>
    layers.map((l) => ({ ...l, id: idGen(), data: { ...l.data } }));
  const walk = (n: GiftPackNode): GiftPackNode => ({
    ...n,
    id: idGen(),
    name: `${n.name} (কপি)`,
    layers: dupLayer(n.layers),
    children: n.children.map(walk),
  });
  return walk(node);
}
