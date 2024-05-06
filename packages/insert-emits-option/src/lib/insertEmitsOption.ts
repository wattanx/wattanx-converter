import { getNodeByKind } from "./getNodeByKind";
import {
  Node,
  SourceFile,
  SyntaxKind,
  CallExpression,
  PropertyAssignment,
  ObjectLiteralExpression,
} from "ts-morph";

export const insertEmitsOption = (sourceFile: SourceFile, template: string) => {
  const exportAssignment = getNodeByKind(
    sourceFile,
    SyntaxKind.ExportAssignment
  );

  const templateEmits = convertToEmitsFromTemplate(template);

  if (!exportAssignment && templateEmits.length === 0) {
    return {
      result: false,
    };
  }

  if (!exportAssignment) {
    return {
      result: false,
      emits: templateEmits,
    };
  }

  const optionsNode = getNodeByKind(
    exportAssignment,
    SyntaxKind.ObjectLiteralExpression
  );

  if (!Node.isObjectLiteralExpression(optionsNode)) {
    return {
      result: false,
      emits: templateEmits,
    };
  }

  const hasEmitsOption = getPropertyNode(optionsNode, "emits");

  if (hasEmitsOption) {
    return {
      result: false,
    };
  }

  const scriptEmits = convertToEmits(optionsNode);

  if (scriptEmits.length === 0 && templateEmits.length === 0) {
    return {
      result: false,
    };
  }

  const emits = [...new Set([...scriptEmits, ...templateEmits])];

  optionsNode.addProperty(`emits: [${emits.join(",")}]`);

  return {
    result: true,
    emits,
  };
};

const convertToEmits = (node: ObjectLiteralExpression) => {
  const emitsCallExpressions = node
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .filter((x) => hasEmit(x));

  if (emitsCallExpressions.length === 0) {
    return [];
  }

  const emits = emitsCallExpressions
    .filter((x) => x.getArguments().length !== 0)
    .map((x) => x.getArguments()[0].getText());

  return emits.filter((x) => x !== "");
};

const hasEmit = (callexpression: CallExpression) => {
  const expression = callexpression.getExpression();
  if (expression.getText() === "emit") {
    return true;
  }

  if (
    Node.isPropertyAccessExpression(expression) &&
    (expression.getName() === "$emit" || expression.getName() === "emit")
  ) {
    // (e.g.) ctx.emit, this.$emit
    return true;
  }

  return false;
};

export const getPropertyNode = (
  expression: ObjectLiteralExpression,
  type: "emits"
) => {
  const properties = expression
    .getProperties()
    .filter((x) => x.getKind() === SyntaxKind.PropertyAssignment);

  const propsNode = properties.find((x) => {
    const identifier = (x as PropertyAssignment).getName();
    return identifier === type;
  });

  if (!propsNode) {
    return;
  }

  return propsNode as PropertyAssignment;
};

const convertToEmitsFromTemplate = (src: string) => {
  const match = [...src.matchAll(/\$emit\((.*).*\)/g)];

  if (match) {
    // $emit('save', 'value') -> ["$emit('save', 'value')", "'save', 'value'"] -> ["'save', 'value'"] -> ["'save'"]
    return match.map((x) => x[1].split(",")[0]);
  }

  return [];
};
