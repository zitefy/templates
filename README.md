<img src="https://github.com/user-attachments/assets/828a118d-0743-4d75-91a0-13a9515f055f" alt="zitefy" width="250" align="right">

# `templates` 🖥️

> This repository holds all the base templates in zitefy. Just pure HTML, CSS & JS code that gets transformed into sites.

## Table Of Contents
* [What's this?](#whats-this)
* [Templating Guide](#templating-guide)
    * [Dealing with info from UI](#dealing-with-info-from-ui)
    * [Using custom values & elements](#using-custom-values--elements)
    * [Extending with external assets](#extending-with-external-assets)
    * [The HTML creation algorithm](#the-html-creation-algorithm)
* [Contributing](#contributing)

## What's this?
These are all the base templates in zitefy. Each directory is a template. Each template contains the source code with some metadata. When a new one is pushed to main, a github action uploads it to the designated directory on the server. Currently, there is no way for a dev to create templates directly from the portal, though we may add it later. As such, if you want to add a new template to zitefy, the only way is to contribute to this repo.

This repository embodies our aim to keep all templates open-source, documented and accessible to even the most inexperienced of developers. Anyone will be able to see and build upon these templates. Want to add your own template to zitefy? Follow the guide below.

## Templating guide
Hi there chad! We suspect you got here because you want to either customize a template manually for your site or make a zitefy template and share it with everyone. If that's the case, we got you! Just read on...

### Dealing with info from UI
You might have seen the web UI where users are allowed to choose what they want to share on their sites. Now, as a template developer, you might want to render this selected info in different ways. For instance, for a social media platform link, you might only want to show an icon. But for others like name or email, you might want to display the data inside your HTML elements. We deal with this issue using a combination of the `id` & `data-display` attributes in HTML.

Let's take a look at a template where you want a social media icon to be rendered without the username and the name to be rendered fully.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>zitefy</title>
        <!-- everything else goes here -->
    </head>
    <body>
        <p id="name" data-display="true">
            <!-- the user's chosen value (in this case, name) will be injected here and displayed. any default content will be overwritten -->
        </p>
        <div class="socials">
            <!-- no content will be injected/altered here, instead the link will be put in the href of this <svg /> -->
            <svg id="twitter"><path /></svg>
        </div>
    </body>
</html>
```

The list of `id`'s being used are:

1. `name` - the user's display name
2. `username` - their username on zitefy
3. `email` - registered email address (link gets prefixed with `mailto:`)
4. `phone` - user's phone number (link gets prefixed with `tel:`)
5. `dob` - the provided date of birth as an ISO 8600 string
6. `pronouns` - the selected pronouns
7. `bio` - the user's bio
8. `instagram` - user's instagram profile
9. `github` - user's github profile
10. `twitter` - user's twitter/x profile
11. `linkedin` - user's linkedin profile
12. `other` - any other link

It's this simple. With this, you can easily control how each info is rendered in your template.

### Using custom values & elements
You can write basically any element inside your HTML and style it as you wish. There are no restrictions, this is an open platform where you can express your creativity.

However, do take care to not replicate the `id` values mentioned in the section above. If you do so, the HTML building engine may get confused and the output may not turn out to be what you expect.

### Extending with external assets
This section doesn't apply to template devs as the feature is only available if you're editing a template to create a site. Unfortunately, if you're a template dev, there is no way other than using your own CDN to use your assets. You can simply upload a file to Google Drive or Dropbox and copy paste the shareable URL.

When editing your personal website from a template, you might want to add a PDF or video or some personal asset for others to see. Here are the steps to do so:

1. Go to the **Assets** tab alongside the other tabs in the editor.
2. Click the **Upload new asset** button and choose your file
3. It will get uploaded, copy the URL by clicking on the icon

> :warning: Never store personal documents or other sensitive info in the assets tab. These are publicly exposed.

The generated URl that you can copy is a GET endpoint for that file. It's essentially free cloud storage for your site. We hope you won't misuse it.

### What's the `metadata.json` file?
This file contains some necessary info about your tempplate in order for it to get processed by the server once uploaded. Make sure that your template's `metadata.json` confirms to the schema. It's no big deal, just a simple straightforward schema with a couple of fields.

```json
    {
        "name": "<name of your template>",
        "author": "<your name, to be displayed in the website>",
        "time": "<creation time, in ISO 8600 format>",
        "author_link": "<your url>",
        "accepts_contributions": true, // more on this below
        "category": "<a general category that your template fits into>"
    }
```

When you create a template, know that it's fully open for others to copy, edit and redistribute under the MIT license. However, if you want us to restrict others from editing your original version and sharing credit in this repository, we can do so manually. The `accepts_contributions` field tells us what to do in case someone opens a PR making changes to your template. If it's `false`, we'll still allow valid improvements to your template, but keep the `author` field intact without crediting the third party. If it's true, they'll be allowed to modify the field & include their name.

### The HTML creation algorithm
Although not mandatory, it'd be cool for you to know the algorithm with which zitefy constructs the HTML code for a site that you see in your browser. Understanding the algorithm might help you better make decisions on how to structure your code or find potential issues with stuff not being rendered or displayed. So, here goes: consider a user who only selects their instagram & github profiles (username: **zitefy**)

1. When the user selects some options in the editor's UI, it creates an array like so. THe json array would then be:

    ```json
    [
        {
            "selector": "instagram",
            "value": "zitefy",
            "link": "https://instagram.com/"
        },
        {
            "selector": "github",
            "value": "zitefy",
            "link": "https://github.com/"
        }
    ]
    ```

2. When the user saves this, the HTML, CSS & JS along with this `data` object get sent upto the server. The server initially inserts the CSS inside a `<style></style>` element & the JS inside a `<script type="module"></script>` element.
3. It then iterates over the `data` array, and for each element, does the following:

    * Checks if an element exists with it's `id` attribute's value being the `selector`.
    * If it does, it checks the tag to see if it is one of the following

        ```html
          <img >
          <video></video>
          <audio></audio>
          <source>
          <track>
          <iframe></iframe>
          <embed>
          <script></script>
        ```
        if it is, the value of the corresponding `link` is set as the value of the element's `src` attribute. Otherwise, it's set as the value of the element's `href` attribute.
    * Then, it checks to see if an element has it's `data-display` attribute set to `true`. If so, it inserts the content of `value` as text inside the element as it's `innerHTML`.
    * For a given element, if there is no value for `link` & `value`, it sets the CSS of that to `display: none;`
    * Additionally, it sets the values of SEO tags to the values of `name`, `image` & `bio` in the selectors respectively. This won't concern you if you leave the SEO tags intact in the base template. If you do require changing them, check out [scripts/builder.js](https://github.com/zitefy/server/blob/main/scripts/builder.js) in the server repo for a more comprehensive understanding of the algorithm.
4. Finally, it changes the document title to the value of the `name` selector if available or defaults to the `username` selector. If both are unavailable, the title stays the same.

Hopefully, now you have a more thorough understanding of the internal process. Keeping this in mind might help you discover new ways of building templates that we never could have dreamt of! If you find any part of these docs confusing or complicated, feel free to open an issue or [DM me on telegram](https://t.me/vishalds), we're always happy to help.

## Contributing
Thanks for looking to contribute to this repository! Please refer to the [contribution guide](https://github.com/zitefy/templates/blob/main/CONTRIBUTING.md)
