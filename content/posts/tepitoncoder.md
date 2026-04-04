---
title: "Generate a full web app with ChatGPT"
date: 2023-06-11T22:51:44-04:00
description: "A Python program that uses the ChatGPT API to generate a complete web app by chaining multiple prompts and using intermediate results."
tags:
  - ChatGPT
  - llms
  - ai
  - automation
  - python
  - web-development
  - prompt-engineering
---

<blockquote class="excerpt">
<!-- excerpt -->
A Python program that uses the ChatGPT API to generate a complete web app by chaining multiple prompts and using intermediate results.
<!-- excerpt -->
</blockquote>


I wanted to understand better how you could write ChatGPT prompts that depended on the results of previous requests, so I did what I usually do: I found something that did what I was looking for, then took it apart and put it back together.

[`smol-ai/developer`](https://github.com/smol-ai/developer) is a program that [Shawn (swyx) Wang](https://www.swyx.io), the developer, describes as the thing that writes the thing you want.

> Given a prompt that describes a program in detail, `smol-ai/developer` determines what files it will need to generate it, then proceeds to generate running code

I called the result [**tepiton coder**](https://github.com/pborenstein/tcoder). [`Tepiton`](https://nahuatl.wired-humanities.org/content/tepiton) is a Nahuatl word that means _something small_. The base I worked from is called "smol developer" so: "tepiton coder".^[In proper Nahuatl it's probably more like "coder-tepiton", but I don't really know proper Nahuatl.]

## How the program works

This walkthrough uses an example prompt called [`randompic.md`](https://github.com/pborenstein/tcoder/blob/main/randompic.md) that generates a web site that displays a random picture and has a button that updates it. We'll see the full prompt in a little bit.

The command^[After installing [tepiton coder](https://github.com/pborenstein/tcoder/blob/main/README.md) and [Modal](https://modal.com)] looks like this:


```bash
$ modal run --quiet main  --prompt randompic.md
```

And this is what it does:

1.  Creates a list of files it needs to generate the app
2.  Figures out the general components of the app and stores them in a file called [`shared_dependencies.md`](https://github.com/pborenstein/tcoder/blob/main/examples/randompic/shared_dependencies.md)
3.  Uses the shared dependencies and the list of files needed to [generate all the files](https://github.com/pborenstein/tcoder/tree/main/examples/randompic)


## How ChatGPT prompts work

Every ChatGPT prompt is a [set of messages](https://platform.openai.com/docs/guides/gpt/chat-completions-api) made up of a role and some content. The roles are:

+ `system`: instructions for the model
+ `user`: user instructions
+ `assistant`: what the model generates

```js
import openai

openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who won the world series in 2020?"},
        {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
        {"role": "user", "content": "Where was it played?"}
    ]
)
```

ChatGPT uses the messages to keep track of who said what in the conversation.^[That's it. That's the  trick.]

This program uses the results of a prompt (an `assitant` message) in subsequent `system` and `user` messages.


### The wish prompt

Everything starts with our initial description of what we want tepiton coder to make for us. This prompt pretty specific, providing lots of hints for later steps. (I call it the _wish prompt_ because reasons.)

<pre style="background-color: rgb(248, 248, 248);" class="language-text"><code class="text"><span class="user_prompt">A web page that displays a random picture in a pleasing layout.

- The URL to get a new random picture everytime: https://picsum.photos/400/
- You do not need to provide any query parameters
- the id of the img element is 'img'
- the id of the button is 'refresh'
- make the background tomato
- set all listeners in script.js
- set all colors in style.css
- make sure the button shows hover and clicked states
</span></code></pre>

You'll see that this prompt is repeated in every request.^[You can find the wish prompt in [`randompic.md`](https://github.com/pborenstein/tcoder/blob/main/randompic.md).]

### The intermediate prompts
Tepiton coder uses four intermediate prompts to generate the files.^[You can find these prompts in [`prompts.py`](https://github.com/pborenstein/tcoder/blob/main/prompts.py).]


- `SYSTEM_PROMPT_TO_GET_LIST_FILES`
  This prompt asks tepiton coder to figure out what
  files we'll need. Its corresponding user prompt is the wish prompt.

+ `SYSTEM_PROMPT_TO_GET_SHARED_DEPENDENCIES`
  This prompt incorporates the wish prompt and the list of
  files generated to figure out dependencies.
  Its corresponding user prompt is the wish prompt.

+ `SYSTEM_PROMPT_TO_GENERATE_FILE`
  This system prompt incorporates the wish prompt,
  the list of files needed,
  and the shared dependencies to help it make sense
  of how the pieces go together.
  It has its own corresponding user prompt.

+ `USER_PROMPT_TO_GENERATE_FILE`
  A companion user prompt, this one tells tepiton coder
  which file to generate, and gives lots of advice. It's
  used to through the files.





## Prompt 1: get a list of files


The first prompt gets a list of files needed for the program. The system prompt is a description of what we want. We have to be very insistent that the response is a Python list of strings.


### system prompt 1: `SYSTEM_PROMPT_TO_GET_LIST_FILES`
The system prompt gives general instructions.

<pre style="background-color: rgb(248, 248, 248);" class="language-text"><code class="text"><strong>system=>:</strong><span class="system_prompt"> You are an AI developer who is trying to write a program
that will generate code for the user based on their intent.

When given their intent, create a complete, exhaustive list of files
that the user would write to make the program.

only list the filepaths you would write, and return them as a python list of strings.
do not add any other explanation, only return a python list of strings.
It is IMPORTANT that you return ONLY a python list of strings, not a string.</span>
</code></pre>


### user prompt 1: wish prompt
While the system prompt tells tepiton coder how to do a task,
the user prompt defines the materials it works with.

<pre style="background-color: rgb(248, 248, 248);" class="language-text"><code class="text"><strong>user=>:</strong><span class="user_prompt"> A web page that displays a random picture in a pleasing layout.

- The URL to get a new random picture everytime: https://picsum.photos/400/
- You do not need to provide any query parameters
- the id of the img element is 'img'
- the id of the button is 'refresh'
- make the background tomato
- set all listeners in script.js
- set all colors in style.css
- make sure the button shows hover and clicked states</span>
</code></pre>


### response 1:
The result is a list of files. It's true, we gave it huge hints about `script.js` and `style.css`. Tepiton coder uses this list in the subsequent steps.

<pre style="background-color: rgb(248, 248, 248);" class="language-text"><code class="text"><span class="file_list">['index.html', 'style.css', 'script.js']</span>
</code></pre>




## Prompt 2: get a list of shared dependencies
This is the most interesting step. Its job is to collect information that can be used to generate consistent code across files.

### system prompt 2: `SYSTEM_PROMPT_TO_GET_SHARED_DEPENDENCIES`

This prompt gives the general instruction to figure out what the dependencies among the generated files will be. Note that this system prompt incorporates the wish prompt and the list of files generated by Prompt 1.

<pre style="background-color: rgb(248, 248, 248);" class="language-text"><code class="text"><strong>system=>:</strong><span class="system_prompt"> You are an AI developer who is trying to write a program
that will generate code for the user based on their intent.

In response to the user's prompt:

    ---
    the app is:<span class="user_prompt"> A web page that displays a random picture in a pleasing layout.

- The URL to get a new random picture everytime: https://picsum.photos/400/
- You do not need to provide any query parameters
- the id of the img element is 'img'
- the id of the button is 'refresh'
- make the background tomato
- set all listeners in script.js
- set all colors in style.css
- make sure the button shows hover and clicked states</span>

    ---

    the files we have decided to generate are: <span class="file_list">['index.html', 'style.css', 'script.js']</span>

    Now that we have a list of files, we need to understand
    what dependencies they share. Please name and briefly
    describe what is shared between the files we are
    generating, including exported variables, data schemas,
    id names of every DOM elements that javascript functions
    will use, message names, and function names. Exclusively
    focus on the names of the shared dependencies, and do
    not add any other explanation.</span>
</code></pre>

### user prompt 2: wish prompt
The user prompt for this step is the wish prompt again. I'm not sure whether this is the best way to do this, given that the wish prompt is used twice. But it is giving me the idea that prompt engineering might actually be a thing.

<pre style="background-color: rgb(248, 248, 248);" class="language-text"><code class="text"><strong>user=>:</strong><span class="user_prompt"> A web page that displays a random picture in a pleasing layout.

- The URL to get a new random picture everytime: https://picsum.photos/400/
- You do not need to provide any query parameters
- the id of the img element is 'img'
- the id of the button is 'refresh'
- make the background tomato
- set all listeners in script.js
- set all colors in style.css
- make sure the button shows hover and clicked states</span>
</code></pre>


### response 2: shared dependencies
Thee resulting list of dependencies is pretty neat. It will use this list when it generates the files.

<pre style="background-color: rgb(248, 248, 248);" class="language-text"><code class="text"><span class="shared_dependencies">Shared dependencies between the files we are generating:

- index.html:
    - img element with id 'img'
    - button element with id 'refresh'
    - script.js file
    - style.css file

- style.css:
    - background color 'tomato'
    - hover and clicked states for button with id 'refresh'

- script.js:
    - img element with id 'img'
    - button element with id 'refresh'
    - event listeners for button with id 'refresh'</span>
</code></pre>

## Prompt 3: file generation
Everything comes together here.

Tepiton coder makes a request for each of the three files.
The system prompt is the same for each request
while the user prompt specifies the file to generate.



### system prompt 3a: `SYSTEM_PROMPT_TO_GENERATE_FILE`

This step puts all the elements into a system prompt
with the instruction to generate code from
the wish prompt
and the shared dependencies.

The same system instruction is given for each file.

<pre style="background-color: rgb(248, 248, 248);" class="language-text"><code class="text"><strong>system=>:</strong> <span class="system_prompt">You are an AI developer who is trying to write a program
that will generate code for the user based on their intent.

the app is: <span class="user_prompt"> A web page that displays a random picture in a pleasing layout.

- The URL to get a new random picture everytime: https://picsum.photos/400/
- You do not need to provide any query parameters
- the id of the img element is 'img'
- the id of the button is 'refresh'
- make the background tomato
- set all listeners in script.js
- set all colors in style.css
- make sure the button shows hover and clicked states</span>

the files we have decided to generate are: <span class="file_list">['index.html', 'style.css', 'script.js']</span>
the shared dependencies (like filenames and variable names)
we have decided on are:
<span class="shared_dependencies">Shared dependencies between the files we are generating:

- index.html:
    - img element with id 'img'
    - button element with id 'refresh'
    - script.js file
    - style.css file

- style.css:
    - background color 'tomato'
    - hover and clicked states for button with id 'refresh'

- script.js:
    - img element with id 'img'
    - button element with id 'refresh'
    - event listeners for button with id 'refresh'</span>

only write valid code for the given filepath and file type,
and return only the code. do not add any other explanation,
only return valid code for that file type.</span>
</code></pre>

### user prompt 3a: `USER_PROMPT_TO_GENERATE_FILE`

The user prompt names the specific file and gives
further instructions.

<pre style="background-color: rgb(248, 248, 248);" class="language-text"><code class="text"><strong>user=>:</strong> <span class="filegen_prompt">We have broken up the program into per-file generation.
Now your job is to generate only the code for the file
index.html. Make sure to have consistent filenames if
you reference other files we are also generating.

Remember that you must obey these things:

- you are generating code for the file index.html
- do not stray from the names of the files
  and the shared dependencies we have decided on
- MOST IMPORTANT OF ALL - the purpose of our app is<span class="user_prompt"> A web page that displays a random picture in a pleasing layout.

- The URL to get a new random picture everytime: https://picsum.photos/400/
- You do not need to provide any query parameters
- the id of the img element is 'img'
- the id of the button is 'refresh'
- make the background tomato
- set all listeners in script.js
- set all colors in style.css
- make sure the button shows hover and clicked states</span>

  every line of code you generate must be valid code.
- DO NOT use code fences
- DO NOT use markdown syntax.
- Do not explain the code
- return valid code for that file type.

Begin generating the code now.</span>
</code></pre>

### response 3a `index.html`

This is the result of generating `index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Random Picture Generator</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <div class="container">
      <img id="img" src="https://picsum.photos/400/">
      <button id="refresh">Refresh</button>
    </div>
    <script src="script.js"></script>
  </body>
</html>
```


### system prompt 3b: `SYSTEM_PROMPT_TO_GENERATE_FILE`

The same system prompt is used to generate files.


<pre style="background-color: rgb(248, 248, 248);" class="language-text"><code class="text"><strong>system=>:</strong> <span class="system_prompt">You are an AI developer who is trying to write a program
that will generate code for the user based on their intent.

the app is:<span class="user_prompt"> A web page that displays a random picture in a pleasing layout.

- The URL to get a new random picture everytime: https://picsum.photos/400/
- You do not need to provide any query parameters
- the id of the img element is 'img'
- the id of the button is 'refresh'
- make the background tomato
- set all listeners in script.js
- set all colors in style.css
- make sure the button shows hover and clicked states</span>

the files we have decided to generate are: <span class="file_list">['index.html', 'style.css', 'script.js']</span>
the shared dependencies (like filenames and variable names)
we have decided on are:
<span class="shared_dependencies">Shared dependencies between the files we are generating:

- index.html:
    - img element with id 'img'
    - button element with id 'refresh'
    - script.js file
    - style.css file

- style.css:
    - background color 'tomato'
    - hover and clicked states for button with id 'refresh'

- script.js:
    - img element with id 'img'
    - button element with id 'refresh'
    - event listeners for button with id 'refresh'</span>

only write valid code for the given filepath and file type,
and return only the code. do not add any other explanation,
only return valid code for that file type.</span>

</code></pre>

### user prompt 3b: `USER_PROMPT_TO_GENERATE_FILE`

Again, the purpose here is to generate `style.css`

<pre style="background-color: rgb(248, 248, 248);" class="language-text"><code class="text"><strong>user=>:</strong> <span class="filegen_prompt">We have broken up the program into per-file generation.
Now your job is to generate only the code for the file
style.css. Make sure to have consistent filenames if
you reference other files we are also generating.

Remember that you must obey these things:

- you are generating code for the file style.css
- do not stray from the names of the files
  and the shared dependencies we have decided on
- MOST IMPORTANT OF ALL - the purpose of our app is<span class="user_prompt"> A web page that displays a random picture in a pleasing layout.

- The URL to get a new random picture everytime: https://picsum.photos/400/
- You do not need to provide any query parameters
- the id of the img element is 'img'
- the id of the button is 'refresh'
- make the background tomato
- set all listeners in script.js
- set all colors in style.css
- make sure the button shows hover and clicked states</span>

  every line of code you generate must be valid code.
- DO NOT use code fences
- DO NOT use markdown syntax.
- Do not explain the code
- return valid code for that file type.

Begin generating the code now.</span>
</code>
</pre>

### response 3b `style.css`

The generated CSS file.

```css
/* style.css */

body {
  background-color: tomato;
}

#refresh {
  background-color: white;
  color: tomato;
  border: 2px solid tomato;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
}

#refresh:hover {
  background-color: tomato;
  color: white;
}

#refresh:active {
  background-color: darkred;
  color: white;
}
```

### system prompt 3c `SYSTEM_PROMPT_TO_GENERATE_FILE`



<pre style="background-color: rgb(248, 248, 248);" class="language-text"><code class="text"><strong>system=>:</strong> <span class="system_prompt">You are an AI developer who is trying to write a program
that will generate code for the user based on their intent.

the app is:<span class="user_prompt"> A web page that displays a random picture in a pleasing layout.

- The URL to get a new random picture everytime: https://picsum.photos/400/
- You do not need to provide any query parameters
- the id of the img element is 'img'
- the id of the button is 'refresh'
- make the background tomato
- set all listeners in script.js
- set all colors in style.css
- make sure the button shows hover and clicked states</span>

the files we have decided to generate are: <span class="file_list">['index.html', 'style.css', 'script.js']</span>
the shared dependencies (like filenames and variable names)
we have decided on are:
<span class="shared_dependencies">Shared dependencies between the files we are generating:

- index.html:
    - img element with id 'img'
    - button element with id 'refresh'
    - script.js file
    - style.css file

- style.css:
    - background color 'tomato'
    - hover and clicked states for button with id 'refresh'

- script.js:
    - img element with id 'img'
    - button element with id 'refresh'
    - event listeners for button with id 'refresh'</span>

only write valid code for the given filepath and file type,
and return only the code. do not add any other explanation,
only return valid code for that file type.</span>

</code></pre>

### user prompt 3c: `USER_PROMPT_TO_GENERATE_FILE`

This is the instruction to generate `script.js`

<pre style="background-color: rgb(248, 248, 248);" class="language-text"><code class="text"><strong>user=>:</strong> <span class="filegen_prompt">We have broken up the program into per-file generation.
Now your job is to generate only the code for the file
script.js. Make sure to have consistent filenames if
you reference other files we are also generating.

Remember that you must obey these things:

- you are generating code for the file script.js
- do not stray from the names of the files
  and the shared dependencies we have decided on
- MOST IMPORTANT OF ALL - the purpose of our app is<span class="user_prompt"> A web page that displays a random picture in a pleasing layout.

- The URL to get a new random picture everytime: https://picsum.photos/400/
- You do not need to provide any query parameters
- the id of the img element is 'img'
- the id of the button is 'refresh'
- make the background tomato
- set all listeners in script.js
- set all colors in style.css
- make sure the button shows hover and clicked states</span>

  every line of code you generate must be valid code.
- DO NOT use code fences
- DO NOT use markdown syntax.
- Do not explain the code
- return valid code for that file type.

Begin generating the code now.</span>

</code></pre>


### response 3c `script.js`

The generated script.

```js
// script.js

const img = document.getElementById('img');
const refreshBtn = document.getElementById('refresh');

function getRandomImage() {
  const randomImageUrl = `https://picsum.photos/400/?random=${Math.random()}`;
  img.src = randomImageUrl;
}

refreshBtn.addEventListener('click', getRandomImage);
```


<style>
  .user_prompt { color: blue; }
  .system_prompt { color: green; }
  .file_list { color: blue; background-color: yellow;}
  .shared_dependencies {color: purple; }
  .filegen_prompt {color: #D95E00; }
  code.text strong { font-weight: 800; color: orangered; }
</style>


## The end result

The [resulting app](https://tepiton-coder.netlify.app/) is very plain, but does the job, and all the code was generated by machine.

![](src/assets/img/tepiton.png)

## Acknowledgments

Thank you so much to [Shawn (swyx) Wang](https://www.swyx.io) and the [contributors](https://github.com/smol-ai/developer/graphs/contributors) for `smol-ai/developer`.


Tepiton coder is more of a derivative of [`smol-ai/developer`](https://github.com/smol-ai/developer) than a fork. The original program explores a whole bunch of things like _generating a prompt from code_. You should go take a look.


I do my best work when I have something smol to start from.

