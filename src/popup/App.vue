<template>
  <div id="popup">
    <h1>FakeNews Extention</h1>
    <p>{{ message }}</p>
    <div v-if="State == 0">
      <button v-if="!jwt" class="btn btn-primary" @click="SetState(1)">Sign in</button>
      <button v-if="jwt" class="btn btn-primary" @click="Logout()">Sign out</button>
      <button v-if="jwt" class="btn btn-primary" @click="AddArticle()">Add Article</button>
      <p v-if="jwt">Cast your vote:</p>
      <button v-if="jwt" class="btn btn-success VoteReal" @click="AddVote(1)">Real News</button>
      <button v-if="jwt" class="btn btn-danger VoteFake" @click="AddVote(0)">Fake News</button>
    </div>
    <div v-if="State == 1">
      <div>
        <br />
        <input class="textinput" placeholder="Username" v-model="username" />
        <br />
        <input class="textinput" placeholder="Password" type="password" v-model="password" />
        <br />
        <button type="submit" class="btn btn-primary" id="btnLogin" @click="Login()">Login</button>
      </div>
      <button class="btn btn-primary" @click="SetState(0)">Back</button>
    </div>
    <div v-if="State == 2">
      <h2>Site is enabled.</h2>
      <button class="btn btn-primary" @click="SetState(0)">Back</button>
    </div>
  </div>
</template>

<script>
import { version } from '../manifest.json';
import { userService } from '../services/user.service.js';
import { articleService } from '../services/article.service.js';
import { voteService } from '../services/vote.service.js';

export default {
  data() {
    return {
      message: '',
      currentPage: '',
      vuelogo: '../assets/logo.png',
      frontersion: version,
      backVersion: 'Unknown',
      State: 0,
      jwt: '',
      rating: 0,
      siteId: null,
      articleId: null,
    };
  },
  created() {
    if (localStorage.getItem('jwt')) {
      this.jwt = localStorage.getItem('jwt');
    }

    var query = { active: true, currentWindow: true };
    chrome.tabs.query(query, this.UrlCallback);
  },
  methods: {
    SetState(state) {
      this.State = state;
      this.message = ' ';
    },
    UrlCallback(tabs) {
      this.currentPage = tabs[0];
      console.log(this.currentPage);
    },
    Login() {
      const { username, password } = this;
      if (!(username && password)) {
        this.message = 'Please enter a username & password.';
        return;
      }
      this.loading = true;
      userService.login(username, password).then(
        data => {
          this.jwt = JSON.stringify(data.jwt);
          localStorage.setItem('jwt', this.jwt);
          this.SetState(0);
          this.message = 'Logged in!';
        },
        error => {
          this.message = error;
        }
      );
    },
    Logout() {
      this.jwt = '';
      localStorage.removeItem('jwt');
      this.message = 'Logged out!';
    },
    AddArticle() {
      if (!this.jwt) {
        this.message = 'Please Login First.';
        return;
      }

      chrome.tabs.executeScript(
        this.currentPage.id,
        {
          code: 'document.querySelector("FakeNewsVariableSiteId").textContent',
        },
        this.GetSite
      );
    },
    GetSite(results) {
      this.siteId = results[0];
      console.log(this.currentPage.url);
      articleService.AddArticle(parseInt(this.siteId), this.currentPage.url).then(
        data => {
          // eslint-disable-line no-unused-vars
          this.message = 'Page added, please refresh.';
        },
        error => {
          this.message = error;
        }
      );
    },
    AddVote(rating) {
      if (!this.jwt) {
        this.message = 'Please Login First.';
        return;
      }

      this.rating = rating;

      chrome.tabs.executeScript(
        this.currentPage.id,
        {
          code: 'document.querySelector("FakeNewsVariableArticleId").textContent',
        },
        this.GetArticle
      );
    },
    GetArticle(result) {
      this.articleId = result[0];

      if (!this.articleId) {
        this.message = 'Please Add article first.';
        return;
      }

      voteService.AddVote(parseInt(this.articleId), this.rating).then(
        data => {
          // eslint-disable-line no-unused-vars
          this.message = 'Vote submitted.';
        },
        error => {
          if (error.toString().includes('JSON')) {
            this.message = 'Vote changed.';
          } else {
            this.message = error;
          }
        }
      );
    },
  },
};
</script>
