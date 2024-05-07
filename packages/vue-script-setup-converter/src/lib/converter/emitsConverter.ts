import {
  CallExpression,
  PropertyAssignment,
  Node,
  SyntaxKind,
  ArrowFunction,
} from "ts-morph";
import { getOptionsNode } from "../helpers/node";

// ctx.emit('event') -> emit('event')
export const replaceEmit = (expression: string, contextName: string) => {
  const regex = new RegExp(`${contextName}\\.(\\w+)`, "g");
  return expression.replace(regex, (_, p1) => p1);
};

export const convertEmits = (node: CallExpression, lang: string = "js") => {
  const emitsNode = getOptionsNode(node, "emits");
  if (!emitsNode) {
    return "";
  }
  const emits =
    lang === "js"
      ? convertToDefineEmits(emitsNode)
      : convertToDefineEmitForTs(emitsNode);

  return emits;
};

const convertToDefineEmits = (node: PropertyAssignment) => {
  const child = node.getInitializer();

  if (!child) {
    throw new Error("emits is empty.");
  }

  if (Node.isObjectLiteralExpression(child)) {
    const properties = child.getProperties();
    const value = properties.map((x) => x.getText()).join(",");
    return `const emit = defineEmits({${value}});`;
  }

  return `const emit = defineEmits(${child.getFullText()});`;
};

// 以下 type-based declaration用

type EmitType =
  | {
      type: "typedNonValidation";
      event: { name: string; args: string[] };
    }
  | {
      type: "nonValidation";
    };

const convertToDefineEmitForTs = (node: PropertyAssignment) => {
  const child = node.getInitializer();

  if (Node.isObjectLiteralExpression(child)) {
    const properties = child.getProperties();

    const arr: EmitType[] = properties.map((x) => {
      if (!Node.isPropertyAssignment(x)) {
        throw new Error("property not found.");
      }

      const emitObj = x.getInitializer() as ArrowFunction;
      if (isTrueKeyword(emitObj.getBody().getKind())) {
        const args = emitObj
          .getParameters()
          .map((parameter) => parameter.getText());

        return {
          type: "typedNonValidation",
          event: { name: x.getName(), args },
        };
      } else {
        return {
          type: "nonValidation",
        };
      }
    });

    const isNodValidation = arr.some((x) => x.type === "nonValidation");

    if (isNodValidation) {
      const value = properties.map((x) => x.getText()).join(",");
      return `const emit = defineEmits({${value}});`;
    }

    const emits = convertToTypeDefineEmits(arr);

    return emits;
  }

  if (!Node.isArrayLiteralExpression(child)) {
    throw new Error("emits not found.");
  }
  return `const emit = defineEmits(${child.getText()});`;
};

const convertToTypeDefineEmits = (props: EmitType[]) => {
  const emitProps = props
    .filter((x) => x.type === "typedNonValidation")
    .map((x: any) => {
      const args = x.event.args.join(",");
      return `(e: '${x.event.name}', ${args}): void`;
    })
    .join(",");

  const emitStatement = `const emit = defineEmits<{${emitProps}}>();`;

  return emitStatement;
};

const isTrueKeyword = (kind: SyntaxKind) => {
  return kind === SyntaxKind.TrueKeyword;
};
