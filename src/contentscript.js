/*
  Fake News Extension
*/

import { HostService } from './services/host.service.js';

var siteId = 0;
var articleId = 0;

function InitializeArticle() {
  var sendurl = HostService.GetHost() + '/site/site/';

  chrome.runtime.sendMessage(
    {
      contentScriptQuery: 'RequestUrl',
      url: sendurl,
    },
    text => {
      var sites = JSON.parse(text);

      for (var i = 0; i < sites.length; i++) {
        if (window.location.href.includes(sites[i].domainName) && window.location.href.length > sites[i].domainName.length + 28) {
          siteId = sites[i].id;
          var titles = document.getElementsByTagName('h1');
          titles[0].innerHTML +=
            '<div class="FakeNewsDialog"><style>.FakeNewsDialog { font-size:12px; padding: 5px; margin:5px; width:200px; border: 1px solid black; background-color: white; color:black;	}</style><style>.FakeNewsLoader { border: 8px solid #888888;  border-top: 8px solid #333333;  border-radius: 50%;  width: 30px;  height: 30px;  animation: FakeNewsSpin 2s linear infinite;}@keyframes FakeNewsSpin {  0% { transform: rotate(0deg); }  100% { transform: rotate(360deg); }}</style><center><p>Fake News Extension</p><div class="FakeNewsLoader"/></center></div>';
          titles[0].innerHTML += '<FakeNewsVariableSiteId style="display: none;">' + siteId + '</FakeNewsVariableSiteId>';

          CheckIfArticle(window.location.href);
          return;
        }
      }
    }
  );
}

function CheckIfArticle(url) {
  var sendurl = HostService.GetHost() + '/article/article?url=' + encodeURIComponent(url);

  chrome.runtime.sendMessage(
    {
      contentScriptQuery: 'RequestUrl',
      url: sendurl,
    },
    text => {
      var loader = document.getElementsByClassName('FakeNewsDialog')[0];
      try {
        var json = JSON.parse(text);
        articleId = json.id;
        loader.parentElement.innerHTML += '<FakeNewsVariableArticleId style="display: none;">' + articleId + '</FakeNewsVariableArticleId>';
        GetVoterScore();
      } catch {
        loader.childNodes[2].childNodes[1].remove();
        loader.childNodes[2].innerHTML += "<p class='FakeNewsError'>Page not in database.</p>";
      }
    }
  );
}

function GetVoterScore() {
  var sendurl = HostService.GetHost() + '/vote/vote/' + articleId;

  chrome.runtime.sendMessage(
    {
      contentScriptQuery: 'RequestUrl',
      url: sendurl,
    },
    text => {
      var loader = document.getElementsByClassName('FakeNewsDialog')[0];
      loader.childNodes[2].childNodes[1].remove();
      try {
        var json = JSON.parse(text);

        var votetext = '';
        if (json.count == 1) {
          votetext = json.count + ' vote';
        } else {
          votetext = json.count + ' votes';
        }

        if (json.percentage >= 98) {
          loader.childNodes[2].innerHTML += "<p style='color:green;'>" + json.percentage + '% trusted. (' + votetext + ')</p>';
        } else if (json.percentage >= 95) {
          loader.childNodes[2].innerHTML += "<p style='color:yellow;'>" + json.percentage + '% trusted. (' + votetext + ')</p>';
        } else if (json.percentage >= 65) {
          loader.childNodes[2].innerHTML += "<p style='color:orange;'>" + json.percentage + '% trusted. (' + votetext + ')</p>';
        } else {
          loader.childNodes[2].innerHTML += "<p style='color:red;'>" + json.percentage + '% trusted. (' + votetext + ')</p>';
        }
      } catch {
        loader.childNodes[2].innerHTML += "<p style='color:black;'>" + text + '</p>';
      }
    }
  );
}

InitializeArticle();
