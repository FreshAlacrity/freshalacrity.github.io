# FreshAlacrity Pages

Tinkering and small javascript projects - a few small toys/proof of concept things and some projects that end up getting their own repositories over time.

## Adding New Submodules to GitHub Pages Sites
Both for my own reference and in case it helps others. :)
If the folder had already been part of the repository, delete it and do this from Git Bash in the folder that the submodule folder should be added to:
(GitHub Desktop will still error afterwards if the folder is still open in VS Code or File Explorer etc, so close those before pushing.)
```
git rm -r --cached submodule_dir
git submodule add https://github.com/FreshAlacrity/timer submodule_dir
```

## Updating Submodules
???