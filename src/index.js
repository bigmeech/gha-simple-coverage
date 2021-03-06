const path = require("path");
const fs = require("fs");

const core = require("@actions/core");
const lcov = require("lcov-total");

const { GITHUB_WORKSPACE } = process.env;

function handleAction() {
  const failIfBelow = core.getInput("fail-if-below");
  const lcovPath = path.resolve(
    GITHUB_WORKSPACE,
    `${core.getInput("lcov-file-path")}`
  );
  try {
    if (!fs.existsSync(lcovPath))
      return core.setFailed(`lcov file not found at: ${lcovPath}`);

    const lcovContent = fs.readFileSync(lcovPath);
    console.log(lcovContent.toString("utf8"));

    const total = lcov(lcovPath);
    if (total < failIfBelow)
      return core.setFailed(
        `Code coverage constraint was not met: ${total}/${failIfBelow}`
      );

    core.setOutput("coverage-percent", total);
  } catch (e) {
    core.setFailed(
      `Actions Error: ${e.message}. Please make sure an lcov file was generated for your source code`
    );
  }
}

handleAction();

module.exports = handleAction
