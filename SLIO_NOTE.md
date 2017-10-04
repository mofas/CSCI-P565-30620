

## Copy Repo to slio

If you don't generate ssh access key in slio yet.

You can generate one by input

```
ssh-keygen -t rsa
```

then copy the `cat ~/.ssh/id_rsa` content, and go to page

```
https://github.com/mofas/CSCI-P565-30620/settings/keys
```

Click `Add deploy key` and paste it.


Then go back slio, clone the repo.

````
git clone git@github.com:mofas/CSCI-P565-30620.git
```

