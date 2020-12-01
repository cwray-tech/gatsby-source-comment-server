# A comment plugin for Gatsby

This is a plugin for Gatsby that makes it easy to add comments to posts in your Gatsby site.

## How it works

- Comments are stored in a free Heroku API.
- Comments are then returned during build time and the Gatsby compiler will create static json files in your website.
- Comments are displayed on your site from the static json files.
- Users can post comments to the API as well with a comment form.

## Configuration

1. To configure the plugin, you need to download it into your server.
2. It should be in a folder one above your Gatsby project folder, or if you prefer, you can set it up as a local plugin.

3. CD into your site directory, and use the npm link command to link the plugin to your Gatsby node modules.

```bash
npm link ../path/to/plugin
```

4. Then add the plugin configuration to your gatsby.config.js file.

```javascript
module.exports = {
  // Other configurations
  plugins: [
    // Other plugins
    "gatsby-plugin-dom-injector",
    {
      resolve: "gatsby-comment-server-plugin",
      options: { website: "https://your-website-url.com" },
      // Above you can see that your website is a option you must provide.
    },
  ],
};
```
