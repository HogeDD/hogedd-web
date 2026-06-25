import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const issueTemplateDirectory = path.join(process.cwd(), ".github", "ISSUE_TEMPLATE");
const requiredSections = ["## 背景", "## やること", "## やらないこと", "## 完了条件"];
const expectedTitlePrefixes = [
  "【app】",
  "【appページ】",
  "【ui】",
  "【fix】",
  "【確認】",
  "【公開準備】",
  "【youtube】",
  "【マーケ】",
  "【docs】",
  "【test】",
  "【infra】",
  "【開発サイクル】",
];

describe("issue templates", () => {
  it("disables blank issues so contributors choose a template", () => {
    const config = readFileSync(path.join(issueTemplateDirectory, "config.yml"), "utf8");

    expect(config).toContain("blank_issues_enabled: false");
  });

  it("provides one template for each issue title prefix", () => {
    const templates = readIssueTemplates();
    const titles = templates.map(({ frontmatter }) => frontmatter.title).sort();

    expect(titles).toEqual([...expectedTitlePrefixes].sort());
  });

  it("keeps every template on the same four-section structure", () => {
    for (const template of readIssueTemplates()) {
      expect(template.frontmatter.name, template.fileName).toBeTruthy();
      expect(template.frontmatter.about, template.fileName).toBeTruthy();

      for (const section of requiredSections) {
        expect(template.body, `${template.fileName} should include ${section}`).toContain(section);
      }
    }
  });
});

function readIssueTemplates() {
  expect(existsSync(issueTemplateDirectory)).toBe(true);

  return readdirSync(issueTemplateDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const content = readFileSync(path.join(issueTemplateDirectory, fileName), "utf8");
      const endOfFrontmatter = content.indexOf("\n---\n", "---\n".length);

      if (!content.startsWith("---\n") || endOfFrontmatter < 0) {
        throw new Error(`${fileName} must start with YAML frontmatter`);
      }

      const frontmatter = content.slice("---\n".length, endOfFrontmatter);
      const body = content.slice(endOfFrontmatter + "\n---\n".length);

      return {
        fileName,
        frontmatter: parseFrontmatter(frontmatter),
        body,
      };
    });
}

function parseFrontmatter(frontmatter: string): Record<string, string> {
  return Object.fromEntries(
    frontmatter
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const separatorIndex = line.indexOf(":");
        if (separatorIndex < 0) {
          throw new Error(`invalid frontmatter line: ${line}`);
        }

        const key = line.slice(0, separatorIndex).trim();
        const value = line
          .slice(separatorIndex + 1)
          .trim()
          .replace(/^"|"$/g, "");

        return [key, value];
      }),
  );
}
