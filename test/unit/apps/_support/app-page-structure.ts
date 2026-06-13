import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

const requiredGuideProps = ["firstSteps", "basicControls", "screenGuide", "rules", "tips"] as const;
const requiredPageIds = ["app", "about", "guide"] as const;

export function discoverAppSlugs(appsDirectory: string): string[] {
  return readdirSync(appsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => entry.name)
    .filter((slug) => existsSync(path.join(appsDirectory, slug, "page.tsx")))
    .sort();
}

export function findAppPageStructureProblems(appsDirectory: string, slug: string): string[] {
  const appDirectory = path.join(appsDirectory, slug);
  const routeFiles = {
    app: path.join(appDirectory, "page.tsx"),
    layout: path.join(appDirectory, "layout.tsx"),
    about: path.join(appDirectory, "about", "page.tsx"),
    guide: path.join(appDirectory, "guide", "page.tsx"),
  };
  const problems: string[] = [];

  for (const [route, filePath] of Object.entries(routeFiles)) {
    if (!existsSync(filePath)) {
      problems.push(`${slug}: missing ${route} route file`);
    }
  }

  if (problems.length > 0) {
    return problems;
  }

  const appPage = parseSourceFile(routeFiles.app);
  const layout = parseSourceFile(routeFiles.layout);
  const aboutPage = parseSourceFile(routeFiles.about);
  const guidePage = parseSourceFile(routeFiles.guide);

  requireMetadataPath(appPage, `/apps/${slug}`, slug, "app", problems);
  requireMetadataPath(aboutPage, `/apps/${slug}/about`, slug, "about", problems);
  requireMetadataPath(guidePage, `/apps/${slug}/guide`, slug, "guide", problems);

  const appPageShell = findJsxOpening(layout, "AppPageShell");
  if (!appPageShell) {
    problems.push(`${slug}: layout must use AppPageShell`);
  } else {
    const appHref = getStringAttribute(appPageShell, "appHref");
    if (appHref !== `/apps/${slug}`) {
      problems.push(`${slug}: AppPageShell appHref must be /apps/${slug}`);
    }

    const availablePages = getStringArrayAttribute(appPageShell, "availablePages");
    if (!sameStringSet(availablePages, requiredPageIds)) {
      problems.push(`${slug}: AppPageShell must enable app, about, and guide`);
    }
  }

  if (!findJsxOpening(aboutPage, "AppAboutShell")) {
    problems.push(`${slug}: about page must use AppAboutShell`);
  }

  const appGuideShell = findJsxOpening(guidePage, "AppGuideShell");
  if (!appGuideShell) {
    problems.push(`${slug}: guide page must use AppGuideShell`);
  } else {
    for (const prop of requiredGuideProps) {
      if (!hasJsxAttribute(appGuideShell, prop)) {
        problems.push(`${slug}: AppGuideShell is missing ${prop}`);
      }
    }
  }

  return problems;
}

function parseSourceFile(filePath: string): ts.SourceFile {
  return ts.createSourceFile(
    filePath,
    readFileSync(filePath, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
}

function requireMetadataPath(
  sourceFile: ts.SourceFile,
  expectedPath: string,
  slug: string,
  route: string,
  problems: string[],
) {
  if (findMetadataPath(sourceFile) !== expectedPath) {
    problems.push(`${slug}: ${route} metadata path must be ${expectedPath}`);
  }
}

function findMetadataPath(sourceFile: ts.SourceFile): string | undefined {
  let metadataPath: string | undefined;

  visit(sourceFile, (node) => {
    if (
      !ts.isCallExpression(node) ||
      !ts.isIdentifier(node.expression) ||
      node.expression.text !== "createPageMetadata"
    ) {
      return;
    }

    const options = node.arguments[0];
    if (!options || !ts.isObjectLiteralExpression(options)) {
      return;
    }

    for (const property of options.properties) {
      if (
        ts.isPropertyAssignment(property) &&
        property.name.getText(sourceFile) === "path" &&
        ts.isStringLiteral(property.initializer)
      ) {
        metadataPath = property.initializer.text;
      }
    }
  });

  return metadataPath;
}

function findJsxOpening(
  sourceFile: ts.SourceFile,
  componentName: string,
): ts.JsxOpeningLikeElement | undefined {
  let match: ts.JsxOpeningLikeElement | undefined;

  visit(sourceFile, (node) => {
    if (
      (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
      node.tagName.getText(sourceFile) === componentName
    ) {
      match = node;
    }
  });

  return match;
}

function getStringAttribute(
  element: ts.JsxOpeningLikeElement,
  attributeName: string,
): string | undefined {
  const attribute = findJsxAttribute(element, attributeName);
  return attribute?.initializer && ts.isStringLiteral(attribute.initializer)
    ? attribute.initializer.text
    : undefined;
}

function getStringArrayAttribute(
  element: ts.JsxOpeningLikeElement,
  attributeName: string,
): string[] {
  const attribute = findJsxAttribute(element, attributeName);
  if (
    !attribute?.initializer ||
    !ts.isJsxExpression(attribute.initializer) ||
    !attribute.initializer.expression ||
    !ts.isArrayLiteralExpression(attribute.initializer.expression)
  ) {
    return [];
  }

  return attribute.initializer.expression.elements
    .filter(ts.isStringLiteral)
    .map((item) => item.text);
}

function hasJsxAttribute(element: ts.JsxOpeningLikeElement, attributeName: string): boolean {
  return findJsxAttribute(element, attributeName) !== undefined;
}

function findJsxAttribute(
  element: ts.JsxOpeningLikeElement,
  attributeName: string,
): ts.JsxAttribute | undefined {
  return element.attributes.properties.find(
    (property): property is ts.JsxAttribute =>
      ts.isJsxAttribute(property) && property.name.getText() === attributeName,
  );
}

function sameStringSet(actual: readonly string[], expected: readonly string[]): boolean {
  return (
    actual.length === expected.length &&
    expected.every((item) => actual.includes(item)) &&
    actual.every((item) => expected.includes(item))
  );
}

function visit(node: ts.Node, inspect: (node: ts.Node) => void) {
  inspect(node);
  node.forEachChild((child) => visit(child, inspect));
}
