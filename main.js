const core = require('@actions/core')
const request = require('request');

process.on('unhandledRejection', handleError);
main().catch(handleError);
function handleError(err) {
  console.error(err)
  core.setFailed(err.message)
}

function post(url, body) {
  request.post(url, {json: body}, (error, response, body) => {
    if (error) {
      core.error('statusCode:', response && response.statusCode);
      core.error('body:', body);
      core.setFailed(error);
    }
  });
}

function sectionBlock(text) {
  return {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": text,
    }
  };
}

function contextBlock(text) {
  return {
    "type": "context",
    "elements": [
      {
        "type": "mrkdwn",
        "text": text
      }
    ]
  };
}

function buttonBlock(text, url) {
  return {
    "type": "actions",
    "elements": [
      {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": text,
          "emoji": true
        },
        "url": url
      }
    ]
  };
}

function build(section, context, buttonText, buttonUrl) {
  blocks = []

  if (section) {
    blocks.push(sectionBlock(section));
  }

  if (context) {
    blocks.push(contextBlock(context));
  }

  if (buttonText && buttonUrl) {
    blocks.push(buttonBlock(buttonText, buttonUrl));
  }

  return {
    "blocks": blocks
  }
}

async function main() {
  const slackUrl = core.getInput('slack-webhook-url');
  const message = core.getInput('message');
  const context = core.getInput('context');
  const buttonUrl = core.getInput('button-url');
  const buttonText = core.getInput('button-text');

  body = build(message, context, buttonText, buttonUrl);
  console.log("Posting to slack");
  post(slackUrl, body);
}

