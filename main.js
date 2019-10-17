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

function build(section, context, buttonText, buttonUrl) {
  blocks = []

  if (section) {
    blocks.push({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": section,
      }
    });
  }
  if (context) {
    blocks.push({
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": context
        }
      ]
    });
  }

  if (buttonText) {
    blocks.push({
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": buttonText,
            "emoji": true
          },
           "url": buttonUrl
        }
      ]
    });

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

