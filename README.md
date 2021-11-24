# Change Me --> Title

## Change Me --> Description

> ℹ️ Please, keep in mind that in this step by step you'll be using the [VTEX IO](https://developers.vtex.com/vtex-developer-docs/docs/what-is-vtex-io) development platform.

### Step 1: Setting up the basic development environment

1. Using the terminal, [install the VTEX IO CLI](https://vtex.io/docs/recipes/development/vtex-io-cli-installation-and-command-reference/) (Command Line Interface) known as **Toolbelt** .
2. Using the terminal and the Toolbelt, log in to your VTEX account by running the following command:

```shell
vtex login {account}
```

> ⚠️ Remember to replace the values between the curly brackets according to your scenario

Once you run this command, a window will open in your browser asking for your credentials.

3. Once you provide your credentials, run the following command in the terminal to create a [Development workspace](https://vtex.io/docs/recipes/development/creating-a-development-workspace/) and to start developing your *Payment* app.

```shell
vtex use {examplename}
```

> ⚠️ Replace `{examplename}` with a name of your choosing. This name will be given to the workspace in which you will develop.

> ℹ️ If you're used to working with GitHub, think of workspaces as branches.

### Step 2: Editing the Middleware app

1. Using your terminal, clone the *Payment* app boilerplate repository to your local files by running:

```shell
git clone Change Me --> Url repository
```

2. Then, using any code editor of your choice, open the boilerplate repository's directory.
3. Using your terminal, go to the app's directory and run the following command:

```shell
vtex link
```

> ℹ️ Once you [link the app](https://vtex.io/docs/recipes/development/linking-an-app/), your computer's local files will sync to our cloud development environment. This means that any change done locally in the code you are working on will be sent to the cloud and then reflected in the workspace in which you are working.

