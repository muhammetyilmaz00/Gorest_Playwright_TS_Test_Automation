const common = {
  requireModule: ["ts-node/register"],
  require: ["src/test/steps/**/*.ts", "src/test/setup/hooks.ts"],
  paths: ["src/test/featureFiles/**/*.feature"],
  dryRun: false,
  tags: process.env.tags || "@regression",
};

module.exports = {
  default: {
    ...common,
    format: [
      // "progress-bar",
      "html:test-results/cucumber-report.html",
      "json:test-results/cucumber-report.json",
      "rerun:@rerun.txt",
    ],
  },
  rerun: {
    format: [
      // "progress-bar",
      "html:test-results/cucumber-report.html",
      "json:test-results/cucumber-report.json",
      "rerun:@rerun.txt",
    ],
  },
  ci: {
    ...common,
    format: [
      "json:test-results/cucumber-json-report.json",
      "junit:test-results/cucumber-junit-report.xml",
    ],
    retry: 1,
  },
};
