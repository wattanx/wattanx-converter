import { SyntaxKind, Node } from 'ts-morph';

export const getNodeByKind = (
  node: Node,
  kind: SyntaxKind
): Node | undefined => {
  const find = (node: Node): Node | undefined => {
    return node.forEachChild((child) => {
      if (child.getKind() === kind) {
        return child;
      }
      return find(child);
    });
  };
  return find(node);
};
