const path = require('path');

const core = require('@actions/core');
const github = require('@actions/github');
const lcov = require('lcov-total');

const { GITHUB_WORKSPACE, RUNNER_WORKSPACE } = process.env

const failAt = core.getInput('fail-at');
try {
    const lcovPath = path.resolve(RUNNER_WORKSPACE, `${core.getInput('lcov-file-path')}`);
    console.log({ lcovPath, failAt, GITHUB_WORKSPACE, ENV: process.env });
    const total = lcov(lcovPath);

    console.log({ total, lcovPath, failAt, GITHUB_WORKSPACE })
    if(failAt < total) {
        core.setFailed(`Code coverage constraint was not met: ${total}/${failAt}`);
    }
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`Event Payload: ${payload}`);
    core.setOutput('coverage-percent', total);
} catch(e) {
    core.setFailed(`Actions Error: ${e.message}. Please make sure an lcov file was generated for your source code`)
}

