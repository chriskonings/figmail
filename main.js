const PERSONAL_ACCESS_TOKEN = '4378-ec89dc8d-6301-4ee7-ae8f-8fa7341a0f43';

function getFileKey(pageUrl) {
const parser = document.createElement('a');
parser.href = pageUrl;
return parser.pathname.replace('/file/', '').replace(/\/.*/,'');
}

function getNodeId(pageUrl) {
const parser = document.createElement('a');
parser.href = pageUrl;
return decodeURIComponent(parser.search).replace('?node-id=','');
}

function apiRequest(fileKey, id) {
return fetch('/convert?key=' + fileKey + '&id=' + id)
.then(function(response) {
    return response.json();
}).catch(function (error) {
    return { err: error };
});
}

function callFigmaAndDrawMockups() {
startProgress();
const pageUrl = document.getElementById('url_input').value;
const nodeId = getNodeId(pageUrl);
apiRequest(getFileKey(pageUrl), nodeId);
stopProgress();
}
