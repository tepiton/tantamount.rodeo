---
title: Posting to the web from Drafts
date: 2023-03-16T02:40:54.663Z
draftDate: 2023-02-11T05:52:08.250Z
github: https://github.com/pborenstein/pborenstein.dev/blob/main/src/posts/13c0b77f-5f5a-49df-941c-3d00be0a0b05.md
newlines: false
permalink: "/posts/{{title|slugify|truncate(32,true, '')}}/"
tags:
  - automation
  - github-api
  - webhooks
  - drafts-app
  - deployment
  - yaml
---
Some notes on a mechanism for posting from Drafts with as little friction as possible.
<!-- excerpt -->

+ Write the text in [Drafts](https://getdrafts.com)
+ Xocoyotl action
    + formats draft as a post with front matter
    + stores metadata used for updates & deletion
    + pushes post to repo
+ Pushing to GitHub triggers a deploy on Netlify


## The Xocoyotl Action

> the genesis of this action came from [Blogging from Drafts | roub dot net](https://roub.net/blahg/2019/01/14/blogging-from-drafts/index.html)


+ Assembles front matter for the draft.
+ Most of the data can be inferred from the draft itself:
    + title (the first line of the draft)
    + date (the current date)
    + draftDate (date draft created)
    ```yaml
    ---
    title: <the H1 from the draft>
    date: 2023-02-10T20:02:51.521Z
    draftDate: 2023-02-10T02:33:55.380Z
    draft: drafts://open?uuid=B79AE5C3-E1A5-4831-B4C3-AAE06AE73CF5
    github: https://github.com/tepiton/tlilli/blob/main/src/posts/b79ae5c3-e1a5-4831-b4c3-aae06ae73cf5.md
    newlines: false
    ---
    ```
+ Data that can't be derived from the draft is stored in `Drafts/Library/Scripts/t-<credentialName>`, keyed on the UUID of the draft
    + the repo name
    + the path for the file
    + whether to preserve newlines
    ```json
    "B79AE5C3-E1A5-4831-B4C3-AAE06AE73CF5" : {
      "newlines" : false,
      "repoPath" : "src/posts",
      "repo" : "tlilli"
    }
    ```

## Credentials

+ GitHub credentials are stored in a Drafts [Credentials object](https://scripting.getdrafts.com/classes/Credential).
+ The credentials object stores the GitHub user name (or project name) and a corresponding [personal access token](https://github.com/settings/tokens).
+ The name of the credential is used in the name of the external storage.
