---
layout: post
title: "Resources I Use to Setup Servers"
date: 2025-01-05
tags: [Servers]
---

Over the years I've had to setup a variety of servers to host websites. I don't do it very often so I always need to look up what I'm doing. This post includes the steps and resources I typically use to setup a server and some additions to help with hiccups I typically encounter.

Just a note: I run Ubuntu Servers.

## First Steps, Creating a User, and Locking Down with SSH Key Logins

A few resources I've used to understand this whole process are the [Syntax YouTube Self Host 101 Guide](https://www.youtube.com/watch?v=Q1Y_g0wMwww&list=PLLnpHn493BHHAxTeLNUZEDLYc8uUwqGXa&index=1) and Akamai's (formerly Linode's) guide to ["Set up and secure a Compute Instance"](https://techdocs.akamai.com/cloud-computing/docs/set-up-and-secure-a-compute-instance). Both of these have everything you need to setup a server.

### SSH keys

One place I always get stuck is setting up a ssh key that isn't the default. I like to setup one ssh-key per server instead of using the same one for all. Here are the steps that I've used to make the process a bit less painful.

Step one is to create the ssh-key on your local machine.

```bash
ssh-keygen -t ed25519 -C "user@domain.tld" -f "~/.ssh/the_name_of_your_key"
```

Then on your server create a `~/.ssh` directory and change the permissions on it so that you can add things to it as your user.

```bash
mkdir -p ~/.ssh && sudo chmod -R 700 ~/.ssh/
```

Then from your local computer copy your key to your server.

```bash
scp ~/.ssh/the_name_of_your_key.pub example_user@203.0.113.10:~/.ssh/authorized_keys
```

Then on your server change the permissions on the `authorized_keys` file.

```bash
sudo chmod -R 600 ~/.ssh/authorized_keys
```

Most of this was very similar to the example on the Akamai instructions. But because the ssh key is named the ssh key will not be recognized on login automatically as the default would. So on your local machine you have two options:

1. You can specify the key when you login wiht the `-i` flag:

```bash
ssh -i ~/.ssh/the_name_of_your_key example_user@203.0.113.10
```

2. You can setup a ssh config that specifies the file. To do this you will need to create a file `~/.ssh/config` (the file name is `config`), and in it add what I'll call an alias for your ssh loging like so:

```bash
Host some_name #whatever you want to use as a name for this login
    HostName 203.0.113.10 #ip or hostname
    User your_username
    IdentityFile ~/.ssh/the_name_of_your_key
```

Save that and now you should be able to login using the `Host` identifier you setup like this:

```bash
ssh some_name
```

And it should automatically use the right ssh file.

## UFW Setup

UFW isn't that strait forward either. Here are my steps for getting it up and running and opening ssh, http, and https ports.

Install UFW if it isn't already installed:

```bash
sudo apt-get install ufw
```

Set default rules

```bash
sudo ufw default allow outgoing
sudo ufw default deny incoming
```

This can lock you out of ssh so before you activate make sure to run your first allow command for ssh:

```bash
sudo ufw allow ssh
```

And for http and https:

```bash
sudo ufw allow http
sudo ufw allow 80 #you can also use a port instead of http
sudo ufw allow https
```

### UFW and Docker don't play nice

If you run Docker UFW is kind of a pain so you need to make some edits to your UFW configuration files and setup some additional rules. All instructions on how to do this can be found [here](https://github.com/chaifeng/ufw-docker?tab=readme-ov-file#solving-ufw-and-docker-issues).

- Make sure to add the ufw rules, restart ufw and your server if necessary.

## Setting Up Git and Github, Setting a Deploy Key

You can basically follow [Github's Deploy Key Documentation](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys#deploy-keys). The only thing I'd change is that, again, I'd specify a file name and not give the ssh-key a passphrase.

This time, on a server we create a ssh key:

```bash
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/the_name_of_your_key
```

Cat your .pub deploy key from the command line.

```bash
cat ~/.ssh/the_name_of_your_key.pub
```

And copy the contents to the repo you want to clone under `Settings>Deploy Keys>add deploy key` give the name that identifies the server and copy in the contents of your .pub key. That should be it.

## Other resources that are helpful for setting up a server

- [Install Docker on Ubuntu](https://www.linode.com/docs/guides/installing-and-using-docker-on-ubuntu-and-debian/)
- [Install Docker Compose](https://docs.docker.com/compose/install/linux/)
