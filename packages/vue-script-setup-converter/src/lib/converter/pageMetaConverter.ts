import { CallExpression, PropertyAssignment } from "ts-morph";
import { getOptionsNode } from "../helpers/node";

export const convertPageMeta = (node: CallExpression, lang: string = "js") => {
  const nameNode = getOptionsNode(node, "name");
  const layoutNode = getOptionsNode(node, "layout");
  const middlewareNode = getOptionsNode(node, "middleware");

  if (!nameNode && !layoutNode && !middlewareNode) return "";

  return convertToDefinePageMeta({ nameNode, layoutNode, middlewareNode });
};

const convertToDefinePageMeta = ({
  nameNode,
  layoutNode,
  middlewareNode,
}: {
  nameNode: PropertyAssignment | undefined;
  layoutNode: PropertyAssignment | undefined;
  middlewareNode: PropertyAssignment | undefined;
}) => {
  const nameProperty = nameNode ? nameNode.getText() : "";
  const layoutProperty = layoutNode ? layoutNode.getText() : "";
  const middlewareProperty = middlewareNode ? middlewareNode.getText() : "";

  return `definePageMeta({
    ${[nameProperty, layoutProperty, middlewareProperty]
      .filter(Boolean)
      .join(",")}
  });`;
};
