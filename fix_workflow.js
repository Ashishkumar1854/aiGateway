const fs = require('fs');
const wf = JSON.parse(fs.readFileSync('n8n/workflows/send_email.json'));

const setAttachmentIndex = wf.nodes.findIndex(n => n.name === 'Set Attachment Name');
const gmailNodeIndex = wf.nodes.findIndex(n => n.name === 'Send Email Node');

// Create IF node
const ifNode = {
  "parameters": {
    "conditions": {
      "boolean": [
        {
          "value1": "={{ $json.hasAttachment }}",
          "value2": true
        }
      ]
    }
  },
  "id": "e0a0d0a3-4321-4b11-a889-ifififififif",
  "name": "Check Attachment",
  "type": "n8n-nodes-base.if",
  "typeVersion": 1,
  "position": [700, 250]
};

// Update existing Gmail node to be "Send Email (Attachment)"
wf.nodes[gmailNodeIndex].name = "Send Email (Attachment)";
wf.nodes[gmailNodeIndex].position = [900, 150];
wf.nodes[gmailNodeIndex].parameters.options = { "attachments": "data" };

// Create second Gmail node "Send Email (No Attachment)"
const gmailNoAttach = JSON.parse(JSON.stringify(wf.nodes[gmailNodeIndex]));
gmailNoAttach.name = "Send Email (No Attachment)";
gmailNoAttach.id = "e0a0d0a3-4321-4b11-a889-noattach0000";
gmailNoAttach.position = [900, 350];
delete gmailNoAttach.parameters.options.attachments;

wf.nodes.push(ifNode, gmailNoAttach);

// Update connections
wf.connections["Set Attachment Name"] = {
  "main": [
    [
      { "node": "Check Attachment", "type": "main", "index": 0 }
    ]
  ]
};

wf.connections["Check Attachment"] = {
  "main": [
    [
      { "node": "Send Email (Attachment)", "type": "main", "index": 0 }
    ],
    [
      { "node": "Send Email (No Attachment)", "type": "main", "index": 0 }
    ]
  ]
};

wf.connections["Send Email (Attachment)"] = wf.connections["Send Email Node"];
wf.connections["Send Email (No Attachment)"] = wf.connections["Send Email Node"];
delete wf.connections["Send Email Node"];

// Build Response should be moved a bit
const buildResIndex = wf.nodes.findIndex(n => n.name === 'Build Response');
const captureErrIndex = wf.nodes.findIndex(n => n.name === 'Capture Gmail Error');
if (buildResIndex !== -1) wf.nodes[buildResIndex].position = [1100, 250];
if (captureErrIndex !== -1) wf.nodes[captureErrIndex].position = [1100, 450];

const respondIndex = wf.nodes.findIndex(n => n.name === 'Respond to Webhook');
const respondErrIndex = wf.nodes.findIndex(n => n.name === 'Respond Error');
if (respondIndex !== -1) wf.nodes[respondIndex].position = [1300, 250];
if (respondErrIndex !== -1) wf.nodes[respondErrIndex].position = [1300, 450];

fs.writeFileSync('n8n/workflows/send_email.json', JSON.stringify(wf, null, 2));
