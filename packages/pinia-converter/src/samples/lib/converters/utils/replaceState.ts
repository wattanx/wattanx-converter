import { Statement, Node, SyntaxKind } from "ts-morph";

export const replaceState = (statement: Statement, replaceText: string) => {
  if (Node.isExpressionStatement(statement)) {
    const propertyAccessExpression = statement
      .getDescendantsOfKind(SyntaxKind.PropertyAccessExpression)
      .at(0);

    const expression = statement.getExpression();

    if (propertyAccessExpression.getExpression().getText() === replaceText) {
      // (e.g.) state.count++ -> count.value++
      const regex = new RegExp(`${replaceText}\\.([\\w-]+)`, "g");
      return expression.getFullText().replace(regex, (_, p1) => `${p1}.value`);
    } else {
      return statement.getFullText();
    }
  }
};
